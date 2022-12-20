const { product, product_image, image } = require("../../../models");
const { app } = require("../../../config/firebase");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
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
};
