import mongoose from "mongoose";

const originSchema = new mongoose.Schema({
    origin:{
        type: String,
        required: true,
        unique: true,
        trim: true
    }
},
{
    timestamps: false,
    versionKey: false
})

const Origin = mongoose.model("Origin", originSchema);

export default Origin;