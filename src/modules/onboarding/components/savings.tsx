"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  saveSavings,
  type FinancialGoal,
  type SavingsBasis,
} from "@/api/onboarding";
import OnboardingStep from "@/shared/onboardingStep";

export type FinancialGoalDraft = FinancialGoal & {
  draftId: string;
};

type SavingsFormValues = {
  savings_percentage: string;
  savings_basis: SavingsBasis;
  financialGoals: Array<FinancialGoalDraft>;
};

type SavingsProps = {
  defaultValues: SavingsFormValues;
  onSuccess: () => void;
};

function createGoalDraft(): FinancialGoalDraft {
  return {
    draftId: crypto.randomUUID(),
    name: "",
    target_amount: 0,
    current_amount: 0,
    target_date: null,
    notes: null,
    is_active: true,
  };
}

export default function Savings({ defaultValues, onSuccess }: SavingsProps) {
  const [showInactive, setShowInactive] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SavingsFormValues>({
    defaultValues,
    mode: "onSubmit",
  });

  const {
    fields: goalFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "financialGoals",
  });

  const currentValues = useWatch({ control });
  const goals = currentValues.financialGoals ?? [];

  const visibleGoals = goalFields
    .map((field, index) => ({
      field,
      index,
      goal: goals[index] ?? field,
    }))
    .filter(({ goal }) => showInactive || goal.is_active);

  const saveMutation = useMutation({
    mutationFn: saveSavings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["onboarding"],
      });
      onSuccess();
    },
  });

  function removeGoal(index: number) {
    const goal = getValues(`financialGoals.${index}`);

    if (goal.id !== undefined) {
      setValue(`financialGoals.${index}.is_active`, false, {
        shouldDirty: true,
      });
      return;
    }

    remove(index);
  }

  function restoreGoal(index: number) {
    setValue(`financialGoals.${index}.is_active`, true, {
      shouldDirty: true,
    });
  }

  function onSubmit(values: SavingsFormValues) {
    clearErrors();

    const percentage = Number(values.savings_percentage);

    if (
      values.savings_percentage.trim() === "" ||
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      setError("savings_percentage", {
        type: "validate",
        message: "Enter a percentage between 0 and 100.",
      });
      return;
    }

    const invalidGoalIndex = values.financialGoals.findIndex(
      (goal) =>
        goal.is_active &&
        (!goal.name.trim() ||
          !Number.isFinite(goal.target_amount) ||
          goal.target_amount <= 0 ||
          !Number.isFinite(goal.current_amount) ||
          goal.current_amount < 0),
    );

    if (invalidGoalIndex !== -1) {
      const goal = values.financialGoals[invalidGoalIndex];

      if (!goal.name.trim()) {
        setError(`financialGoals.${invalidGoalIndex}.name`, {
          type: "validate",
          message: "Enter a name for this goal.",
        });
      }

      if (!Number.isFinite(goal.target_amount) || goal.target_amount <= 0) {
        setError(`financialGoals.${invalidGoalIndex}.target_amount`, {
          type: "validate",
          message: "Enter a target amount greater than zero.",
        });
      }

      if (!Number.isFinite(goal.current_amount) || goal.current_amount < 0) {
        setError(`financialGoals.${invalidGoalIndex}.current_amount`, {
          type: "validate",
          message: "Enter an amount of zero or more.",
        });
      }

      return;
    }

    saveMutation.mutate({
      savings_percentage: percentage,
      savings_basis: values.savings_basis,
      financialGoals: values.financialGoals.map(({ draftId, ...goal }) => goal),
    });
  }

  return (
    <OnboardingStep
      title="Plan your savings"
      description="Choose how much you want to save and what you're saving for. You can update these choices later."
    >
      <form id="savings-form" onSubmit={handleSubmit(onSubmit)}>
        <Section>
          <SectionTitle>Monthly savings target</SectionTitle>
          <Field>
            <Label htmlFor="savings-percentage">
              What percentage would you like to save?
            </Label>

            <PercentageRow>
              <Range
                id="savings-percentage"
                type="range"
                min="0"
                max="100"
                step="1"
                {...register("savings_percentage", {
                  required: "Choose a savings percentage.",
                })}
              />

              <PercentageInput
                aria-label="Savings percentage"
                type="number"
                min="0"
                max="100"
                step="1"
                {...register("savings_percentage", {
                  required: "Enter a savings percentage.",
                })}
              />
              <PercentSign>%</PercentSign>
            </PercentageRow>

            {errors.savings_percentage?.message && (
              <ErrorMessage>{errors.savings_percentage.message}</ErrorMessage>
            )}

            <Hint>
              This is your savings target, not a requirement to spend the
              remaining percentage.
            </Hint>
          </Field>
        </Section>

        <Section>
          <SectionTitle>Calculate savings from</SectionTitle>
          <ChoiceList>
            <Choice $selected={currentValues.savings_basis === "income"}>
              <input
                type="radio"
                value="income"
                {...register("savings_basis")}
              />
              <ChoiceText>
                <ChoiceTitle>Income</ChoiceTitle>
                <ChoiceDescription>
                  Set aside a percentage of your income.
                </ChoiceDescription>
              </ChoiceText>
            </Choice>

            <Choice
              $selected={currentValues.savings_basis === "current_savings"}
            >
              <input
                type="radio"
                value="current_savings"
                {...register("savings_basis")}
              />
              <ChoiceText>
                <ChoiceTitle>Current savings</ChoiceTitle>
                <ChoiceDescription>
                  Set a percentage target based on the savings you already have.
                </ChoiceDescription>
              </ChoiceText>
            </Choice>
          </ChoiceList>
        </Section>

        <Section>
          <SectionTitle>Financial goals</SectionTitle>
          <SectionDescription>
            Examples: emergency fund, a new laptop, travel, or a car. Adding
            goals is optional.
          </SectionDescription>

          {visibleGoals.length === 0 ? (
            <EmptyState>
              <EmptyTitle>No goals added yet</EmptyTitle>
              <EmptyDescription>
                Add a goal to keep track of how much you need and how much
                you&apos;ve already saved.
              </EmptyDescription>
            </EmptyState>
          ) : (
            <GoalList>
              {visibleGoals.map(({ field, index, goal }, visibleIndex) => (
                <GoalCard key={field.id} $inactive={!goal.is_active}>
                  <CardHeader>
                    <CardTitle>
                      Goal {visibleIndex + 1}
                      {!goal.is_active ? " (inactive)" : ""}
                    </CardTitle>

                    {goal.is_active ? (
                      <RemoveButton
                        type="button"
                        onClick={() => removeGoal(index)}
                      >
                        Remove
                      </RemoveButton>
                    ) : (
                      <RestoreButton
                        type="button"
                        onClick={() => restoreGoal(index)}
                      >
                        Restore
                      </RestoreButton>
                    )}
                  </CardHeader>

                  {goal.is_active ? (
                    <>
                      <Field>
                        <Label htmlFor={`goal-name-${goal.draftId}`}>
                          Goal name
                        </Label>
                        <Input
                          id={`goal-name-${goal.draftId}`}
                          maxLength={150}
                          placeholder="e.g. Emergency fund"
                          {...register(`financialGoals.${index}.name`)}
                        />
                        {errors.financialGoals?.[index]?.name?.message && (
                          <ErrorMessage>
                            {errors.financialGoals[index]?.name?.message}
                          </ErrorMessage>
                        )}
                      </Field>

                      <TwoColumns>
                        <Field>
                          <Label htmlFor={`goal-target-${goal.draftId}`}>
                            Target amount
                          </Label>
                          <Input
                            id={`goal-target-${goal.draftId}`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            {...register(
                              `financialGoals.${index}.target_amount`,
                              {
                                valueAsNumber: true,
                              },
                            )}
                          />
                          {errors.financialGoals?.[index]?.target_amount
                            ?.message && (
                            <ErrorMessage>
                              {
                                errors.financialGoals[index]?.target_amount
                                  ?.message
                              }
                            </ErrorMessage>
                          )}
                        </Field>

                        <Field>
                          <Label htmlFor={`goal-current-${goal.draftId}`}>
                            Already saved
                          </Label>
                          <Input
                            id={`goal-current-${goal.draftId}`}
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(
                              `financialGoals.${index}.current_amount`,
                              {
                                valueAsNumber: true,
                              },
                            )}
                          />
                          {errors.financialGoals?.[index]?.current_amount
                            ?.message && (
                            <ErrorMessage>
                              {
                                errors.financialGoals[index]?.current_amount
                                  ?.message
                              }
                            </ErrorMessage>
                          )}
                        </Field>
                      </TwoColumns>

                      <Field>
                        <Label htmlFor={`goal-date-${goal.draftId}`}>
                          Target date (optional)
                        </Label>
                        <Input
                          id={`goal-date-${goal.draftId}`}
                          type="date"
                          {...register(`financialGoals.${index}.target_date`, {
                            setValueAs: (value: string) => value || null,
                          })}
                        />
                      </Field>

                      <Field>
                        <Label htmlFor={`goal-notes-${goal.draftId}`}>
                          Notes (optional)
                        </Label>
                        <TextArea
                          id={`goal-notes-${goal.draftId}`}
                          maxLength={2000}
                          placeholder="Add useful details"
                          rows={3}
                          {...register(`financialGoals.${index}.notes`, {
                            setValueAs: (value: string) => value || null,
                          })}
                        />
                      </Field>
                    </>
                  ) : (
                    <InactiveMessage>
                      This goal will be marked inactive when you save.
                    </InactiveMessage>
                  )}
                </GoalCard>
              ))}
            </GoalList>
          )}

          <AddButton type="button" onClick={() => append(createGoalDraft())}>
            <span aria-hidden="true">+</span>
            Add financial goal
          </AddButton>

          <ToggleButton
            type="button"
            onClick={() => setShowInactive((current) => !current)}
          >
            {showInactive ? "Hide inactive goals" : "Show inactive goals"}
          </ToggleButton>
        </Section>

        {saveMutation.isError && (
          <ErrorMessage role="alert">
            Could not save your savings settings. Please try again.
          </ErrorMessage>
        )}
      </form>
    </OnboardingStep>
  );
}

