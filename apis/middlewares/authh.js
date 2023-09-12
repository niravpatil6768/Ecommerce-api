const jwt = require("jsonwebtoken");
const SECRET = "27676ghgtysj";
const authh = (req, res, next) => {
    
    try {
            let token = req.headers.authorization;
        if(token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token,SECRET);
            req.userId = user._id;
            req.userType = user.type;

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
