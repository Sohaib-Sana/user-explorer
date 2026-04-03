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
  confirmColorPalette?: string;
}

export default function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmColorPalette = 'red',
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
        bg="white"
      >
        <Dialog.Header pb={2}>
          <Dialog.Title color="black">{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body color="gray.700" pt={0} pb={6}>
          <p>{description}</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <IconButton variant="outline" onClick={onClose} px={4} py={2}>
              {cancelText}
            </IconButton>
          </Dialog.ActionTrigger>
          <IconButton colorPalette={confirmColorPalette} onClick={onConfirm} px={4} py={2}>
            {confirmText}
          </IconButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}