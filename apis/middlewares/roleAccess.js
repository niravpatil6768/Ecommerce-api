const roleAccess = (permissions) => { 
    
    return (req, res, next) => {
        try {
            if(permissions.includes(req.userType)) {
                next();
            } else {
                return res.status(401).json({
                    message: "you don't have permission to this page"
                });
            }

        } catch(error) {
            res.status(401).json({
                message: "Access denied to this page"
            });
        }
    }
}


module.exports = roleAccess;
