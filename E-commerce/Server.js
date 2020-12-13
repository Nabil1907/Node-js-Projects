const express = require('express');

const body = require('body-parser');

const session = require('express-session')
// const mongodb = require('./util/database').mongoConnect  ; 

const MongoDbStore = require('connect-mongodb-session')(session);

const User = require('./models/user'); 
// csrf ==> 
const csrf = require('csurf'); 

const flash = require('connect-flash'); 

const app = express();

const adminData = require('./Routes/admin.js'); 

const userRoutes = require('./Routes/shop.js'); 

const authRoutes = require('./Routes/auth'); 

const mongoose = require('mongoose'); 

const mongoDbUrl ='mongodb+srv://nabilsalman:KH5vZPXbVedCKh6C@cluster0.z526z.mongodb.net/<dbname>?retryWrites=true&w=majority';

const path = require('path'); 

const multer = require('multer');

const erroPage = require('./controllers/error');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.png')
  }
})

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine','ejs');

app.set('views','Views');


app.use(body.urlencoded({extended: false}));
//function use help to add a new middleware function
// storage: fileStorage, fileFilter: fileFilter

app.use(
  multer({ 
    storage: storage ,
    fileFilter: fileFilter

  }).single('image')
);



app.use(express.static(path.join(__dirname,'Public')));
app.use('/images' , express.static(path.join(__dirname,'images')));


const store =new MongoDbStore({
  uri:mongoDbUrl,
  collection:'sessions'
});


app.use(session({
  secret:'my Secret',
  resave:false,
  saveUninitialized:false,
  store:store
}))

// const csrfProtection = csrf();

app.use(csrf());

app.use(flash());

app.use((req, res, next) => {
  res.locals.login = req.session.login;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next(); 
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});


app.use('/admin',adminData.router);

app.use(userRoutes);

app .use(authRoutes); 


app.use(erroPage.get404Page);


// --------------MongoDb --------------------------- 

mongoose.connect(mongoDbUrl)
.then(()=>{
    
    // const user = new User({
    //     name:'nabil',
    //     email:'nabil@yahoo.com',
    //     cart: {
    //         items : [
    //             // ... 
    //         ]
    //     }
    // }); 
    // user.save()
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})

// --------------- Sequelize -------------------------
// const sequelize = require('./util/database');

// const Product = require('./models/products');

// const User = require('./models/user');

// const Cart = require('./models/cart');

// const CartItem = require('./models/cart-item');

// const OrderItem = require('./models/order-item');

// const Order = require('./models/order');

// // relation 

// Product.belongsTo(User,{constraints: 'true' , onDelete:'CASCADE'}); 

// User.hasMany(Product);

// User.hasOne(Cart);

// Cart.belongsTo(User); 

// // cart many to many product 
// Cart.belongsToMany(Product , {through : CartItem}); 

// Product.belongsToMany(Cart ,{through : CartItem} ); 

// //order one to many with user 

// Order.belongsTo(User);

// User.hasMany(Order); 

// //order with Product 

// Order.belongsToMany(Product,{through :OrderItem });

// sequelize
//     // .sync({force:true})//it will first drop tables before recreating them. /  
//     .sync()
//     .then( result =>{
//         return User.findByPk(1);
//     })
//     .then(user=>{
//         if(!user) { 
//             return User.create({name:'Nabil',email:'nabil@gmail.com'});
//         }
//         else {
//             return user ;
//         }
//     })
//     .then(user=>{ 
//       return user.createCart();
//     })
//     .then(cart => { 
//         app.listen(3000);
//     })
//     .catch(err => { 
//         console.log(err);
//     });

// const server = http.createServer(app);

