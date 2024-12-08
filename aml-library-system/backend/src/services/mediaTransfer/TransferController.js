const transferService = require('./TransferService');

// Fetch media and branches
async function getMediaAndBranches(req, res) {
  try {
    const data = await transferService.getMediaAndBranches();
    res.json(data);
  } catch (error) {
    console.error("Error fetching media and branches:", error);
    res.status(500).json({ error: error.message });
  }
}

// Handle media transfer between branches
async function transferMedia(req, res) {
  const { mediaId, fromBranchId, toBranchId, quantity } = req.body;

  // Debugging log to check the incoming request body
  console.log("Received transfer request:", req.body);

  if (!mediaId || !fromBranchId || !toBranchId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const result = await transferService.transferMedia(mediaId, fromBranchId, toBranchId, quantity);
    res.status(200).json({ message: 'Transfer successful', result });
  } catch (error) {
    console.error("Error during media transfer:", error);
    res.status(500).json({ error: error.message });
  }
}


// Fetch media for a specific branch
async function getBranchMedia(req, res) {
  const branchId = req.params.branchId; 
  console.log("Fetching media for branch:", branchId); 
  try {
    const data = await transferService.getBranchMedia(branchId);
    console.log("Fetched media data:", data); 
    res.json(data); 
  } catch (error) {
    console.error("Error fetching branch media:", error);
    res.status(500).json({ error: error.message });
  }
}

// add media to a specific branch
async function addMediaToBranch(req, res) {
  const { mediaName, quantity, branchName } = req.body;

  console.log("Received add media request:", req.body);

  if (!mediaName || !quantity || !branchName) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const result = await transferService.addMediaToBranch(mediaName, quantity, branchName);
    res.status(200).json({
      message: "Media successfully added to branch",
      result
    });
  } catch (error) {
    console.error("Error adding media to branch:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Add media to branch
async function getMediaInfo(req, res) {
  const { mediaName } = req.params;

  try {
    const mediaInfo = await transferService.getMediaByName(mediaName);
    if (mediaInfo) {
      res.json(mediaInfo);
    } else {
      res.status(404).json({ error: 'Media not found' });
    }
  } catch (error) {
    console.error("Error fetching media info:", error);
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getMediaAndBranches,
  getBranchMedia,
  transferMedia,

  addMediaToBranch,
  getMediaInfo
};
