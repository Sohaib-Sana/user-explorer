"use client"

import { createToaster, Portal, Spinner, Stack, Toast, Toaster } from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const AppToaster = () => {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            width={{ base: "90vw", md: "320px" }}
            minH="48px"
            p={2}
            borderRadius="md"
            boxShadow="lg"
            borderWidth="1px"
            borderColor="gray.200"
          >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  )
}