const {
    product,
    product_image,
    image,
    category,
    product_review,
    product_category,
    reviewer,
    favorite,
    table_booking,
} = require("../../../models");
const {
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

    getAllProduct: async ({
        categoryId,
        size,
        page,
        sortField,
        sortDirect,
        userId,
    }) => {
        let sort = [{}];
        sort[0][sortField] = sortDirect;
        let result = await queryStringSearch(
            `categories.id:${categoryId}`,
            size,
            page,
            sort
        );
        await ExtractProdImgAndFav(result.hits, userId);
        return result;
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
        field.price = parseInt(field.price);
        await elasticNodeClient.update({
            index: "product",
            id,
            body: {
                doc: field,
            },
        });
        return;
    },

    deleteProduct: async (id) => {
        await product.destroy({
            where: {
                id,
            },
        });
        await elasticNodeClient.delete({
            index: "product",
            id,
        });
    },
    createCategory: async (name, image) => {
        let imageId = (await createImage(image)).id;
        let categoryId = (await category.create({ name, imageId })).id;
        return categoryId;
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

    // avg = m/(m+1)*preAvg + d/m+1
    createReview: async (productId, rating, name, email, content) => {
        let newReviewer = await reviewer.create({ name, email });
        let reviewerId = newReviewer.dataValues.id;
        let body = await product_review.create({
            rating,
            content,
            reviewerId,
            productId,
        });
        let product = (await queryStringSearch(`id:${productId}`, 1, 1)).hits[0]
            ._source;
        let preAvg = product.rating;
        let preCount = product.reviewCount;
        let currAvg =
            (preCount / (preCount + 1)) * preAvg + rating / (preCount + 1);
        let updateSource =
            "ctx._source.rating = params.currAvg; ctx._source.reviewCount++";
        let params = { currAvg };
        await updateElasticDocument("product", productId, updateSource, params);
        return body;
    },
    getReviews: async (productId) => {
        return await product_review.findAll({
            where: {
                productId,
            },
            include: "reviewer",
        });
    },

    search: async ({ keyword, size, page, sortField, sortDirect, userId }) => {
        let sort = [{}];
        sort[0][sortField] = sortDirect;
        let result = await queryStringSearch(`*${keyword}*`, size, page, sort);
        await ExtractProdImgAndFav(result.hits, userId);
        return result;
    },
    createTable: async (information) => {
        let table = await table_booking.create({
            date: information.date,
            time: information.time,
            adult: information.adult,
            kid: information.kid,
            message: information.message,
            userId:information.userId
        });
        return table
    },
    getTable: async(userId) =>{
        let tables = await table_booking.findAll({
            where:{
                userId
            },
        })
        return tables
    },
    deleteTable: async(userId,tableId) =>{
        await table_booking.destroy({
            where:{
                userId,
                id: tableId
            }
        })
        return
    }
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

let ExtractProdImgAndFav = async (products, userId) => {
    for (let product of products) {
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
