import express from "express"
import jobModel from "./schema.js"
import mongoose from "mongoose"
const { isValidObjectId } = mongoose
import q2m from "query-to-mongo"
import createError from "http-errors"

const routes = express.Router()

routes.get("/", async (req, res, next) => {
    try {
        const limit = 20
        const query = q2m(req.query)
        query.options.limit = query.options.limit ? (query.options.limit < limit ? query.options.limit : limit) : limit
        console.log(query)
        const total = await jobModel.countDocuments(query.criteria)
        const result = await jobModel
            .find(query.criteria)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(query.options.limit && query.options.limit < limit ? query.options.limit : limit)

        res.status(200).send({ navigation: query.links("/", total), num_jobs: total, jobs: result })
    } catch (error) {
        next(createError(500, error))
    }
})

routes.get("/:id", async (req, res, next) => {
    try {
        let result
        if (!isValidObjectId(req.params.id)) next(createError(400, `ID: ${req.params.id} is invalid`))
        else result = await jobModel.findById(req.params.id)
        res.send(result)
    } catch (error) {
        next(createError(500, error))
    }
})

export default routes
