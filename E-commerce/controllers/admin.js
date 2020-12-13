const Product = require('../models/products');

const fileHelper = require('../util/file');
const {validationResult} = require('express-validator');
const ITEM_PER_PAGE = 1 ; 

exports.getAddProduct = (req, res, next) => {
    
    res.render('admin/edit-product',{
    path:'admin/add-product' ,
    pagetitle :'Add Product',
    editing : false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    isAuth:req.session.login
    });
}
exports.postAddProduct = (req, res, next) => {
    const title = req.body.name ; 
    const image = req.file; 
    const price = req.body.price ; 
    const desc = req.body.desc ;
    // console.log(image)
    const errors = validationResult(req);
    if(!image){
        return res.status(422).render('admin/edit-product', {
            pagetitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            isAuth:req.session.login,
            product: {
              title: title,
              price: price,
              desc: desc
            },
            errorMessage: "Attach File is not an image ! ",
            validationErrors: [] 
          });
    }
    const imageUrl = image.path ; 
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('admin/edit-product', {
        pagetitle: 'Add Product',
        path: '/admin/edit-product',
        editing: false,
        hasError: true,
        isAuth:req.session.login,
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          desc: desc
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }

    const product = new Product({title:title ,price : price ,imageUrl:imageUrl,desc:desc ,userId:req.user});
    product.save()
    .then(result =>{ 
        res.redirect('/');
        // console.log(result)
    }).
    catch(err => {
        console.log(err)
    }) ;
  

};


exports.getEditProduct = (req,res,next)=>{
    // const product = new Product()
    Product.findById(req.params.productId). 
    then(product=>{
        res.render('admin/edit-product',{
            path:'admin/add-product',
            pagetitle:'Edit Product',
            product:product,
            editing:true,
            errorMessage:null,
            isAuth: req.session.login
        }).
        catch(err =>  {
            console.log(err);
        });

    });
    

}
exports.PostEditProduct = (req,res,next) => { 
    const title = req.body.name ; 
    const image = req.file ; 
    const price = req.body.price ; 
    const desc = req.body.desc ; 
    const id = req.body.id ; 
    const errors = validationResult(req);
    // console.log(imageUrl);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('admin/edit-product', {
        pagetitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        hasError: true,
        isAuth:req.session.login,
        product: {
          title: title,
          price: price,
          desc: desc
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
    // const product = new Product(title,price,imageUrl,desc);
    Product.findById(id).then(product=>{
        product.title = title ; 
        if(image){
            fileHelper.deleteFile(product.imageUrl)
            product.imageUrl =image.path; 
        }
        product.price = price; 
        product.desc = desc ; 
        return product.save()
    })
    .then(result => { 
         res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.getProducts = (req,res,next ) => { 
    // const product = new Product();
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

    // Product.find({userId:req.user._id})
    // // .select()
    // // .populate('userId')
    .then(products =>{
        res.render('admin/products',{
            prods : products ,
             pagetitle :'Products' ,
              path:'/admin/add-products',
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

exports.deleteProduct = (req ,res ,next )=> {
    // const product = new Product() ;
    Product.findById(req.params.productId)
    .then(product=>{
        fileHelper.deleteFile(product.imageUrl)
    })
    .catch(err=>{
        console.log(err);
    })
    Product.findByIdAndRemove(req.params.productId)
    .then(result => {
        res.json({message:'Success! '});
    }
    )
    .catch(err =>{ 
        // console.log(err) ;
        res.json({message:'Failed! '});

    })
};

