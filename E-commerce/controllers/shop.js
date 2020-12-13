const Product = require('../models/products');
const Order = require('../models/order');

const fs = require('fs');
const path = require('path');
const pdfKit = require('pdfkit');

const ITEM_PER_PAGE = 1 ; 
// // const Cart = require('../models/cart');
// exports.getProducts = (req, res, next) => {
//     // const products = new Product() ; 
//     const page = req.query.page; 

//     Product.find({userId:req.user._id})
//     .skip((page-1)*ITEM_PER_PAGE)
//     .limit(ITEM_PER_PAGE)
//     .then(products => { 
//         res.render('user/index.ejs',{
//             prods : products ,
//              pagetitle :'My Shop' ,
//               path:'shop' ,
//               isAuth: req.session.login
//             }) 
//     }).catch(err => { 
//         console.log(err)
//     });
   
    
// };

exports.getIndex = (req,res,next ) => {
    // const products = new Product() ; 
    const page = +req.query.page || 1; 
    let totalProducts ; 
    Product.find()
    .count()
    .then(numProducts=>{
        totalProducts = numProducts ; 
        return Product.find({userId:req.user._id})
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
    })
    
    .then(products =>{
        res.render('user/index.ejs',{
            prods : products ,
             pagetitle :'Products' ,
              path:'shop',
              isAuth: req.session.login,
              currentPage:page,
              totalProducts:totalProducts , 
              hasNextPage:ITEM_PER_PAGE*page<totalProducts,
              hasPreviousPage:page>1,
              nextPage:page+1,
              previousPage:page-1,
              lastPage:Math.ceil(totalProducts/ITEM_PER_PAGE)
            
            });
              
    }).catch(err => {console.log(err)});


}; 


exports.checkout = (req,res,next) =>{
    res.render('user/checkout.ejs', {
        path : '/checkOut',
        pagetitle : 'Check Out',
        isAuth: req.session.login
    });

};




exports.getProduct = (req , res , next)=>{ 
    const proid = req.params.productId;
    // const product = new Product() ;

    Product.findById(proid).then(product => {
        res.render('user/product-details.ejs',{
            product : product,
            pagetitle :product.title,
            path:'/product-list',
            isAuth: req.session.login
        })
   
    }).
        catch(err => 
            console.log(err)) ;
};

exports.postCart = (req, res , next)=> {
    proid = req.body.productId ;
    // product = new Product()
    Product.findById(proid)
    .then(product=>{
       return  req.user.addToCart(product)
    })
    .then(result=>{
        // console.log(result);
        res.redirect('/cart');
    })
    .catch(err=>{
        console.log(err); 
    });
    // let fetchedCart ; 
    // req.user
    // .getCart()
    // .then(cart => { 
    //     fetchedCart = cart 
    //     return cart.getProducts({where : {id:proid}});
    // })
    // .then(products =>{
    //     let product ; 
    //     if(products.length > 0 ){
    //         product = products[0];
    //     }
    //     let newQuantity = 1 ; 
    //     if(product){
    //         oldQuantity = product.cartItem.quantity
    //         newQuantity = oldQuantity + 1; 
    //     }
    //     return Product.findByPk(proid)
    //     .then(product => { 
    //         return fetchedCart.addProduct(product,{through : { quantity : newQuantity}}); 
    //     }) 
    //     .then(()=> {
    //         res.redirect('/cart');
    //     }
    //     )
    //     .catch(err=> { 
    //         console.log(err)
    //     }); 
    // })
}

exports.getCarts= (req,res,next)=>{

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
            products = user.cart.items
            res.render('user/cart.ejs',{
                            pagetitle:'Cart',
                            path:'/cart',
                            prods:products,
                            isAuth: req.session.login
                        });
        })
}

exports.getcheckout = (req, res, next)=>{
    
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
            let totalPrice = 0 ; 
            products = user.cart.items
            products.forEach(p=>{
                totalPrice += p.quantity * p.productId.price ;
            })
            res.render('user/checkout.ejs',{
                            pagetitle:'Cart',
                            path:'/cart',
                            prods:products,
                            isAuth: req.session.login,
                            totalPrice:totalPrice
                        });
        })

}

exports.deleteCart = (req,res,next)=>{ 
    proid = req.params.productId;
     req.user.deleteFromCart(proid)
     .then((result)=>{
         res.redirect('/cart');
     })
     .catch(err => {
         console.log(err)
     })
};

exports.postOrder = (req,res,next) =>{ 
    

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items.map(i=>{
            return {product: {...i.productId._doc},quantity: i.quantity};
        }) 
        console.log(products)
        const order = new Order({
            productData :  products
    
            ,
            user:{
                name : req.user.email,
                userId: req.user.id 
            }
        }); 
        return order.save()
    })

    .then(result => {
        req.user.clearCart()
        res.redirect('/order');

    })
    .catch(err => console.log(err))

}

exports.getOrder = (req,res,next)=>{
    if(!req.session.login){
        res.redirect('/login');
    }
     Order.find()
    .then(orders=> {
        console.log(orders)
        res.render('user/order.ejs',{
            pagetitle:'Order',
            path:'/order',
            orders:orders,
            isAuth: req.session.login
        });
    })
    .catch(err=>{
        console.log(err)
    })
   
};
exports.getInvoice = (req, res, next)=>{
    const orderId = req.params.orderId ; 

    Order.findById(orderId)
    .then((order)=>{
        if(!order){
            //return next(new Error('No Order Found ! ))
            res.redirect('/products');
        }
        if(order.user.userId.toString !== req.user._id.toString ){
            //return next(new Error('No Order Found ! ))
            res.redirect('/products');
        }
        const invoiceName = 'invoice-'+orderId+'.pdf' ; 
        const invoicePath = path.join('data','invoices',invoiceName); 
        res.setHeader('Content-Type','application/pdf'); 
        res.setHeader('Content-Disposition',
        'inline; filename="'+ invoiceName+'"',
          
        ); 
        const pdfDoc =new pdfKit();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        
        
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      console.log(order)
      order.productData.forEach(prod => {
          console.log(prod)
        //   console.log(prod.quantity)

        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);


        pdfDoc.end();
    //     fs.readFile(invoicePath,(err,data)=>{
    //         if(err) {
    //             console.log(err); 
    //             // return(err)
    //         }
  
    // })
        // const file = fs.createReadStream(invoicePath);
       
        // res.send(data);
    
}).catch(err=>
    {console.log(err)}
    );
    

}