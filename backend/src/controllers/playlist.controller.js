const playListModel = require('../models/playList.model')
const musicModel = require('../models/music.model')


async function createPlayList(req,res){
    const {title,musics} = req.body;
    const creator = req.user._id;

    const alreadyPlayLists = await playListModel.find({creator});

    if(alreadyPlayLists.length>3){
        return res.status(401).json({
            message:'You can only create 4 playLists!'
        })
    }

    for(let alreadyPlayList of alreadyPlayLists){
        if(alreadyPlayList.title === title){
            return res.status(401).json({
                message:'Your playlist already exists with this title!'
            })
        }
    }

    for(let music of musics){
        const musicData = await musicModel.findById(music);

        if(!musicData){
            return res.status(404).json({
                message:`Music with ID ${music} not found!`
            })
        }
    }

    try{

        const playList = await playListModel.create({
            title,
            creator,
            musics
        })

        res.status(201).json({
            message:'PlayList created successfully!',
            playList
        })

    }catch(error){
        return res.status(409).json({
            message:'Error creating playlist',
            error
        })
    }

}

async function getPlayLists(req,res){
    

    const playLists = await playListModel.find({creator : req.user._id})
    .populate('creator');

    if(playLists.length === 0){
        return res.status(200).json({
            message:'No playlist created!'
        })
    }

    res.status(200).json({
        message:'Playlists fetched!',
        playLists
    })

} 

async function addToPlayList(req,res){
    const {music,title} = req.body;
    const creator = req.user._id;

    const musicExists = await musicModel.findById(music);

    if(!musicExists){
        return res.status(409).json({
            message:'Music does not exists!'
        })
    }


    const updatedPlayList = await playListModel.findOneAndUpdate({
        $and:[
            {title},
            {creator}
        ]
    },{
        $addToSet:{musics:music}
    })



    if(!updatedPlayList){
        return res.status(404).json({
            message:'Playlist not found!'
        })
    }


    res.status(201).json({
        message:'Added to PLaylist!',
        updatedPlayList
    })



}


async function getPlayListById(req,res){
    const {id} = req.params;

    const playList = await playListModel.findById(id)
    .populate('creator')
    .populate({
        path: 'musics',
        populate: { path: 'artist' }
    });

    if(!playList){
        return res.status(404).json({
            message:'Playlist not found!'
        })
    }

    res.status(200).json({
        message:'Playlist fetched successfully!',
        playList
    })
}

async function deletePlaylist(req,res){
    const {id} = req.params;

    const playlist = await playListModel.findById(id);

    if(!playlist){
        return res.status(404).json({
            message:'Playlist not found!'
        })
    }

    const user = await playListModel.findOne({
        $and:[
            {creator:req.user._id},
            {_id:id}
        ]
    })


    if(!user){
        return res.status(401).json({
            message:'You are not authorized to delete it!'
        })
    }



    const deletedplaylist = await playListModel.findByIdAndDelete(id);

    res.status(200).json({
        message:'Playlist Deleted Successfully!',
    })
}

module.exports = {
    createPlayList,
    getPlayLists,
    addToPlayList,
    getPlayListById,
    deletePlaylist,
}