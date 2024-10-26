import jwt from "jsonwebtoken";

export const verifyStudent = (req, res, next) => {
    const token = req.cookies.studentToken;  // Updated to studentToken
    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        req.userId = decoded.userId;  // Attach the student ID to the request object
        next();  // Continue to the next middleware or route handler

    } catch (error) {
        console.log("Error in verify token:", error);
        res.status(500).json({ success: false, message: "Error in verify token" });
    }
};
