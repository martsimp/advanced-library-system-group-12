const inventoryRepository = require('./inventoryRepository');

async function getAllMedia() {
    return await inventoryRepository.getAllMedia();
}

module.exports = {
    getAllMedia
};
