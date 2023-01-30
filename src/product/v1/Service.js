const {
    product,
    product_image,
    image,
    category,
    product_review,
    reviewer,
} = require("../../../models");
const { app } = require("../../../config/firebase");
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require("firebase/storage");
const storage = getStorage(app);

module.exports = {
    createProduct: async (images, productDetail) => {
        let productId = (await product.create(productDetail)).id;

        await Promise.all(
            images.map(async (i) => {
                let imageId = await createImage(i);
                await product_image.create({ productId, imageId });
            })
        );

        return productId;
    },

    getAllProduct: async (page, size, sort) => {
        const limit = size ? size : 9;
        const offset = page ? (page - 1) * limit : 0;
        let paginatedProd = await product.findAll({
            limit,
            offset,
            order: [[sort, "DESC"]],

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
            attributes: ["id", "name", "price", "createdAt"],
        });
        for (let product of paginatedProd) {
            await ExtractProdImgAndRate(product);
        }
        let productCount = await product.count();
        return { paginatedProd, productCount };
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
        return (await category.create({ name, imageId })).id;
    },

    getProductByCategory: async (id, page, size) => {
        const limit = size ? size : 4;
        const offset = page ? (page - 1) * limit : 0;
        let detail = await category.findOne({
            where: {
                id,
            },
            include: {
                model: product,
                limit,
                offset,
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
    return (await image.create({ link: dest_storage })).id;
};
