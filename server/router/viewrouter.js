const express = require("express")
const router = express.Router()
const auth = require("../middleware/token")
const jwt = require("jsonwebtoken")
const {
    client
} = require("../app")

router.get("/api/v1/articles/:articleid", auth.decodeToken, (req, resp) => {
    let id = req.params.articleid
    let comments = {}
    client.query("SELECT * FROM article WHERE article_id = $1", [id], (err, res) => {
        if (err) {
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"

            })
        }
        let {
            article_id,
            tittle,
            created_time,
            article
        } = res.rows[0]

        client.query("SELECT comment, comment_id,  person_id FROM article_comment WHERE article_id =$1", [id], (err, res2) => {
            if (err) {
                console.log(err)
                return resp.json({
                    status: "Error",
                    error: "Datatbase error"
                })
            }
            comments = res2.rows
            return resp.json({
                status: "success",
                data: {
                    id: article_id,
                    createdOn: created_time,
                    tittle,
                    article,
                    comments
                }
            })
        })
    })
})

router.get("/api/v1/gifs/:gifid", auth.decodeToken, (req, resp) => {
    let id = req.params.gifid
    let comments = {}
    client.query("SELECT * FROM image WHERE image_id = $1", [id], (err, res) => {
        if (err) {
            console.log(err, process.env.userpq)
            return resp.json({
                status: "Error",
                error: "Datatbase error"

            })
        }
        let {person_id,
            image_id,
            tittle,
            created_on,
            url
        } = res.rows[0]

        client.query("SELECT comment, comment_id,person_id,created_on FROM image_comment WHERE image_id =$1", [id], (err, res2) => {
            if (err) {
                console.log(err)
                return resp.json({
                    status: "Error",
                    error: "Datatbase error"
                })
            }
            console.log(res2)
            comments = res2.rows
            return resp.status(200).json({
                status: "success",
                data: {
                    personId:person_id,
                    id: image_id,
                    createdOn: created_on,
                    tittle,
                    url,
                    comments
                }
            })
        })
    })
})
router.get("/api/v1/feed", auth.decodeToken, (req, resp) => {
    client.query("SELECT 'Article' AS record_type, article_id,tittle,article,person_id,created_time AS created_on FROM article UNION SELECT 'Image' AS record_type, image_id,tittle,url,person_id,created_on FROM image ORDER BY created_on;", (err, res) => {
        if (err) {
            console.log(err)
        }
        resp.json(res.rows)

    })
})
// to get a single person articles
router.get("/api/v1/article/:personid", auth.decodeToken, (req, resp) => {
    let personId = req.params.personid
    let id = req.data.userid
    client.query("SELECT * FROM article WHERE person_id = $1", [id], (err, res) => {
        if (err) {
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"

            })
        }
        return resp.status(200).json({
            status: "success",
            data: res.rows
        })
    })
})
// to get a single person images
router.get("/api/v1/gif/:gifid", auth.decodeToken, (req, resp) => {
    let personId = req.params.gifid
    let id = req.data.userid
    client.query("SELECT * FROM image WHERE person_id = $1", [id], (err, res) => {
        if (err) {
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"

            })
        }

        return resp.status(200).json({
            status: "success",
            data: res.rows
        })
    })
})

router.post("/api/v1/verifytoken",(req,resp) =>{
    let token = req.body.token
    let data = jwt.decode(token)
    if (data == null) {
        resp.statusCode = 400
        return resp.json({status:"Error",
    error:"permission denial"})
    }
    return resp.status(200).json({
        status:"ok",
        data,
    })

})
router.get("/api/v1/getperson/:personid",(req,resp)=>{
let personId = req.params.personid
console.log(personId)
client.query("SELECT firstname,lastname FROM Person WHERE userid =$1",[personId],(err,res)=>{
    if (err){
        return console.log(err)
    }
    console.log(res.rows,'uuu')
    return resp.status(200).json({
        status:"ok",
        data:{
           firstname: res.rows[0].firstname,
           lastname: res.rows[0].lastname
        }
    })
})
})
module.exports = router