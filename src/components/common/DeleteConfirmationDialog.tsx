import {
  Dialog,
  IconButton,
} from '@chakra-ui/react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Content
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        maxW="md"
      >
        <Dialog.Header>
          <Dialog.Title color="black">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <p>{description}</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <IconButton variant="outline" onClick={onClose} px={4} py={2}>
              {cancelText}
            </IconButton>
          </Dialog.ActionTrigger>
          <IconButton colorPalette="red" onClick={onConfirm} px={4} py={2}>
            {confirmText}
          </IconButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}