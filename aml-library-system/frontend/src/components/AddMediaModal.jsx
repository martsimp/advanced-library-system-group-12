import React, { useState, useEffect } from 'react';
import { Button } from "./ui/Button"

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

  // Function to fetch media information based on media name
  const fetchMediaInfo = async (name) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/mediaInfo/${encodeURIComponent(name)}`);
      
      if (response.ok) {
        const data = await response.json();
        setAvailableQuantity(data.total_copies); 
        setMediaError(''); 
      } else {
        setMediaError('Media not found'); 
        setAvailableQuantity(0); 
      }
    } catch (error) {
      console.error('Error fetching media info:', error); 
      setMediaError('Error fetching media information');
      setAvailableQuantity(0);
    }
  };


  if (!isOpen) return null;

  // Handle the button for Add Media
  const handleAdd = async () => {
    let hasError = false;

    // Validation for branch selection
    if (!selectedBranch) {
      setBranchError('Please select a branch.');
      hasError = true;
    } else {
      setBranchError('');
    }

    // Validation for quantity input
    if (quantity <= 0 || quantity > availableQuantity) {
      setQuantityError(`Quantity must be between 1 and ${availableQuantity}.`);
      hasError = true;
    } else {
      setQuantityError('');
    }

    // Validation for media name
    if (!mediaName.trim()) {
      setMediaError('Please enter a media name.');
      hasError = true;
    } else {
      setMediaError('');
    }

    // If no errors, proceed to add the media
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
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Media</h2>
        <div className="border px-3 py-2">
          {/* Media Name Input */}
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

          {/* Quantity Input */}
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

          {/* Branch Selection */}
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

          {/* Modal Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={onClose} 
              className="px-4 rounded hover:bg-gray-100"
              variant="outline"
            >
              Cancel
            </Button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
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
