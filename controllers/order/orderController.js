const authOrderModel = require('../../models/authOrder')
const customerOrder = require('../../models/customerOrder')

const myShopWallet = require('../../models/myShopWallet')
const sellerWallet = require('../../models/sellerWallet')

const cardModel = require('../../models/cardModel')
const moment = require("moment")
const { responseReturn } = require('../../utiles/response')
const logger = require('../../utiles/logger')
const { mongo: {ObjectId}} = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


class orderController{

    paymentCheck = async (id) => {
        try {
            const order = await customerOrder.findById(id)
            if (order.payment_status === 'unpaid') {
                await customerOrder.findByIdAndUpdate(id, {
                    delivery_status: 'cancelled'
                })
                await authOrderModel.updateMany({
                    orderId: id
                },{
                    delivery_status: 'cancelled'
                })
            }
            return true
        } catch (error) {
            logger.error('paymentCheck', error.message)
            return false
        }
    }
    place_order = async (req,res) => {
        const { price, products, shipping_fee, shippingInfo } = req.body
        const userId = req.id
        
        let authorOrderData = []
        let cardId = []
        const tempDate = moment(Date.now()).format('LLL')

        let customerOrderProduct = []
        if (!Array.isArray(products) || products.length === 0) {
            return responseReturn(res, 400, { error: 'Products are required' })
        }

        for (let i = 0; i < products.length; i++) {
            const pro = products[i].products
            for (let j = 0; j < pro.length; j++) {
                const tempCusPro = pro[j].productInfo;
                tempCusPro.quantity = pro[j].quantity
                customerOrderProduct.push(tempCusPro)
                if (pro[j]._id) {
                    cardId.push(pro[j]._id)
                } 
            } 
        }

        try {
            const order = await customerOrder.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                payment_status: 'unpaid',
                delivery_status: 'pending',
                date: tempDate
            })
            for (let i = 0; i < products.length; i++) {
                const pro = products[i].products
                const pri = products[i].price
                const sellerId =new ObjectId(products[i].sellerId);
                let storePor = []
                for (let j = 0; j < pro.length; j++) {
                    const tempPro = pro[j].productInfo
                    tempPro.quantity = pro[j].quantity
                    storePor.push(tempPro)                    
                }

                authorOrderData.push({
                    orderId: order.id,sellerId,
                    products: storePor,
                    price:pri,
                    payment_status: 'unpaid',
                    shippingInfo: 'Easy Main Warehouse',
                    delivery_status: 'pending',
                    date: tempDate
                }) 
            }

            await authOrderModel.insertMany(authorOrderData)
            for (let k = 0; k < cardId.length; k++) {
                await cardModel.findByIdAndDelete(cardId[k]) 
            }
   
            setTimeout(() => {
                this.paymentCheck(order.id)
            }, 15000)

