import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import jobs from "./jobs/index.js"
import listEndpoints from "express-list-endpoints"

const server = express()
const port = process.env.PORT || 1234

server.use(cors())
server.use(express.json())

server.use("/", jobs)

server.use((err, _req, res, _next) => res.status(err.status).send(err.message))

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log("server is running on port:", port)
    })
})
