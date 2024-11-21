const userService = require('./userService');

async function getUserByFirebaseUid(req, res) {
    try {
        const user = await userService.getUserByFirebaseUid(req.params.firebaseUid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function registerUser(req, res) {
    try {
        const userData = {
            firebase_uid: req.body.firebase_uid,
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            street_address: req.body.street_address,
            city: req.body.city,
            postal_code: req.body.postal_code,
            notifications_enabled: req.body.notifications_enabled,
            role: 'member',
            outstanding_fines: 0
        };
        
        const newUser = await userService.createUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserByFirebaseUid,
    registerUser,
    updateUser,
    deleteUser
};
