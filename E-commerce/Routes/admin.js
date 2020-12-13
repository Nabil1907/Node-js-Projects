const express = require('express');

const router = express.Router();

const path = require('path');

const AdminControl = require('../controllers/admin');

const isAuth = require('../middleware/isAuth'); 

const{body} = require('express-validator/check')
// admin/add-prouct = > get
router.get('/add-product',isAuth, AdminControl.getAddProduct);

router.get('/edit-product/:productId',isAuth, AdminControl.getEditProduct );

router.post('/edit-product/:productId',[
    body('name')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('desc')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],isAuth, AdminControl.PostEditProduct);

router.delete('/product/:productId',isAuth, AdminControl.deleteProduct);

// // admin/add-prouct = > post
router.post('/add-product',[
    body('name')
      .isString()
      .isLength({ min: 3 })
      .trim(),
 
    body('price').isFloat(),
    body('desc')
      .isLength({ min: 5, max: 400 })

  ],isAuth, AdminControl.postAddProduct);

router.get('/products' ,isAuth, AdminControl.getProducts);


exports.router = router; 

// exports.products = products;