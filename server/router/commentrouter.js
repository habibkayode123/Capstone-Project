const express = require("express")
const router = express.Router()
const auth = require("../middleware/token")
const {client} = require("../app")

router.post("/api/v1/gifs/:gifid/comment",auth.decodeToken,(req,resp) => {
    let imageId = req.params.gifid
    let {comment}  = req.body
    let time = new Date()
    let id = req.data.userid
    console.log(comment)
    client.query("SELECT tittle FROM image WHERE image_id = $1", [imageId], (err,res) =>{
        if (err){
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"
            })

            
        }
        if (res.rows[0] == undefined){
            return resp.status(400).json({
                status: "Error",
                error: "The image does not exit"
            })   
        }
        let tittle = res.rows[0].tittle
    client.query("INSERT INTO image_comment (comment,image_id,created_on,person_id) VALUES($1,$2,$3,$4)", [comment,imageId,time,id], (err,res2) =>{
        if (err){
            return resp.status(400).json({
                status: "Error",
                error: "Database Error"
            })
        }
        return resp.status(200).json({
            status:"success",
            data:{
                message:"comment successfully created",
                createdOn:new Date ().toUTCString(),
                gifTitle:tittle,
                comment
            }
        })
    })
    }) 
})
router.post("/api/v1/articles/:articleid/comment",auth.decodeToken,(req,resp) => {
    let articleId = req.params.articleid
    let {comment}  = req.body
    let time = new Date()
    let id = req.data.userid

    client.query("SELECT tittle FROM article WHERE article_id = $1", [articleId], (err,res) =>{
        if (err){
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"
            })

            
        }
        if (res.rows[0] == undefined){
            return resp.status(400).json({
                status: "Error",
                error: "The article does not exit"
            })   
        }
        let tittle = res.rows[0].tittle
        let article = res.rows[0].article
    client.query("INSERT INTO article_comment (comment,article_id,created_on,person_id) VALUES($1,$2,$3,$4)", [comment,articleId,time,id], (err,res2) =>{
        if (err){
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"
            
        }) 
    }
    
    return resp.status(200).json({
        status:"success",
        data:{
            message:"comment successfully created",
            createdOn:new Date ().toUTCString(),
            articleTitle:tittle,
            article,
            comment
        }
    })
    })
    }) 
})


module.exports = router