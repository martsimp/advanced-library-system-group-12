import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/Button';
import toast from 'react-hot-toast';

const TransferModal = ({ show, onClose, onTransfer, branches, mediaItem }) => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [transferQty, setTransferQty] = useState(1);
  const [branchError, setBranchError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!show) return null;

  const handleTransfer = () => {
    let hasError = false;

    if (!selectedBranch) {
      setBranchError('Please select a branch.');
      hasError = true;
    } else {
      setBranchError('');
    }

    const maxQuantity = mediaItem?.quantity || 0;
    if (transferQty <= 0 || transferQty > maxQuantity) {
      setQuantityError(`Quantity must be between 1 and ${maxQuantity}.`);
      hasError = true;
    } else {
      setQuantityError('');
    }

    if (!mediaItem?.media_id) {
      console.error('Invalid media item:', mediaItem);
      return;
    }

    if (!hasError) {
      setShowConfirmation(true);
    }
  };

  const confirmTransfer = () => {
    onTransfer(mediaItem.media_id, selectedBranch, transferQty);
    setShowConfirmation(false);
    setSelectedBranch('');
    setTransferQty(1);
    setShowSuccessMessage(true);
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Transfer Media</h2>

        <div className="border px-3 py-2">
          <p className="mb-4">
            <strong>Title:</strong> {mediaItem?.media_name || 'Loading...'}
          </p>

          <div className="mb-4">
            <label htmlFor="transferQty" className="block mb-2">Quantity to Transfer:</label>
            <input
              id="transferQty"
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

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setSelectedBranch('');
                setTransferQty(1);
                onClose();
              }}
              variant="outline"
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <button
              onClick={handleTransfer}
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to transfer {transferQty} item(s) of "{mediaItem?.media_name}" to
              the selected branch?
            </p>
            <DialogFooter>
              <Button
                className="hover:bg-gray-100"
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <button
                onClick={confirmTransfer}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showSuccessMessage && (
        <Dialog open={showSuccessMessage} onOpenChange={() => setShowSuccessMessage(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Successful</DialogTitle>
            </DialogHeader>
            <p>
              Successfully transferred {transferQty} item(s) of "{mediaItem?.media_name}" to the
              selected branch.
            </p>
            <DialogFooter>
              <Button
                className="hover:bg-gray-100"
                variant="outline"
                onClick={closeSuccessMessage}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransferModal;
