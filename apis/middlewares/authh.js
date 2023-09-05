const jwt = require("jsonwebtoken");
const SECRET = "JFEHKJBBBOEWRDVDWF";
const authh = (req, res, next) => {
    
    try {
        let token = req.headers.authorization;
        //console.log("token:",token);
        if(token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token,SECRET);
            console.log(user);
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
        res.status(401).json({
            message: "Unauthorized User"
        });
    }
}

module.exports = authh;
