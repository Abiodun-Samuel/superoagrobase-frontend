import Button from '@/components/ui/Button';
import { DeleteConfirmation } from '@/components/ui/DeleteConfirmation';
import Modal from '@/components/ui/modal/Modal';
import React from 'react';

export default function DeleteConfirmationModal({
  title = 'Delete Record',
  description = 'Are you sure you want to delete this attendance record? This action cannot be undone.',
  isOpen,
  isLoading = false,
  isSuccess = false,
  onClose,
  onConfirm,
}) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <DeleteConfirmation isSuccess={isSuccess} description={description} />
        {!isSuccess && (
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              loading={isLoading}
              size="sm"
              variant="danger"
              onClick={onConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
