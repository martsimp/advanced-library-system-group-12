import React, { useState } from 'react';

const TransferModal = ({ show, onClose, onTransfer, branches, mediaItem }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [transferQty, setTransferQty] = useState(1);
  const [branchError, setBranchError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  if (!show) return null; 

  // Validate form before transferring
  const handleTransfer = () => {
    let hasError = false;

    // Validate selected branch
    if (!selectedBranch) {
      setBranchError('Please select a branch.');
      hasError = true;
    } else {
      setBranchError('');
    }

    // Validate transfer quantity
    const maxQuantity = mediaItem?.quantity || 0;
    if (transferQty <= 0 || transferQty > maxQuantity) {
      setQuantityError(`Quantity must be between 1 and ${maxQuantity}.`);
      hasError = true;
    } else {
      setQuantityError('');
    }

    // Ensure mediaItem is valid
    if (!mediaItem?.media_id) {
      console.error('Invalid media item:', mediaItem);
      return;
    }

    // If there are no errors, proceed with the transfer
    if (!hasError) {
      console.log('Transferring media:', {
        mediaId: mediaItem.media_id,
        targetBranch: selectedBranch,
        quantity: transferQty,
      });

      // Call onTransfer prop to handle the actual transfer
      onTransfer(mediaItem.media_id, selectedBranch, transferQty);

      setSelectedBranch('');
      setTransferQty(1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Transfer Media</h2>

        {/* Media Information */}
        <div className="border px-3 py-2">
          <p className="mb-4">
            <strong>Title:</strong> {mediaItem?.media_name || 'Loading...'}
          </p>

          {/* Quantity Input */}
          <div className="mb-4">
            <label className="block mb-2">Quantity to Transfer:</label>
            <input
              type="number"
              min="1"
              max={mediaItem?.quantity || 1}
              value={transferQty}
              onChange={(e) => setTransferQty(parseInt(e.target.value, 10))}
              className={`w-full border rounded px-3 py-2 ${
                quantityError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {quantityError && <p className="text-red-500 text-sm">{quantityError}</p>}
          </div>

          {/* Branch Selection */}
          <div className="mb-4">
            <label className="block mb-2">Select Branch:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${
                branchError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">--Select Branch--</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {branchError && <p className="text-red-500 text-sm">{branchError}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                // Reset form and close modal
                setSelectedBranch('');
                setTransferQty(1);
                onClose();
              }}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