            responseReturn(res,200,{message: "Order Placed Success" , orderId: order.id })

            
        } catch (error) {
            logger.error('place_order', error.message)
            responseReturn(res,500,{error: 'Internal Server Error'})
        }

    }

    get_customer_dashboard_data = async(req,res) => {
        const{ userId } = req.params 
        if (userId !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }

        try {
            const recentOrders = await customerOrder.find({
                customerId: new ObjectId(userId) 
            }).limit(5)
            const pendingOrder = await customerOrder.find({
                customerId: new ObjectId(userId),delivery_status: 'pending'
             }).countDocuments()
             const totalOrder = await customerOrder.find({
                customerId: new ObjectId(userId)
             }).countDocuments()
             const cancelledOrder = await customerOrder.find({
                customerId: new ObjectId(userId),delivery_status: 'cancelled'
             }).countDocuments()
             responseReturn(res, 200,{
                recentOrders,
                pendingOrder,
                totalOrder,
                cancelledOrder
             })

        } catch (error) {
            logger.error('get_customer_dashboard_data', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }

    }
     // End Method

    get_orders = async (req, res) => {
        const {customerId, status} = req.params
        if (customerId !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }

        try {
            let orders = []
            if (status !== 'all') {
                orders = await customerOrder.find({
                    customerId: new ObjectId(customerId),
                    delivery_status: status
                })
            } else {
                orders = await customerOrder.find({
                    customerId: new ObjectId(customerId)
                })
            }
            responseReturn(res, 200,{
                orders
            })

        } catch (error) {
            logger.error('get_orders', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }

     }
 // End Method

 get_order_details = async (req, res) => {
    const {orderId} = req.params

    try {
        const order = await customerOrder.findById(orderId)
        if (!order) {
            return responseReturn(res,404, { error: 'Order not found' })
        }
        if (order.customerId.toString() !== req.id) {
            return responseReturn(res,403, { error: 'Forbidden' })
        }
        responseReturn(res,200, {
            order
        })

    } catch (error) {
        logger.error('get_order_details', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
    }
 }
 // End Method

 get_admin_orders = async(req, res) => {
    let {page,searchValue,parPage} = req.query
    page = parseInt(page)
    parPage= parseInt(parPage)

    const skipPage = parPage * (page - 1)

    try {
        if (searchValue) {
            
        } else {
            const orders = await customerOrder.aggregate([
                {
                    $lookup: {
                        from: 'authororders',
                        localField: "_id",
                        foreignField: 'orderId',
                        as: 'suborder'
                    }
                }
            ]).skip(skipPage).limit(parPage).sort({ createdAt: -1})

            const totalOrder = await customerOrder.aggregate([
                {
                    $lookup: {
                        from: 'authororders',
                        localField: "_id",
                        foreignField: 'orderId',
                        as: 'suborder'
                    }
                }
            ])

            responseReturn(res,200, { orders, totalOrder: totalOrder.length })
        }
    } catch (error) {
        logger.error('get_admin_orders', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
    }

 }

  get_admin_order = async (req, res) => {
    const { orderId } = req.params
    try {

        const order = await customerOrder.aggregate([
            {
                $match: {_id: new ObjectId(orderId)}
            },
            {
                $lookup: {
                    from: 'authororders',
                    localField: "_id",
                    foreignField: 'orderId',
                    as: 'suborder'
                }
            }
        ])
        responseReturn(res,200, { order: order[0] })
    } catch (error) {
        logger.error('get_admin_order', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
    }
  }

  admin_order_status_update = async(req, res) => {
    const { orderId } = req.params
    const { status } = req.body

    try {
        await customerOrder.findByIdAndUpdate(orderId, {
            delivery_status : status
        })
        responseReturn(res,200, {message: 'order Status change success'})
    } catch (error) {
        logger.error('admin_order_status_update', error.message)
        responseReturn(res,500, {message: 'internal server error'})
    }
     
  }
  
  get_seller_orders = async (req,res) => {
        const {sellerId} = req.params
        if (sellerId !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }
        let {page,searchValue,parPage} = req.query
        page = parseInt(page)
        parPage= parseInt(parPage)

        const skipPage = parPage * (page - 1)

        try {
            if (searchValue) {
                
            } else {
                const orders = await authOrderModel.find({
                    sellerId:new ObjectId(sellerId),
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1})
                const totalOrder = await authOrderModel.find({
                    sellerId:new ObjectId(sellerId)
                }).countDocuments()
                responseReturn(res,200, {orders,totalOrder})
            }
            
        } catch (error) {
         logger.error('get_seller_orders', error.message)
         responseReturn(res,500, {message: 'internal server error'})
        }

  }
  // End Method

  get_seller_order = async (req,res) => {
    const { orderId } = req.params
    
    try {
        const order = await authOrderModel.findById(orderId)
        if (!order) {
            return responseReturn(res, 404, { error: 'Order not found' })
        }
        if (order.sellerId.toString() !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }
        responseReturn(res, 200, { order })
    } catch (error) {
        logger.error('get_seller_order', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
    }
  }
  // End Method

  seller_order_status_update = async(req,res) => {
    const {orderId} = req.params
    const { status } = req.body

    try {
        const sellerOrder = await authOrderModel.findById(orderId)
        if (!sellerOrder) {
            return responseReturn(res, 404, { error: 'Order not found' })
        }
        if (sellerOrder.sellerId.toString() !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }
         // 1. seller order update
        const updatedSellerOrder = await authOrderModel.findByIdAndUpdate(
            orderId,
            { delivery_status: status },
            { new: true }
        )

        // 2. main order update (IMPORTANT 🔥)
        await customerOrder.findByIdAndUpdate(
            updatedSellerOrder.orderId, // 🔥 reference use করো
            { delivery_status: status }
        )
        responseReturn(res, 200, {
            message: 'order status updated successfully',
            order:updatedSellerOrder
        })
    } catch (error) {
        logger.error('seller_order_status_update', error.message)
        responseReturn(res,500, {message: 'internal server error'})
    }


  }
create_payment = async (req, res) => {
    const { price } = req.body
    const numericPrice = Number(price)

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return responseReturn(res, 400, { error: 'Invalid payment amount' })
    }

    try {
        const payment = await stripe.paymentIntents.create({
            amount: Math.round(numericPrice * 100),
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            }
        })
        responseReturn(res, 200, { clientSecret: payment.client_secret })
    } catch (error) {
        logger.error('create_payment', error.message)
        responseReturn(res,500,{error: 'Payment creation failed'})
    }
  }

cart_item_delete = async (req, res) => {
        const userId = req.id;
  try {
  const result = await cardModel.deleteMany({ userId: new ObjectId(userId) });

    responseReturn(res, 200, {
      message: "Cart cleared successfully"
    });

  } catch (error) {
    responseReturn(res, 500, {
      error: error.message
    });
  }
};
    
    
  order_confirm = async (req,res) => {
    const {orderId} = req.params
      try {
        const order = await customerOrder.findById(orderId)
        if (!order) {
            return responseReturn(res, 404, { error: 'Order not found' })
        }
        if (order.customerId.toString() !== req.id) {
            return responseReturn(res, 403, { error: 'Forbidden' })
        }

        await customerOrder.findByIdAndUpdate(orderId, { payment_status: 'paid' })
        await authOrderModel.updateMany({ orderId: new ObjectId(orderId)},{
            payment_status: 'paid', delivery_status: 'pending'  
        })
        const cuOrder = await customerOrder.findById(orderId)

        const auOrder = await authOrderModel.find({
            orderId: new ObjectId(orderId)
        })
         
        const time = moment(Date.now()).format('l')
        const splitTime = time.split('/')

        await myShopWallet.create({
            amount: cuOrder.price,
            month: splitTime[0],
            year: splitTime[2]
        })

        for (let i = 0; i < auOrder.length; i++) {
             await sellerWallet.create({
                sellerId: auOrder[i].sellerId,
                amount: auOrder[i].price,
                month: splitTime[0],
                year: splitTime[2]
             }) 
        }
        responseReturn(res, 200, {message: 'success'}) 
        
    } catch (error) {
        logger.error('order_confirm', error.message)
        responseReturn(res,500,{error: 'Internal Server Error'})
    }

  }
   // End Method 

}

module.exports = new orderController()
