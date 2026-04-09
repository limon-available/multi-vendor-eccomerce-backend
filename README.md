# 🧩 Backend Documentation

## 📘 Project Overview

The **E-commerce Dashboard Backend** is a **scalable, multi-role web server** built using  
**Node.js**, **Express**, **MongoDB**, and **Socket.IO**.

It provides a **complete API** and **real-time infrastructure** for a full-stack  
eCommerce platform that connects **Admins**, **Sellers**, and **Customers** seamlessly.

```
Project Structure

BACKEND/
├── controllers/
│ ├── chat/
│ │ └── ChatController.js
│ ├── dashboard/
│ │ ├── categoryController.js
│ │ ├── dashboardController.js
│ │ ├── productController.js
│ │ └── sellerController.js
│ ├── home/│
│ ├── cardController.js
│ │ ├── customerAuthController.js
│ │ └── homeControllers.js
│ ├── order/
│ │ └── orderController.js
│ ├── payment/
│ │ └── paymentController.js
│ ├── authControllers.js
├── middlewares/
│ └── authMiddleware.js
├── models/
│ ├── chat/
│ │ ├── adminSellerMessage.js
│ │ ├── sellerCustomerMessage.js
│ │ └── sellerCustomerModel.js
│ ├── adminModel.js
│ ├── authOrder.js
│ ├── bannerModel.js
│ ├── cardModel.js
│ ├── categoryModel.js
│ ├── customerModel.js
│ ├── customerOrder.js
│ ├── myShopWallet.js
│ ├── productModel.js
│ ├── reviewModel.js
│ ├── sellerModel.js
│ ├── sellerWallet.js
│ ├── stripeModel.js
│ ├── wishlistModel.js
│ ├── withdrawModel.js
│ └── withdrawRequest.js
├── routes/
│ ├── dashboard/
│ │ ├── categoryRoutes.js
│ │ ├── dashboardRoutes.js
│ │ ├── productRoutes.js
│ │ └── sellerRoutes.js
│ ├── home/
│ │ ├── cardRoutes.js
│ │ ├── customerAuthRoutes.js
│ │ └── homeRoutes.js
│ ├── order/
│ │ └── orderRoutes.js
│ ├── adminRoutes.js
│ ├── authRoutes.js
│ ├── chatRoutes.js
│ └── paymentRoutes.js
├── utiles/
│ ├── db.js
│ ├── multer.js
│ ├── queryProducts.js
│ ├── response.js
│ └── tokenCreate.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

```
Installation & Setup

Clone the Repository
git clone:
cd backend

Install Dependencies
Make sure you have Node.js (v16 or later) and npm installed, then run:
npm install

