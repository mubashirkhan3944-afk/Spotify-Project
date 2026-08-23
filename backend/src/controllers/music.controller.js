const musicModel = require('../models/music.model');
const {uploadfile} = require('../services/storage.services')
const {deletefile} = require('../services/storage.services');


async function createMusic(req,res){

    const file = req.files['music'][0];
    const image = req.files['image']?.[0];

    const {title,type} = req.body;
    const artist = req.user._id;

    if(!artist || !title || !file || !type){
        return res.status(401).json({
            message:'Insufficient data to create new music!'
        })
    }


        const fileUrl = await uploadfile(file.buffer.toString('base64'));
        let imageurl=null;
        if(image){
            const imageUrl = await uploadfile(image.buffer.toString('base64'));
            imageurl = imageUrl
        }

    const music = await musicModel.create({
        url:fileUrl.url,
        urlid:fileUrl.fileId,
        title,
        type,
        artist,
        image: imageurl.url,
        imageid:imageurl.fileId
    })

    res.status(201).json({
        message:'Music Created Successfully!',
        music
    })


    

}

async function getMusic(req,res){
    const musics = await musicModel.find()
    .populate('artist')
    // .skip(Math.random()*3)
    
    if(musics.length === 0){
        return res.status(200).json({
            message:'No music uploaded! Be the first to do so :)'
        })
    }

    return res.status(200).json({
        message:'Musics fetched successfully!',
        musics
    })
}

async function getMusicById(req,res){
    const {id} = req.params;

    const music = await musicModel.findById(id)
    .populate('artist');

    if(!music){
        return res.status(404).json({
            message:'Music Not Found!'
        })
    }

    return res.status(200).json({
        message:'Music fetched successfully!',
        music
    })
}

async function deleteMusic(req,res){
    const {id} = req.params;

    const music = await musicModel.findById(id);

    if(!music){
        return res.status(404).json({
            message:'Music not found!'
        })
    }

    const user = await musicModel.findOne({
        $and:[
            {artist:req.user._id},
            {_id:id}
        ]
    })

    if(!user){
        return res.status(401).json({
            message:'You are not authorized to delete this music!'
        })
    }

    const deletedMusic = await musicModel.findByIdAndDelete(id);

    let deletedfile = await deletefile(music.urlid);
    if(music?.image){
        let deletedImage = await deletefile(music.imageid);
    }



    res.status(200).json({
        message:'Music Deleted Successfully!',
    })
}



module.exports = {
    createMusic,
    getMusic,
    getMusicById,
    deleteMusic,
}