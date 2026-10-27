"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import styled from "styled-components";

import type { IncomeFrequency } from "@/api/incomeSources";

export type RecurringItemFormValues = {
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

type RecurringItemModalProps = {
  title: string;
  description: string;
  submitLabel: string;
  initialValues: RecurringItemFormValues;
  isPending: boolean;
  errorMessage: string | null;
  onSubmit: (values: RecurringItemFormValues) => void;
  onClose: () => void;
};

const frequencies: Array<{ value: IncomeFrequency; label: string }> = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "one_time", label: "One-time" },
];

export default function RecurringItemModal({
  title,
  description,
  submitLabel,
  initialValues,
  isPending,
  errorMessage,
  onSubmit,
  onClose,
}: RecurringItemModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecurringItemFormValues>({
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const startDate = useWatch({ control, name: "start_date" });

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

  function submit(values: RecurringItemFormValues) {
    onSubmit({
      ...values,
      name: values.name.trim(),
      notes: values.notes?.trim() || null,
      end_date: values.end_date || null,
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
        aria-labelledby="recurring-item-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <div>
            <Title id="recurring-item-title">{title}</Title>
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
            <Label htmlFor="item-name">Name *</Label>
            <Input
              id="item-name"
              maxLength={150}
              placeholder="e.g. Monthly salary"
              {...register("name", {
                validate: (value) =>
                  value.trim().length > 0 || "Please enter a name.",
              })}
            />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </Field>

          <TwoColumn>
            <Field>
              <Label htmlFor="item-amount">Amount *</Label>
              <Input
                id="item-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                {...register("amount", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value > 0) ||
                    "Enter an amount greater than zero.",
                })}
              />
              {errors.amount && <ErrorText>{errors.amount.message}</ErrorText>}
            </Field>

            <Field>
              <Label htmlFor="item-frequency">Frequency *</Label>
              <Select id="item-frequency" {...register("frequency")}>
                {frequencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </TwoColumn>

          <TwoColumn>
            <Field>
              <Label htmlFor="item-start">Start date *</Label>
              <Input
                id="item-start"
                type="date"
                {...register("start_date", {
                  required: "Choose a start date.",
                })}
              />
              {errors.start_date && (
                <ErrorText>{errors.start_date.message}</ErrorText>
              )}
            </Field>

            <Field>
              <Label htmlFor="item-end">End date (optional)</Label>
              <Input
                id="item-end"
                type="date"
                min={startDate ?? undefined}
                {...register("end_date")}
              />
            </Field>
          </TwoColumn>

          <Field>
            <Label htmlFor="item-notes">Notes (optional)</Label>
            <TextArea
              id="item-notes"
              maxLength={2000}
              rows={3}
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
  padding: 20px;
  overflow-y: auto;
  background: rgb(20 28 23 / 55%);
`;

const Panel = styled.section`
  width: 100%;
  max-width: 520px;
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.025em;
`;

const Description = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
`;

const CloseButton = styled.button`
  display: grid;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background: var(--color-background);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: var(--color-text);
  font-size: 13px;
  font-weight: 550;
`;

const inputStyles = `
  width: 100%;
  min-width: 0;
  min-height: 42px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  outline: none;
  background: var(--color-background);
  color: var(--color-text);
  font: inherit;
  font-size: 14px;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(36 75 59 / 8%);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
`;

const TextArea = styled.textarea`
  ${inputStyles}
  padding: 10px 12px;
  resize: vertical;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: var(--color-error);
  font-size: 12px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

const CancelButton = styled.button`
  min-height: 42px;
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

const SubmitButton = styled.button`
  min-height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
