const branchService = require('./branchService');

async function getAllBranches(req, res) {
    try {
        const media = await branchService.getAllBranches(req.query);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getBranchById(req, res) {
    try {
        const media = await branchService.getAllBranches({ id: req.params.id });
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createBranch(req, res) {
    try {
        const media = await branchService.createBranch(req.body);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateBranch(req, res) {
    try {
        const media = await branchService.updateBranch(req.params.id, req.body);
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteBranch(req, res) {
    try {
        await branchService.deleteBranch(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
};
