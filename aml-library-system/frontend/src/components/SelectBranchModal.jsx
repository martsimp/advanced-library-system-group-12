import React, { useState } from 'react';

export const SelectBranchModal = ({ show, onClose, onSelectBranch, branches }) => {
    const [selectedBranch, setSelectedBranch] = useState('');

    if (!show) return null; // Hide modal if 'show' is false

    const handleClick = () => {
        onSelectBranch(selectedBranch)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Reserve Media</h2>

                {/* Media Information */}
                <div className="border px-3 py-2">
                    {/* Branch Selection */}
                    <div className="mb-4">
                        <label className="block mb-2">Select Branch:</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className={`w-full border rounded px-3 py-2 ${
                                false ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">--Select Branch--</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                // Reset form and close modal
                                setSelectedBranch('');
                                onClose();
                            }}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleClick}
                        >
                            Reserve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
