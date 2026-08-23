const albumModel = require('../models/album.model');
const musicModel = require('../models/music.model')



async function createAlbum(req,res){
    const artist = req.user._id;
    const {title,musics} = req.body;

    const alreadyAlbum = await albumModel.findOne({title});

    if(alreadyAlbum){
        return res.status(401).json({
            message:'Album already exists!'
        })
    }

    if(musics.length == 0){
        return res.status(401).json({
            message:'Album should have at least One Music'
        })
    }

    for(let music of musics){
        const musicData = await musicModel.findById(music)
        if(!musicData){
            return res.status(404).json({
                message:`Music with ID ${music} was not found!`
            })
        }
    }


    try{

        const album = await albumModel.create({
            artist,
            title,
            musics
        })

        res.status(201).json({
            message:'Album created successfully',
            album
        })

    }catch(error){
        return res.status(409).json({
            message:'Error creating album!'
        })
    }
    

}

async function addToAlbum(req,res){
    const {music} = req.body;
    const {title} = req.body;
    const user = req.user._id;

    const album = await albumModel.findOne({title});

    if(!album){
        return res.status(404).json({
            message:'Album not found!'
        })
    }


    if(JSON.stringify(album.artist) != JSON.stringify(user)){
        return res.status(409).json({
            message:'Only Album creator can add music!'
        })
    }

    const updateAlbum = await albumModel.findOneAndUpdate({title},{
        $addToSet:{musics:music}
    })

    

    res.status(201).json({
        message:"Music added to album!",
        updateAlbum
    })

}

async function getAlbum(req,res){

    const albums = await albumModel.find()
    .populate('artist');

    if(albums.length === 0){
        return res.status(200).json({
            message:'No album created!'
        })
    }

    res.status(200).json({
        message:'album fetched successfully!',
        albums
    })
} 

async function getAlbumById(req,res){
    const {id} = req.params;

    const album = await albumModel.findById(id)
    .populate('artist')
    .populate({
        path: 'musics',
        populate: { path: 'artist' }
    });

    if(!album){
        return res.status(404).json({
            message:'Album not found!'
        })
    }

    res.status(200).json({
        message:'Album fetched successfully!',
        album
    })
}

async function deleteAlbum(req,res){
    const {id} = req.params;

    const album = await albumModel.findById(id);

    if(!album){
        return res.status(404).json({
            message:'Album does not exists!'
        })
    }

    const user = await albumModel.findOne({
        $and:[
            {artist:req.user._id},
            {_id:id}
        ]
    })

    if(!user){
        return res.status(401).json({
            message:'You are not authorized to delete this album!'
        })
    }

    const deletedAlbum = await albumModel.findByIdAndDelete(id);

    res.status(200).json({
        message:'Album Deleted Successfully!'
    })
}


module.exports = {
    createAlbum,
    addToAlbum,
    getAlbum,
    getAlbumById,
    deleteAlbum,
}