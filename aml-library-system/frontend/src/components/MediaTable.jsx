import React, { useState, useEffect } from 'react';
import TransferModal from './TransferModal';
import { Button } from './ui/Button'; 
import { Input } from './ui/Input';    

const MediaTable = ({ mediaList, branches, onTransfer, currentBranch }) => {
  const [filteredMedia, setFilteredMedia] = useState(mediaList);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let result = [...mediaList];

    if (searchTerm) {
      result = result.filter((media) =>
        media.media_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const quantityA = Number(a.quantity);
      const quantityB = Number(b.quantity);
      return sortOrder === 'asc' ? quantityA - quantityB : quantityB - quantityA;
    });

    setFilteredMedia(result);
  }, [mediaList, searchTerm, sortOrder]);

  const handleOpenModal = (media) => {
    console.log('Selected media:', media);
    setSelectedMedia(media);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex gap-4">
        <Input
          type="text"
          placeholder="Search media by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 bg-white"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border"
        >
          <option value="asc">Sort by Lowest Copies</option>
          <option value="desc">Sort by Highest Copies</option>
        </select>
      </div>

      <div className="p-4 bg-white shadow-md">

        <p className="text-lg font-semibold text-gray-700 mb-4">
          Select "Transfer" to send a media to another branch.
        </p>
        <div className="bg-white shadow-md rounded-md overflow-hidden border">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-gray-500 text-left">Media Name</th>
                <th className="px-4 py-2 text-gray-500">Total Quantity</th>
                <th className="px-4 py-2 w-52 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.length > 0 ? (
                filteredMedia.map((media) => (
                  <tr key={`${currentBranch.id}-${media.media_id}`} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-2">{media.media_name}</td>
                    <td className="border-b px-4 py-2 text-center">{media.quantity}</td>
                    <td className="border-b px-4 py-2 text-center">
                      <Button
                        className={`w-32 px-4 py-2 transition duration-300 ${
                          media.quantity === 0
                            ? 'bg-gray-400 cursor-not-allowed text-white' 
                            : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                        onClick={() => {
                          if (media.quantity > 0) {
                            handleOpenModal(media);
                          }
                        }}
                        disabled={media.quantity === 0}
                      >
                        {media.quantity === 0 ? 'Unavailable' : 'Transfer'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center">
                    No media found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && selectedMedia && (
        <TransferModal
          show={showModal}
          onClose={handleCloseModal}
          onTransfer={onTransfer}
          branches={branches}
          mediaItem={selectedMedia}
        />
      )}
    </div>
  );
};

export default MediaTable;
