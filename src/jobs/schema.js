import mongoose from "mongoose"

const { Schema, model } = mongoose

const jobSchema = new Schema(
    {
        job_data: {
            title: { type: String, required: true },
            description: { type: String, required: true },
            location: { type: String, required: true },
            category: { type: String, required: true },
            contact_person: { type: String, required: true },
            contact_phone: { type: String, required: true },
            contact_email: { type: String, required: true },
            geographical_acceptance: { type: String, default: "Worldwide" },
            salary: { type: String, default: "" },
            tags: { type: [String], default: [] }
        },
        hiring_company: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
            url: { type: String, required: true },
            image: { type: String, required: true }
        }
    },
    { timestamps: true }
)

jobSchema.set("toJSON", {
    transform: function (_doc, ret, _options) {
        ret.id = ret._id
        delete ret._id

        ret.published = ret.createdAt
        delete ret.createdAt

        ret.modified = ret.updatedAt
        delete ret.updatedAt

        delete ret.__v
    }
})

export default model("Job", jobSchema)
