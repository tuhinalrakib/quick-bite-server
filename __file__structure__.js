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