const mongoose = require('mongoose');


const albumSchema = new mongoose.Schema({
    artist:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    musics:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'music',
        required:true
    }]
})


const albumModel = mongoose.model('album',albumSchema);


module.exports = albumModel;