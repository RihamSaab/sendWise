"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import styled from "styled-components";

export type GoalFormValues = {
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  notes: string | null;
  is_active: boolean;
};

type GoalModalProps = {
  title: string;
  description: string;
  submitLabel: string;
  initialValues: GoalFormValues;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (values: GoalFormValues) => void;
  onClose: () => void;
};

export default function GoalModal({
  title,
  description,
  submitLabel,
  initialValues,
  isPending,
  errorMessage,
  onSubmit,
  onClose,
}: GoalModalProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<GoalFormValues>({
    defaultValues: initialValues,
  });

  const target = useWatch({ control, name: "target_amount" });

  useEffect(() => {
    const previousBody = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousBody;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isPending, onClose]);

  function submit(values: GoalFormValues) {
    clearErrors();

    if (values.current_amount > values.target_amount) {
      setError("current_amount", {
        type: "validate",
        message: "Current amount cannot exceed the target amount.",
      });
      return;
    }

    onSubmit({
      ...values,
      name: values.name.trim(),
      notes: values.notes?.trim() || null,
      target_date: values.target_date || null,
    });
  }

  return (
    <Overlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <Panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <div>
            <Title id="goal-modal-title">{title}</Title>
            <Description>{description}</Description>
          </div>

          <CloseButton
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            disabled={isPending}
          >
            ×
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit(submit)} noValidate>
          <Field>
            <Label htmlFor="goal-name">Goal name *</Label>
            <Input
              id="goal-name"
              maxLength={150}
              placeholder="e.g. Emergency fund"
              {...register("name", {
                validate: (value) =>
                  value.trim().length > 0 || "Please enter a name.",
              })}
            />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </Field>

          <TwoColumn>
            <Field>
              <Label htmlFor="goal-target">Target amount *</Label>
              <Input
                id="goal-target"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                {...register("target_amount", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value > 0) ||
                    "Enter a target greater than zero.",
                })}
              />
              {errors.target_amount && (
                <ErrorText>{errors.target_amount.message}</ErrorText>
              )}
            </Field>

            <Field>
              <Label htmlFor="goal-current">Already saved</Label>
              <Input
                id="goal-current"
                type="number"
                min="0"
                step="0.01"
                max={target || undefined}
                {...register("current_amount", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value >= 0) ||
                    "Enter zero or more.",
                })}
              />
              {errors.current_amount && (
                <ErrorText>{errors.current_amount.message}</ErrorText>
              )}
            </Field>
          </TwoColumn>

          <Field>
            <Label htmlFor="goal-date">Target date (optional)</Label>
            <Input id="goal-date" type="date" {...register("target_date")} />
          </Field>

          <Field>
            <Label htmlFor="goal-notes">Notes (optional)</Label>
            <TextArea
              id="goal-notes"
              rows={3}
              maxLength={2000}
              {...register("notes")}
            />
          </Field>

          {errorMessage && <ErrorText role="alert">{errorMessage}</ErrorText>}

          <Actions>
            <CancelButton type="button" onClick={onClose} disabled={isPending}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isPending}>
              {isPending ? "Saving..." : submitLabel}
            </SubmitButton>
          </Actions>
        </Form>
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  overflow-y: auto;
  background: rgb(31 36 32 / 45%);
  backdrop-filter: blur(2px);
`;

const Panel = styled.section`
  width: 100%;
  max-width: 520px;
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: var(--spacing-xl);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--elevation-3);

  @media (max-width: 480px) {
    padding: var(--spacing-lg);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.025em;
`;

const Description = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
`;

const CloseButton = styled.button`
  display: grid;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  place-items: center;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-size: var(--text-lg);
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
`;

const inputStyles = `
  width: 100%;
  min-width: 0;
  min-height: 42px;
  padding: 0 var(--spacing-sm);
  box-sizing: border-box;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-base);
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(36 75 59 / 8%);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  padding: var(--spacing-sm);
  resize: vertical;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);

  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: var(--color-error);
  font-size: var(--text-xs);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
`;

const CancelButton = styled.button`
  min-height: 42px;
  padding: 0 var(--spacing-md);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  min-height: 42px;
  padding: 0 var(--spacing-lg);
  border: var(--stroke) solid var(--color-primary);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 150ms ease,
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: var(--color-primary-hover);
    box-shadow: var(--elevation-2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
