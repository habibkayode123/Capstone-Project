require("dotenv").config()
const express = require("express")

const app = express()
const bodyParser = require("body-parser")
const router = require("./router/index")
const editRouter = require("./router/editrouter")
const deletRouter = require("./router/deleterouter")
const commentRouter = require("./router/commentrouter")
const viewRouter = require("./router/viewrouter")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.use(editRouter)
app.use(deletRouter)
app.use(commentRouter)
app.use( router)
app.use(viewRouter)


app.listen(3000, () =>{console.log("connet")})
module.exports= app