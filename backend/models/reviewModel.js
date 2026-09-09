import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    docId: {
        type: String,
        required: true,
        ref: "doctor"
    },
    userId: {
        type: String,
        required: true,
        ref: "user"
    },
    appointmentId: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Number,
        default: Date.now
    }
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
