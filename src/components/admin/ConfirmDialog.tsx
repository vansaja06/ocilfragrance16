"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Yakin ingin menghapus?",
  description = "Tindakan ini tidak dapat dibatalkan.",
  confirmLabel = "Hapus",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-[28px] p-6 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-full px-6"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>

          <Button
            type="button"
            disabled={loading}
            className="h-12 rounded-full bg-red-500 px-6 text-white hover:bg-red-600"
            onClick={onConfirm}
          >
            {loading ? "Menghapus…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
