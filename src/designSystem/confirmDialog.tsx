"use client";

import { useEffect } from "react";
import styled from "styled-components";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isPending = false,
  errorMessage = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const previousBody = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousBody;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isPending, onCancel]);

  return (
    <StyledConfirmDialog_Overlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onCancel();
        }
      }}
    >
      <StyledConfirmDialog_Panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <StyledConfirmDialog_Title id="confirm-dialog-title">
          {title}
        </StyledConfirmDialog_Title>

        <StyledConfirmDialog_Description>
          {description}
        </StyledConfirmDialog_Description>

        {errorMessage && (
          <StyledConfirmDialog_Error role="alert">
            {errorMessage}
          </StyledConfirmDialog_Error>
        )}

        <StyledConfirmDialog_Actions>
          <StyledConfirmDialog_CancelButton
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </StyledConfirmDialog_CancelButton>

          <StyledConfirmDialog_ConfirmButton
            type="button"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Working..." : confirmLabel}
          </StyledConfirmDialog_ConfirmButton>
        </StyledConfirmDialog_Actions>
      </StyledConfirmDialog_Panel>
    </StyledConfirmDialog_Overlay>
  );
}

const StyledConfirmDialog_Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgb(35 35 39 / 32%);
  backdrop-filter: blur(2px);
`;

const StyledConfirmDialog_Panel = styled.section`
  width: 100%;
  max-width: 440px;
  padding: 32px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  box-shadow: 0 24px 60px rgb(35 35 39 / 12%);
`;

const StyledConfirmDialog_Title = styled.h2`
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 500;
  letter-spacing: -0.02em;
`;

const StyledConfirmDialog_Description = styled.p`
  margin: 0 0 24px;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.65;
`;

const StyledConfirmDialog_Error = styled.p`
  margin: 0 0 20px;
  padding: 10px 12px;
  border: var(--stroke) solid var(--color-error);
  color: var(--color-error);
  font-size: var(--text-sm);
  line-height: 1.5;
`;

const StyledConfirmDialog_Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const StyledConfirmDialog_CancelButton = styled.button`
  min-height: 38px;
  padding: 0 16px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 400;
  cursor: pointer;
  transition: border-color 140ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-text);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StyledConfirmDialog_ConfirmButton = styled.button`
  min-height: 38px;
  padding: 0 16px;
  border: var(--stroke) solid var(--color-error);
  border-radius: var(--radius-sm);
  background: var(--color-error);
  color: var(--color-plate);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    filter 140ms ease,
    transform 140ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
