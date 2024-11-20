import { useState, useEffect } from 'react';
import { Book, ArrowLeft, Calendar } from 'lucide-react';
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

export default function MyBorrowingsPage() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/user/${currentUser.uid}/current`);
        if (!response.ok) {
          throw new Error('Failed to fetch borrowed books');
        }
        const data = await response.json();
        setBorrowedBooks(data);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, [currentUser]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with back button */}
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
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Borrowings</h1>
        {/* Current Borrowings */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
            <CardDescription>Manage your current loans and due dates</CardDescription>
          </CardHeader>
          <CardContent>
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Book className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>You don't have any books checked out</p>
                <p className="text-sm mt-1">Visit our catalog to find your next read!</p>
                <Link to="/catalog">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {borrowedBooks.map(book => (
                  <div 
                    key={book.transaction_id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Book className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                        <div className="mt-2 space-x-2">
                          <Badge variant="secondary">
                            Due in {Math.ceil((new Date(book.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(book.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      <Button size="sm">Renew</Button>
                      <Button size="sm" variant="outline">Return</Button>
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