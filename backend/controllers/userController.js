import validator from 'validator'
import usermodel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';


// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body

        if (!name || !phone || !email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        //validating email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email is invalid" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Password is not strong" })
        }

        //checking if user already exists
        const user = await usermodel.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "User already exists" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new usermodel({
            name,
            phone,
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.json({ success: true, message: "User registered successfully", token })
    }

    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" })
        }

        // checking if user exists in database 
        const user = await usermodel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // matching password with database password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        // jwt token for authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        
        res.json({ success: true, message: "Login successful", token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfileData = async (req, res) => {
   
    try{
        const { userId } = req.body
        const user = await usermodel.findById(userId).select('-password')
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user })
    }

    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}  


// API to update user profile
const updateProfile = async(req, res) =>{
    try {   
        // we are using FormData in frontend so we can't use json parsing, so we are getting data from req.body
        const {userId,name,phone, address, dob, gender} = req.body;
        const imageFile = req.file;

        if(!name || !phone || !address || !dob || !gender){
            return res.json({success: false, message: "All fields are required"})
        }

        let parsedAddress = address;
        if (typeof address === "string") {
            try {
                parsedAddress = JSON.parse(address);
            } catch {
                parsedAddress = { line1: address, line2: "" };
            }
        }

        let updatedUser;
        if(imageFile) {
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;
            updatedUser = await usermodel.findByIdAndUpdate(userId, {name, phone, address: parsedAddress, dob, gender, image: imageUrl}, { new: true });
        } else {
            updatedUser = await usermodel.findByIdAndUpdate(userId, {name, phone, address: parsedAddress, dob, gender}, { new: true });
        }

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message})
    }
}

export { registerUser, loginUser, getProfileData, updateProfile }  
