import jwt from "jsonwebtoken";

// admin authentication middleware
const authUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization') || req.headers.token;
        if(!token){
            return res.json({success: false, message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!req.body) req.body = {};
        req.body.userId = decoded.id;   
        next();
    } catch (error) {
        return res.json({success: false, message: "Unauthorized"});
    }
};

export default authUser;   