const pool = require('../../config/database');

// Fetch all media for a specific branch with their total copies
async function getAllMedia(branchId) {
  const query = 
    `SELECT 
      m.id AS media_id,           
      m.title AS media_name,     
      bmi.available_copies AS quantity, 
      bmi.branch_id               
    FROM 
      branch_media_inventory bmi
    JOIN 
      media m ON bmi.media_id = m.id 
    WHERE 
      bmi.branch_id = $1`; 
  const result = await pool.query(query, [branchId]); 
  return result.rows; 
}


// Fetch all branches
async function getAllBranches() {
  const query = 'SELECT id, name FROM branches';
  const result = await pool.query(query);
  return result.rows; 
}

// Update media quantity in the media table
async function updateMediaQuantity(mediaId, quantity) {
  const query = `
    UPDATE media
    SET total_copies = total_copies + $1
    WHERE id = $2
    RETURNING id, title, total_copies;
  `;
  const values = [quantity, mediaId];
  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new Error(`Media with ID ${mediaId} not found`);
  }

  return result.rows[0];
}

// Fetch media for a specific branch
async function getBranchMedia(branchId) {
  const query = 
    `SELECT
      m.id AS media_id,           
      m.title AS media_name, 
      bmi.available_copies as quantity
    FROM
      branch_media_inventory bmi
    JOIN
      media m ON bmi.media_id = m.id
    WHERE
      bmi.branch_id = $1`; 
  const values = [branchId];  
  const result = await pool.query(query, values);
  return result.rows;  
}

// Fetch media by name
async function getMediaByName(mediaName) {
  const query = `
    SELECT id, title, total_copies
    FROM media
    WHERE LOWER(title) = LOWER($1)
  `;
  const result = await pool.query(query, [mediaName]);
  return result.rows[0];
}

// Fetch a branch by name
async function getBranchByName(branchName) {
  const query = `
    SELECT id, name
    FROM branches
    WHERE LOWER(name) = LOWER($1)
  `;
  const result = await pool.query(query, [branchName]);
  return result.rows[0];
}

// Update media quantity in the media table
async function updateMediaQuantity(mediaId, quantity, client) {
  const query = `
    UPDATE media
    SET total_copies = total_copies + $1
    WHERE id = $2
    RETURNING id, title, total_copies;
  `;
  const values = [quantity, mediaId];
  const result = await (client || pool).query(query, values);
  return result.rows[0];
}

// Update branch inventory (either insert or update the media quantity)
async function updateBranchInventory(branchId, mediaId, quantity, client) {
  const query = `
    INSERT INTO branch_media_inventory (branch_id, media_id, available_copies)
    VALUES ($1, $2, $3)
    ON CONFLICT (branch_id, media_id)
    DO UPDATE SET available_copies = branch_media_inventory.available_copies + $3
    RETURNING available_copies;
  `;
  const values = [branchId, mediaId, quantity];
  const result = await (client || pool).query(query, values);
  return result.rows[0];
}

module.exports = {
  getAllMedia,
  getAllBranches,
  updateMediaQuantity,
  updateBranchInventory,
  getBranchMedia,

  getMediaByName,
  getBranchByName,
};
//Repository.js