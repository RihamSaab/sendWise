"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { saveStartingPoint } from "@/api/onboarding";
import OnboardingStep from "@/shared/onboardingStep";

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

          <Select id="currency" {...register("currency", { required: true })}>
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </Select>

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
  gap: 24px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #273b31;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #dce2dc;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  color: #273b31;
  font: inherit;
  box-sizing: border-box;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:focus {
    border-color: #244b3b;
    box-shadow: 0 0 0 3px rgb(36 75 59 / 10%);
  }
`;

const Select = styled.select`
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #dce2dc;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  color: #273b31;
  font: inherit;

  &:focus {
    border-color: #244b3b;
    box-shadow: 0 0 0 3px rgb(36 75 59 / 10%);
  }
`;

const HelpText = styled.p`
  margin: 0;
  color: #818a83;
  font-size: 0.8rem;
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin: 0;
  color: #b42318;
  font-size: 0.8rem;
  line-height: 1.5;
`;
