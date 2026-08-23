const mongoose = require('mongoose')



const playListSchema = new mongoose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    musics:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'music',
        required:true
    }],
    title:{
        type:String,
        required:true
    }
})


const playListModel = mongoose.model('playlist',playListSchema);


module.exports = playListModel;