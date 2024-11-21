import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/Button";
import { AlertTriangle } from "lucide-react";

export function CancelReservationModal({ reservation, isOpen, onClose, onConfirm }) {
  const handleCancel = async () => {
    await onConfirm(reservation.reservation_id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Cancel Reservation
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your reservation for "{reservation?.title}"?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-500">
            This action cannot be undone. You will lose your current queue position if you decide to reserve this book again.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Keep Reservation</Button>
          <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
            Cancel Reservation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 