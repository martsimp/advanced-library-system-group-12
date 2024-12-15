import React, { useState, useEffect } from 'react';
import TransferModal from './TransferModal';
import { Mic } from 'lucide-react';
import { Button } from './ui/Button'; 
import { Input } from './ui/Input';

const MediaTable = ({ mediaList, branches, onTransfer, currentBranch }) => {
  const [filteredMedia, setFilteredMedia] = useState(mediaList);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

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
    setSelectedMedia(media);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };
  

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const cleanedTranscript = transcript.replace(/\.$/, '');
        setSearchTerm(cleanedTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.log('Web Speech API is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-full max-w-2xl flex items-center gap-2 transition-all duration-300 focus-within:max-w-full">
          <Input
            type="text"
            placeholder="Search media by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pr-10"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label="Search media by name"
          />
          {'webkitSpeechRecognition' in window && (
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`text-white ${
                isListening ? 'bg-red-600 hover:bg-red-700 opacity-80' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              aria-label={isListening ? "Stop voice search" : "Start voice search"}
            >
              <Mic className="h-4 w-4 mr-2" />
            </Button>
          )}
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-2 py-2"
          aria-label="Sort media by quantity"
        >
          <option value="asc">Sort by Lowest Copies</option>
          <option value="desc">Sort by Highest Copies</option>
        </select>
      </div>

      <div className="p-4 bg-white shadow-md" role="region" aria-labelledby="media-inventory-heading">
        <h2 id="media-inventory-heading" className="text-lg font-semibold text-gray-700 mb-4">Media Inventory</h2>
        <p className="mb-4" aria-live="polite">Select "Transfer" to send a media to another branch.</p>
        <div className="bg-white shadow-md rounded-md overflow-hidden border">
          <table className="min-w-full bg-white" aria-label="Media inventory table">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-gray-500 text-left" scope="col">Media Name</th>
                <th className="px-4 py-2 text-gray-500" scope="col">Total Quantity</th>
                <th className="px-4 py-2 w-52 text-gray-500" scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.length > 0 ? (
                filteredMedia.map((media) => (
                  <tr key={`${currentBranch.id}-${media.media_id}`} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-2" aria-label={`Media name: ${media.media_name}`}>{media.media_name}</td>
                    <td className="border-b px-4 py-2 text-center" aria-label={`Quantity available: ${media.quantity}`}>{media.quantity}</td>
                    <td className="border-b px-4 py-2 text-center">
                      <Button
                        className={`w-32 px-4 py-2 transition duration-300 ${
                          media.quantity === 0 ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                        onClick={() => {
                          if (media.quantity > 0) {
                            handleOpenModal(media);
                          }
                        }}
                        disabled={media.quantity === 0}
                        aria-label={`Transfer ${media.media_name}`}
                      >
                        {media.quantity === 0 ? 'Unavailable' : 'Transfer'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border px-4 py-2 text-center" aria-live="assertive">
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