Run the Server
For production mode:
npm start
For development mode (with live reloading using nodemon):
npx nodemon server.js
```

---

## 🗂️ **File:** `controllers/ChatController.js`

### 📘 **Overview**

Handles chat features between **Seller**, **Customer**, and **Admin** — including  
friend creation, message sending, and message retrieval.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **add_customer_friend**

- **Purpose:** Connects seller & customer as chat friends.
- **Endpoint:** `POST /api/chat/add-friend`
- **Returns:** Friend list + previous messages.

#### 2️⃣ **customer_message_add**

- **Purpose:** Customer sends a message to seller.
- **Endpoint:** `POST /api/chat/customer-message`
- **Updates:** Friend list order for both users.

#### 3️⃣ **get_customers**

- **Purpose:** Get all customers connected to a seller.
- **Endpoint:** `GET /api/chat/customers/:sellerId`

#### 4️⃣ **get_customers_seller_message**

- **Purpose:** Fetches all messages between a seller & specific customer.
- **Endpoint:** `GET /api/chat/messages/:customerId`

#### 5️⃣ **seller_message_add**

- **Purpose:** Seller sends message to customer.
- **Endpoint:** `POST /api/chat/seller-message`
- **Updates:** Both sides’ chat order.

#### 6️⃣ **seller_admin_message_insert**

- **Purpose:** Send messages between **Admin ↔ Seller**.
- **Endpoint:** `POST /api/chat/admin-seller`

#### 7️⃣ **get_admin_messages**

- **Purpose:** Fetches conversation between **Admin & Seller**.
- **Endpoint:** `GET /api/chat/admin/:receverId`

#### 8️⃣ **get_sellers**

- **Purpose:** Returns all seller info (name, email, image, status).
- **Endpoint:** `GET /api/chat/sellers`

#### 9️⃣ **get_seller_messages**

- **Purpose:** Fetches messages between **Seller ↔ Admin**.
- **Endpoint:** `GET /api/chat/seller-messages`

---

## 🗂️ **File:** `controllers/dashboard/CategoryController.js`

### 📘 **Overview**

Handles all CRUD operations for **product categories** — including image upload via **Cloudinary**.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **add_category**

- **Endpoint:** `POST /api/category/add`
- **Purpose:** Add new category with image upload.
- **Input:** `name`, `image (file)`
- **Uploads:** Image to Cloudinary → stores URL in MongoDB.
- **Response:** `{ category, message }`

#### 2️⃣ **get_category**

- **Endpoint:** `GET /api/category`
- **Purpose:** Fetch all categories (with search & pagination).
- **Query Params:** `page`, `parPage`, `searchValue`
- **Response:** `{ categorys, totalCategory }`

#### 3️⃣ **update_category**

- **Endpoint:** `PUT /api/category/update/:id`
- **Purpose:** Update existing category name and/or image.
- **Input:** `name (optional)`, `image (optional)`
- **Response:** `{ category, message }`

#### 4️⃣ **deleteCategory**

- **Endpoint:** `DELETE /api/category/delete/:id`
- **Purpose:** Delete a category by ID.
- **Response:** `{ message: "Category deleted successfully" }`

---

### 🧩 **Dependencies**

- **Model:** `categoryModel`
- **Utility:** `responseReturn()`
- **Cloud Service:** `Cloudinary (for image storage)`

---

## 🗂️ **File:** `controllers/dashboard/DashboardController.js`

### 📘 **Overview**

Manages **Admin & Seller dashboard analytics** and **Banner management**.  
Includes sales statistics, product counts, recent activity, and banner uploads via **Cloudinary**.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **get_admin_dashboard_data**

- **Endpoint:** `GET /api/admin/dashboard`
- **Purpose:** Retrieve admin overview data.
- **Returns:**
  - `totalSale`, `totalProduct`, `totalOrder`, `totalSeller`
  - `messages` (latest 3 admin-seller messages)
  - `recentOrders` (latest 5 customer orders)

#### 2️⃣ **get_seller_dashboard_data**

- **Endpoint:** `GET /api/seller/dashboard/:id`
- **Purpose:** Retrieve dashboard data for a specific seller.
- **Returns:**
  - `totalSale`, `totalProduct`, `totalOrder`, `totalPendingOrder`
  - `messages` (seller-customer chat preview)
  - `recentOrders` (latest 5 seller orders)

#### 3️⃣ **add_banner**

- **Endpoint:** `POST /api/banner/add`
- **Purpose:** Upload and add a banner linked to a product.
- **Input:** `productId`, `mainban (image file)`
- **Process:**
  - Uploads image to Cloudinary (`banners/` folder)
  - Saves record in `bannerModel`
- **Response:** `{ banner, message }`

#### 4️⃣ **get_banner**

- **Endpoint:** `GET /api/banner/:productId`
- **Purpose:** Retrieve banner for a specific product.
- **Response:** `{ banner }`

#### 5️⃣ **update_banner**

- **Endpoint:** `PUT /api/banner/update/:bannerId`
- **Purpose:** Update banner image for a specific product.
- **Process:**
  - Deletes old Cloudinary image
  - Uploads new image
  - Updates `bannerModel`
- **Response:** `{ banner, message }`

#### 6️⃣ **get_banners**

- **Endpoint:** `GET /api/banners`
- **Purpose:** Fetch random 5 banners for homepage display.
- **Response:** `{ banners }`

---

### 🧩 **Dependencies**

- **Models:** `myShopWallet`, `productModel`, `customerOrder`, `sellerModel`, `sellerWallet`, `authOrder`, `bannerModel`, `adminSellerMessage`, `sellerCustomerMessage`
- **Utilities:** `responseReturn()`
- **Libraries:** `formidable`, `cloudinary`, `mongoose`

---

## 🗂️ **File:** `controllers/dashboard/ProductController.js`

### 📘 **Overview**

Handles **CRUD operations for products** — including image upload and updates via **Cloudinary**.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **add_product**

- **Endpoint:** `POST /api/product/add`
- **Purpose:** Add new product with multiple image uploads.
- **Input Fields:** `name`, `category`, `description`, `stock`, `price`, `discount`, `shopName`, `brand`, `images[]`
- **Response:** `{ message: 'Product Added Successfully' }`

#### 2️⃣ **products_get**

- **Endpoint:** `GET /api/products`
- **Purpose:** Get all products by seller with pagination & search.
- **Query Params:** `page`, `parPage`, `searchValue`
- **Response:** `{ products, totalProduct }`

#### 3️⃣ **product_get**

- **Endpoint:** `GET /api/product/:productId`
- **Purpose:** Fetch a single product by ID.
- **Response:** `{ product }`

#### 4️⃣ **product_update**

- **Endpoint:** `PUT /api/product/update`
- **Purpose:** Update product details (text fields only).
- **Input:** `name`, `description`, `stock`, `price`, `discount`, `brand`, `productId`
- **Response:** `{ product, message: 'Product Updated Successfully' }`

#### 5️⃣ **product_image_update**

- **Endpoint:** `PUT /api/product/image/update`
- **Purpose:** Replace an old image with a new one.
- **Input:** `oldImage`, `productId`, `newImage (file)`
- **Process:** Uploads new image to Cloudinary → Replaces old URL.
- **Response:** `{ product, message: 'Product Image Updated Successfully' }`

---

### 🧩 **Dependencies**

- **Libraries:** `formidable`, `cloudinary`
- **Models:** `productModel`
- **Utility:** `responseReturn()`

---

## 🗂️ **File:** `controllers/dashboard/SellerController.js`

### 📘 **Overview**

Handles **Seller management** — viewing pending, active, and inactive sellers, approving/rejecting requests, and updating statuses.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **request_seller_get**

- **Endpoint:** `GET /api/seller/request`
- **Purpose:** Get all pending seller requests.
- **Response:** `{ sellers, totalSeller }`

#### 2️⃣ **get_seller**

- **Endpoint:** `GET /api/seller/:sellerId`
- **Purpose:** Fetch a specific seller’s full details.
- **Response:** `{ seller }`

#### 3️⃣ **seller_status_update**

- **Endpoint:** `PUT /api/seller/status`
- **Purpose:** Update a seller’s account status (pending, active, or deactive).
- **Input Body:** `{ sellerId, status }`
- **Response:** `{ seller, message: 'Seller Status Updated Successfully' }`

#### 4️⃣ **get_active_sellers**

- **Endpoint:** `GET /api/seller/active`
- **Purpose:** Get all active sellers with pagination and search.
- **Response:** `{ sellers, totalSeller }`

#### 5️⃣ **get_deactive_sellers**

- **Endpoint:** `GET /api/seller/deactive`
- **Purpose:** Get all deactivated sellers.
- **Response:** `{ sellers, totalSeller }`

---

### 🧩 **Dependencies**

- **Libraries:** `formidable`, `cloudinary`
- **Model:** `sellerModel`
- **Utility:** `responseReturn()`

---

## 🗂️ **File:** `controllers/home/CardController.js`

### 📘 **Overview**

Handles **shopping cart** and **wishlist** operations — add, view, update, and delete items for each user.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **add_to_card**

- **Endpoint:** `POST /api/card/add`
- **Purpose:** Add a product to the user’s cart.
- **Body:** `{ userId, productId, quantity }`
- **Response:**
  - Success → `{ message: "Added To Card Successfully" }`
  - Exists → `{ error: "Product Already Added To Card" }`

#### 2️⃣ **get_card_products**

- **Endpoint:** `GET /api/card/:userId`
- **Purpose:** Fetch all cart products for a specific user.
- **Response:** `{ card_products, price, card_product_count, shipping_fee, outOfStockProduct, buy_product_item }`

#### 3️⃣ **delete_card_products**

- **Endpoint:** `DELETE /api/card/delete/:card_id`
- **Purpose:** Remove a specific product from the cart.
- **Response:** `{ message: "Product Remove Successfully" }`

#### 4️⃣ **quantity_inc / quantity_dec**

- **Endpoints:**
  - `PUT /api/card/inc/:card_id`
  - `PUT /api/card/dec/:card_id`
- **Purpose:** Increase or decrease quantity by 1.
- **Response:** `{ message: "Qty Updated" }`

#### 5️⃣ **add_wishlist / get_wishlist / remove_wishlist**

- **Endpoints:**
  - `POST /api/wishlist/add`
  - `GET /api/wishlist/:userId`
  - `DELETE /api/wishlist/remove/:wishlistId`
- **Purpose:** Manage wishlist items for each user.

---

### 🧩 **Dependencies**

- **Models:** `cardModel`, `wishlistModel`
- **Utils:** `responseReturn()`
- **MongoDB:** `ObjectId` for aggregation & relation lookup

---

## 🗂️ **File:** `controllers/home/CustomerAuthController.js`

### 📘 **Overview**

Handles **customer registration, login, and logout** using JWT-based authentication and cookie storage.

---

### ⚙️ **Function Summary**

#### 1️⃣ **customer_register**

- **Endpoint:** `POST /api/customer/register`
- **Purpose:** Register a new customer and create login token.
- **Response:** `{ message: "User Register Success", token: "<jwt_token>" }`

#### 2️⃣ **customer_login**

- **Endpoint:** `POST /api/customer/login`
- **Purpose:** Authenticate existing customer.
- **Response:** `{ message: "User Login Success", token: "<jwt_token>" }`

#### 3️⃣ **customer_logout**

- **Endpoint:** `POST /api/customer/logout`
- **Purpose:** Logout customer & clear token.
- **Response:** `{ message: "Logout Success" }`

---

### 🧩 **Dependencies**

- **Models:** `customerModel`, `sellerCustomerModel`
- **Libraries:** `bcrypt`, `jsonwebtoken`
- **Utils:** `responseReturn()`, `createToken()`
- **Auth:** JWT cookie (`customerToken`) expires in 7 days

---

## 🗂️ **File:** `controllers/home/HomeController.js`

### 📘 **Overview**

Manages **homepage and product** operations like fetching categories, filtering, details, and reviews.

---

### ⚙️ **Function Summary**

#### 1️⃣ **get_categorys**

- **Endpoint:** `GET /api/home/categories`
- **Purpose:** Fetch all available categories.

#### 2️⃣ **get_products**

- **Endpoint:** `GET /api/home/products`
- **Purpose:** Get homepage product sections (latest, top-rated, discounted).

#### 3️⃣ **price_range_product**

- **Endpoint:** `GET /api/home/price-range`
- **Purpose:** Fetch latest products and price range.

#### 4️⃣ **query_products**

- **Endpoint:** `GET /api/home/query-products`
- **Purpose:** Filter and sort products by category, rating, search, price.

#### 5️⃣ **product_details**

- **Endpoint:** `GET /api/home/product/:slug`
- **Purpose:** Fetch single product details + related items.

#### 6️⃣ **submit_review**

- **Endpoint:** `POST /api/home/review`
- **Purpose:** Add new product review and update rating.

#### 7️⃣ **get_reviews**

- **Endpoint:** `GET /api/home/reviews/:productId?pageNo=1`
- **Purpose:** Fetch paginated reviews & rating summary.

---

### 🧩 **Dependencies**

- **Models:** `categoryModel`, `productModel`, `reviewModel`
- **Utils:** `responseReturn()`, `queryProducts`
- **Libraries:** `moment`, `mongoose`

---

## 🗂️ **File:** `controllers/order/OrderController.js`

### 📘 **Overview**

Handles **order placement, payment, tracking, and wallet updates** for both customers and sellers.  
Includes **Stripe** integration for secure online payments.

---

### ⚙️ **Function Summary (with API Endpoints)**

#### 1️⃣ **place_order**

- **Endpoint:** `POST /api/order/place`
- **Purpose:** Create new customer order and related seller sub-orders.
- **Response:** `{ message: "Order Placed Success", orderId: "..." }`

#### 2️⃣ **get_customer_dashboard_data**

- **Endpoint:** `GET /api/order/customer-dashboard/:userId`
- **Purpose:** Fetch customer order stats & recent orders.

#### 3️⃣ **get_orders / get_order_details**

- **Endpoints:**
  - `GET /api/order/customer/:customerId/:status`
  - `GET /api/order/details/:orderId`
- **Purpose:** Retrieve customer orders and specific order details.

#### 4️⃣ **get_admin_orders / get_admin_order**

- **Endpoints:**
  - `GET /api/admin/orders`
  - `GET /api/admin/order/:orderId`
- **Purpose:** Admin view for all orders and single order.

#### 5️⃣ **admin_order_status_update**

- **Endpoint:** `PUT /api/admin/order/status/:orderId`
- **Purpose:** Update order delivery status.
- **Body:** `{ status: "cancelled" }`

#### 6️⃣ **get_seller_orders / get_seller_order**

- **Endpoints:**
  - `GET /api/seller/orders/:sellerId`
  - `GET /api/seller/order/:orderId`
- **Purpose:** Fetch orders related to a specific seller.

#### 7️⃣ **seller_order_status_update**

- **Endpoint:** `PUT /api/seller/order/status/:orderId`
- **Purpose:** Seller updates delivery status.
- **Response:** `{ message: "order status updated successfully" }`

#### 8️⃣ **create_payment**

- **Endpoint:** `POST /api/order/payment`
- **Purpose:** Create Stripe payment intent.
- **Response:** `{ clientSecret: "..." }`

#### 9️⃣ **order_confirm**

- **Endpoint:** `PUT /api/order/confirm/:orderId`
- **Purpose:** Confirm order after successful payment.
- **Response:** `{ message: "success" }`

#### 🔟 **card_item_delete**

- **Endpoint:** `DELETE /api/order/cart-clear`
- **Purpose:** Clear all cart items of a user.

---

### 🧩 **Dependencies**

- **Models:** `authOrderModel`, `customerOrder`, `sellerWallet`, `myShopWallet`, `cardModel`
- **Libraries:** `moment`, `mongoose`, `stripe`
- **Utils:** `responseReturn()`
- **Notes:** Auto-cancels unpaid orders using `paymentCheck()`

---

## 🗂️ **File:** `controllers/payment/PaymentController.js`

### 📘 **Overview**

Manages **payment and withdrawal** operations for sellers using **Stripe Connect**.

---

### ⚙️ **Function Summary**

#### 1️⃣ **create_stripe_connect_account**

- **Endpoint:** `POST /api/payment/create-stripeaccount`
- **Purpose:** Creates Stripe Express account for seller.
- **Response:** Stripe onboarding URL.

#### 2️⃣ **active_stripe_connect_account**

- **Endpoint:** `GET /api/payment/active/:activeCode`
- **Purpose:** Activates seller payment after onboarding.

#### 3️⃣ **get_seller_payment_details**

- **Endpoint:** `GET /api/payment/details/:sellerId`
- **Purpose:** Retrieve seller’s payment overview and balance.

#### 4️⃣ **withdrowal_request**

- **Endpoint:** `POST /api/payment/withdraw-request`
- **Purpose:** Seller requests a withdrawal amount.
- **Status:** Default → pending.

#### 5️⃣ **get_payment_request**

- **Endpoint:** `GET /api/payment/withdraw-pending`
- **Purpose:** Admin view pending withdrawal requests.

#### 6️⃣ **payment_request_confirm**

- **Endpoint:** `POST /api/payment/confirm-request`
- **Purpose:** Admin confirms withdrawal and sends funds via Stripe.

---

### 🧩 **Stripe Integration**

- `stripe.accounts.create()`
- `stripe.accountLinks.create()`
- `stripe.transfers.create()`

---

## 🗂️ **File:** `controllers/AuthControllers.js`

### 📘 **Overview**

Handles **authentication and profile management** for both Admin and Seller users —  
including login, registration, JWT handling, and Cloudinary profile uploads.

---

### ⚙️ **Function Summary**

#### 1️⃣ **admin_login**

- **Endpoint:** `POST /api/auth/admin-login`
- **Purpose:** Verify admin credentials and create JWT token.

#### 2️⃣ **seller_login**

- **Endpoint:** `POST /api/auth/seller-login`
- **Purpose:** Authenticate seller and set token cookie.

#### 3️⃣ **seller_register**

- **Endpoint:** `POST /api/auth/seller-register`
- **Purpose:** Register new seller & create related records.

#### 4️⃣ **getUser**

- **Endpoint:** `GET /api/auth/get-user`
- **Purpose:** Verify JWT from cookie and retrieve user details.

#### 5️⃣ **profile_image_upload**

- **Endpoint:** `POST /api/auth/upload-profileimage`
- **Purpose:** Upload seller profile image to Cloudinary.

#### 6️⃣ **profile_info_add**

- **Endpoint:** `POST /api/auth/add-profile-info`
- **Purpose:** Update seller’s shop details.

#### 7️⃣ **logout**

- **Endpoint:** `POST /api/auth/logout`
- **Purpose:** Clear admin and seller cookies.

---

### 🧩 **Integrations**

- **Cloudinary** → Profile image uploads
- **bcrypt** → Password encryption
- **JWT** → Token-based authentication
- **Cookies** → Session management

# 🧩 MIDDLEWARE DOCUMENTATION

---

## 🗂️ **File:** `AuthMiddleware.js`

### 📘 **Purpose**

Handles authentication for **Admin** and **Seller** routes using **JWT tokens** stored in cookies.  
This middleware verifies the token, extracts the user information (ID, role), and ensures access to protected routes.

---

### ⚙️ **Function Summary**

#### 🔹 **verifyToken(token)**

- **Purpose:**  
  Verifies a JWT token using the secret key defined in `.env`.
- **Process:**  
  Decodes and validates the token → returns user info (id, role).
- **Error Handling:**  
  Throws an error if the token is invalid or expired.

---

#### 🔹 **adminAuth(req, res, next)**

- **Purpose:**  
  Protects routes meant for **Admin** users.  
  Checks the `adminToken` cookie and validates it via JWT.
- **Process:**
  - Reads `req.cookies.adminToken`
  - Verifies token with `verifyToken()`
  - Attaches decoded info to the request as:
    - `req.id` → Admin ID
    - `req.role` → `"admin"`
- **On Failure:**  
  Returns `401 Unauthorized` if token is missing or invalid.

---

#### 🔹 **sellerAuth(req, res, next)**

- **Purpose:**  
  Protects routes meant for **Seller** users.  
  Checks the `sellerToken` cookie and validates it via JWT.
- **Process:**
  - Reads `req.cookies.sellerToken`
  - Verifies token with `verifyToken()`
  - Attaches decoded info to the request as:
    - `req.id` → Seller ID
    - `req.role` → `"seller"`
- **On Failure:**  
  Returns `401 Unauthorized` if token is missing or invalid.

---

### 🧩 **Dependencies**

- **jsonwebtoken** → For verifying JWT tokens.
- **dotenv** → For accessing secret key (`process.env.SECRET`).
- **cookie-parser** → For reading cookies from HTTP requests.

---

### 🧱 **Used In**

This middleware is used across:

- `routes/dashboard/` → Admin-protected routes
- `routes/home/` → Seller or Customer routes
- `routes/payment/` → Seller/Payment authorization
- `routes/chat/` → Real-time admin-seller communication security

---

✅ **Summary:**  
`AuthMiddleware.js` ensures that only authenticated users (Admin or Seller) can access sensitive API endpoints.  
It is a core layer of security for the backend system.

# 🧭 ROUTES DOCUMENTATION

---

## 🗂️ **File:** `routes/dashboard/categoryRoutes.js`

### 📘 **Purpose**

Handles all **category-related API routes** in the e-commerce backend.  
Supports adding, viewing, updating, and deleting product categories — restricted to authenticated admins.

---

### 🧩 **Dependencies**

- **express** → Router instance
- **categoryController** → Core logic for category management
- **adminAuth** → Middleware to verify admin authentication
- **upload (Multer)** → Handles image uploads

---

### ⚙️ **Routes Summary**

| Method     | Endpoint               | Middleware                            | Controller Function | Description                   |
| :--------- | :--------------------- | :------------------------------------ | :------------------ | :---------------------------- |
| **POST**   | `/category-add`        | `adminAuth`, `upload.single('image')` | `add_category`      | Add new category with image   |
| **GET**    | `/category-get`        | `adminAuth`                           | `get_category`      | Retrieve all categories       |
| **PUT**    | `/category-update/:id` | `adminAuth`                           | `update_category`   | Update category details by ID |
| **DELETE** | `/category/:id`        | `adminAuth`                           | `deleteCategory`    | Delete category by ID         |

---

## 🗂️ **File:** `routes/dashboard/dashboardRoutes.js`

### 📘 **Purpose**

Defines **dashboard-related API routes** for both admin and seller roles.  
Provides routes to fetch analytics and banner data.

---

### 🧩 **Dependencies**

- **express** → Router
- **dashboardController** → Dashboard data logic
- **adminAuth, sellerAuth** → Middleware for authentication and role-based access control

---

### ⚙️ **Routes Summary**

| Method  | Endpoint                         | Middleware   | Controller Function         | Description                      |
| :------ | :------------------------------- | :----------- | :-------------------------- | :------------------------------- |
| **GET** | `/admin/get-dashboard-data`      | `adminAuth`  | `get_admin_dashboard_data`  | Fetch admin dashboard statistics |
| **GET** | `/seller/get-dashboard-data/:id` | `sellerAuth` | `get_seller_dashboard_data` | Fetch seller dashboard data      |
| **GET** | `/banner/get/:productId`         | `sellerAuth` | `get_banner`                | Retrieve banner for product      |
| **GET** | `/banners`                       | —            | `get_banners`               | Get all banners (public)         |

---

## 🗂️ **File:** `routes/dashboard/sellerRoutes.js`

### 📘 **Purpose**

Defines **seller-management routes** used by admin/dashboard systems to retrieve, update, and manage seller info & status.

---

### 🧩 **Dependencies**

- **express** → Router
- **sellerController** → Seller-related actions
- **sellerAuth** → Middleware ensuring only authenticated sellers/admins can access routes

---

### ⚙️ **Routes Summary**

| Method   | Endpoint                | Middleware   | Controller Function    | Description                   |
| :------- | :---------------------- | :----------- | :--------------------- | :---------------------------- |
| **GET**  | `/request-seller-get`   | `sellerAuth` | `request_seller_get`   | Fetch pending seller requests |
| **GET**  | `/get-seller/:sellerId` | `sellerAuth` | `get_seller`           | Retrieve seller details       |
| **POST** | `/seller-status-update` | `sellerAuth` | `seller_status_update` | Update seller status          |
| **GET**  | `/get-sellers`          | `sellerAuth` | `get_active_sellers`   | Get all active sellers        |
| **GET**  | `/get-deactive-sellers` | `sellerAuth` | `get_deactive_sellers` | Get all deactivated sellers   |

---

## 🗂️ **File:** `routes/home/cardRoutes.js`

### 📘 **Purpose**

Defines **shopping cart & wishlist API routes** for frontend (home section).  
Connects client actions to `cardController` functions.

---

### 🧩 **Dependencies**

- **express** → Router
- **cardController** → Logic for cart & wishlist actions

---

### ⚙️ **Implemented Routes**

| Method     | Endpoint                                            | Controller Function    | Description                       |
| :--------- | :-------------------------------------------------- | :--------------------- | :-------------------------------- |
| **POST**   | `/home/product/add-to-card`                         | `add_to_card`          | Add product to user’s cart        |
| **GET**    | `/home/product/get-card-product/:userId`            | `get_card_products`    | Fetch all cart items for user     |
| **DELETE** | `/home/product/delete-card-product/:card_id`        | `delete_card_products` | Remove specific product from cart |
| **PUT**    | `/home/product/quantity-inc/:card_id`               | `quantity_inc`         | Increase product quantity         |
| **PUT**    | `/home/product/quantity-dec/:card_id`               | `quantity_dec`         | Decrease product quantity         |
| **POST**   | `/home/product/add-to-wishlist`                     | `add_wishlist`         | Add product to wishlist           |
| **GET**    | `/home/product/get-wishlist-products/:userId`       | `get_wishlist`         | Retrieve wishlist items           |
| **DELETE** | `/home/product/remove-wishlist-product/:wishlistId` | `remove_wishlist`      | Remove product from wishlist      |

> ⚠️ **Note:**  
> Routes are publicly accessible (identified by `userId`).  
> In production, JWT middleware should be added for security.

---

## 🗂️ **File:** `routes/home/customerAuthRoutes.js`

### 📘 **Purpose**

Handles **customer authentication operations** — registration, login, and logout.

---

### ⚙️ **Routes Overview**

| Method   | Endpoint                      | Controller Function | Description             |
| :------- | :---------------------------- | :------------------ | :---------------------- |
| **POST** | `/customer/customer-register` | `customer_register` | Register a new customer |
| **POST** | `/customer/customer-login`    | `customer_login`    | Authenticate customer   |
| **GET**  | `/customer/logout`            | `customer_logout`   | Logout customer         |

---

## 🗂️ **File:** `routes/home/homeRoutes.js`

### 📘 **Purpose**

Manages **customer-facing endpoints** for fetching categories, products, product details, and reviews.

---

### ⚙️ **Routes Overview**

| Method   | Endpoint                           | Controller Function   | Description                        |
| :------- | :--------------------------------- | :-------------------- | :--------------------------------- |
| **GET**  | `/get-categorys`                   | `get_categorys`       | Get all product categories         |
| **GET**  | `/get-products`                    | `get_products`        | Get products for homepage          |
| **GET**  | `/price-range-latest-product`      | `price_range_product` | Get products by price range/latest |
| **GET**  | `/query-products`                  | `query_products`      | Filter & sort products             |
| **GET**  | `/product-details/:slug`           | `product_details`     | Get single product details         |
| **POST** | `/customer/submit-review`          | `submit_review`       | Submit product review              |
| **GET**  | `/customer/get-reviews/:productId` | `get_reviews`         | Retrieve reviews for a product     |

---

## 🗂️ **File:** `routes/order/orderRoutes.js`

### 📘 **Purpose**

Manages **all order-related operations** for customers, admins, and sellers.

---

### ⚙️ **Key Endpoints**

| Role         | Endpoint                   | Description                 |
| :----------- | :------------------------- | :-------------------------- |
| **Customer** | `/home/order/placeorder`   | Place new order             |
| **Admin**    | `/admin/orders`            | View all orders             |
| **Seller**   | `/seller/orders/:sellerId` | View seller-specific orders |

> Includes endpoints for payment creation, order confirmation, and status updates.

---

## 🗂️ **File:** `routes/auth/authRoutes.js`

### 📘 **Purpose**

Defines all **authentication & profile routes** for Admins and Sellers.  
Connects to `authControllers` with JWT middleware for protection.

---

### ⚙️ **Routes Overview**

| Method   | Endpoint                | Middleware                             | Controller Function    | Description                 |
| :------- | :---------------------- | :------------------------------------- | :--------------------- | :-------------------------- |
| **POST** | `/admin-login`          | —                                      | `admin_login`          | Admin login                 |
| **GET**  | `/get-user`             | `adminAuth`                            | `getUser`              | Get logged-in admin         |
| **POST** | `/seller-register`      | —                                      | `seller_register`      | Seller registration         |
| **POST** | `/seller-login`         | —                                      | `seller_login`         | Seller login                |
| **POST** | `/profile-image-upload` | `sellerAuth`, `upload.single('image')` | `profile_image_upload` | Upload seller profile image |
| **POST** | `/profile-info-add`     | `sellerAuth`                           | `profile_info_add`     | Update seller profile       |
| **GET**  | `/logout`               | —                                      | `logout`               | Logout current user         |

---

## 🗂️ **File:** `routes/chat/chatRoutes.js`

### 📘 **Purpose**

Defines all **chat-related API routes** used for communication between **Customers**, **Sellers**, and **Admins**.

---

### ⚙️ **Routes Overview**

| Method   | Endpoint                                        | Middleware   | Controller Function            | Description                         |
| :------- | :---------------------------------------------- | :----------- | :----------------------------- | :---------------------------------- |
| **POST** | `/chat/customer/add-customer-friend`            | —            | `add_customer_friend`          | Add customer to seller chat list    |
| **POST** | `/chat/customer/send-message-to-seller`         | —            | `customer_message_add`         | Customer → Seller message           |
| **GET**  | `/chat/seller/get-customers/:sellerId`          | —            | `get_customers`                | Get all seller customers            |
| **GET**  | `/chat/seller/get-customer-message/:customerId` | `sellerAuth` | `get_customers_seller_message` | Get seller-customer message history |
| **POST** | `/chat/seller/send-message-to-customer`         | `sellerAuth` | `seller_message_add`           | Seller → Customer message           |
| **GET**  | `/chat/admin/get-sellers`                       | `adminAuth`  | `get_sellers`                  | List sellers for admin              |
| **POST** | `/chat/message-send-seller-admin`               | `adminAuth`  | `seller_admin_message_insert`  | Admin ↔ Seller messaging            |
| **GET**  | `/chat/get-admin-messages/:receverId`           | `adminAuth`  | `get_admin_messages`           | Get admin-seller messages           |
| **GET**  | `/chat/get-seller-messages`                     | `adminAuth`  | `get_seller_messages`          | Fetch all seller messages           |

---

## 🗂️ **File:** `routes/payment/paymentRoutes.js`

### 📘 **Purpose**

Handles **payment & withdrawal routes** for sellers and admins via **Stripe Connect**.

---

### ⚙️ **Routes Overview**

| Method   | Endpoint                                             | Middleware   | Controller Function             | Description                       |
| :------- | :--------------------------------------------------- | :----------- | :------------------------------ | :-------------------------------- |
| **GET**  | `/payment/create-stripe-connect-account`             | `sellerAuth` | `create_stripe_connect_account` | Initialize Stripe Connect account |
| **PUT**  | `/payment/active-stripe-connect-account/:activeCode` | `sellerAuth` | `active_stripe_connect_account` | Activate Stripe account           |
| **GET**  | `/payment/seller-payment-details/:sellerId`          | `sellerAuth` | `get_seller_payment_details`    | Retrieve seller payment data      |
| **POST** | `/payment/withdrowal-request`                        | `sellerAuth` | `withdrowal_request`            | Request withdrawal                |
| **GET**  | `/payment/request`                                   | `sellerAuth` | `get_payment_request`           | Fetch all withdrawal requests     |
| **POST** | `/payment/request-confirm`                           | `adminAuth`  | `payment_request_confirm`       | Admin approves withdrawal         |

# ⚙️ UTILITIES & CONFIGURATION FILES

---

## 🗂️ **File:** `utiles/dbConnect.js`

### 📘 **Purpose**

Handles **MongoDB connection** for the backend using **Mongoose**.  
Connects to either local or production database depending on the environment mode.

---

### ⚙️ **Function Overview**

| Function        | Description                                                                                                         |
| :-------------- | :------------------------------------------------------------------------------------------------------------------ |
| **dbConnect()** | Connects to MongoDB using Mongoose. Chooses between `DB_LOCAL_URL` or `DB_PRO_URL` based on `.env` value of `mode`. |

---

### 🔧 **Environment Variables Used**

- `mode` — Determines environment (`pro` or `local`)
- `DB_PRO_URL` — MongoDB production URL
- `DB_LOCAL_URL` — MongoDB local URL

---

### 🧠 **Developer Notes**

- Uses `useNewUrlParser: true` for compatibility.
- Logs connection success or failure to console.
- Called once inside `server.js` during initialization.

---

## 🗂️ **File:** `utiles/multer.js`

### 📘 **Purpose**

Configures **Multer** for file uploads (e.g., product images, profile pictures).  
Uses **in-memory storage** (no file system writes) — ideal for cloud upload (e.g., Cloudinary).

---

### ⚙️ **Function Overview**

| Variable    | Description                                                     |
| :---------- | :-------------------------------------------------------------- |
| **storage** | Uses `multer.memoryStorage()` to hold uploaded files in memory. |
| **upload**  | Exports a configured Multer instance for route-level use.       |

---

### 🧪 **Usage Example**

```js
router.post(
  "/profile-image-upload",
  sellerAuth,
  upload.single("image"),
  authControllers.profile_image_upload,
);
```

# 🧩 **File:** `queryProducts.js`

## 📘 **Overview**

The `queryProducts` class provides a complete **product filtering, searching, sorting, and pagination utility** for the eCommerce backend.  
It processes product arrays in memory based on **user query parameters** (e.g., category, rating, price range, etc.) to dynamically modify product listings.

---

## ⚙️ **Class Summary**

### 🏷️ **Class Name:** `queryProducts`

- **Purpose:** Filter, sort, and paginate product data for frontend display.
- **Exported As:** `module.exports = queryProducts`
- **Core Features:**
  - Filter by category and rating
  - Keyword-based search
  - Price range filtering
  - Sorting (low → high, high → low)
  - Pagination (skip & limit)

## 🧱 **Constructor**

constructor(products, query)

# 🧩 **File:** `responseReturn.js`

## 📘 **Overview**

The `responseReturn` utility function is a **standardized HTTP response handler** for the backend.  
It ensures consistent and clean API responses across all controllers, improving code readability and reducing repetition.

---

## ⚙️ **Function Summary**

### 🔹 **Function Name:** `responseReturn(res, code, data)`

```js
module.exports.responseReturn = (res, code, data) => {
  return res.status(code).json(data);
};
```

# 🧩 **File:** `createToken.js`

---

## 📘 **Overview**

The `createToken` utility is responsible for generating **JWT (JSON Web Token)** for authentication and authorization in the backend.  
It ensures secure, time-limited tokens for **Admin**, **Seller**, and **Customer** login sessions.

---

## ⚙️ **Function Summary**

### 🔹 **Function Name:** `createToken(data)`

# ⚙️ **Environment Configuration (`.env`)**

---

## 📘 **Overview**

The `.env` file stores all **environment variables** required for running the eCommerce backend.  
It includes database connections, authentication secrets, cloud storage credentials, and payment gateway configurations.

This file **must not** be uploaded to any public repository — it contains **sensitive information** like API keys and passwords.

---

## 🧱 **Server Configuration**

| Variable | Example Value | Description                                                                                                            |
| -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `PORT`   | `5000`        | The port number on which the backend server runs.                                                                      |
| `mode`   | `pro`         | Defines the environment mode. <br>• `pro` → Production (uses MongoDB Atlas)<br>• `local` → Development (uses local DB) |

---

## 🗄️ **Database Configuration**

| Variable       | Example Value                                                        | Description                                                      |
| -------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `DB_LOCAL_URL` | `mongodb://localhost:27017/ecommerce`                                | Local MongoDB database connection string used in development.    |
| `DB_PRO_URL`   | `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce` | MongoDB Atlas (production) connection URL. Used when `mode=pro`. |

