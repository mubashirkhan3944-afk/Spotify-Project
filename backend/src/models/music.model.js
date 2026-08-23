const mongoose = require('mongoose');


const musicSchema = new mongoose.Schema({
    url:{
        type:String,
        required:[true,'Music is required to add new music']
    },
    urlid:{
        type:String,
        required:[true,'URL ID is required to add new music']
    },
    image:{
        type:String
    },
    imageid:{
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    type:{
        type:String,
        required:[true,'Music type is required to create music']
    },
})


const musicModel = mongoose.model('music',musicSchema);



module.exports = musicModel;