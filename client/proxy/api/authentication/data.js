const userKey = { key: '57bd67287664bb1497cb29fe89d2d5087195a3ae' };

let currentUser = null;
const getCurrentUser = () => currentUser;
const setCurrentUser = newUser => (currentUser = newUser);

module.exports = { userKey, getCurrentUser, setCurrentUser };
