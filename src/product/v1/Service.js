const {
    product,
    product_image,
    image,
    category,
    product_review,
    product_category,
    reviewer,
    addons,
    sequelize,
    favorite,
} = require("../../../models");
const {
    elasticCloudClient,
    elasticNodeClient,
} = require("../../../library/elastic_client");
const { app } = require("../../../config/firebase");
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage");
const storage = getStorage(app);

// avg = m/(m+1)*preAvg + d/m+1

module.exports = {
    createProduct: async (images, productDetail, categories) => {
        let createdProduct = await product.create(productDetail);
        createdProduct.dataValues.rating = 0;

        createdProduct.dataValues.reviewCount = 0;
        createdProduct.dataValues.price = Number(
            createdProduct.dataValues.price
        );
        await createElasticDocument(
            "product",
            createdProduct.id,
            createdProduct
        );

        await addProductCategory(createdProduct.id, categories);

        await Promise.all(
            images.map(async (i) => {
                let image = await createImage(i);
                let params = { link: image.link };
                let source = `if (!ctx._source.containsKey('images')) {ctx._source.images = [];} ctx._source.images.add(params.link)`;
                updateElasticDocument(
                    "product",
                    createdProduct.id,
                    source,
                    params
                );
                await product_image.create({
                    productId: createdProduct.id,
                    imageId: image.id,
                });
            })
        );

        return createdProduct.id;
    },

    getAllProduct: async (page, size, sortField, sortDirect, userId) => {
        let sort = [{}];
        sort[0][sortField] = sortDirect;
        let products = await queryStringSearch("*", size, page, sort);

        for (let product of products.hits) {
            product._source.images = product._source.images
                ? await getImageFromFirebase(product._source.images[0])
                : await getImageFromFirebase(
                      "foodorder/product/254824122-blue-lint-abstract-8k-5120x2880.jpg"
                  );
            if (await isFavorite(userId, product._source.id)) {
                product._source.isFavorite = true;
            } else {
                product._source.isFavorite = false;
            }
        }
        return products;
    },

    getProductDetail: async (id) => {
        let detail = await product.findOne({
            where: {
                id,
            },
            attributes: { exclude: ["categoryId"] },
            include: [
                {
                    model: category,
                    attributes: ["name", "id"],
                },
                {
                    model: image,
                    attributes: ["link"],
                },
                {
                    model: reviewer,
                    attributes: ["name"],
                },
            ],
        });
        let relatedProducts = await getRelatedProduct(
            detail.dataValues.categories
        );
        let relatedImages = [];
        for (let r of relatedProducts.hits) {
            r._source.images = r._source.images
                ? { link: r._source.images[0] }
                : { link: null };
            relatedImages.push(r._source.images);
        }

        for (let i of [...detail.dataValues.images, ...relatedImages]) {
            i.link = await getImageFromFirebase(i.link);
        }

        return { detail, relatedProducts };
    },

    updateProduct: async (id, field) => {
        await product.update(field, {
            where: { id },
        });
        return;
    },

    deleteProduct: async (id) => {
        await product.destroy({
            where: {
                id,
            },
        });
    },
    createAddons: async (image, name, price) => {
        let imageId = (await createImage(image)).id;
        let createdAddons = await addons.create({
            imageId,
            name,
            price,
        });

        return createdAddons.id;
    },

    getAllAddons: async () => {
        let AllAddons = await addons.findAll({ include: "image" });
        for (let a of AllAddons) {
            a.dataValues.image = await getImageFromFirebase(
                a.dataValues.image.link
            );
        }
        return AllAddons;
    },

    createCategory: async (name, image) => {
        let imageId = await createImage(image);
        let categoryId = (await category.create({ name, imageId })).id;
        return categoryId;
    },

    getProductByCategory: async (id) => {
        let detail = await category.findOne({
            where: {
                id,
            },

            include: [
                {
                    model: product,

                    attributes: ["id", "name", "price"],
                    order: [["createdAt", "DESC"]],
                    include: [
                        {
                            model: product_review,
                            attributes: ["rating"],
                        },
                        {
                            model: image,
                            attributes: ["link"],
                        },
                    ],
                },
            ],
        });

        for (let product of detail.dataValues.products) {
            await ExtractProdImg(product);
        }
        return detail;
    },
    getAllCategory: async () => {
        let cates = await category.findAll({
            include: ["image"],
            raw: true,
            nest: true,
        });
        for (c of cates) {
            c.image = await getImageFromFirebase(c.image.link);
        }

        return cates;
    },
    deleteCategory: async (id) => {
        return await category.destroy({ where: { id } });
    },

    createReview: async (productId, rating, name, email, content) => {
        let newReviewer = await reviewer.create({ name, email });
        let reviewerId = newReviewer.dataValues.id;
        let body = await product_review.create({
            rating,
            content,
            reviewerId,
            productId,
        });
        return body;
    },
};
// -------------------------------------------------------------------------------
let getRelatedProduct = async (categories) => {
    let cateQuery = [];

    for (let cate of categories) {
        let name = cate.dataValues.name;
        cateQuery.push(name);
    }
    return await queryStringSearch(
        `categories.name = ${cateQuery.join(" OR ")}`,
        4,
        1
    );
};

