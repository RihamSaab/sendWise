"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { saveFixedExpenses, type FixedExpense } from "@/api/onboarding";
import OnboardingStep from "@/shared/onboardingStep";

export type FixedExpenseDraft = FixedExpense & {
  draftId: string;
};

type FixedExpenseFormValues = {
  fixedExpenses: Array<FixedExpenseDraft>;
};

type FixedExpensesProps = {
  defaultValues: FixedExpenseFormValues;
  onSuccess: () => void;
};

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "one_time", label: "One-time" },
] as const;

function createExpenseDraft(): FixedExpenseDraft {
  return {
    draftId: crypto.randomUUID(),
    name: "",
    amount: 0,
    frequency: "monthly",
    start_date: new Date().toLocaleDateString("en-CA"),
    end_date: null,
    notes: null,
    is_active: true,
  };
}

export default function FixedExpenses({
  defaultValues,
  onSuccess,
}: FixedExpensesProps) {
  const [showInactive, setShowInactive] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FixedExpenseFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fixedExpenses",
  });

  const currentExpenses =
    useWatch({
      control,
      name: "fixedExpenses",
    }) ?? [];

  const saveMutation = useMutation({
    mutationFn: saveFixedExpenses,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["onboarding"],
      });
      onSuccess();
    },
  });

  const visibleExpenses = fields
    .map((field, index) => ({
      field,
      index,
      expense: currentExpenses[index] ?? field,
    }))
    .filter(({ expense }) => showInactive || expense.is_active);

  function removeExpense(index: number) {
    const expense = getValues(`fixedExpenses.${index}`);

    // Saved records are deactivated, not deleted.
    if (expense.id !== undefined) {
      setValue(`fixedExpenses.${index}.is_active`, false);
      return;
    }

    // Unsaved records can be removed from the form.
    remove(index);
  }

  function restoreExpense(index: number) {
    setValue(`fixedExpenses.${index}.is_active`, true);
  }

  function onSubmit(values: FixedExpenseFormValues) {
    const invalidExpense = values.fixedExpenses.find(
      (expense) =>
        expense.is_active &&
        expense.end_date !== null &&
        expense.end_date < expense.start_date,
    );

    if (invalidExpense) {
      return;
    }

    const fixedExpenses: Array<FixedExpense> = values.fixedExpenses.map(
      ({ draftId: _draftId, ...expense }) => expense,
    );

    saveMutation.mutate({ fixedExpenses });
  }

  return (
    <OnboardingStep
      title="What are your fixed expenses?"
      description="Add recurring bills and other regular expenses, such as rent, internet, subscriptions, or insurance. You can also include a one-time expense."
    >
      <form id="fixed-expenses-form" onSubmit={handleSubmit(onSubmit)}>
        {visibleExpenses.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No expenses added yet</EmptyTitle>
            <EmptyDescription>
              Add your expenses to help SpendWise understand your regular
              financial commitments. You can also continue without any.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <ExpenseList>
            {visibleExpenses.map(({ field, index, expense }, displayIndex) => (
              <ExpenseCard key={field.id} $inactive={!expense.is_active}>
                <CardHeader>
                  <CardTitle>
                    Expense {displayIndex + 1}
                    {!expense.is_active ? " (inactive)" : ""}
                  </CardTitle>

                  {expense.is_active ? (
                    <RemoveButton
                      type="button"
                      onClick={() => removeExpense(index)}
                    >
                      Remove
                    </RemoveButton>
                  ) : (
                    <RestoreButton
                      type="button"
                      onClick={() => restoreExpense(index)}
                    >
                      Restore
                    </RestoreButton>
                  )}
                </CardHeader>

                {expense.is_active ? (
                  <>
                    <Field>
                      <Label htmlFor={`expense-name-${field.draftId}`}>
                        Expense name
                      </Label>
                      <Input
                        id={`expense-name-${field.draftId}`}
                        maxLength={150}
                        placeholder="e.g. Internet"
                        {...register(`fixedExpenses.${index}.name`, {
                          validate: (value) =>
                            !getValues(`fixedExpenses.${index}.is_active`) ||
                            value.trim().length > 0 ||
                            "Enter an expense name.",
                        })}
                      />
                      {errors.fixedExpenses?.[index]?.name && (
                        <ErrorText role="alert">
                          {errors.fixedExpenses[index]?.name?.message}
                        </ErrorText>
                      )}
                    </Field>

                    <TwoColumns>
                      <Field>
                        <Label htmlFor={`expense-amount-${field.draftId}`}>
                          Amount
                        </Label>
                        <Input
                          id={`expense-amount-${field.draftId}`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          {...register(`fixedExpenses.${index}.amount`, {
                            valueAsNumber: true,
                            validate: (value) =>
                              !getValues(`fixedExpenses.${index}.is_active`) ||
                              (Number.isFinite(value) && value > 0) ||
                              "Enter an amount greater than zero.",
                          })}
                        />
                        {errors.fixedExpenses?.[index]?.amount && (
                          <ErrorText role="alert">
                            {errors.fixedExpenses[index]?.amount?.message}
                          </ErrorText>
                        )}
                      </Field>

                      <Field>
                        <Label htmlFor={`expense-frequency-${field.draftId}`}>
                          Frequency
                        </Label>
                        <Select
                          id={`expense-frequency-${field.draftId}`}
                          {...register(`fixedExpenses.${index}.frequency`)}
                        >
                          {frequencies.map((frequency) => (
                            <option
                              key={frequency.value}
                              value={frequency.value}
                            >
                              {frequency.label}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </TwoColumns>

                    <TwoColumns>
                      <Field>
                        <Label htmlFor={`expense-start-${field.draftId}`}>
                          Start date
                        </Label>
                        <Input
                          id={`expense-start-${field.draftId}`}
                          type="date"
                          {...register(`fixedExpenses.${index}.start_date`, {
                            required: "Choose a start date.",
                          })}
                        />
                        {errors.fixedExpenses?.[index]?.start_date && (
                          <ErrorText role="alert">
                            {errors.fixedExpenses[index]?.start_date?.message}
                          </ErrorText>
                        )}
                      </Field>

                      <Field>
                        <Label htmlFor={`expense-end-${field.draftId}`}>
                          End date (optional)
                        </Label>
                        <Input
                          id={`expense-end-${field.draftId}`}
                          type="date"
                          min={expense.start_date}
                          {...register(`fixedExpenses.${index}.end_date`, {
                            setValueAs: (value: string) => value || null,
                          })}
                        />
                        {errors.fixedExpenses?.[index]?.end_date && (
                          <ErrorText role="alert">
                            {errors.fixedExpenses[index]?.end_date?.message}
                          </ErrorText>
                        )}
                      </Field>
                    </TwoColumns>

                    <Field>
                      <Label htmlFor={`expense-notes-${field.draftId}`}>
                        Notes (optional)
                      </Label>
                      <TextArea
                        id={`expense-notes-${field.draftId}`}
                        maxLength={2000}
                        placeholder="Add any useful details"
                        rows={3}
                        {...register(`fixedExpenses.${index}.notes`, {
                          setValueAs: (value: string) => value || null,
                        })}
                      />
                    </Field>
                  </>
                ) : (
                  <InactiveMessage>
                    This expense will be marked inactive when you save.
                  </InactiveMessage>
                )}
              </ExpenseCard>
            ))}
          </ExpenseList>
        )}

        {saveMutation.isError && (
          <ErrorText role="alert">
            Could not save your fixed expenses. Please try again.
          </ErrorText>
        )}

        <AddButton type="button" onClick={() => append(createExpenseDraft())}>
          <span aria-hidden="true">+</span>
          Add fixed expense
        </AddButton>

        <ToggleButton
          type="button"
          onClick={() => setShowInactive((current) => !current)}
        >
          {showInactive ? "Hide inactive expenses" : "Show inactive expenses"}
        </ToggleButton>
      </form>
    </OnboardingStep>
  );
}

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ExpenseCard = styled.article<{ $inactive: boolean }>`
  padding: 22px;
  border: 1px solid #e3e7df;
  border-radius: 14px;
  background: ${({ $inactive }) => ($inactive ? "#f0f0ec" : "#fcfcf9")};
  opacity: ${({ $inactive }) => ($inactive ? 0.8 : 1)};

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  margin: 0;
  color: #244b3b;
  font-size: 1rem;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  padding: 7px 10px;
  border: 1px solid #ead7d4;
  border-radius: 8px;
  background: white;
  color: #a23a32;
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
`;

const RestoreButton = styled.button`
  padding: 7px 10px;
  border: 1px solid #b9c9bb;
  border-radius: 8px;
  background: white;
  color: #244b3b;
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
`;

const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  color: #273b31;
  font-size: 0.85rem;
  font-weight: 500;
`;

const inputStyles = `
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #dce2dc;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #273b31;
  font: inherit;
  font-size: 0.9rem;

  &:focus {
    border-color: #244b3b;
    box-shadow: 0 0 0 3px rgb(36 75 59 / 10%);
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
  resize: vertical;
`;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  margin-top: 20px;
  border: 1px dashed #b9c9bb;
  border-radius: 10px;
  background: #f7faf6;
  color: #244b3b;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  span {
    font-size: 1.2rem;
  }

  &:hover {
    border-color: #244b3b;
    background: #edf4ed;
  }
`;

const ToggleButton = styled.button`
  margin-top: 14px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: #526c5c;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
`;

const EmptyState = styled.div`
  padding: 28px 20px;
  border: 1px dashed #dce2dc;
  border-radius: 12px;
  text-align: center;
`;

const EmptyTitle = styled.h2`
  margin: 0;
  color: #244b3b;
  font-size: 1rem;
`;

const EmptyDescription = styled.p`
  margin: 8px 0 0;
  color: #778078;
  font-size: 0.875rem;
  line-height: 1.6;
`;

const InactiveMessage = styled.p`
  margin: 0;
  color: #6b756f;
  font-size: 0.875rem;
  line-height: 1.6;
`;

const ErrorText = styled.p`
  margin: 6px 0 12px;
  color: #a23a32;
  font-size: 0.82rem;
`;
