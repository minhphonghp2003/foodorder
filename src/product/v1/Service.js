const {
    product,
    product_image,
    image,
    category,
    product_review,
    product_category,
    reviewer,
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

module.exports = {
    createProduct: async (images, productDetail, categories) => {
        let createdProduct = await product.create(productDetail);
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

    getAllProduct: async (page, size, sort, userId) => {
        const limit = size ? size : 9;
        const offset = page ? (page - 1) * limit : 0;
        let paginatedProd = await product.findAll({
            limit,
            offset,
            order: [[sort, "DESC"]],
            include: [
                {
                    model: product_review,
                    attributes: ["rating", "id"],
                },
                {
                    model: category,
                    attributes: ["id", "name"],
                },
                {
                    model: image,
                    attributes: ["link"],
                },
            ],
            attributes: ["id", "name", "price", "createdAt"],
        });
        for (let product of paginatedProd) {
            product.dataValues.reviewCount =
                product.dataValues.product_reviews.length;
            await ExtractProdImgAndRate(product);
            if (await isFavorite(userId, product.dataValues.id)) {
                product.dataValues.isFavorite = true;
            } else {
                product.dataValues.isFavorite = false;
            }
        }

        let productCount = await product.count();
        return { paginatedProd, productCount };
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
        for (let i of detail.dataValues.images) {
            i.link = await getImageFromFirebase(i.link);
        }
        return { detail };
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
            await ExtractProdImgAndRate(product);
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

    search: async (query) => {
        let result = await elasticNodeClient.search({
            index: "food",
            query: {
                query_string: {
                    query: `*${query}*`,
                },
            },
        });
        return result.hits.hits;
    },
};

// -------------------------------------------------------------------------------

let ExtractProdImgAndRate = async (product) => {
    product.dataValues.rating = avgCalc(
        product.dataValues.product_reviews,
        "rating"
    );

    delete product.dataValues.product_reviews;
    imagePath = product.dataValues.images[0]
        ? product.dataValues.images[0].link
        : null;
    product.dataValues.images = await getImageFromFirebase(imagePath);
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
        let source = `if (!ctx._source.containsKey('categories')) {ctx._source.categories = [];} ctx._source.categories.add(params.category)`;
        let params = {category:cate};
        updateElasticDocument("product", productId, source, params);
        await product_category.create({
            productId,
            categoryId: cate.id,
        });
    }
};
