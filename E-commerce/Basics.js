// data type : const, let, var ;


var name = "nabil";
var age=20;
// create function 
function user(name,age){
    return('The name IS : '+name
    +' , His Age :' +age);
}
console.log(user(name,age));

// create arrow function 

const add = (a,b)=> {
    return (a+b);
};
console.log(add(1,2));

//create anouther arrow function :  
const addOne= a => a + 1; 
console.log(addOne(1));

// create object : 
const person = {
    student: 'Nabil',
    age : '20',
    greet(){
        console.log('Hello My Name : '+ this.student);
    }
};
person.greet()

//create array : 
const hobbies =['sporting','Swimming',1]
for(i of hobbies){
    console.log(i)
};
// map ==> help me to edit on array element 
console.log(hobbies.map(hobby => 'Hobby : '+hobby ));

//copy to array :  array.slice() == copy_array=[...array]
const Copy_array = hobbies.slice();
console.log(Copy_array);

//arrow  function return array from arg: 
const toArray = (...arg)=>{
    return arg;
}
console.log(toArray(1,2,3,4,5))
//function settime:
setTimeout(()=>{    
    console.log('Hi after 1 ms');
},1);

console.log('Hi before 1ms');

// to create package 
// in terminal  run : "npm init" 
// npm ==>  node package manage 
// npm install nodemon // this package plt 

//------------
// type of errors : 
//1- syntax error 2- runtime error 3-logical error 
//------------

// express.js = > framework to node.js as solve defficult routes 
// npm install --save express 
// npm install --save body-parser 


// connection with DB 
// command ==> 'npm install --save mysql2

// npm install nodemailer-sendgrid-transport
