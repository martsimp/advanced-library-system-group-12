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
            role: user.role,
            has_seen_tutorial: user.has_seen_tutorial
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
            outstanding_fines: 0,
            has_seen_tutorial: false
        };
        
        const newUser = await userService.createUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ error: error.message });
    }
}

async function updateTutorialStatus(req, res) {
    try {
        const { firebaseUid } = req.params;
        await userService.updateTutorialStatus(firebaseUid);
        res.status(200).json({ message: 'Tutorial status updated successfully' });
    } catch (error) {
        console.error('Error updating tutorial status:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserByFirebaseUid,
    registerUser,
    updateTutorialStatus
};
