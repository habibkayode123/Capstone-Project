const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const auth = require("../middleware/token")
const parser = require("../middleware/util")
const {
    Pool
} = require("pg")
const pool = new Pool({
    user: process.env.dbuser,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
})



router.post("/auth/create-use", auth.decodeToken, (req, resp) => {

    if (req.data.jobrole != "admin") {
        resp.statusCode = 400
        return resp.json({
            status: "Error",
            error: "invalid permission"
        })
    }

    let pass = bcrypt.hashSync(req.body.password, 10)
    const {
        firstname,
        lastname,
        email,
        jobrole,
        address,
        gender,
        department
    } = req.body
    let payload = {}
    pool.query("INSERT INTO Person (firstname,lastname,email,jobrole,address,gender,department,hashpassword) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ", [firstname, lastname, email, jobrole, address, gender, department, pass], (err, res) => {
        if (err) {
            return resp.status(400).json({
                status: "Error",
                error: "Datatbase error or network"
            })
        }
        pool.query("SELECT userid,firstname,lastname,hashpassword,jobrole,email FROM Person WHERE Person.email =$1;", [email], (err, res2) => {
            if (err) {
                return resp.status(400).json({
                    status: "Error",
                    error: "Datatbase error"
                })

            }

            resp.status(200).json({
                status: "success",
                token: auth.createToken(res2.rows[0]),
                userId: res2.rows[0].userid


            })
        })



    })


})
router.post("/auth/signin", (req, resp) => {
    pool.query("SELECT * FROM Person WHERE Person.email =$1;", [req.body.email], (err, res) => {
        if ((res.rows[0]) == undefined) {
            resp.statusCode = 400
            return resp.json({
                error: "invalid email"
            });
        }
        const {
            hashpassword,
            email,
            firstName,
            lastName,
            jobrole,
            userid
        } = res.rows[0]
        bcrypt.compare(req.body.password, hashpassword, (err, sus) => {
            if (err) {
                return console.log("wrong password")
            }
            let token = auth.createToken({
                hashpassword,
                email,
                firstName,
                lastName,
                jobrole,
                userid
            })
            resp.statusCode = 200
            resp.json({
                token,
                status: "success",
                userid
            })

        })
    })

})

router.post("/auth/articles", auth.decodeToken, (req, resp) => {
    let {
        article,
        tittle
    } = req.body
    const {
        userid
    } = req.data
    let createdTime = new Date()
    pool.query("INSERT INTO article (article,tittle,person_id,created_time) VALUES($1,$2,$3,$4)", [article, tittle, userid, createdTime], (err, res) => {
        if (err) {
            return resp.status(400).json({
                status: "Error",
                error: "database error"
            })
        }
        pool.query("SELECT tittle,article_id,created_time FROM article WHERE person_id = $1", [req.data.userid], (err, res2) => {
            if (err) {
                return resp.status(400).json({
                    status: "Error",
                    error: "database error"
                })
            }
            let {
                tittle,
                article_id,
                created_time
            } = res2.rows[res2.rows.length - 1]
            return resp.status(200).json({
                status: "success",
                data: {
                    tittle,
                    article_id,
                    created_time
                }
            })
        })

    })

})

router.post("/gifs", auth.decodeToken, parser.single("image"), (req, resp) => {
    let {tittle} = req.body
    let {url} = req.file
    let time = req.file.created_at
    let id = req.data.userid
     pool.query("INSERT INTO image (tittle,person_id,created_on,url) VALUES($1,$2,$3,$4)", [ tittle, id,time,url], (err, res) => {
        if (err) {
            return resp.status(400).json({
                status: "Error",
                error: "database error"
            })
        }
       pool.query("SELECT image_id FROM image WHERE person_id = $1", [id], (err,res2) =>{
        if (err) {
            return resp.status(400).json({
                status: "Error",
                error: "database error in 2"
            })
        }
        return resp.status(200).json({
            status: "success",
            data: {
                tittle,
                image_id:res2.rows[res2.rows.length - 1].image_id,
                createdOn:time,
                imageUrl:url
            }
        })
           
       } )
    })


})





module.exports = router