 const categoryModel = require('../../models/categoryModel')
const productModel = require('../../models/productModel')
const reviewModel = require('../../models/reviewModel')
const { responseReturn } = require("../../utiles/response")
const queryProducts = require('../../utiles/queryProducts')
const logger = require('../../utiles/logger')
const moment = require('moment')
const { mongo: {ObjectId}} = require('mongoose')

class homeControllers{

    formateProduct = (products) => {
        const productArray = [];
        let i = 0;
        while (i < products.length ) {
            let temp = []
            let j = i
            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j])
                }
                j++
            }
            productArray.push([...temp])
            i = j
        }
        return productArray
    }

    get_categorys = async(req,res) => {
        try {
            const categorys = await categoryModel.find({})
            responseReturn(res,200, {
                categorys
            })

        } catch (error) {
            logger.error('get_categorys', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }
    // end method

    get_products = async(req, res) => {
        try {
            const products = await productModel.find({}).limit(12).sort({
                createdAt: -1
            })
            const allProduct1 = await productModel.find({}).limit(9).sort({
                createdAt: -1
            })
            const latest_product = this.formateProduct(allProduct1);
            
            const allProduct2 = await productModel.find({}).limit(9).sort({
                rating: -1
            })
            const topRated_product = this.formateProduct(allProduct2);
           
            const allProduct3 = await productModel.find({}).limit(9).sort({
                discount: -1
            })
            const discount_product = this.formateProduct(allProduct3);

            responseReturn(res, 200,{
                products,
                latest_product,
                topRated_product,
                discount_product
            })

        } catch (error) {
            logger.error('get_products', error.message)
            responseReturn(res, 500, { error: 'Internal Server Error' })
        }
    }
   // end method

   /*price_range_product = async (req, res) => {
    try {
        const priceRange = {
            low: 0,
            high: 0,
        }
        const products = await productModel.find({}).limit(9).sort({
            createdAt: -1 // 1 for asc -1 is for Desc
        })
        const latest_product = this.formateProduct(products);
        const getForPrice = await productModel.find({}).sort({
            'price': 1
        })
        if (getForPrice.length > 0) {
            priceRange.high = getForPrice[getForPrice.length - 1].price
            priceRange.low = getForPrice[0].price
        }
        responseReturn(res, 200, {
            latest_product,
            priceRange
        })
        
    } catch (error) {
        console.log(error.message)
    }

   }
*/
// end method 

    query_products = async (req, res) => {
  const parPage = 12
  const { low, high, category, rating, sortPrice, searchValue, pageNumber } = req.query

  let query = {}

  // 🔹 price filter
if (low !== undefined && high !== undefined){
    query.price = {
      $gte: Number(low),
      $lte: Number(high)
    }
  }

  // 🔹 category filter
  if (category) {
    query.category = category
  }

  // 🔹 search filter
  if (searchValue) {
    query.name = { $regex: searchValue, $options: "i" }
  }

  // 🔹 rating filter
  if (rating) {
    query.rating = { $gte: Number(rating) }
  }

  // 🔹 sorting
  let sortOption = { createdAt: -1 }

  if (sortPrice === "low-to-high") {
    sortOption = { price: 1 }
  }

  if (sortPrice === "high-to-low") {
    sortOption = { price: -1 }
  }

  try {
    const totalProduct = await productModel.countDocuments(query)

    const products = await productModel
      .find(query)
      .sort(sortOption)
      .skip((pageNumber - 1) * parPage)
      .limit(parPage)

    responseReturn(res, 200, {
      products,
      totalProduct,
      parPage
    })

  } catch (error) {
    logger.error('query_products', error.message)
    responseReturn(res, 500, { error: 'Internal Server Error' })
  }
}
// end method

product_details = async (req, res) => {
    const { slug } = req.params
    try {
        const product = await productModel.findOne({slug})
        if (!product) {
            return responseReturn(res, 404, { error: 'Product not found' })
        }

        const relatedProducts = await productModel.find({
            $and: [{
                _id: {
                    $ne: product.id
                }
            },
            {
                category: {
                    $eq: product.category 
                }
            }
           ]
        }).limit(12)
        const moreProducts = await productModel.find({
            $and: [{
                _id: {
                    $ne: product.id
                }
            },
            {
                sellerId: {
                    $eq: product.sellerId
                }
            }
           ]
        }).limit(3)
        responseReturn(res, 200, {
            product,
            relatedProducts,
            moreProducts
        })

    } catch (error) {
        logger.error('product_details', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
    }
}
// end method

 get_price_range = async (req, res) => {
  try {
    const result = await productModel.aggregate([
      {
        $group: {
          _id: null,
          low: { $min: "$price" },
          high: { $max: "$price" }
        }
      }
    ]);

    res.status(200).json({
      priceRange: result[0] || { low: 0, high: 1000 }
    });

  } catch (error) {
    logger.error('get_price_range', error.message);
    responseReturn(res, 500, { error: 'Internal Server Error' });
  }
};

submit_review = async (req, res) => {
     const {productId,rating,review,name} = req.body

     try {
        await reviewModel.create({
            productId,
            name,
            rating,
            review,
            date: moment(Date.now()).format('LL')
        })

        let rat = 0;
        const reviews = await reviewModel.find({
            productId
        })
        for (let i = 0; i < reviews.length; i++) {
            rat = rat + reviews[i].rating 
        }
        let productRating = 0
        if (reviews.length !== 0) {
            productRating = (rat / reviews.length).toFixed(1)
        }

        await productModel.findByIdAndUpdate(productId,{
            rating : productRating
        })
        responseReturn(res, 201, {
            message: "Review Added Successfully"
        })

     } catch (error) {
        logger.error('submit_review', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
     }
}
// end method

get_reviews = async (req, res) => {
    const {productId} = req.params
    let {pageNo} = req.query 
    pageNo = parseInt(pageNo)
    const limit = 5
    const skipPage = limit * (pageNo - 1) 

    try {
        let getRating = await reviewModel.aggregate([{
            $match: {
                productId: {
                    $eq : new ObjectId(productId)
                },
                rating: {
                    $not: {
                        $size: 0
                    }
                }
            }
        },
        {
            $unwind: "$rating"
        },
        {
            $group: {
                _id: "$rating",
                count: {
                    $sum: 1
                }
            }
        } 
    ])
    let rating_review = [{
        rating: 5,
        sum : 0
    },
    {
        rating: 4,
        sum: 0
    },
    {
        rating: 3,
        sum: 0
    },
    {
        rating: 2,
        sum: 0
    },
    {
        rating: 1,
        sum: 0
    }
   ]
   for (let i = 0; i < rating_review.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
            if (rating_review[i].rating === getRating[j]._id) {
                rating_review[i].sum = getRating[j].count
                break
            } 
        }  
   }

   const getAll = await reviewModel.find({
    productId
   })
   const reviews = await reviewModel.find({
    productId
   }).skip(skipPage).limit(limit).sort({createdAt: -1})

   responseReturn(res, 200, {
    reviews,
    totalReview: getAll.length,
    rating_review
   })

    } catch (error) {
        logger.error('get_reviews', error.message)
        responseReturn(res, 500, { error: 'Internal Server Error' })
    }
}
// end method


}

module.exports = new homeControllers()