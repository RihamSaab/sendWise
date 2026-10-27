"use client";

import {
  useDeleteTransaction,
  type ApiTransaction,
} from "@/api/transactions";
import ConfirmDialog from "@/designSystem/confirmDialog";

type DeleteTransactionDialogProps = {
  transaction: ApiTransaction;
  onClose: () => void;
};

export default function DeleteTransactionDialog({
  transaction,
  onClose,
}: DeleteTransactionDialogProps) {
  const deleteMutation = useDeleteTransaction();

  function handleConfirm() {
    deleteMutation.mutate(transaction.id, {
      onSuccess: onClose,
    });
  }

  return (
    <ConfirmDialog
      title="Delete this transaction?"
      description={`"${transaction.title}" will be permanently removed. This cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Keep"
      isPending={deleteMutation.isPending}
      errorMessage={
        deleteMutation.error
          ? deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Could not delete this transaction."
          : null
      }
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
