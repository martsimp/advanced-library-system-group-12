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
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Add h-full to ensure full height */}
      <aside className="w-64 bg-white shadow-md h-full fixed">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">AML Member</h2>
        </div>
        <nav className="mt-6">
          <Link to="/catalog" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <Book className="inline-block mr-2" />
            Search Catalog
          </Link>
          <Link to="/my-borrowings" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <CheckCircle className="inline-block mr-2" />
            My Borrowings
          </Link>
          <Link to="/my-reservations" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <Clock className="inline-block mr-2" />
            My Reservations
          </Link>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <Calendar className="inline-block mr-2" />
            Reading History
          </a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <Library className="inline-block mr-2" />
            Branch Locations
          </a>
        </nav>
      </aside>

      {/* Main Content - Add margin-left to account for fixed sidebar */}
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{welcomeMessage}</h1>
          <div className="flex items-center gap-4 relative z-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white border-gray-200 hover:bg-gray-100"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {borrowedBooks.length > 0 ? (
                  borrowedBooks.map(book => (
                    <DropdownMenuItem key={book.transaction_id}>
                      <span className="text-sm">
                        "{book.title}" is due in {Math.ceil((new Date(book.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="bg-white border-gray-200 hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-white"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Search className="mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Member Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Current Borrowings</CardTitle>
              <CardDescription>Books you currently have checked out</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{borrowingStats.totalBorrowings}</p>
              <p className="text-sm text-gray-500 mt-2">
                {borrowingStats.dueSoon} due within a week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Active Reservations</CardTitle>
              <CardDescription>Books you've reserved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{reservationStats.totalReservations}</p>
              <p className="text-sm text-gray-500 mt-2">{reservationStats.readyForPickup} ready for pickup</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Reading History</CardTitle>
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
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Currently Borrowed Books</CardTitle>
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
                      <Badge variant="secondary">Due in {Math.ceil((new Date(book.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days</Badge>
                      <Button size="sm">Renew</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Current Reservations */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Current Reservations</CardTitle>
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
                        <Button size="sm" variant="outline">
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
      </main>
    </div>
  )
}