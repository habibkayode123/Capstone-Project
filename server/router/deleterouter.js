const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const auth = require("../middleware/token")
const {client} = require("../app")


router.delete("/api/v1/articles/:articlesid", auth.decodeToken, (req, resp) => {
    let articleId = req.body.params

    client.query("SELECT person_id FROM article WHERE article_id =$1;", [articleId], (err, res) => {
        if (err) {
            return resp.json({
                status: "Error",
                error: "Datatbase error"
            })
        }
        if (res.rows[0].person_id != req.data.userid) {
            return resp.json({
                status: "Error",
                error: "Invalid permission"
            })
        }
        client.query("DELETE FROM article WHERE article_id=$1",[articleId], (err,res2) =>{
            if (err){
                return resp.json({
                    status: "Error",
                    error: "Invalid permission"
                })
            }
            return resp.status(200).json({
                status: "success",
                data: {
              message:"article successfully deleted"  }
            })
        })
    })
})

router.delete("/api/v1/image/:imageid", auth.decodeToken, (req, resp) => {
    let imageId = req.params.imageid

    client.query("SELECT person_id FROM image WHERE image_id =$1;", [imageId], (err, res) => {
        if (err) {
            return resp.json({
                status: "Error",
                error: "Datatbase error"
            })
        }
        if (res.rows[0].person_id != req.data.userid) {
            return resp.json({
                status: "Error",
                error: "Invalid permission"
            })
        }
        client.query("DELETE FROM image WHERE image_id=$1",[imageId], (err,res2) =>{
            if (err){
                return resp.json({
                    status: "Error",
                    error: "Invalid permission"
                })
            }
            return resp.status(200).json({
                status: "success",
                data: {
              message:"gif post successfully deleted"  }
            })
        })
    })
})
module.exports = router