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
import { RenewalModal } from '../components/RenewalModal';

export default function MyBorrowingsPage() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        const borrowingsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/user/${userData.id}/current`);
        if (!borrowingsResponse.ok) {
          throw new Error('Failed to fetch borrowed books');
        }
        const borrowingsData = await borrowingsResponse.json();
        setBorrowedBooks(borrowingsData);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchBorrowedBooks();
    }
  }, [currentUser]);

  const handleRenewalClick = (book) => {
    setSelectedBook(book);
    setIsRenewalModalOpen(true);
  };

  const handleRenewalComplete = (transactionId, newDueDate) => {
    console.log('Updating book with transaction ID:', transactionId);
    setBorrowedBooks(books => 
      books.map(book => 
        book.transaction_id === transactionId 
          ? { ...book, due_date: newDueDate }
          : book
      )
    );
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8" role="main" aria-label="My Borrowings">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Borrowings</h1>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2" aria-label="Return to Dashboard">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="bg-white shadow-lg" role="region" aria-labelledby="borrowings-title">
          <CardHeader>
            <CardTitle id="borrowings-title">My Borrowed Books</CardTitle>
            <CardDescription>Manage your current loans and view due dates</CardDescription>
          </CardHeader>
          <CardContent>
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-6 text-gray-500" role="status" aria-live="polite">
                <Book className="mx-auto h-12 w-12 opacity-30 mb-2" aria-hidden="true" />
                <p>You don't have any books checked out</p>
                <p className="text-sm mt-1">Visit our catalog to find your next read!</p>
                <Link to="/catalog">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" aria-label="Browse Library Catalog">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6" role="list" aria-label="List of borrowed books">
                {borrowedBooks.map(book => (
                  <div 
                    key={book.transaction_id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    role="listitem"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Book className="h-6 w-6 text-gray-600" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-medium">{book.title}</h3>
                        <p className="text-sm text-gray-500">by {book.author}</p>
                        <div className="mt-2 space-x-2">
                          <Badge variant="secondary" role="status" aria-label={`Due in ${Math.ceil((new Date(book.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days`}>
                            Due in {Math.ceil((new Date(book.due_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </Badge>
                          <Badge variant="outline" role="status" aria-label={`Due date: ${new Date(book.due_date).toLocaleDateString()}`}>
                            <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                            {new Date(book.due_date).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleRenewalClick(book)}
                        aria-label={`Renew ${book.title}`}
                      >
                        Renew
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        aria-label={`Return ${book.title}`}
                      >
                        Return
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
            aria-label={`Renew ${selectedBook.title}`}
          />
        )}
      </main>
    </div>
  );
} 