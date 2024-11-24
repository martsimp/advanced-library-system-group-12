import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MediaTable from '../components/MediaTable';
import AddMediaModal from '../components/AddMediaModal';
import axios from 'axios';
import { BiTransfer } from 'react-icons/bi';
import { FaBoxes } from 'react-icons/fa';
import { HiOutlineHome } from 'react-icons/hi';

const TransferPage = () => {
  const [mediaList, setMediaList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

// Handles user logout by redirecting to the login page
  const handleLogout = () => {
    navigate('/login');
  };

  // Fetches branches and media data when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/media`);
        setBranches(response.data.branches);
        setCurrentBranch(response.data.branches[0]);
        setMediaList(response.data.media);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Updates the media list when a different branch is selected
  const handleBranchChange = async (branch) => {
    if (!branch.id) {
      console.error('Branch ID is undefined');
      return;
    }
    setCurrentBranch(branch);
    setIsLoading(true);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/branch/${branch.id}`);
      setMediaList(response.data.media);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch branch data');
      setIsLoading(false);
    }
  };

  // Transfer the media between branches
  const handleTransfer = async (mediaId, toBranchId, quantity) => {
    if (!mediaId) {
      setError('Invalid media ID');
      return;
    }
    try {
      const branchId = Number(toBranchId);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/transfer`, {
        mediaId,
        fromBranchId: currentBranch.id,
        toBranchId: branchId,
        quantity,
      });
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/branch/${currentBranch.id}`);
      setMediaList(response.data.media); 
    } catch (err) {
      setError('Failed to transfer media');
    }
  };

  // Handles adding new media to the specific branch
  const handleAddMedia = async (mediaName, quantity, branchName) => {
    try {
      const requestData = {
        mediaName,
        quantity,
        branchName
      };
      console.log('Sending add media request:', requestData);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/addMedia`, requestData);
      // Refresh the media list after adding
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mediaTransfer/branch/${currentBranch.id}`);
      setMediaList(response.data.media);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add media:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.error : 'Failed to add media');
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="p-5 space-y-2">
          <h1 className="text-2xl font-bold mb-4">WELCOME BACK</h1>

          {/* Sidebar links */}
          <Link to="/transfer" className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-200 border ${location.pathname === '/transfer' ? 'bg-gray-300' : ''}`}>
            <BiTransfer className="text-xl" />
            <span>Transfer Media</span>
          </Link>
          <Link to="/inventory" className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-200 border ${location.pathname === '/inventory' ? 'bg-gray-300' : ''}`}>
            <FaBoxes className="text-xl" />
            <span>Manage Inventory</span>
          </Link>
          <Link to="/branches" className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-200 border ${location.pathname === '/branches' ? 'bg-gray-300' : ''}`}>
            <HiOutlineHome className="text-xl" />
            <span>View Branches</span>
          </Link>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-64 p-5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded transition-colors duration-200 border">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 overflow-y-auto">
        <div className="mx-auto">

          {/* Branch selection */}
          <h1 className="text-2xl font-bold mb-4">{currentBranch ? currentBranch.name : 'Select a Branch'}</h1>
          <div className="flex space-x-2 mb-4">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleBranchChange(branch)}
                className={`w-full px-4 py-4 rounded ${currentBranch && currentBranch.id === branch.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {branch.name}
              </button>
            ))}
          </div>

            {/* Media inventory header and Add Media button */}
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold">Media Inventory</h4>
            <button onClick={() => setShowAddModal(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Add Media
            </button>
          </div>

          {/* Media table component */}
          <MediaTable
            mediaList={mediaList}  
            branches={branches.filter(b => b.id !== currentBranch.id)}
            onTransfer={handleTransfer}
            currentBranch={currentBranch}
          />
        </div>
      </main>

      {/* Add Media Modal */}
      {showAddModal && (
        <AddMediaModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMedia}
          branches={branches}
        />
      )}
    </div>
  );
};

export default TransferPage;

