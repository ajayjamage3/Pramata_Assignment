const mongoose = require("mongoose")
require("dotenv").config()
mongoose.set("strictQuery",false)
const connection =mongoose.connect("mongodb+srv://clickdeal:ajayjamage@cluster0.zkvsjva.mongodb.net/chatDB?retryWrites=true&w=majority")

module.exports={
    connection
}