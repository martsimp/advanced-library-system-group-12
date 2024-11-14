const branchRepository = require('./branchRepository');

async function getAllBranches(filter) {
    return await branchRepository.getAllBranches(filter);
}

async function createBranch(info) {
    return await branchRepository.createBranch(info);
}

async function updateBranch(id, info) {
    return await branchRepository.updateBranch(id, info);
}

async function deleteBranch(id) {
    return await branchRepository.deleteBranch(id);
}

module.exports = {
    getAllBranches,
    createBranch,
    updateBranch,
    deleteBranch
};
