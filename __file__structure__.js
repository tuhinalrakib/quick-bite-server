/**
 * backend/
├── config/                  # কনফিগারেশন ফাইল
│   └── db.js                # MongoDB কানেকশন ফাইল
├── controllers/             # মেইন বিজনেস লজিক (API এর কাজগুলো এখানে হবে)
│   ├── authController.js    # রেজিস্ট্রেশন ও লগইন লজিক
│   ├── foodController.js    # খাবার যোগ করা, ডিলিট করা, দেখার লজিক
│   ├── orderController.js   # অর্ডার তৈরি এবং স্ট্যাটাস আপডেটের লজিক
│   └── paymentController.js # PayHere Sandbox ইন্টিগ্রেশন ও পেমেন্ট ভেরিফিকেশন লজিক
├── middleware/              # মিডলওয়্যার (সিকিউরিটি ও ভেরিফিকেশন)
│   ├── authMiddleware.js    # JWT টোকেন চেক করা (কাস্টমার নাকি অ্যাডমিন যাচাই করা)
│   └── errorMiddleware.js   # এরর হ্যান্ডলিং
├── models/                  # ডাটাবেজ স্কিমা/টেবিল (MongoDB এর জন্য Mongoose Model)
│   ├── User.js              # কাস্টমার ও অ্যাডমিন ডেটা (Name, Email, Password, Role)
│   ├── Food.js              # খাবারের ডেটা (Title, Price, Image, Category)
│   └── Order.js             # অর্ডারের ডেটা (User, Items, TotalAmount, PaymentStatus, OrderStatus)
├── routes/                  # API এন্ডপয়েন্ট বা রাউটস
│   ├── authRoutes.js        # /api/auth
│   ├── foodRoutes.js        # /api/foods
│   ├── orderRoutes.js       # /api/orders
│   └── paymentRoutes.js     # /api/payments
├── .env                     # সিক্রেট ভেরিয়েবল (PORT, MONGO_URI, JWT_SECRET, PAYHERE_MERCHANT_ID)
├── .gitignore
├── package.json
└── server.js                # ব্যাকএন্ডের মেইন এন্ট্রি পয়েন্ট
 */

/**
 * 
 * MONGO_URI=mongodb://quick_bite:w9fivUX9BNwrAgn5@ac-9thg7kf-shard-00-00.mr0uen8.mongodb.net:27017,ac-9thg7kf-shard-00-01.mr0uen8.mongodb.net:27017,ac-9thg7kf-shard-00-02.mr0uen8.mongodb.net:27017/quick_bite?ssl=true&replicaSet=atlas-kdpnoo-shard-0&authSource=admin&appName=Cluster0
PORT=5000
NODE_ENV=development

# Google Client Id
GOOGLE_CLIENT_ID=800110998179-5tubk1vmkgjh8m9gh7j907ino4tkjhmh.apps.googleusercontent.com

# Redis
REDIS_HOST=redis-19010.c81.us-east-1-2.ec2.cloud.redislabs.com
REDIS_PORT=19010
REDIS_USERNAME=default
REDIS_PASSWORD=hpGQdtIKxqNK7HWZk6z7PvWH54kBfzNv

# Limiter 
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

# JWT SECRET
JWT_ACCESS_SECRET=f800332f0d7707c5ceda4d693db369ba21ee0b091ae6dc370350f18fe829f13f109cfc416bf8c
744d419f7edf0f25e4f3abec39ec11bcf0a21a44cb70fddfc75
JWT_REFRESH_SECRET=9a8aa901cd8efbb2df9f538f9807af8561f34c29991fb5136d6a563741922c7bb8b4f00ac8415e24b6ceace51c1516636b8a425fbcc6688
0b73ce7d56b31ea4f

# Cloudinary
CLOUDINARY_CLOUD_NAME=dxkmkskvy
CLOUDINARY_API_KEY=683616221747714
CLOUDINARY_API_SECRET=VX8OFXnLhD1a5H2y90JSW9Qo61g
 */