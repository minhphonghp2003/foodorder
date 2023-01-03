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
            await productImageAndRateExtrc(product);
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
    createCategory: async (name) => {
        return (await category.create({ name })).id;
    },

    getCategoryDetail: async (id) => {
        let detail = await category.findOne({
            where: {
                id,
            },
            include: {
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
        });
        for (let product of detail.dataValues.products) {
            await productImageAndRateExtrc(product);
        }
        return detail;
    },
    getProductDetail: async (id) => {
        let detail = await product.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: category,
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
        // TODO:show related(by cate)
        return detail;
    },
};

// -------------------------------------------------------------------------------

let productImageAndRateExtrc = async (product) => {
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
    return array.reduce((p, c) => p + c[property], 0) / array.length;
};

let getImageFromFirebase = async (path) => {
    if (path) {
        const pathReference = ref(storage, path);
        const downloadUrl = await getDownloadURL(pathReference);
        return downloadUrl;
    }
    return null;
};
