const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required to create an account'],
        minlength:[6,'Min length should be 6']
    },
    username:{
        type:String,
        required:[true,'Username is required to create account'],
        unique:true,
        index:true,
        trim:true,
        minlength:[8,'Username must be of atleast length 8']
    },
    email:{
        type:String,
        required:[true,'Email is required to create account'],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Inavlid email!'],
        trim:true,
        lowercase:true,
        unique:true,
        index:true

    },
    password:{
        type:String,
        required:[true,'Password is required to create account'],
        minlength:[8,'Password should be atleast of length 8'],
        select:false
    },
    role:{
        type:String,
        enum:['USER','ARTIST'],
        default:'USER'
    },
    image:{
        type:String
    },
    caption:{
        type:String
    },
},{
    timestamps:true
})



const userModel = mongoose.model('user',userSchema);


module.exports = userModel;