import { useState, useEffect } from 'react';
import { Book, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { LoadingPage } from '../components/ui/spinner';

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        const reservationsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/user/${userData.id}/current`);
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
  }, [currentUser]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              to="/dashboard" 
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Reservations</h1>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Current Reservations</CardTitle>
            <CardDescription>Track and manage your reserved books</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Clock className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>You don't have any active reservations</p>
                <p className="text-sm mt-1">Reserve books from our catalog to see them here</p>
                <Link to="/catalog">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.map(reservation => (
                  <div 
                    key={reservation.reservation_id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Book className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{reservation.title}</h3>
                        <p className="text-sm text-gray-500">by {reservation.author}</p>
                        <div className="mt-2">
                          <Badge variant="secondary">
                            {reservation.status === 'fulfilled' 
                              ? 'Ready for pickup' 
                              : `Queue position: ${reservation.queue_position}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      {reservation.status === 'fulfilled' ? (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Pickup
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Cancel Reservation
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 