---

## 🔐 **Security & Authentication**

| Variable | Example Value | Description                                                              |
| -------- | ------------- | ------------------------------------------------------------------------ |
| `SECRET` | `limon`       | Secret key used for signing and verifying JWT tokens. Keep this private! |

---

## ☁️ **Cloudinary Configuration**

| Variable     | Example Value                 | Description                                            |
| ------------ | ----------------------------- | ------------------------------------------------------ |
| `cloud_name` | `dnjrmakcu`                   | Your Cloudinary cloud account name.                    |
| `api_key`    | `745158254861959`             | Public Cloudinary API key for upload operations.       |
| `api_secret` | `vmeb2IA-KSMohDXX2xc5PSBe5L8` | Private Cloudinary API secret used for authentication. |

> 🧠 **Note:** These credentials allow image uploads to your Cloudinary storage.  
> Keep them hidden and never expose them in public repositories.

---

## 💳 **Stripe Payment Gateway Configuration**

| Variable            | Example Value | Description                                                                             |
| ------------------- | ------------- | --------------------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY` |               | Stripe test secret key for handling secure payment transactions and seller withdrawals. |

> ⚠️ **Security Tip:** Use separate keys for **test** and **production** environments.

---

## 🌐 **Frontend Integration**

| Variable                         | Example Value                                            | Description                                                         |
| -------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| `client_customer_production_url` | `https://frontend-mern-multi-vendor-ecommerc.vercel.app` | The production URL of the frontend app where API requests are sent. |

