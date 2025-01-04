const transferRepository = require('./TransferRepository');
const pool = require('../../config/database');

// Fetch media and branches
async function getMediaAndBranches() {
  const media = await transferRepository.getAllMedia();
  const branches = await transferRepository.getAllBranches();
  return { media, branches };
}

// Fetch media for a specific branch
async function getBranchMedia(branchId) {
  const media = await transferRepository.getBranchMedia(branchId);  
  return { media };
}


// Handle media transfer between branches
async function transferMedia(mediaId, fromBranchId, toBranchId, quantity) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check available copies in the source branch
    const sourceAvailableCopies = await transferRepository.getAvailableCopies(fromBranchId, mediaId, client);
    if (!sourceAvailableCopies || sourceAvailableCopies < quantity) {
      throw new Error(`Not enough copies available in the source branch. Only ${sourceAvailableCopies || 0} copies available.`);
    }

    // Update branch inventories
    await transferRepository.updateBranchInventory(fromBranchId, mediaId, -quantity, client);
    await transferRepository.updateBranchInventory(toBranchId, mediaId, quantity, client); 

    await client.query('COMMIT');
    return { message: 'Transfer successful' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error during transfer:", error.message);
    throw error;
  } finally {
    client.release();
  }
}


// Fetch media by name
async function getMediaByName(mediaName) {
  return await transferRepository.getMediaByName(mediaName);
}

// Add media from media table to a specific branch
async function addMediaToBranch(mediaName, quantity, branchName) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const media = await getMediaByName(mediaName);
    if (!media) {
      throw new Error("Media not found");
    }

    if (quantity <= 0 || quantity > media.total_copies) {
      throw new Error(`Please choose between 1 to ${media.total_copies}`);
    }

    const branch = await transferRepository.getBranchByName(branchName);
    if (!branch) {
      throw new Error("Branch not found");
    }

    await transferRepository.updateMediaQuantity(media.id, -quantity, client);

    const inventoryUpdate = await transferRepository.updateBranchInventory(
      branch.id,
      media.id,
      quantity,
      client
    );

    await client.query('COMMIT');

    return { 
      message: 'Media added successfully', 
      mediaName: media.title, 
      branchName: branch.name, 
      updatedCopies: inventoryUpdate.available_copies };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


module.exports = {
  getMediaAndBranches,
  getBranchMedia,
  transferMedia,

  addMediaToBranch,
  getMediaByName,
};
