const models = require('../../models')
const fs = require('fs')
const { url } = require('inspector')

exports.upload = async (req,res) =>{
try{
    const img = req.files
    //
    for(let i = 0; i<img.length; i++){
        try {
        await models.image.create({
            image_name : img[i].filename
        })
      } catch (err) {
        console.log(err)
      }    
    }
    //
    console.log(img)
    res.json({result : true, info : req.files})
} catch{
    res.json({result : false})
}
}

exports.download = async (req,res) => {
    const id = req.body.id
    const user = await models.image.findOne({ attributes : ['image_name'], where: { id: id } })
        fs.createReadStream('./uploads/'+ user.image_name)
        .pipe(res)
        .on('finish', () =>{
            console.log(user.image_name)
        })
}