const Section = styled.section`
  margin-top: 28px;
  padding: 22px;
  border: 1px solid #e3e7df;
  border-radius: 14px;
  background: #fcfcf9;

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  color: #244b3b;
  font-size: 1.05rem;
  font-weight: 600;
`;

const SectionDescription = styled.p`
  margin: -6px 0 18px;
  color: #6b756f;
  font-size: 0.875rem;
  line-height: 1.6;
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

const PercentageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Range = styled.input`
  flex: 1;
  min-width: 0;
  accent-color: #244b3b;
  cursor: pointer;
`;

const PercentageInput = styled.input`
  width: 76px;
  min-height: 42px;
  padding: 8px;
  border: 1px solid #dce2dc;
  border-radius: 9px;
  background: white;
  color: #244b3b;
  font: inherit;
  text-align: center;
`;

const PercentSign = styled.span`
  margin-left: -8px;
  color: #526c5c;
`;

const Hint = styled.p`
  margin: 0;
  color: #778078;
  font-size: 0.8rem;
  line-height: 1.5;
`;

const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Choice = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${({ $selected }) => ($selected ? "#8ca995" : "#e3e7df")};
  border-radius: 10px;
  background: ${({ $selected }) => ($selected ? "#f0f6ef" : "#fff")};
  cursor: pointer;

  input {
    margin-top: 4px;
    accent-color: #244b3b;
  }
`;

