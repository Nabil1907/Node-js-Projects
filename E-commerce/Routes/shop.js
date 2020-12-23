const path = require('path');

const express = require('express');

const routes = express.Router();

const shopControl = require('../controllers/shop');

const isAuth = require('../middleware/isAuth');

routes.get('/',isAuth, shopControl.getApiIndex);

routes.get('/products' ,isAuth,shopControl.getIndex);

routes.get('/products/:productId',shopControl.getProduct);

routes.get('/cart' ,isAuth, shopControl.getCarts);

routes.post('/cart',isAuth,shopControl.postCart);

routes.get('/checkout' ,isAuth, shopControl.getcheckout);

// // routes.get('/checkout',shopControl.checkout);

routes.get('/order',isAuth,shopControl.getOrder);

routes.post('/delete-cart/:productId',isAuth,shopControl.deleteCart);

routes.post('/create-order',isAuth,shopControl.postOrder);

routes.get('/orders/:orderId',isAuth,shopControl.getInvoice);
module.exports = routes;