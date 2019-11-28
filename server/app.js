require("dotenv").config()
const express = require("express")
const cors = require("cors")
var {
    Client
} = require("pg");
var client = new Client({
  /*  user:process.env.user,
    host:"localhost",
    database:process.env.database,
    password:process.env.password, */
   // ssl: true,
    connectionString: process.env.database_url
})
client.connect()
module.exports.client = client
const app = express()
app.use(cors())
const bodyParser = require("body-parser")
const postRouter = require("./router/post")
const editRouter = require("./router/editrouter")
const deletRouter = require("./router/deleterouter")
const commentRouter = require("./router/commentrouter")
const viewRouter = require("./router/viewrouter")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(editRouter)
app.use(deletRouter)
app.use(commentRouter)
app.use(postRouter)
app.use(viewRouter)
app.get("/",(req,resp)=>{
    resp.send("you are welcome")
})



app.listen(process.env.PORT || 3002, () => {
    console.log("connet",process.env.PORT)
})


module.exports.app =  app
    