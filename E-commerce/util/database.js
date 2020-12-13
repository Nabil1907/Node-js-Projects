// MongoDb 

const mongodb = require('mongodb') ; 
const MongoClient = mongodb.MongoClient; 
let _db; 

const mongoConnect = callback => { 
    MongoClient.connect(
        'mongodb+srv://nabil_salman:RNBaVfUdugy38VEw@cluster0-pdyp5.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(client =>{ 
        console.log('Connected ! ')
        _db = client.db();
        callback()
    })
    .catch(err=> {
        console.log('DB Connection Error:' +err);
    })
}


const getDb = () =>{
    if(_db) { 
        return _db ;
    }
    throw('DataBase Not Found !');
}

exports.mongoConnect = mongoConnect ; 
exports.getDb = getDb;







// Sequelize 
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete','root','141999',{dialect:'mysql' , host :'localhost'});

// module.exports = sequelize ;


