require("dotenv").config()
const express = require("express")
var {
    Client
} = require("pg");
var client = new Client({
    ssl: true,
    connectionString: "postgres://hwynqtegjipaco:fd239927b987b7e47007ada8c3a63600cf718c843284a4a87ed413c42f972344@ec2-54-235-181-55.compute-1.amazonaws.com:5432/d5ph5cvtt0v530"
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
    
