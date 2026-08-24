const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {uploadfile} = require('../services/storage.services')


async function registerUser(req,res){
    const {name,username,email,password,caption,role} = req.body;
    const image = req.file;

    if(!name || !username || !email || !password ){
        return res.status(409).json({
            message:'Incomplete credentials!'
        })
    }

    const alreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    });

    if(alreadyExists){
        return res.status(409).json({
            message:'User already exists!'
        })
    }

    let imageurl = '';
    if(image){
        const imageupload = await uploadfile(image.buffer.toString('base64'));
        imageurl = imageupload.url;
    }

    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        name,
        username,
        email,
        password:hash,
        image:imageurl,
        caption,
        role
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_TOKEN);

    res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge:24*60*60*1000,
        path:'/'
    });

    res.status(201).json({
        message:'User created successfully!',
        user
    })

} 

async function loginUser(req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password ){
        return res.status(401).json({
            message:'Insufficeint data to login!'
        })
    }

    const user = await userModel.findOne({
        $and:[
            {email},
            {username}
        ]
    }).select('+password')

    if(!user){
        return res.status(404).json({
            message:'User not found!'
        })
    }

    const corrPassword = await bcrypt.compare(password , user.password);

    if(!corrPassword){
        return res.status(409).json({
            message:'Invalid Credentials!'
        })
    }

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_TOKEN);

    res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge:24*60*60*1000,
        path:'/'
    });

    res.status(200).json({
        message:'Log In Successfull!',
        user
    })

}

async function logoutUser(req,res){
    const token = req.cookies.token || req.headers.authorization?.(' ')[1];

    if(!token){
        return res.status(200).json({
            message:'User already logged out!'
        })
    }

    res.clearCookie('token',{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        path:'/'
    });

    res.status(200).json({
        message:'User logged out successfully!'
    })

}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}