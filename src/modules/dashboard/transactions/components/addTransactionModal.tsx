"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";

import {
  transactionQueries,
  useCreateTransaction,
  useUpdateTransaction,
  type ApiTransaction,
} from "@/api/transactions";
import Select from "@/designSystem/select";

import {
  transactionSchema,
  type TransactionFormValues,
} from "../schemas/transactionSchema";

type TransactionType = "income" | "expense";

const formTypeOptions = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

function getLocalDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildDefaultValues(
  transaction: ApiTransaction | null,
): TransactionFormValues {
  if (!transaction) {
    return {
      title: "",
      amount: undefined as unknown as number,
      type: "expense",
      category_id: 0,
      transaction_date: getLocalDate(),
      notes: "",
    };
  }

  return {
    title: transaction.title,
    amount: Number(transaction.amount),
    type: transaction.type,
    category_id: transaction.category_id,
    transaction_date: transaction.transaction_date,
    notes: transaction.notes ?? "",
  };
}

type AddTransactionModalProps = {
  onClose: () => void;
  transaction?: ApiTransaction | null;
};

export default function AddTransactionModal({
  onClose,
  transaction = null,
}: AddTransactionModalProps) {
  const isEditing = transaction !== null;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    mode: "onTouched",
    defaultValues: buildDefaultValues(transaction),
  });

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const activeMutation = isEditing ? updateMutation : createMutation;
  const saving = activeMutation.isPending;

  const {
    data: categories = [],
    isPending: areCategoriesPending,
    error: categoriesError,
  } = useQuery(transactionQueries.categories());

  const selectedType = useWatch({
    control,
    name: "type",
  });

  const filteredCategories = categories.filter(
    (category) => category.type === selectedType || category.type === "both",
  );

  const formCategoryOptions = filteredCategories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !activeMutation.isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, activeMutation.isPending]);

  function handleTypeChange(value: string) {
    const nextType = value as TransactionType;

    setValue("type", nextType, {
      shouldValidate: true,
      shouldTouch: true,
    });

    const firstCategory = categories.find(
      (category) => category.type === nextType || category.type === "both",
    );

    setValue("category_id", firstCategory ? firstCategory.id : 0, {
      shouldValidate: true,
      shouldTouch: true,
    });
  }

  function handleClose() {
    if (!saving) {
      onClose();
    }
  }

  function onSubmit(values: TransactionFormValues) {
    const payload = {
      title: values.title.trim(),
      amount: values.amount,
      type: values.type,
      category_id: values.category_id,
      transaction_date: values.transaction_date,
      notes: values.notes.trim() || null,
    };

    const handleSuccess = () => {
      reset(buildDefaultValues(null));
      onClose();
    };

    if (isEditing && transaction) {
      updateMutation.mutate(
        { id: transaction.id, input: payload },
        { onSuccess: handleSuccess },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: handleSuccess });
  }

  return (
    <StyledTransactionsPage_ModalOverlay
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <StyledTransactionsPage_Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-transaction-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <StyledTransactionsPage_ModalHeader>
          <div>
            <StyledTransactionsPage_ModalTitle id="add-transaction-title">
              {isEditing ? "Edit transaction" : "Add transaction"}
            </StyledTransactionsPage_ModalTitle>

            <StyledTransactionsPage_ModalDescription>
              {isEditing
                ? "Update the details and save your changes."
                : "Record money coming in or going out."}
            </StyledTransactionsPage_ModalDescription>
          </div>

          <StyledTransactionsPage_CloseButton
            type="button"
            aria-label="Close dialog"
            onClick={handleClose}
            disabled={saving}
          >
            ×
          </StyledTransactionsPage_CloseButton>
        </StyledTransactionsPage_ModalHeader>

        <StyledTransactionsPage_RequiredNote>
          Fields marked with{" "}
          <StyledTransactionsPage_Required>*</StyledTransactionsPage_Required>{" "}
          are required.
        </StyledTransactionsPage_RequiredNote>

        <StyledTransactionsPage_Form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <StyledTransactionsPage_FormField>
            <StyledTransactionsPage_FormLabel htmlFor="transaction-title">
              Transaction title{" "}
              <StyledTransactionsPage_Required>
                *
              </StyledTransactionsPage_Required>
            </StyledTransactionsPage_FormLabel>

            <StyledTransactionsPage_FormInput
              id="transaction-title"
              placeholder="e.g. Grocery shopping"
              maxLength={150}
              aria-invalid={Boolean(errors.title)}
              $hasError={Boolean(errors.title)}
              {...register("title")}
            />

            {errors.title && (
              <StyledTransactionsPage_FormError role="alert">
                {errors.title.message}
              </StyledTransactionsPage_FormError>
            )}
          </StyledTransactionsPage_FormField>

          <StyledTransactionsPage_FormRow>
            <StyledTransactionsPage_FormField>
              <StyledTransactionsPage_FormLabel htmlFor="transaction-amount">
                Amount{" "}
                <StyledTransactionsPage_Required>
                  *
                </StyledTransactionsPage_Required>
              </StyledTransactionsPage_FormLabel>

              <StyledTransactionsPage_FormInput
                id="transaction-amount"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="any"
                aria-invalid={Boolean(errors.amount)}
                $hasError={Boolean(errors.amount)}
                {...register("amount", { valueAsNumber: true })}
              />

              {errors.amount && (
                <StyledTransactionsPage_FormError role="alert">
                  {errors.amount.message}
                </StyledTransactionsPage_FormError>
              )}
            </StyledTransactionsPage_FormField>

            <StyledTransactionsPage_FormField>
              <StyledTransactionsPage_FormLabel>
                Type{" "}
                <StyledTransactionsPage_Required>
                  *
                </StyledTransactionsPage_Required>
              </StyledTransactionsPage_FormLabel>

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    ariaLabel="Transaction type"
                    value={field.value}
                    options={formTypeOptions}
                    onValueChange={handleTypeChange}
                  />
                )}
              />

              {errors.type && (
                <StyledTransactionsPage_FormError role="alert">
                  {errors.type.message}
                </StyledTransactionsPage_FormError>
              )}
            </StyledTransactionsPage_FormField>
          </StyledTransactionsPage_FormRow>

          <StyledTransactionsPage_FormField>
            <StyledTransactionsPage_FormLabel>
              Category{" "}
              <StyledTransactionsPage_Required>
                *
              </StyledTransactionsPage_Required>
            </StyledTransactionsPage_FormLabel>

            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select
                  ariaLabel="Transaction category"
                  value={String(field.value || "")}
                  options={formCategoryOptions}
                  onValueChange={(value) => {
                    field.onChange(Number(value) || 0);
                  }}
                />
              )}
            />

            {areCategoriesPending && (
              <StyledTransactionsPage_HelperText>
                Loading categories...
              </StyledTransactionsPage_HelperText>
            )}

            {categoriesError && (
              <StyledTransactionsPage_FormError role="alert">
                Could not load transaction categories.
              </StyledTransactionsPage_FormError>
            )}

            {errors.category_id && (
              <StyledTransactionsPage_FormError role="alert">
                {errors.category_id.message}
              </StyledTransactionsPage_FormError>
            )}
          </StyledTransactionsPage_FormField>

          <StyledTransactionsPage_FormField>
            <StyledTransactionsPage_FormLabel htmlFor="transaction-date">
              Date{" "}
              <StyledTransactionsPage_Required>
                *
              </StyledTransactionsPage_Required>
            </StyledTransactionsPage_FormLabel>

            <StyledTransactionsPage_FormInput
              id="transaction-date"
              type="date"
              aria-invalid={Boolean(errors.transaction_date)}
              $hasError={Boolean(errors.transaction_date)}
              {...register("transaction_date")}
            />

            {errors.transaction_date && (
              <StyledTransactionsPage_FormError role="alert">
                {errors.transaction_date.message}
              </StyledTransactionsPage_FormError>
            )}
          </StyledTransactionsPage_FormField>

          <StyledTransactionsPage_FormField>
            <StyledTransactionsPage_FormLabel htmlFor="transaction-notes">
              Notes{" "}
              <StyledTransactionsPage_Optional>
                (optional)
              </StyledTransactionsPage_Optional>
            </StyledTransactionsPage_FormLabel>

            <StyledTransactionsPage_FormTextarea
              id="transaction-notes"
              placeholder="Add any extra details..."
              {...register("notes")}
            />
          </StyledTransactionsPage_FormField>

          {activeMutation.error && (
            <StyledTransactionsPage_FormError role="alert">
              {activeMutation.error instanceof Error
                ? activeMutation.error.message
                : "Something went wrong while saving your transaction."}
            </StyledTransactionsPage_FormError>
          )}

          <StyledTransactionsPage_FormActions>
            <StyledTransactionsPage_SecondaryButton
              type="button"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </StyledTransactionsPage_SecondaryButton>

            <StyledTransactionsPage_SubmitButton
              type="submit"
              disabled={
                saving || areCategoriesPending || categories.length === 0
              }
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Save transaction"}
            </StyledTransactionsPage_SubmitButton>
          </StyledTransactionsPage_FormActions>
        </StyledTransactionsPage_Form>
      </StyledTransactionsPage_Modal>
    </StyledTransactionsPage_ModalOverlay>
  );
}

