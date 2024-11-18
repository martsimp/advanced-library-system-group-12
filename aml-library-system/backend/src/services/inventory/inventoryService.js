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

async function deleteMedia(id) {
    return await inventoryRepository.deleteMedia(id);
}

async function getReservations(filter) {
    return await inventoryRepository.getReservations(filter);
}

async function createReservation(data) {
    return await inventoryRepository.createReservation(data);
}

async function deleteReservation(id) {
    return await inventoryRepository.deleteReservation(id);
}

async function fulfillReservation(id) {
    return await inventoryRepository.fulfillReservation(id);
}

module.exports = {
    getAllMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    getReservations,
    createReservation,
    deleteReservation,
    fulfillReservation
};
