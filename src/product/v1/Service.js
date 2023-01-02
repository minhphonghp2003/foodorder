const {
    product,
    product_image,
    image,
    category,
    product_review,
} = require("../../../models");
const { Op } = require("sequelize");
const { app } = require("../../../config/firebase");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const storage = getStorage(app);

module.exports = {
    createProduct: async (images, productDetail) => {
        // TODO: add 0 star review
        let productId = (await product.create(productDetail)).id;

        await Promise.all(
            images.map(async (i) => {
                let file_name =
                    (Date.now() % 1000000000) -
                    Math.round(Math.random() * 100000000) +
                    "-" +
                    i.originalname;
                let dest_storage = "foodorder/product/" + file_name;
                let storageRef = ref(storage, dest_storage);
                let bytes = i.buffer;

                await uploadBytes(storageRef, bytes);
                let imageId = (await image.create({ link: dest_storage })).id;
                await product_image.create({ productId, imageId });
            })
        );

        return productId;
    },

    getAllProduct: async (page, size, sort, cate) => {

        const limit = size ? size : 9;
        const offset = page ? (page - 1) * limit : 0;
        let paginatedProd = await product.findAll({
            limit,
            offset,
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
            attributes: ["id", "name", "price"],
        });
        for (let product of paginatedProd) {
            product.dataValues.rating =
                product.dataValues.product_reviews.reduce(
                    (p, c) => p + c.rating,
                    0
                ) / product.dataValues.product_reviews.length;
            
        }
        // TODO: sort, cate
        return paginatedProd;
    },
};
