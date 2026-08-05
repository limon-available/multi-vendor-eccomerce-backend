 const cardModel = require('../../models/cardModel')
const { responseReturn } = require('../../utiles/response')
const logger = require('../../utiles/logger')
const { mongo: {ObjectId}} = require('mongoose')
const wishlistModel = require('../../models/wishlistModel')

class cardController{
   
    add_to_card =  async(req, res) => {
        const { productId, quantity } = req.body
        const userId = req.id
        try {
            const product = await cardModel.findOne({
                $and: [{
                    productId : {
                        $eq: productId
                    }
                },
                {
                    userId: {
                        $eq: userId
                    }
                }
            ]
            })

            if (product) {
                responseReturn(res,404,{error: "Product Already Added To Card" })
            } else {
                const product = await cardModel.create({
                    userId,
                    productId,
                    quantity
                })
                responseReturn(res,201,{message: "Added To Card Successfully" , product})
            }

        } catch (error) {
            logger.error('add_to_card', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }
    // End Method

    get_card_products = async(req, res) => {
       const co = 5;
       const {userId } = req.params
       if (userId !== req.id) {
        return responseReturn(res, 403, { error: 'Forbidden' })
       }
       try {
        const card_products = await cardModel.aggregate([{
            $match: {
                userId: {
                    $eq: new ObjectId(userId)
                }
            }
        },
        {
            $lookup : {
                from: 'products',
                localField: 'productId',
                foreignField: "_id",
                as: 'products'
            }
        } 
      ])
      let buy_product_item = 0
      let calculatePrice = 0;
      let card_product_count = 0;
      const outOfStockProduct = card_products.filter(p => p.products[0].stock < p.quantity)
      for (let i = 0; i < outOfStockProduct.length; i++) {
         card_product_count = card_product_count + outOfStockProduct[i].quantity        
      }
      const stockProduct = card_products.filter(p => p.products[0].stock >= p.quantity)
      for (let i = 0; i < stockProduct.length; i++) {
        const { quantity } = stockProduct[i]
        card_product_count = buy_product_item + quantity

        buy_product_item = buy_product_item + quantity
        const { price,discount } = stockProduct[i].products[0]
        if (discount !== 0) {
            calculatePrice = calculatePrice + quantity * (price - Math.floor((price * discount) / 100 ))
        } else {
            calculatePrice  = calculatePrice + quantity * price
        }        
      } // end for
      let p = []
      let unique = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))] 
      for (let i = 0; i < unique.length; i++) {
        let price = 0;
        for (let j = 0; j < stockProduct.length; j++) {
           const tempProduct = stockProduct[j].products[0]
           if (unique[i] === tempProduct.sellerId.toString()) {
                let pri = 0;
                if (tempProduct.discount !== 0) {
                    pri = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100 )
                } else {
                    pri = tempProduct.price
                }
        pri = pri - Math.floor((pri * co) / 100)
        price = price + pri * stockProduct[j].quantity
        p[i] = {
            sellerId: unique[i], 
            shopName: tempProduct.shopName,
            price,
            products: p[i] ? [
                ...p[i].products,
                {
                    _id: stockProduct[j]._id,
                    quantity: stockProduct[j].quantity,
                    productInfo: tempProduct 
                }
            ] : [{
                _id: stockProduct[j]._id,
                quantity: stockProduct[j].quantity,
                productInfo: tempProduct 
            }]
          } 

           } 
        } 
      }

      responseReturn(res,200,{ 
        card_products: p,
        price: calculatePrice,
        card_product_count,
        shipping_fee: 20 * p.length,
        outOfStockProduct,
        buy_product_item
      })

       } catch (error) {
         logger.error('get_card_products', error.message)
         responseReturn(res, 500, { error: 'Internal Server Error' })
       }

    }
    // End Method


    delete_card_products = async (req, res) => {
        const {card_id } = req.params
        try {
            const item = await cardModel.findById(card_id)
            if (!item) {
                return responseReturn(res,404,{error: "Cart item not found" })
            }
            if (item.userId.toString() !== req.id) {
                return responseReturn(res,403,{error: "Forbidden" })
            }
            await cardModel.findByIdAndDelete(card_id)
            responseReturn(res,200,{message: "Product Remove Successfully" })

        } catch (error) {
            logger.error('delete_card_products', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }

    }
       // End Method

       quantity_inc = async (req, res) => {
        const {card_id } = req.params
        try {
            const product = await cardModel.findById(card_id)
            if (!product) {
                return responseReturn(res,404,{error: "Cart item not found" })
            }
            if (product.userId.toString() !== req.id) {
                return responseReturn(res,403,{error: "Forbidden" })
            }
            const {quantity} = product
            await cardModel.findByIdAndUpdate(card_id,{quantity: quantity + 1 })
            responseReturn(res,200,{message: "Qty Updated" })

        } catch (error) {
            logger.error('quantity_inc', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
         
    }
       // End Method 

       quantity_dec = async (req, res) => {
        const {card_id } = req.params
        try {
            const product = await cardModel.findById(card_id)
            if (!product) {
                return responseReturn(res,404,{error: "Cart item not found" })
            }
            if (product.userId.toString() !== req.id) {
                return responseReturn(res,403,{error: "Forbidden" })
            }
            const {quantity} = product
            await cardModel.findByIdAndUpdate(card_id,{quantity: quantity - 1 })
            responseReturn(res,200,{message: "Qty Updated" })

        } catch (error) {
            logger.error('quantity_dec', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
         
    }
       // End Method 


       add_wishlist = async (req, res) => {
        const { slug } = req.body
        const userId = req.id
        try {
            const product = await wishlistModel.findOne({slug, userId})
                if (product) {
                    responseReturn(res, 404 ,{
                        error: 'Product Is Already In Wishlist'
                    })
                } else {
                    await wishlistModel.create({ ...req.body, userId })
                    responseReturn(res, 201 ,{
                        message: 'Product Add to Wishlist Success'
                    })
                }
        } catch (error) {
            logger.error('add_wishlist', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }

       }
       // End Method


       get_wishlist = async (req, res) => {
        const { userId } = req.params
        if (userId !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }
        try {
            const wishlists = await wishlistModel.find({
                userId
            })
            responseReturn(res, 200, {
                wishlistCount: wishlists.length,
                wishlists
            })

        } catch (error) {
            logger.error('get_wishlist', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
       }
        // End Method

        remove_wishlist = async (req, res) => {
           const {wishlistId} = req.params
           try {
            const wishlist = await wishlistModel.findById(wishlistId)
            if (!wishlist) {
                return responseReturn(res, 404,{ error: 'Wishlist product not found' })
            }
            if (wishlist.userId.toString() !== req.id) {
                return responseReturn(res, 403,{ error: 'Forbidden' })
            }
            await wishlistModel.findByIdAndDelete(wishlistId) 
            responseReturn(res, 200,{
                message: 'Wishlist Product Remove',
                wishlistId
            })

           } catch (error) {
            logger.error('remove_wishlist', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
           }
        }
 // End Method

}


module.exports = new cardController()
