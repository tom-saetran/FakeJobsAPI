import express from "express"
import jobModel from "./schema.js"
import mongoose from "mongoose"
const { isValidObjectId } = mongoose
import q2m from "query-to-mongo"
import createError from "http-errors"

const routes = express.Router()

routes.get("/", async (req, res, next) => {
    try {
        const limit = 10
        const query = q2m(req.query)
        let filter = {}
        query.options.limit = query.options.limit ? (query.options.limit < limit ? query.options.limit : limit) : limit
        const total = await jobModel.countDocuments(query.criteria.search ? { $text: { $search: query.criteria.search } } : query.criteria)

        if (query.criteria.search) filter = { $text: { $search: query.criteria.search } }

        const result = await jobModel
            .find(filter)
            .sort(query.options.sort)
            .skip(query.options.skip || 0)
            .limit(limit)

        res.status(200).send({ navigation: query.links("https://fake.careers", total), num_jobs: total, jobs: result })
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
