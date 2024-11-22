import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMediaModal = ({ isOpen, onClose, onAdd, branches }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mediaName, setMediaName] = useState('');
  const [branchError, setBranchError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);

  useEffect(() => {
    if (mediaName) {
      fetchMediaInfo(mediaName);
    }
  }, [mediaName]);

  const fetchMediaInfo = async (name) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/mediaTransfer/mediaInfo/${encodeURIComponent(name)}`);
      setAvailableQuantity(response.data.total_copies);
      setMediaError('');
    } catch (error) {
      console.error('Error fetching media info:', error);
      setMediaError('Media not found');
      setAvailableQuantity(0);
    }
  };

  if (!isOpen) return null;

  const handleAdd = async () => {
    let hasError = false;

    if (!selectedBranch) {
      setBranchError('Please select a branch.');
      hasError = true;
    } else {
      setBranchError('');
    }

    if (quantity <= 0 || quantity > availableQuantity) {
      setQuantityError(`Quantity must be between 1 and ${availableQuantity}.`);
      hasError = true;
    } else {
      setQuantityError('');
    }

    if (!mediaName.trim()) {
      setMediaError('Please enter a media name.');
      hasError = true;
    } else {
      setMediaError('');
    }

    if (!hasError) {
      try {
        console.log('Attempting to add media:', { mediaName, quantity, branchName: selectedBranch });
        await onAdd(mediaName, quantity, selectedBranch);
        setMediaName('');
        setQuantity(1);
        setSelectedBranch('');
        onClose();
      } catch (error) {
        console.error('Error adding media:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Media</h2>
        <div className="border px-3 py-2">
          <div className="mb-4">
            <label className="block mb-2">Media Name:</label>
            <input
              type="text"
              value={mediaName}
              onChange={(e) => setMediaName(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${mediaError ? 'border-red-500' : 'border-gray-300'}`}
            />
            {mediaError && <p className="text-red-500 text-sm">{mediaError}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Quantity (Available: {availableQuantity}):</label>
            <input
              type="number"
              min="1"
              max={availableQuantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className={`w-full border rounded px-3 py-2 ${quantityError ? 'border-red-500' : 'border-gray-300'}`}
            />
            {quantityError && <p className="text-red-500 text-sm">{quantityError}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Select Branch:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${branchError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">--Select Branch--</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
            {branchError && <p className="text-red-500 text-sm">{branchError}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMediaModal;

