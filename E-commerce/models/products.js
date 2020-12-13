
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema

const productSchema = new Schema({
title:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true
},
desc:{
    type:String,
    required:true
},
imageUrl:{
    type:String,
    required:true
},
userId :{
    type:Schema.Types.ObjectId,
    ref:'User'
}

});

module.exports = mongoose.model('Product',productSchema);





// --------------mongo db -----------
// const getDb = require('../util/database').getDb ; 
// const mongodb = require('mongodb'); 
// class Product{
//     constructor(title, price, imageUrl, desc, userId){
//         this.title = title ; 
//         this.imageUrl = imageUrl ;
//         this.price =price ; 
//         this.desc = desc ; 
//         this.userId = userId ; 
//     }

//     save(){
//         const db = getDb();
//         return db.collection('products')
//         .insertOne(this)
//         .then(result =>{ 
//             // console.log(result)
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }
//     update(proid){
//         const db = getDb(); 
//         // console.log(proid);
//         // console.log(mongodb.ObjectID(proid))

//         return db.collection('products')
//         .updateOne({_id : mongodb.ObjectID(proid)}, {$set:this})
//         .then(result=>{
//             // console.log(result) ; 
//             return result;
//         })
//         .catch(err =>{
//             console.log(err); 
//         });
//     }
//     delete(id){
//         const db = getDb(); 
//         return db.collection('products')
//         .deleteOne({_id: mongodb.ObjectID(id)})
//         .then(result =>{
//             return result ; 
//         })
//         .catch(err=>{ 
//             console.log(err) ;
//         });
//     }
//     fetchAll(){
//         const db = getDb() ; 
//         return db.collection('products')
//         .find()
//         .toArray()
//         .then(products =>{ 
//             // console.log(products);
//             return products;
//         })
//         .catch(err=> {
//             console.log(err); 
//         }) ;
//     }

//     findById(proid){
//         const db = getDb(); 
//         return db.collection('products')
//         .find({_id : mongodb.ObjectID(proid)})
//         .next()
//         .then(product => {
//             // console.log(product); 
//             return product ;
//         })
//         .catch(err =>{ 
//             console.log(err); 
//         }); 
//     }
// }

//  -----------sequelize -----------------
// // const Product = sequelize.define('product',{
// //     id: { 
// //         type : Sequelize.INTEGER,
// //         autoIncrement : true , 
// //         allowNull : false,
// //         primaryKey:true 
// //     },
// //     title : {
// //         type : Sequelize.STRING
// //     },
// //     price :
// //     {
// //         type :Sequelize.INTEGER , 
// //         allowNull :false

// //     },
// //     imageUrl : 
// //     {
// //         type : Sequelize.STRING , 
// //         allowNull: false
// //     },
// //     desc :{
        
// //         type : Sequelize.STRING , 
// //         allowNull: false

// //     }
// // }); 


// module.exports = Product;