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

async function updateMedia(req, res) {
    try {
        const media = await inventoryService.updateMedia(req.params.id, req.body);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteMedia(req, res) {
    try {
        await inventoryService.deleteMedia(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getReservations(req, res) {
    try {
        const result = await inventoryService.getReservations(req.body);
        res.json(result);
    } catch (error) {
        throw error;
        res.status(500).json({ error: error.message });
    }
}

async function createReservation(req, res) {
    try {
        const result = await inventoryService.createReservation(req.body);
        res.json(result);
    } catch (error) {
        throw error;
        res.status(500).json({ error: error.message });
    }
}

async function fulfillReservation(req, res) {
    try {
        await inventoryService.fulfillReservation(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteReservation(req, res) {
    try {
        await inventoryService.deleteReservation(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function searchMedia(req, res) {
    try {
        const searchParams = {
            searchQuery: req.query.q,
            genre: req.query.genre,
            format: req.query.format,
            status: req.query.status,
            sortBy: req.query.sortBy
        };
        
        const results = await inventoryService.searchMedia(searchParams);
        res.json(results);
    } catch (error) {
        console.error('Error searching media:', error);
        res.status(500).json({ error: error.message });
    }
}

async function getFilterOptions(req, res) {
    try {
        const options = await inventoryService.getFilterOptions();
        res.json(options);
    } catch (error) {
        console.error('Error getting filter options:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllMedia,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia,
    getReservations,
    createReservation,
    fulfillReservation,
    deleteReservation,
    searchMedia,
    getFilterOptions
};
