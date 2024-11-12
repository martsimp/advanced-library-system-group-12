const inventoryService = require('./inventoryService');

async function getAllMedia(req, res) {
    try {
        const users = await inventoryService.getAllMedia();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllMedia
};
