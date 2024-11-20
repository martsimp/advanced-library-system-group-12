"use client"

import { useState, useEffect } from 'react'
import { Book, Calendar, CheckCircle, Clock, Library, Search, User, Bell } from 'lucide-react'
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

export default function MemberDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowedBooks, setBorrowedBooks] = useState([])

  const fetchBorrowedBooks = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/user/${userId}/current`)
      if (!response.ok) {
        throw new Error('Failed to fetch borrowed books')
      }
      const data = await response.json()
      setBorrowedBooks(data)
    } catch (error) {
      console.error('Error fetching borrowed books:', error)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const firebaseUid = localStorage.getItem('firebaseUid')
        console.log('Firebase UID from localStorage:', firebaseUid)

        if (!firebaseUid) {
          console.error('No firebase UID found')
          return
        }

        const url = `${process.env.REACT_APP_API_URL}/api/users/${firebaseUid}`
        console.log('Fetching from URL:', url)

        const response = await fetch(url)
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        console.log('Received user data:', data)
        setUserData(data)
        
        await fetchBorrowedBooks(data.id)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Replace the hardcoded welcome message
  const welcomeMessage = loading 
    ? 'Loading...' 
    : userData 
    ? `Welcome, ${userData.name}` 
    : 'Welcome'

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">AML Member</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <Book className="inline-block mr-2" />
            Search Catalog
          </a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <CheckCircle className="inline-block mr-2" />
            My Borrowings
          </a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            <Clock className="inline-block mr-2" />
            My Reservations
          </a>
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{welcomeMessage}</h1>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Bell className="mr-2" />Notifications</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>"1984" is due in 2 days</DropdownMenuItem>
                <DropdownMenuItem>"To Kill a Mockingbird" reservation is ready</DropdownMenuItem>
                <DropdownMenuItem>New arrivals in your favorite genre</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><User className="mr-2" />Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
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
              <p className="text-4xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-500 mt-2">2 due within a week</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Active Reservations</CardTitle>
              <CardDescription>Books you've reserved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">2</p>
              <p className="text-sm text-gray-500 mt-2">1 ready for pickup</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Reading History</CardTitle>
              <CardDescription>Books you've read this year</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">17</p>
              <p className="text-sm text-gray-500 mt-2">5 more than last year</p>
            </CardContent>
          </Card>
        </div>

        {/* Currently Borrowed Books */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Currently Borrowed Books</CardTitle>
            <CardDescription>Manage your current loans</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {borrowedBooks.map(book => (
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
          </CardContent>
        </Card>

        {/* Recommended Books */}
        <Card className="mt-6 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Based on your reading history</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="mr-2" />
                  <span>"Brave New World" by Aldous Huxley</span>
                </div>
                <Button size="sm">Reserve</Button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="mr-2" />
                  <span>"To Kill a Mockingbird" by Harper Lee</span>
                </div>
                <Button size="sm">Reserve</Button>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Book className="mr-2" />
                  <span>"The Catcher in the Rye" by J.D. Salinger</span>
                </div>
                <Button size="sm">Reserve</Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}