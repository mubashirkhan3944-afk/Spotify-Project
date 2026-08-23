const {ImageKit}=require('@imagekit/nodejs');

const client=new ImageKit({
    privateKey:process.env.PrivateKey
});

async function uploadfile(file){
    const result=await client.files.upload({
        file,
        fileName: 'Music_' + Date.now(),
        folder:'POST_PROJECT/spotify'
    })
    return result;
}

async function deletefile(fileId){
    const result=await client.files.delete(fileId);
    console.log('deleted successfull');
    return result;
}

module.exports={uploadfile,deletefile};