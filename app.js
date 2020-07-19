const express = require("express")
const app = express()
const path = require("path")
const morgan = require("morgan")

// middlewares
app.use(morgan("dev"))  // restarts server when file changes saved

app.use(express.static(path.join(__dirname, 'view')));

const port = 8080
app.listen(port, () => {
    console.log(`NodeJS API listening on port: ${port}`)
})