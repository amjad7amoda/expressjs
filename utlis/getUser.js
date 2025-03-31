const User = require('../app/models/user.model');
const getUserById = async (id) => {
    userDoc = await User.findById({_id: id});
    user = UserDoc.toObject();
    return user;
}

const getUserByEmail = async (email) => {
    userDoc = await User.findOne({email: email});
    user = await userDoc.toObject();
    return user;
}
module.exports = {
    getUserByEmail,
    getUserById
}