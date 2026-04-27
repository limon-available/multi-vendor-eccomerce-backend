 const { IncomingForm } = require('formidable');
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2
const productModel = require('../../models/productModel')
const mongoose = require("mongoose");

class productController {

    add_product = async (req, res) => {
        const { id } = req;
        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 400, { error: err.message });
            }

            let name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            let category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
            let description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
            let stock = Array.isArray(fields.stock) ? fields.stock[0] : fields.stock;
            let price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
            let discount = Array.isArray(fields.discount) ? fields.discount[0] : fields.discount;
            let shopName = Array.isArray(fields.shopName) ? fields.shopName[0] : fields.shopName;
            let brand = Array.isArray(fields.brand) ? fields.brand[0] : fields.brand;

            let images = files.images;
            if (!Array.isArray(images)) {
                images = [images];
            }

            // trim করা
            name = name ? name.trim() : "";
            category = category ? category.trim() : "";
            description = description ? description.trim() : "";
            shopName = shopName ? shopName.trim() : "";
            brand = brand ? brand.trim() : "";

            const slug = name.split(' ').join('-');

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                let allImageUrl = [];

                for (let i = 0; i < images.length; i++) {
                    if (!images[i]) continue;
                    const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'products' });
                    allImageUrl.push(result.secure_url);
                }

                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    category,
                    description,
                    stock: parseInt(stock) || 0,
                    price: parseInt(price) || 0,
                    discount: parseInt(discount) || 0,
                    images: allImageUrl,
                    brand
                });

                responseReturn(res, 201, { message: 'Product Added Successfully' });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    }

    // ✅ Products List Get
    products_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        const { id } = req;
       
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);
       
        try {
            console.log("in try");
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: ObjectId(id)
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
               
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments();

                responseReturn(res, 200, { products, totalProduct });
            } else {
                const products = await productModel.find({ sellerId:new mongoose.Types.ObjectId(id) })
                    .skip(skipPage).limit(parPage).sort({ createdAt: -1 });

                const totalProduct = await productModel.find({ sellerId:new mongoose.Types.ObjectId(id)}).countDocuments();

                responseReturn(res, 200, { products, totalProduct });
            }
        } catch (error) {
            console.log("in products",error.message);
        }
    }

    // ✅ Single Product Get
    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product });
        } catch (error) {
            console.log(error.message);
        }
    }

    // ✅ Product Update
    product_update = async (req, res) => {
        let { name, description, stock, price, discount, brand, productId } = req.body;

        name = name ? name.trim() : "";
        const slug = name.split(' ').join('-');

        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, stock, price, discount, brand, slug
            });

            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product, message: 'Product Updated Successfully' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    // ✅ Product Image Update
    product_image_update = async (req, res) => {
        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            const oldImage = Array.isArray(fields.oldImage) ? fields.oldImage[0] : fields.oldImage;
            const productId = Array.isArray(fields.productId) ? fields.productId[0] : fields.productId;
            const newImage = files.newImage;

            if (err) {
                return responseReturn(res, 400, { error: err.message });
            }

            try {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });

                const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' });

                if (result) {
                    let { images } = await productModel.findById(productId);
                    const index = images.findIndex(img => img === oldImage);
                    images[index] = result.secure_url;

                    await productModel.findByIdAndUpdate(productId, { images });
                    const product = await productModel.findById(productId);

                    responseReturn(res, 200, { product, message: 'Product Image Updated Successfully' });
                } else {
                    responseReturn(res, 404, { error: 'Image Upload Failed' });
                }
            } catch (error) {
                responseReturn(res, 404, { error: error.message });
            }
        });
    }
}

module.exports = new productController();
