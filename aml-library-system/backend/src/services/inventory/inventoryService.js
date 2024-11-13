const inventoryRepository = require('./inventoryRepository');

async function getAllMedia(filter) {
    return await inventoryRepository.getAllMedia(filter);
}

async function createMedia(info) {
    return await inventoryRepository.createMedia(info);
}

module.exports = {
    getAllMedia,
    createMedia
};
