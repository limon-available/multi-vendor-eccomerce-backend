 const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utiles/response')
const bcrypt = require('bcrypt')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const {createToken} = require('../../utiles/tokenCreate')
const logger = require('../../utiles/logger')
const { authCookieOptions, clearAuthCookieOptions } = require('../../utiles/cookieOptions')

class customerAuthController{

    customer_register = async(req,res) => {
        const {name, email, password } = req.body

        try {
            const customer = await customerModel.findOne({email}) 
            if (customer) {
                responseReturn(res, 404,{ error : 'Email Already Exits'} )
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'menualy'
                })
                await sellerCustomerModel.create({
                    myId: createCustomer.id
                })
             const token = await createToken({
    id: createCustomer.id,
    role: 'customer' // 🔥 MUST ADD
})
               res.cookie('customerToken', token, authCookieOptions());
                responseReturn(res,201,{message: "User Register Success", token})
            }
        } catch (error) {
            logger.error('customer_register', error.message)
            responseReturn(res, 500,{ error : 'Internal Server Error'} )
        }
    }
    // End Method

    customer_login = async(req, res) => {
       const { email, password } =req.body
       try {
        const customer = await customerModel.findOne({email}).select('+password')
        if (customer) {
            const match = await bcrypt.compare(password, customer.password)
            if (match) {
                const token = await createToken({
                    id : customer.id,
                    name: customer.name,
                    email: customer.email,
                    method: customer.method,
                    role:'customer'
                })
                res.cookie('customerToken', token, authCookieOptions())
                responseReturn(res, 201,{ message :  'User Login Success',userInfo:customer,token})
                
            } else {
                responseReturn(res, 404,{ error :  'Password Wrong'})
            }
        } else {
            responseReturn(res, 404,{ error :  'Email Not Found'})
        }
        
       } catch (error) {
        logger.error('customer_login', error.message)
        responseReturn(res, 500,{ error : 'Internal Server Error'} )
       }
    }
  // End Method

  customer_logout = async(req, res) => {
    const options = clearAuthCookieOptions()
    // Clear every role cookie so a stale admin/seller token can't linger in the
    // shared backend cookie jar and hijack customer routes after logout.
    res.clearCookie('customerToken', options)
    res.clearCookie('sellerToken', options)
    res.clearCookie('adminToken', options)
    responseReturn(res, 200,{ message :  'Logout Success'})
  }
    // End Method

}

module.exports = new customerAuthController()
