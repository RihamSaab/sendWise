"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { saveIncomeSources, type IncomeSource } from "@/api/onboarding";
import OnboardingStep from "@/shared/onboardingStep";

export type IncomeDraft = IncomeSource & {
  draftId: string;
};

type IncomeFormValues = {
  incomeSources: Array<IncomeDraft>;
};

type IncomeProps = {
  defaultValues: IncomeFormValues;
  onSuccess: () => void;
};

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "one_time", label: "One-time" },
] as const;

function createIncomeDraft(): IncomeDraft {
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

export default function Income({ defaultValues, onSuccess }: IncomeProps) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IncomeFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "incomeSources",
  });

  const saveMutation = useMutation({
    mutationFn: saveIncomeSources,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["onboarding"],
      });
      onSuccess();
    },
  });

  const activeValues = fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => field.is_active);

  function removeIncome(index: number) {
    const income = getValues(`incomeSources.${index}`);

    // Saved records are deactivated instead of deleted.
    if (income.id !== undefined) {
      setValue(`incomeSources.${index}.is_active`, false);
      return;
    }

    remove(index);
  }

  function onSubmit(values: IncomeFormValues) {
    const invalidIncome = values.incomeSources.find(
      (income) =>
        income.is_active &&
        income.end_date !== null &&
        income.end_date < income.start_date,
    );

    if (invalidIncome) {
      return;
    }

    const incomeSources: Array<IncomeSource> = values.incomeSources.map(
      ({ draftId: _draftId, ...income }) => income,
    );

    saveMutation.mutate({ incomeSources });
  }

  return (
    <OnboardingStep
      title="Where does your money come from?"
      description="Add your salary, freelance income, business revenue, or any other source of income. You can add more than one."
    >
      <form id="income-form" onSubmit={handleSubmit(onSubmit)}>
        {activeValues.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No income sources added yet</EmptyTitle>
            <EmptyDescription>
              Add an income source if you have one. You can also continue
              without adding any.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <IncomeList>
            {activeValues.map(({ field, index }, displayIndex) => (
              <IncomeCard key={field.draftId}>
                <CardHeader>
                  <CardTitle>Income source {displayIndex + 1}</CardTitle>
                  <RemoveButton
                    type="button"
                    onClick={() => removeIncome(index)}
                  >
                    Remove
                  </RemoveButton>
                </CardHeader>

                <Field>
                  <Label htmlFor={`income-name-${field.draftId}`}>Name</Label>
                  <Input
                    id={`income-name-${field.draftId}`}
                    maxLength={150}
                    placeholder="e.g. Monthly salary"
                    {...register(`incomeSources.${index}.name`, {
                      validate: (value) =>
                        !getValues(`incomeSources.${index}.is_active`) ||
                        value.trim().length > 0 ||
                        "Enter an income source name.",
                    })}
                  />
                  {errors.incomeSources?.[index]?.name && (
                    <ErrorText role="alert">
                      {errors.incomeSources[index]?.name?.message}
                    </ErrorText>
                  )}
                </Field>

                <TwoColumns>
                  <Field>
                    <Label htmlFor={`income-amount-${field.draftId}`}>
                      Amount
                    </Label>
                    <Input
                      id={`income-amount-${field.draftId}`}
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      {...register(`incomeSources.${index}.amount`, {
                        valueAsNumber: true,
                        validate: (value) =>
                          !getValues(`incomeSources.${index}.is_active`) ||
                          (Number.isFinite(value) && value > 0) ||
                          "Enter an amount greater than zero.",
                      })}
                    />
                    {errors.incomeSources?.[index]?.amount && (
                      <ErrorText role="alert">
                        {errors.incomeSources[index]?.amount?.message}
                      </ErrorText>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor={`income-frequency-${field.draftId}`}>
                      Frequency
                    </Label>
                    <Select
                      id={`income-frequency-${field.draftId}`}
                      {...register(`incomeSources.${index}.frequency`)}
                    >
                      {frequencies.map((frequency) => (
                        <option key={frequency.value} value={frequency.value}>
                          {frequency.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </TwoColumns>

                <TwoColumns>
                  <Field>
                    <Label htmlFor={`income-start-${field.draftId}`}>
                      Start date
                    </Label>
                    <Input
                      id={`income-start-${field.draftId}`}
                      type="date"
                      {...register(`incomeSources.${index}.start_date`, {
                        required: "Choose a start date.",
                      })}
                    />
                    {errors.incomeSources?.[index]?.start_date && (
                      <ErrorText role="alert">
                        {errors.incomeSources[index]?.start_date?.message}
                      </ErrorText>
                    )}
                  </Field>

                  <Field>
                    <Label htmlFor={`income-end-${field.draftId}`}>
                      End date (optional)
                    </Label>
                    <Input
                      id={`income-end-${field.draftId}`}
                      type="date"
                      min={getValues(`incomeSources.${index}.start_date`)}
                      {...register(`incomeSources.${index}.end_date`, {
                        setValueAs: (value: string) => value || null,
                      })}
                    />
                    {errors.incomeSources?.[index]?.end_date && (
                      <ErrorText role="alert">
                        {errors.incomeSources[index]?.end_date?.message}
                      </ErrorText>
                    )}
                  </Field>
                </TwoColumns>

                <Field>
                  <Label htmlFor={`income-notes-${field.draftId}`}>
                    Notes (optional)
                  </Label>
                  <TextArea
                    id={`income-notes-${field.draftId}`}
                    maxLength={2000}
                    placeholder="Add any useful details"
                    rows={3}
                    {...register(`incomeSources.${index}.notes`, {
                      setValueAs: (value: string) => value || null,
                    })}
                  />
                </Field>
              </IncomeCard>
            ))}
          </IncomeList>
        )}

        {saveMutation.isError && (
          <ErrorText role="alert">
            Could not save your income sources. Please try again.
          </ErrorText>
        )}

        <AddButton type="button" onClick={() => append(createIncomeDraft())}>
          <span aria-hidden="true">+</span>
          Add income source
        </AddButton>
      </form>
    </OnboardingStep>
  );
}

const IncomeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const IncomeCard = styled.article`
  padding: var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-muted);

  @media (max-width: 560px) {
    padding: var(--spacing-md);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const CardTitle = styled.h2`
  margin: 0;
  color: var(--color-primary);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.015em;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-error);
  font: inherit;
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: var(--color-error);
  }
`;

const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
`;

const inputStyles = `
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 10px 12px;
  box-sizing: border-box;
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    border-color: var(--color-primary);
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
  gap: var(--spacing-md);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  min-height: 48px;
  margin-top: var(--spacing-md);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  color: var(--color-primary);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background 150ms ease;

  span {
    font-size: 1.2rem;
  }

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-soft);
  }
`;

const EmptyState = styled.div`
  padding: var(--spacing-xl) var(--spacing-lg);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  text-align: center;
`;

const EmptyTitle = styled.h2`
  margin: 0;
  color: var(--color-primary);
  font-size: var(--text-md);
  font-weight: 600;
`;

const EmptyDescription = styled.p`
  margin: var(--spacing-sm) 0 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
`;

const ErrorText = styled.p`
  margin: 6px 0 12px;
  color: var(--color-error);
  font-size: var(--text-xs);
`;
