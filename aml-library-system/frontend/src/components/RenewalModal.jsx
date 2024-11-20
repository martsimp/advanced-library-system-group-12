import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/Button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export function RenewalModal({ book, isOpen, onClose, onRenew }) {
  const currentDueDate = new Date(book.due_date);
  const newDueDate = new Date(currentDueDate.setDate(currentDueDate.getDate() + 14));

  const handleRenew = async () => {
    try {
      console.log('Renewing book with transaction ID:', book.transaction_id);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/${book.transaction_id}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_due_date: newDueDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to renew book');
      }
      
      const updatedTransaction = await response.json();
      console.log('Renewal successful:', updatedTransaction);
      
      onRenew(book.transaction_id, newDueDate);
      onClose();
    } catch (error) {
      console.error('Error renewing book:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renew Book</DialogTitle>
          <DialogDescription>
            Extend your borrowing period for "{book?.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Current Due Date:</span>
            <span className="font-medium">{format(new Date(book?.due_date), 'PPP')}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">New Due Date:</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-green-600">{format(newDueDate, 'PPP')}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRenew} className="bg-blue-600 hover:bg-blue-700">
            Confirm Renewal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 