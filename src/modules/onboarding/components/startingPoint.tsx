"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { saveStartingPoint } from "@/api/onboarding";
import OnboardingStep from "@/shared/onboardingStep";
import Select from "@/designSystem/select";

export type StartingPointValues = {
  currency: string;
  starting_balance: string;
  tracking_start_date: string;
};

type StartingPointProps = {
  defaultValues: StartingPointValues;
  onSuccess: () => void;
};

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "LBP", label: "Lebanese Pound (L.L.)" },
  { value: "EUR", label: "Euro (€)" },
];

export default function StartingPoint({
  defaultValues,
  onSuccess,
}: StartingPointProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StartingPointValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const saveMutation = useMutation({
    mutationFn: saveStartingPoint,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["onboarding"],
      });

      onSuccess();
    },
  });

  function onSubmit(values: StartingPointValues) {
    const balanceText = values.starting_balance.trim();
    const balance = Number(balanceText);

    if (!/^\d+(\.\d{1,2})?$/.test(balanceText) || !Number.isFinite(balance)) {
      return;
    }

    saveMutation.mutate({
      currency: values.currency,
      starting_balance: balance,
      tracking_start_date: values.tracking_start_date,
    });
  }

  return (
    <OnboardingStep
      title="Let's set up your finances"
      description="Start with your current balance and choose when you want SpendWise to begin tracking your finances."
    >
      <Form id="starting-point-form" onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label htmlFor="currency">Main currency</Label>

          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                ariaLabel="Main currency"
                value={field.value}
                options={currencies}
                onValueChange={field.onChange}
              />
            )}
          />

          <HelpText>
            Your transactions and summaries will use this currency.
          </HelpText>
        </Field>

        <Field>
          <Label htmlFor="starting-balance">Starting balance</Label>

          <Input
            id="starting-balance"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...register("starting_balance", {
              required: "Enter your starting balance.",
              validate: (value) =>
                (/^\d+(\.\d{1,2})?$/.test(value.trim()) &&
                  Number.isFinite(Number(value)) &&
                  Number(value) >= 0) ||
                "Enter a valid non-negative amount with up to two decimal places.",
            })}
          />

          {errors.starting_balance ? (
            <ErrorText>{errors.starting_balance.message}</ErrorText>
          ) : null}

          <HelpText>
            How much money did you have when you started tracking?
          </HelpText>
        </Field>

        <Field>
          <Label htmlFor="tracking-start-date">Tracking start date</Label>

          <Input
            id="tracking-start-date"
            type="date"
            {...register("tracking_start_date", {
              required: "Choose a tracking start date.",
            })}
          />

          {errors.tracking_start_date ? (
            <ErrorText>{errors.tracking_start_date.message}</ErrorText>
          ) : null}

          <HelpText>
            Choose the date from which you want to track your finances.
          </HelpText>
        </Field>

        {saveMutation.isError ? (
          <ErrorText role="alert">
            We couldn&apos;t save your starting point. Please try again.
          </ErrorText>
        ) : null}
      </Form>
    </OnboardingStep>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Label = styled.label`
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.005em;
`;

const Input = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 0 var(--spacing-md);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  box-sizing: border-box;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(36 75 59 / 10%);
  }
`;


const HelpText = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin: 0;
  color: var(--color-error);
  font-size: var(--text-xs);
  line-height: 1.5;
`;
