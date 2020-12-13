const mongoose  = require('mongoose');

const schema = mongoose.Schema; 

const userSchema = new schema({
    password:{
        type:String,
        required:true
    },
    email:{
        required:true,
        type:String
    },
    resetToken:String,
    resetTokenExpire:String,
    cart: { 
        items:  [{      productId: {type:schema.Types.ObjectId , ref:'Product',required:true },
                        quantity:  {type:Number,required:true} 
                }]
    }

});

userSchema.methods.addToCart = function (product){

    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
      });
      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];
  
      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId:product._id,
          quantity: newQuantity
        });
      }
      const updatedCart = {
        items: updatedCartItems
      };
     this.cart = updatedCart; 
     return this.save()

}
userSchema.methods.deleteFromCart = function(productId) {
    const updatedCart = this.cart.items.filter(item=>{
    return item.productId.toString() !== productId.toString();  
     
    })
    this.cart = updatedCart; 
    return this.save();

}

userSchema.methods.clearCart = function(){
  this.cart = { items:[] }
  return this.save()

}
module.exports = mongoose.model('User',userSchema);

// const getDb = require('../util/database').getDb ; 
// const mongodb = require('mongodb'); 

// class User{
//     constructor(username,email,id,cart){
//         this.name = username ; 
//         this.email = email ; 
//         this.cart = cart ; 
//         this._id = id; 

//    }
//    save(){
//        const db = getDb() ;
//        return db.collection('users')
//        .insertOne(this)
//        .then(result =>{ 
//            return result; 

//        })
//        .catch(err=>{ 
//            console.log(err); 
//        }); 
//    }
//    addToCart(product){
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//         return cp.productId.toString() === product._id.toString();
//       });
//       let newQuantity = 1;
//       const updatedCartItems = [...this.cart.items];
  
//       if (cartProductIndex >= 0) {
//         newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//         updatedCartItems[cartProductIndex].quantity = newQuantity;
//       } else {
//         updatedCartItems.push({
//           productId: mongodb.ObjectID(product._id),
//           quantity: newQuantity
//         });
//       }
//       const updatedCart = {
//         items: updatedCartItems
//       };
//       const db = getDb();
//       return db
//         .collection('users')
//         .updateOne(
//           { _id: mongodb.ObjectID(this._id) },
//           { $set: { cart: updatedCart } }
//         );
//    }

//    getCart(){
//         const db= getDb(); 
//         const  productIds = this.cart.items.map(i=>{
//             return i.productId ; 
//         })
//         return db.collection('products')
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then(products=>{
//             return products.map(p=>{
//                 return{
//                     ...p,
//                     quantity: this.cart.items.find(
//                         i=>{
//                             return i.productId.toString() === p._id.toString();
//                         }
//                     ).quantity
//                 }
//             });
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//    }

//    deleteCart(productId){
//        const updatedCart = this.cart.items.filter(item=>{
//            return item.productId.toString() !== productId.toString();  
//        })
//        const db = getDb()
//        return db.collection('users')
//        .updateOne({_id : mongodb.ObjectID(this._id)},  {$set: { cart:{items : updatedCart } }} ) 
//        .then(result =>{
//         //  
//        })
//        .catch(err=>{
//            console.log(err); 
//        })
//    }
//    addOrder(){
//     const db = getDb()
//     return this.getCart()
//     .then(products=>{
//      const order ={
//          items:products,
//          user:{
//              _id:mongodb.ObjectID(this._id),
//              name:this.name
//          }
//      };
//      return db.collection('orders').insertOne(order);
//     })
//     .then(result=>{
//      this.cart = { items:[] }
//      return db.collection('users')
//      .updateOne({_id:mongodb.ObjectID(this._id)} , {$set:{cart:{items:[]}}})
//     })

//    }
//    getOrders(){
//        const db= getDb()
//        return db.collection('orders').find({'user._id': mongodb.ObjectID(this._id)})
//        .toArray( );

     
//    }
//    findById(id){
//        const db = getDb(); 
//        return db.collection('users')
//        .findOne({_id:mongodb.ObjectID(id)})
//        .then(user => {
//            console.log(user);
//            return user ; 
//        })
//        .catch(err=>{ 
//            console.log(err); 
//        });
//    }
// }

// module.exports = User ; 

// // const Sequelize = require('sequelize'); 

// // const sequelize = require('../util/database') ; 

// // const User = sequelize.define('user',{
// //     id: { 
// //         type : Sequelize.INTEGER,
// //         autoIncrement : true , 
// //         allowNull : false,
// //         primaryKey:true 
// //     },
// //     name : {
// //         type : Sequelize.STRING
// //     },
// //     email : { 
// //         type : Sequelize.STRING 
// //     }
// // }); 
 

// //  module.exports = User;