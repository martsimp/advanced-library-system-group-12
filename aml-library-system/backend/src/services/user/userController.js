const userService = require('./userService');

async function getUserByFirebaseUid(req, res) {
    try {
        const user = await userService.getUserByFirebaseUid(req.params.firebaseUid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
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

module.exports = {
    getUserByFirebaseUid,
    registerUser
};
