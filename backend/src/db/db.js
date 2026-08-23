const mongoose = require('mongoose');



async function connectDB(){


    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to DB')
    })
    .catch((err)=>{
        console.log('Error connecting to DB ',err);
    })

}


module.exports = connectDB;