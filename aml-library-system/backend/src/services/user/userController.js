const userService = require('./userService');

async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createUser(req, res) {
    try {
        console.log('Received user data:', req.body);
        const userData = req.body;
        const newUser = await userService.createUser(userData);
        console.log('Created user:', newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: error.message });
    }
}

async function getUserByFirebaseUid(req, res) {
    try {
        const { firebaseUid } = req.params;
        const user = await userService.getUserByFirebaseUid(firebaseUid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserByFirebaseUid
};
