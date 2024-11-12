const inventoryRepository = require('./inventoryRepository');

async function getAllMedia(filter) {
    return await inventoryRepository.getAllMedia(filter);
}

module.exports = {
    getAllMedia
};
