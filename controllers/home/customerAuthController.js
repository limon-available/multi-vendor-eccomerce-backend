 const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utiles/response')
const bcrypt = require('bcrypt')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const {createToken} = require('../../utiles/tokenCreate')
const logger = require('../../utiles/logger')
const { authCookieOptions, clearAuthCookieOptions } = require('../../utiles/cookieOptions')
const { verifyGoogleToken, verifyFacebookToken } = require('../../utiles/oauthVerify')

class customerAuthController{

    // Shared flow for Google/Facebook customer sign-in: find-or-create a
    // customer by the provider's verified email, then issue the same JWT
    // cookie the manual login path uses.
    _social_login = async (res, profile) => {
        let customer = await customerModel.findOne({ email: profile.email })

        if (!customer) {
            customer = await customerModel.create({
                name: profile.name,
                email: profile.email,
                method: profile.provider,
            })
            await sellerCustomerModel.create({ myId: customer.id })
        }

        const token = await createToken({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            method: customer.method,
            role: 'customer',
        })
        res.cookie('customerToken', token, authCookieOptions())
        return responseReturn(res, 200, { message: 'User Login Success', userInfo: customer, token })
    }

    customer_google = async (req, res) => {
        try {
            const profile = await verifyGoogleToken(req.body.access_token)
            return await this._social_login(res, profile)
        } catch (error) {
            logger.error('customer_google', error.message)
            return responseReturn(res, 401, { error: 'Google sign-in failed' })
        }
    }
    // End Method

    customer_facebook = async (req, res) => {
        try {
            const profile = await verifyFacebookToken(req.body.access_token)
            return await this._social_login(res, profile)
        } catch (error) {
            logger.error('customer_facebook', error.message)
            return responseReturn(res, 401, { error: 'Facebook sign-in failed' })
        }
    }
    // End Method

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
