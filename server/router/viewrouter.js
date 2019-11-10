const express = require("express")
const router = express.Router()
const auth = require("../middleware/token")
const {
    Pool
} = require("pg")
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Teamwork",
    password: "ayofe2020",
    port: "5432"
})

router.get("/articles/:articleid", auth.decodeToken, (req, resp) => {
    let id = req.params.articleid
    let comments = {}
    pool.query("SELECT * FROM article WHERE article_id = $1", [id], (err, res) => {
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

        pool.query("SELECT comment, comment_id,  person_id FROM article_comment WHERE article_id =$1", [id], (err, res2) => {
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

router.get("/gifs/:gifid", auth.decodeToken, (req, resp) => {
    let id = req.params.gifid
    let comments = {}
    pool.query("SELECT * FROM image WHERE image_id = $1", [id], (err, res) => {
        if (err) {
            console.log(err)
            return resp.json({
                status: "Error",
                error: "Datatbase error"

            })
        }
        let {
            image_id,
            tittle,
            created_on,
            url
        } = res.rows[0]

        pool.query("SELECT comment, comment_id,person_id FROM image_comment WHERE image_id =$1", [id], (err, res2) => {
            if (err) {
                console.log(err)
                return resp.json({
                    status: "Error",
                    error: "Datatbase error"
                })
            }
            console.log(res2)
            comments = res2.rows
            return resp.json({
                status: "success",
                data: {
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

module.exports = router