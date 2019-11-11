require("dotenv").config()
const express = require("express")
const {
    Client
} = require("pg");
const client = new Client({
    ssl: true,
    connectionString: process.env.database_url
})
client.connect()
module.exports.client = client
const app = express()
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



app.listen(3000, () => {
    console.log("connet")
})


module.exports.app =  app
    