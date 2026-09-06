import jwt from "jsonwebtoken";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const atoken = req.header('Authorization');
        if(!atoken){
            return res.json({success: false, message: "Unauthorized"});
        }
        const decodedToken = jwt.verify(atoken, process.env.JWT_SECRET);
        req.body.adminId = decodedToken.id;
        next();
    } catch (error) {
        return res.json({success: false, message: "Unauthorized"});
    }
};

export default authAdmin;   