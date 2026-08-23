const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')



async function checkUser(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.(' ')[1];


    if(!token){
        return res.status(201).json({
            message:'Log in first!'
        })
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_TOKEN);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message:'User not found with token!'
            })
        }

        req.user = user;
        next();

    }catch(error){
        return res.status(409).json({
            message:'Invalid token!'
        })
    }
}

async function checkArtist(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.(' ')[1];

    if(!token){
        return res.status(401).json({
            message:'Log in first!'
        })
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_TOKEN);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message:'User not found!'
            })
        }

        if(user.role != 'ARTIST'){
            return res.status(401).json({
                message:'Not an artist!'
            })
        }

        req.user = user;

        next();

    }catch(error){
        return res.status(409).json({
            message:'Invalid Token'
        })
    }


}

async function checkLogin(req,res){
    const token = req.cookies.token || req.headers.authorization?.(' ')[1];

    if(!token){
        return res.status(401).json({
            message:'Log in first!'
        })
    }


    try{

        const decoded = jwt.verify(token,process.env.JWT_TOKEN);

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(404).json({
                message:'User not found with token!'
            })
        }

        req.user = user;

        return res.status(200).json({
            message:'User Logged in successfully!',
            user
        });

    }catch(error){
        return res.status(409).json({
            message:'No internet connection!'
        });
    }
}



module.exports = {
    checkUser,
    checkArtist,
    checkLogin
}