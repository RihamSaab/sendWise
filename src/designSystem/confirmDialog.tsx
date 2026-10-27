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
  background: rgb(20 28 23 / 55%);
`;

const StyledConfirmDialog_Panel = styled.section`
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
`;

const StyledConfirmDialog_Title = styled.h2`
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledConfirmDialog_Description = styled.p`
  margin: 0 0 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
`;

const StyledConfirmDialog_Error = styled.p`
  margin: 0 0 16px;
  color: var(--color-error);
  font-size: 13px;
  line-height: 1.5;
`;

const StyledConfirmDialog_Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const StyledConfirmDialog_CancelButton = styled.button`
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-background);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StyledConfirmDialog_ConfirmButton = styled.button`
  min-height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: var(--color-error);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
