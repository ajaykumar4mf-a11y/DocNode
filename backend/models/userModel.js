import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "/public/default-avatar.jpg"
    },
    address: {
        type: Object,
        default: { line1: '', line2: ' ' }
    },
    gender: {
        type: String,
        required: true,
        default: "Not Selected"
    },
    dob: {
        type: Date,
        required: true,
        default: Date.now
    },
    phone: {
        type: String,
        required: true,
        default: "0000000000000"
    }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
