const inventoryRepository = require('./inventoryRepository');
const userService = require('../user/userService');

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
    const user = await userService.getUserByFirebaseUid(data.user);
    // Transform the user into its database ID which is needed by the reservations table.
    data.user = user.id;
    return await inventoryRepository.createReservation(data);
}

async function deleteReservation(id) {
    return await inventoryRepository.deleteReservation(id);
}

async function fulfillReservation(id) {
    return await inventoryRepository.fulfillReservation(id);
}

async function searchMedia(searchParams) {
    return await inventoryRepository.searchMedia(searchParams);
}

async function getFilterOptions() {
    return await inventoryRepository.getFilterOptions();
}

module.exports = {
    getAllMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    getReservations,
    createReservation,
    deleteReservation,
    fulfillReservation,
    searchMedia,
    getFilterOptions
};
