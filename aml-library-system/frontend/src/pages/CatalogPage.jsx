import { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, ArrowLeft } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Link } from 'react-router-dom';

export default function CatalogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [genre, setGenre] = useState('all');
    const [format, setFormat] = useState('all');
    const [status, setStatus] = useState('all');
    const [sortBy, setSortBy] = useState('title');
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        genres: [],
        formats: [],
        statuses: []
    });

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory/filters`);
            const data = await response.json();
            setFilterOptions(data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        setHasSearched(true);
        try {
            const params = new URLSearchParams({
                ...(searchQuery && { q: searchQuery }),
                ...(genre !== 'all' && { genre }),
                ...(format !== 'all' && { format }),
                ...(status !== 'all' && { status }),
                ...(sortBy && { sortBy })
            });

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inventory/search?${params}`);
            const data = await response.json();
            setMedia(data);
        } catch (error) {
            console.error('Error searching media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link 
                            to="/dashboard" 
                            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Library Catalog</h1>

                {/* Search and Filters Card */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Search Input */}
                        <div className="lg:col-span-2">
                            <label htmlFor="searchQuery" className="sr-only">
                                Search by title, author, or description
                            </label>
                            <Input
                                id="searchQuery"
                                placeholder="Search by title, author, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full"
                                aria-labelledby="searchQuery"
                            />
                        </div>

                        {/* Genre Filter */}
                        <Select value={genre} onValueChange={setGenre} aria-label="Select Genre">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genres</SelectItem>
                                {filterOptions.genres.map((g) => (
                                    <SelectItem key={g} value={g} aria-label={`Genre: ${g}`}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Format Filter */}
                        <Select value={format} onValueChange={setFormat} aria-label="Select Format">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Formats</SelectItem>
                                {filterOptions.formats.map((f) => (
                                    <SelectItem key={f} value={f} aria-label={`Format: ${f}`}>{f}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={status} onValueChange={setStatus} aria-label="Select Status">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {filterOptions.statuses.map((s) => (
                                    <SelectItem key={s} value={s} aria-label={`Status: ${s}`}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort By */}
                        <Select value={sortBy} onValueChange={setSortBy} aria-label="Sort By">
                            <SelectTrigger>
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">Title</SelectItem>
                                <SelectItem value="author">Author</SelectItem>
                                <SelectItem value="publication_year">Publication Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-end">
                        <Button 
                            onClick={handleSearch} 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            {loading ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                </section>

                {/* Results Grid */}
                {media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {media.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                <MediaCard media={item} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty States */}
                {media.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        {hasSearched ? (
                            <>
                                <p className="text-xl font-semibold text-gray-900">No results found</p>
                                <p className="text-gray-500 mt-2">Try adjusting your search criteria or filters</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xl font-semibold text-gray-900">Start exploring our collection</p>
                                <p className="text-gray-500 mt-2">
                                    Use the search bar and filters above to discover books, music, and more
                                </p>
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* For NoScript Support */}
            <noscript>
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-xl font-semibold text-gray-900">JavaScript is required to view this page properly.</p>
                </div>
            </noscript>
        </div>
    );
}
