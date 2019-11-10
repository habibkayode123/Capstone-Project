const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const auth = require("../middleware/token")
const {
    Pool
} = require("pg")
const pool = new Pool({
    
    user: process.env.userpq,
    host: process.env.host,
    database: process.env.databasepq,
    password: process.env.passwordpq,
    port: process.env.port
})


router.patch("/articles/:articleid", auth.decodeToken, (req, resp) => {

    let articleId = req.params.articleid
    let article = req.body.article
    let tittle = req.body.tittle

    pool.query("SELECT person_id FROM article WHERE article_id =$1;", [articleId], (err, res) => {
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
        pool.query("UPDATE article SET article = $1, tittle = $2 WHERE article_id = $3", [article, tittle, articleId], (err, res2) => {
            if (err) {
                return resp.json({
                    status: "Error",
                    error: "Database or connection error"
                })
            }
            return resp.json({
                status: "success",
                data: {
                    article,
                    tittle
                }
            })


        })

    })
})


module.exports = router