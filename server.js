require('dotenv').config()

const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const mongoose = require('mongoose')

const { clientOrigins, port, validateEnv } = require('./config/env')
const { dbConnect } = require('./utiles/db')
const { errorHandler, notFound } = require('./middlewares/errorMiddleware')
const rateLimit = require('./middlewares/rateLimiter')
const securityHeaders = require('./middlewares/securityHeaders')
const logger = require('./utiles/logger')

const app = express()
const server = http.createServer(app)

validateEnv()

app.disable('x-powered-by')
app.set('trust proxy', 1)

const corsOptions = {
    origin(origin, callback) {
        if (!origin || clientOrigins.includes(origin)) {
            return callback(null, true)
        }

        const error = new Error('Not allowed by CORS')
        error.status = 403
        return callback(error)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(securityHeaders)
app.use(cors(corsOptions))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))

const io = socket(server, {
    cors: {
        origin: clientOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

let allCustomer = []
let allSeller = []
let admin = {}

const addUser = (customerId, socketId, userInfo) => {
    const checkUser = allCustomer.some((u) => u.customerId === customerId)
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo,
        })
    }
}

const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some((u) => u.sellerId === sellerId)
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo,
        })
    }
}

const findCustomer = (customerId) => allCustomer.find((c) => c.customerId === customerId)
const findSeller = (sellerId) => allSeller.find((c) => c.sellerId === sellerId)

const remove = (socketId) => {
    allCustomer = allCustomer.filter((c) => c.socketId !== socketId)
    allSeller = allSeller.filter((c) => c.socketId !== socketId)
}

io.on('connection', (soc) => {
    soc.on('add_user', (customerId, userInfo) => {
        addUser(customerId, soc.id, userInfo)
        io.emit('activeSeller', allSeller)
    })

    soc.on('add_seller', (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo)
        io.emit('activeSeller', allSeller)
    })

    soc.on('send_seller_message', (msg) => {
        const customer = findCustomer(msg.receverId)
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg)
        }
    })

    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg)
        }
    })

    soc.on('send_message_admin_to_seller', (msg) => {
        const seller = findSeller(msg.receverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg)
        }
    })

    soc.on('send_message_seller_to_admin', (msg) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg)
        }
    })

    soc.on('add_admin', (adminInfo) => {
        if (!adminInfo) {
            return
        }

        const safeAdmin = { ...adminInfo }
        delete safeAdmin.email
        delete safeAdmin.password

        admin = safeAdmin
        admin.socketId = soc.id

        io.emit('activeSeller', allSeller)
    })

    soc.on('disconnect', () => {
        remove(soc.id)
        io.emit('activeSeller', allSeller)
    })
})

app.use('/api/home', require('./routes/home/homeRoutes'))
app.use('/api', require('./routes/authRoutes'))
app.use('/api', require('./routes/order/orderRoutes'))
app.use('/api', require('./routes/home/cardRoutes'))
app.use('/api', require('./routes/dashboard/categoryRoutes'))
app.use('/api', require('./routes/dashboard/productRoutes'))
app.use('/api', require('./routes/dashboard/sellerRoutes'))
app.use('/api', require('./routes/home/customerAuthRoutes'))
app.use('/api', require('./routes/chatRoutes'))
app.use('/api', require('./routes/paymentRoutes'))
app.use('/api', require('./routes/dashboard/dashboardRoutes'))

app.get('/', (req, res) => res.status(200).json({ status: 'ok' }))
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))
app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
    try {
        await dbConnect()

        server.listen(port, () => {
            logger.info(`Server is running on port ${port}`)
        })
    } catch (error) {
        logger.error('Server start failed:', error.message)
        process.exit(1)
    }
}

const gracefulShutdown = (signal) => {
    logger.warn(`${signal} received, shutting down gracefully`)
    io.close()
    server.close(() => {
        logger.info('HTTP server closed')
        mongoose.connection.close(false).finally(() => process.exit(0))
    })

    // Force-exit if connections do not drain in time
    setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
    }, 10000).unref()
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason instanceof Error ? reason.message : reason)
})

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error.message)
    process.exit(1)
})

startServer()
