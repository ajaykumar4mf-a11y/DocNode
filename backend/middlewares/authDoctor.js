import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization') || req.header('dtoken') || req.headers.dtoken;
        if (!authHeader) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!req.body) req.body = {};
        req.body.docId = decodedToken.id;
        req.docId = decodedToken.id;
        next();
    } catch (error) {
        console.error("authDoctor error:", error.message);
        return res.json({ success: false, message: "Unauthorized" });
    }
};

export default authDoctor;   