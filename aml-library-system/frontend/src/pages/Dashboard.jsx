"use client"

import { useState, useEffect } from 'react'
import { Book, Calendar, CheckCircle, Clock, Library, Search, User, Bell, Settings, LogOut } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Badge } from '../components/ui/badge'
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingPage, Spinner } from '../components/ui/spinner';
import { RenewalModal } from '../components/RenewalModal';
import { CancelReservationModal } from '../components/CancelReservationModal';
import { TutorialModal } from '../components/TutorialModal';

export default function MemberDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [borrowingStats, setBorrowingStats] = useState({
    totalBorrowings: 0,
    dueSoon: 0
  });
  const [reservations, setReservations] = useState([]);
  const [reservationStats, setReservationStats] = useState({
    totalReservations: 0,
    readyForPickup: 0
  });
  const [readingHistory, setReadingHistory] = useState({
    currentYearBooks: [],
    lastYearCount: 0
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const calculateBorrowingStats = (books) => {
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const now = new Date();
    
    const stats = {
      totalBorrowings: books.length,
      dueSoon: books.filter(book => {
        const dueDate = new Date(book.due_date);
        const timeUntilDue = dueDate - now;
        return timeUntilDue > 0 && timeUntilDue <= oneWeek;
      }).length
    };

    setBorrowingStats(stats);
  };

  const calculateReservationStats = (reservations) => {
    const stats = {
      totalReservations: reservations.length,
      readyForPickup: reservations.filter(res => res.status === 'fulfilled').length
    };
    setReservationStats(stats);
  };

  const fetchBorrowedBooks = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/user/${userId}/current`)
      if (!response.ok) {
        throw new Error('Failed to fetch borrowed books')
      }
      const data = await response.json()
      setBorrowedBooks(data)
      calculateBorrowingStats(data)
    } catch (error) {
      console.error('Error fetching borrowed books:', error)
    }
  }

  const fetchReservations = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/user/${userId}/current`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      setReservations(data);
      calculateReservationStats(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchReadingHistory = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/user/${userId}/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch reading history');
      }
      const data = await response.json();
      setReadingHistory(data);
    } catch (error) {
      console.error('Error fetching reading history:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser) {
          console.error('No user authenticated');
          return;
        }

        const url = `${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log('Received user data:', data);
        setUserData(data);
        
        if (!data.has_seen_tutorial) {
          setShowTutorial(true);
        }
        
        await fetchBorrowedBooks(data.id);
        await fetchReservations(data.id);
        await fetchReadingHistory(data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // If the initial loading is happening, show the full-page loader
  if (loading) {
    return <LoadingPage />;
  }

  // Replace the hardcoded welcome message
  const welcomeMessage = loading 
    ? 'Loading...' 
    : userData 
    ? `Welcome, ${userData.name}` 
    : 'Welcome'

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The PrivateRoute will automatically redirect to login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const MAX_DISPLAY_ITEMS = 2; // Number of items to show before "View More"
  
  const handleRenewalClick = (book) => {
    setSelectedBook(book);
    setIsRenewalModalOpen(true);
  };

  const handleRenewalComplete = (transactionId, newDueDate) => {
    setBorrowedBooks(books => 
      books.map(book => 
        book.transaction_id === transactionId 
          ? { ...book, due_date: newDueDate }
          : book
      )
    );
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/cancel`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      setReservations(prevReservations => 
        prevReservations.filter(res => res.reservation_id !== reservationId)
      );
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to catalog page with search query as URL parameter
    navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Add h-full to ensure full height */}
      <aside className="w-64 bg-white shadow-md h-full fixed" role="navigation" aria-label="Main navigation">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">AML Member</h2>
        </div>
        <nav className="mt-6">
          <Link to="/catalog" className="block py-2 px-4 text-gray-700 hover:bg-gray-200" aria-label="Search Library Catalog">
            <Book className="inline-block mr-2" aria-hidden="true" />
            Search Catalog
          </Link>
          <Link to="/my-borrowings" className="block py-2 px-4 text-gray-700 hover:bg-gray-200" aria-label="View My Borrowings">
            <CheckCircle className="inline-block mr-2" aria-hidden="true" />
            My Borrowings
          </Link>
          <Link to="/my-reservations" className="block py-2 px-4 text-gray-700 hover:bg-gray-200" aria-label="View My Reservations">
            <Clock className="inline-block mr-2" aria-hidden="true" />
            My Reservations
          </Link>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200" aria-label="View Reading History">
            <Calendar className="inline-block mr-2" aria-hidden="true" />
            Reading History
          </a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200" aria-label="View Branch Locations">
            <Library className="inline-block mr-2" aria-hidden="true" />
            Branch Locations
          </a>
        </nav>
      </aside>

      {/* Main Content - Add margin-left to account for fixed sidebar */}
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{welcomeMessage}</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={handleLogout} variant="outline" size="sm" aria-label="Log out of your account">
                Log Out
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8" role="search">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search the catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-white"
              aria-label="Search the library catalog"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" aria-label="Perform search">
              <Search className="h-4 w-4 mr-2" aria-hidden="true" />
              Search
            </Button>
          </div>
        </form>

        {/* Member Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="region" aria-label="Dashboard Overview">
          <Card className="bg-white shadow-lg" role="region" aria-labelledby="borrowings-title">
            <CardHeader>
              <CardTitle id="borrowings-title">Current Borrowings</CardTitle>
              <CardDescription>Books you currently have checked out</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{borrowingStats.totalBorrowings}</p>
              <p className="text-sm text-gray-500 mt-2">
                {borrowingStats.dueSoon} due within a week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg" role="region" aria-labelledby="reservations-title">
            <CardHeader>
              <CardTitle id="reservations-title">Active Reservations</CardTitle>
              <CardDescription>Books you've reserved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{reservationStats.totalReservations}</p>
              <p className="text-sm text-gray-500 mt-2">{reservationStats.readyForPickup} ready for pickup</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg" role="region" aria-labelledby="history-title">
            <CardHeader>
              <CardTitle id="history-title">Reading History</CardTitle>
              <CardDescription>Books you've read this year</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{readingHistory.currentYearBooks.length}</p>
              <p className="text-sm text-gray-500 mt-2">
                {readingHistory.currentYearBooks.length > readingHistory.lastYearCount
                  ? `${readingHistory.currentYearBooks.length - readingHistory.lastYearCount} more than last year`
                  : readingHistory.currentYearBooks.length < readingHistory.lastYearCount
                  ? `${readingHistory.lastYearCount - readingHistory.currentYearBooks.length} less than last year`
                  : 'Same as last year'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Borrowed Books */}
        <Card className="mt-6 bg-white shadow-lg" role="region" aria-labelledby="current-books-title">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle id="current-books-title">Currently Borrowed Books</CardTitle>
              <CardDescription>Manage your current loans</CardDescription>
            </div>
            {borrowedBooks.length > MAX_DISPLAY_ITEMS && (
              <Link to="/my-borrowings">
                <Button variant="outline" size="sm">
                  View All ({borrowedBooks.length})
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Book className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>You don't have any books checked out</p>
                <p className="text-sm mt-1">Visit our catalog to find your next read!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {borrowedBooks.slice(0, MAX_DISPLAY_ITEMS).map(book => (
                  <li key={book.transaction_id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Book className="mr-2" />
                      <span>{book.title} by {book.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Due in {Math.ceil((new Date(book.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                      <Button 
                        size="sm"
                        onClick={() => handleRenewalClick(book)}
                        aria-label={`Renew ${book.title}`}
                      >
                        Renew
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Current Reservations */}
        <Card className="mt-6 bg-white shadow-lg" role="region" aria-labelledby="reservations-list-title">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle id="reservations-list-title">Current Reservations</CardTitle>
              <CardDescription>Manage your reservations</CardDescription>
            </div>
            {reservations.length > MAX_DISPLAY_ITEMS && (
              <Link to="/my-reservations">
                <Button variant="outline" size="sm">
                  View All ({reservations.length})
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Clock className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>You don't have any active reservations</p>
                <p className="text-sm mt-1">Reserve books from our catalog to see them here</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {reservations.slice(0, MAX_DISPLAY_ITEMS).map(reservation => (
                  <li key={reservation.reservation_id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Book className="mr-2" />
                      <span>{reservation.title} by {reservation.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {reservation.status === 'fulfilled' 
                            ? 'Ready for pickup' 
                            : `Queue position: ${reservation.queue_position}`}
                      </Badge>
                      {reservation.status === 'fulfilled' ? (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Pickup
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setIsCancelModalOpen(true);
                          }}
                          aria-label={`Cancel reservation for ${reservation.title}`}
                        >
                          Cancel Reservation
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Reading History */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
            <CardDescription>Books you've completed this year</CardDescription>
          </CardHeader>
          <CardContent>
            {readingHistory.currentYearBooks.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Book className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>No books completed this year yet</p>
                <p className="text-sm mt-1">Your finished books will appear here</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {readingHistory.currentYearBooks.map(book => (
                  <li key={book.transaction_id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Book className="mr-2" />
                      <span>{book.title} by {book.author}</span>
                    </div>
                    <Badge variant="secondary">
                      Completed {new Date(book.return_date).toLocaleDateString()}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* RenewalModal */}
        {selectedBook && (
          <RenewalModal
            book={selectedBook}
            isOpen={isRenewalModalOpen}
            onClose={() => {
              setIsRenewalModalOpen(false);
              setSelectedBook(null);
            }}
            onRenew={handleRenewalComplete}
          />
        )}

        {selectedReservation && (
          <CancelReservationModal
            reservation={selectedReservation}
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setSelectedReservation(null);
            }}
            onConfirm={handleCancelReservation}
          />
        )}

        {/* Tutorial Modal */}
        <TutorialModal 
          isOpen={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />
      </main>
    </div>
  )
}