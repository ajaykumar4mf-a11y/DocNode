import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if(!token){
            return res.json({success: false, message: "Unauthorized"});
        }
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.json({success: false, message: "Unauthorized"});
    }
};

export default authAdmin;   