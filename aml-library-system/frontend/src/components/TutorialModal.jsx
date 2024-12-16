import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/Button';

export function TutorialModal({ isOpen, onClose }) {
  const handleClose = async () => {
    try {
      // Update the user's has_seen_tutorial status in the database
      const firebaseUid = localStorage.getItem('firebaseUid');
      await fetch(`${process.env.REACT_APP_API_URL}/api/users/${firebaseUid}/tutorial`, {
        method: 'POST',
      });
      onClose();
    } catch (error) {
      console.error('Error updating tutorial status:', error);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Welcome to AML Library System!</DialogTitle>
          <DialogDescription>
            Watch this quick tutorial to learn how to use our system.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 aspect-video">
          <video
            className="w-full h-full rounded-lg"
            controls
            autoPlay
          >
            <source src="/tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 