let ExtractProdImg = async (images) => {
    let imagePath = images ? images[0] : null;
    images = await getImageFromFirebase(imagePath);
};

let avgCalc = (array, property) => {
    if (array != null) {
        return array.reduce((p, c) => p + c[property], 0) / array.length;
    }
};

let getImageFromFirebase = async (path) => {
    if (path) {
        const pathReference = ref(storage, path);
        const downloadUrl = await getDownloadURL(pathReference);
        return downloadUrl;
    }
    return null;
};

let createImage = async (file) => {
    let file_name =
        (Date.now() % 1000000000) -
        Math.round(Math.random() * 100000000) +
        "-" +
        file.originalname;
    let dest_storage = "foodorder/product/" + file_name;
    let storageRef = ref(storage, dest_storage);
    let bytes = file.buffer;

    await uploadBytes(storageRef, bytes);
    return await image.create({ link: dest_storage });
};

let createElasticDocument = async (index, id, body) => {
    await elasticNodeClient.index({
        index,
        id,
        body,
    });
};

let queryStringSearch = async (query, size, page, sort) => {
    size = size ? size : 9;
    let from = page ? (page - 1) * size : 0;
    let result = await elasticNodeClient.search({
        index: "product",
        size,
        from,
        body: {
            query: {
                query_string: {
                    query,
                },
            },
            sort,
        },
    });
    // if (!sort || sort == "null") {
    //     sort = "createdAt";
    // }
    // result.body.hits.hits.sort((a, b) => a._source[sort] - b._source[sort]);
    return result.body.hits;
};

let updateElasticDocument = async (index, id, source, params) => {
    await elasticNodeClient.update({
        index,
        id,
        body: {
            script: {
                lang: "painless",
                //   source: 'ctx._source.times++'
                // you can also use parameters
                source,
                params: params,
            },
        },
    });
};

let isFavorite = async (userId, productId) => {
    if (!userId || userId == "null") {
        return false;
    }
    let isExist = await favorite.findOne({
        where: {
            userId,
            productId,
        },
    });
    if (!isExist) {
        return false;
    }
    return true;
};

let addProductCategory = async (productId, categories) => {
    for (cate of categories) {
        cate.id = parseInt(cate.id);
        let source = `if (!ctx._source.containsKey('categories')) {ctx._source.categories = [];} ctx._source.categories.add(params.category)`;
        let params = { category: cate };
        updateElasticDocument("product", productId, source, params);
        await product_category.create({
            productId,
            categoryId: cate.id,
        });
    }
};
