"use client";

import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 46px;
  padding: 0 var(--spacing-md);
  border: var(--stroke) solid
    ${({ $hasError }) =>
      $hasError ? "var(--color-error)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-base);
  outline: none;
  transition:
    border-color var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? "var(--color-error)" : "var(--color-primary)"};
    box-shadow: 0 0 0 3px rgb(36 75 59 / 10%);
  }
`;

export const Hint = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  line-height: 1.5;
`;

export const ErrorText = styled.p`
  margin: 0;
  color: var(--color-error);
  font-size: var(--text-xs);
`;

export const SubmitButton = styled.button`
  margin-top: var(--spacing-sm);
  min-height: 48px;
  padding: 0 var(--spacing-lg);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-primary);
  box-shadow: var(--specular-top-dark), var(--elevation-1);
  color: var(--color-text-on-primary);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition:
    transform var(--dur-base) var(--ease-silk),
    background var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: var(--gradient-primary-hover);
    box-shadow: var(--specular-top-dark), var(--elevation-2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormError = styled.p`
  margin: 0;
  padding: 10px var(--spacing-md);
  border-radius: var(--radius-md);
  background: rgb(176 69 69 / 8%);
  color: var(--color-error);
  font-size: var(--text-sm);
  line-height: 1.5;
`;
