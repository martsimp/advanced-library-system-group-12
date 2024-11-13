const inventoryService = require('./inventoryService');

async function getAllMedia(req, res) {
    try {
        const media = await inventoryService.getAllMedia(req.query);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getMediaById(req, res) {
    try {
        const media = await inventoryService.getAllMedia({ id: req.params.id });
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createMedia(req, res) {
    try {
        const media = await inventoryService.createMedia(req.body);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllMedia,
    getMediaById,
    createMedia
};
