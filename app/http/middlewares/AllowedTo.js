const appError = require("../../../utlis/appError");
const { FAIL } = require("../../../utlis/httpStatus");


module.exports = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)){
            return next(appError(`You don't have permission (UnAuthorized)`, 401, FAIL));
        }
        return next();
    }
};