const ChoiceText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChoiceTitle = styled.span`
  color: #273b31;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ChoiceDescription = styled.span`
  color: #6b756f;
  font-size: 0.825rem;
  line-height: 1.5;
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const GoalCard = styled.article<{ $inactive: boolean }>`
  padding: 20px;
  border: 1px solid #e3e7df;
  border-radius: 12px;
  background: ${({ $inactive }) => ($inactive ? "#f0f0ec" : "#fff")};
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

const CardTitle = styled.h3`
  margin: 0;
  color: #244b3b;
  font-size: 1rem;
  font-weight: 600;
`;

const buttonStyles = `
  padding: 7px 10px;
  border-radius: 8px;
  background: white;
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  ${buttonStyles}
  border: 1px solid #ead7d4;
  color: #a23a32;
`;

const RestoreButton = styled.button`
  ${buttonStyles}
  border: 1px solid #b9c9bb;
  color: #244b3b;
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
  background: white;
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

  &:hover {
    border-color: #244b3b;
    background: #edf4ed;
  }

  span {
    font-size: 1.2rem;
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
  padding: 24px 18px;
  border: 1px dashed #dce2dc;
  border-radius: 12px;
  text-align: center;
`;

const EmptyTitle = styled.h3`
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

const ErrorMessage = styled.p`
  margin: 8px 0 0;
  color: #a23a32;
  font-size: 0.85rem;
  line-height: 1.5;
`;