const StyledTransactionsPage_ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: rgb(31 36 32 / 45%);
  backdrop-filter: blur(2px);
`;

const StyledTransactionsPage_Modal = styled.section`
  width: 100%;
  max-width: 480px;
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--spacing-xl);
  border: none;
  border-radius: var(--radius-xl);
  background: var(--gradient-surface);
  box-shadow:
    var(--specular-top),
    var(--elevation-3);

  @media (max-width: 480px) {
    padding: var(--spacing-lg);
  }
`;

const StyledTransactionsPage_ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
`;

const StyledTransactionsPage_ModalTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: -0.03em;
`;

const StyledTransactionsPage_ModalDescription = styled.p`
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
`;

const StyledTransactionsPage_CloseButton = styled.button`
  display: grid;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  place-items: center;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-lg);
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledTransactionsPage_RequiredNote = styled.p`
  margin: 0 0 var(--spacing-md);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
`;

const StyledTransactionsPage_Required = styled.span`
  color: var(--color-error);
`;

const StyledTransactionsPage_Optional = styled.span`
  margin-left: 4px;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: 400;
`;

const StyledTransactionsPage_Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const StyledTransactionsPage_FormField = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 7px;
`;

const StyledTransactionsPage_FormLabel = styled.label`
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
`;

const StyledTransactionsPage_FormInput = styled.input<{
  $hasError?: boolean;
}>`
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 var(--spacing-sm);
  border: var(--stroke) solid
    ${({ $hasError }) =>
      $hasError ? "var(--color-error)" : "var(--color-border)"};
  border-radius: var(--radius-md);
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-base);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? "var(--color-error)" : "var(--color-primary)"};
    box-shadow: 0 0 0 3px rgb(36 75 59 / 8%);
  }
`;

const StyledTransactionsPage_FormTextarea = styled.textarea`
  width: 100%;
  height: 96px;
  min-height: 96px;
  padding: var(--spacing-sm);
  resize: none;
  overflow-y: auto;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: var(--text-base);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(36 75 59 / 8%);
  }
`;

const StyledTransactionsPage_FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-sm);

  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const StyledTransactionsPage_FormError = styled.p`
  margin: 0;
  color: var(--color-error);
  font-size: var(--text-xs);
  line-height: 1.5;
`;

const StyledTransactionsPage_HelperText = styled.span`
  color: var(--color-text-muted);
  font-size: var(--text-xs);
`;

const StyledTransactionsPage_FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: 6px;
`;

const StyledTransactionsPage_SecondaryButton = styled.button`
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

  &:hover {
    border-color: var(--color-primary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledTransactionsPage_SubmitButton = styled.button`
  min-height: 42px;
  padding: 0 var(--spacing-lg);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-primary);
  box-shadow:
    var(--specular-top-dark),
    var(--elevation-1);
  color: var(--color-text-on-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-base) var(--ease-silk),
    transform var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: var(--gradient-primary-hover);
    box-shadow:
      var(--specular-top-dark),
      var(--elevation-3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