---

## 🧩 **Usage Example**

In your `server.js`:

```js
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const mode = process.env.mode;

if (mode === "pro") {
  mongoose.connect(process.env.DB_PRO_URL);
} else {
  mongoose.connect(process.env.DB_LOCAL_URL);
}
```

# 🧩 **File:** `server.js`

---

## 📘 **Overview**

This file serves as the **entry point** of the eCommerce backend application.  
It initializes the **Express.js server**, establishes a **MongoDB database connection**, integrates **Socket.IO** for real-time messaging, and registers all REST API routes for Admin, Seller, and Customer functionalities.

---

## ⚙️ **Core Responsibilities**

1. Initialize and configure the Express server.
2. Connect to MongoDB via the `dbConnect()` utility.
3. Configure middlewares — CORS, JSON parsing, and cookies.
4. Establish real-time communication using **Socket.IO**.
5. Load and mount all route modules.
6. Start the HTTP server on the configured port.

---

## 🧱 **Dependencies**

| Library                        | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| **express**                    | Web framework for handling API requests.                   |
| **cors**                       | Enables cross-origin requests from frontend URLs.          |
| **body-parser**                | Parses incoming JSON data.                                 |
| **cookie-parser**              | Parses cookies for authentication.                         |
| **dotenv**                     | Loads environment variables from `.env`.                   |
| **mongoose** (via `dbConnect`) | Connects to MongoDB (local or production).                 |
| **socket.io**                  | Enables real-time communication for chat and live updates. |
| **http**                       | Creates a custom HTTP server to integrate with Socket.IO.  |

---

## ⚙️ **Middleware Configuration**

```js
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());
```
