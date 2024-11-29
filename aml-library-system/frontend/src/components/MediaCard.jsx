import {useEffect, useState} from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Book } from 'lucide-react';
import BorrowModal from './BorrowModal';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export default function MediaCard({ media }) {
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [reservedHere, setReservedHere] = useState(false);

    const fetchBranches = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/media`);
            const data = await response.json();
            setBranches(data.branches);
        } catch (error) {
            setError('Failed to fetch branches');
        }
    };

    const handleReserve = async () => {
        if (!currentUser || !selectedBranch) return;

        setLoading(true);
        try {
            // Get user ID first
            const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}`);
            const userData = await userResponse.json();

            // Create reservation
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: currentUser.uid,
                    media_id: media.id,
                    branch_id: selectedBranch
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create reservation');
            }

            setShowReserveModal(false);
            setSelectedBranch('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}`);
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await userResponse.json();

                const params = new URLSearchParams({ "mediaId": media.id });
                const reservationsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/user/${userData.id}/current?${params}`);
                if (!reservationsResponse.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                const reservationsData = await reservationsResponse.json();
                setReservations(reservationsData);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchReservations();
        }
    }, [currentUser, media]);

    // Check if the user has a reservation active at the selected branch
    const checkReservedAtSelectedBranch = () => {
        setReservedHere(reservations.some(r => r.branch_id === parseInt(selectedBranch)));
    }

    return (
        <Card className="w-full h-full">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <Book className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{media.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">by {media.author}</p>
                        <div className="mt-3 space-y-2">
                            {media.genre && (
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                    {media.genre}
                                </span>
                            )}
                            {media.format && (
                                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded ml-2">
                                    {media.format}
                                </span>
                            )}
                            {media.status && (
                                <span className={`inline-block text-xs px-2 py-1 rounded ml-2 ${
                                    media.status === 'available' 
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {media.status}
                                </span>
                            )}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            {media.status === 'available' ? (
                                <Button 
                                    onClick={() => setShowBorrowModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                >
                                    Borrow
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => {
                                        fetchBranches();
                                        setShowReserveModal(true);
                                    }}
                                    variant="outline"
                                    className="border-blue-200 hover:bg-blue-50 text-blue-600"
                                >
                                    Reserve
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            <BorrowModal
                show={showBorrowModal}
                onClose={() => setShowBorrowModal(false)}
                mediaItem={media}
            />

            <Dialog open={showReserveModal} onOpenChange={() => setShowReserveModal(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reserve {media.title}</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Branch for Reservation
                            </label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => {setSelectedBranch(e.target.value); checkReservedAtSelectedBranch(); }}
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

                        {error && (
                            <p className="text-sm text-red-600 mb-4">
                                {error}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowReserveModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReserve}
                            disabled={loading || !selectedBranch || reservedHere }
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? 'Reserving...' : 'Confirm Reservation'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
} 