const inventoryRepository = require('./inventoryRepository');

async function getAllMedia(filter) {
    return await inventoryRepository.getAllMedia(filter);
}

async function createMedia(info) {
    return await inventoryRepository.createMedia(info);
}

async function updateMedia(id, info) {
    return await inventoryRepository.updateMedia(id, info);
}

module.exports = {
    getAllMedia,
    createMedia,
    updateMedia,
    updateMedia
};
