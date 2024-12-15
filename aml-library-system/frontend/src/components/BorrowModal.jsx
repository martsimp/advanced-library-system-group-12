import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function BorrowModal({ show, onClose, mediaItem }) {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [availability, setAvailability] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        // Fetch branches when modal opens
        if (show) {
            fetchBranches();
        }
    }, [show]);

    useEffect(() => {
        // Check availability when branch is selected
        if (selectedBranch && mediaItem) {
            checkAvailability();
        }
    }, [selectedBranch, mediaItem]);

    const fetchBranches = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/media`);
            const data = await response.json();
            setBranches(data.branches);
        } catch (error) {
            setError('Failed to fetch branches');
        }
    };

    const checkAvailability = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/branch/${selectedBranch}`);
            const data = await response.json();
            const mediaAvailability = data.media.find(m => m.media_id === mediaItem.id);
            setAvailability(mediaAvailability?.quantity || 0);
        } catch (error) {
            setError('Failed to check availability');
        }
    };

    const handleBorrow = async () => {
        if (!currentUser || !mediaItem || !selectedBranch) return;

        setLoading(true);
        try {
            // Get user ID first
            const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}`);
            const userData = await userResponse.json();

            // Borrow the media
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/borrow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.id,
                    mediaId: mediaItem.id,
                    branchId: selectedBranch
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to borrow media');
            }

            toast.success(`Successfully borrowed "${mediaItem.title}"`);
            onClose();
        } catch (error) {
            toast.error('Failed to borrow: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Borrow {mediaItem?.title}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Branch
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="">Select a branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedBranch && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Availability: {availability} copies
                            </p>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 mb-4">
                            {error}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBorrow}
                        disabled={loading || !selectedBranch || availability < 1}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                        {loading ? 'Borrowing...' : 'Borrow'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 