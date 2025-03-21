import React from "react";
import { CoinsIcon, CheckIcon, XIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "../ui/dialog";
import { Button } from "../ui/button";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: number;
    title: string;
    image: string;
    price: number;
    description?: string;
  };
  onConfirm: () => void;
}

export const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
  isOpen,
  onOpenChange,
  item,
  onConfirm
}) => {
  // Format title with proper capitalization for display
  const formattedTitle = item.title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl tracking-wide">Confirm Purchase</DialogTitle>
          <DialogDescription>
            You are about to purchase the following item:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Item image and details */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-md overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white [font-family:'Good_Times-Book',Helvetica]">
                {formattedTitle}
              </h3>
              <div className="flex items-center mt-2">
                <CoinsIcon className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-white font-bold">{item.price}</span>
              </div>
            </div>
          </div>

          {/* Item description */}
          <div className="bg-[#2a2a2a] p-4 rounded-md">
            <p className="text-white/80">
              {item.description || `Get access to ${item.title} and enhance your gaming experience.`}
            </p>
            <p className="text-white/70 text-sm mt-2">
              This purchase will be made using your in-game currency.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-red-500/50 hover:bg-red-900/20 hover:text-white text-red-400"
            >
              <XIcon className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={onConfirm}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            Confirm Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseConfirmationModal;
