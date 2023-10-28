//it is use for authentication.like, it will stop user to go on particular page without login
const jwt = require("jsonwebtoken");
const SECRET = "27676ghgtysj";
const authh = (req, res, next) => {
    
    try {
            let token = req.headers.authorization;
        if(token) {
            //split to remove the "Bearer " prefix
            token = token.split(" ")[1];
            // verify token 
            let user = jwt.verify(token,SECRET);
            //id and type from JWT payload are added to request object
            req.userId = user._id;
            req.userType = user.type;

            //use to pass control to next middleware
            next();
        } else {
            res.status(401).json({
                
                message: "Unauthorized User"
                
            });
        }

    } 
    catch(error) {
        console.log('error', error)
        
        res.status(401).json({
            message: "Unauthorized User11",
            error: error
        });
    }
}

module.exports = authh;
