import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface DeletePerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  perfumeName: string;
  isLoading: boolean;
}

const DeletePerfumeModal = ({
  isOpen,
  onClose,
  onConfirm,
  perfumeName,
  isLoading,
}: DeletePerfumeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete the perfume{" "}
            <span className="font-bold">{perfumeName}</span>. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? <Spinner className="mr-2" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePerfumeModal;
