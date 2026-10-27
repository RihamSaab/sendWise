"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import {
  transactionQueries,
  useUpdateSettings,
  type UpdateSettingsInput,
} from "@/api/transactions";

type SettingsFormValues = {
  currency: string;
  starting_balance: number;
  tracking_start_date: string;
  savings_percentage: number;
  savings_basis: "income" | "current_savings";
};

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "LBP", label: "Lebanese Pound (L.L.)" },
  { value: "EUR", label: "Euro (€)" },
];

export default function SettingsPage() {
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const { data: settings, isPending, isError } = useQuery(
    transactionQueries.settings(),
  );
  const updateMutation = useUpdateSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      currency: "USD",
      starting_balance: 0,
      tracking_start_date: new Date().toLocaleDateString("en-CA"),
      savings_percentage: 0,
      savings_basis: "income",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        currency: settings.currency || "USD",
        starting_balance: Number(settings.starting_balance ?? 0),
        tracking_start_date:
          settings.tracking_start_date ||
          new Date().toLocaleDateString("en-CA"),
        savings_percentage: Number(settings.savings_percentage ?? 0),
        savings_basis: settings.savings_basis ?? "income",
      });
    }
  }, [settings, reset]);

  function onSubmit(values: SettingsFormValues) {
    const payload: UpdateSettingsInput = {
      currency: values.currency,
      starting_balance: values.starting_balance,
      tracking_start_date: values.tracking_start_date,
      savings_percentage: values.savings_percentage,
      savings_basis: values.savings_basis,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => setSavedAt(Date.now()),
    });
  }

  if (isPending) {
    return (
      <Page>
        <Message>Loading settings...</Message>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Message>Could not load settings.</Message>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>YOUR WORKSPACE</Eyebrow>
          <Title>Settings</Title>
          <SubTitle>
            Update your currency, starting point, and savings target.
          </SubTitle>
        </div>
      </Header>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <SectionCard>
          <SectionTitle>Account</SectionTitle>

          <Field>
            <Label htmlFor="settings-currency">Main currency</Label>
            <Select
              id="settings-currency"
              {...register("currency", { required: true })}
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </Select>
            <Help>
              Changing the currency does not convert historical amounts.
            </Help>
          </Field>

          <TwoColumn>
            <Field>
              <Label htmlFor="settings-balance">Starting balance</Label>
              <Input
                id="settings-balance"
                type="number"
                min="0"
                step="0.01"
                {...register("starting_balance", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value >= 0) ||
                    "Enter zero or more.",
                })}
              />
              {errors.starting_balance && (
                <ErrorText>{errors.starting_balance.message}</ErrorText>
              )}
            </Field>

            <Field>
              <Label htmlFor="settings-start-date">Tracking start date</Label>
              <Input
                id="settings-start-date"
                type="date"
                {...register("tracking_start_date", {
                  required: "Choose a start date.",
                })}
              />
              {errors.tracking_start_date && (
                <ErrorText>{errors.tracking_start_date.message}</ErrorText>
              )}
            </Field>
          </TwoColumn>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Savings target</SectionTitle>

          <TwoColumn>
            <Field>
              <Label htmlFor="settings-savings-percent">
                Percentage to save
              </Label>
              <Input
                id="settings-savings-percent"
                type="number"
                min="0"
                max="100"
                step="1"
                {...register("savings_percentage", {
                  valueAsNumber: true,
                  validate: (value) =>
                    (Number.isFinite(value) && value >= 0 && value <= 100) ||
                    "Enter a value between 0 and 100.",
                })}
              />
              {errors.savings_percentage && (
                <ErrorText>{errors.savings_percentage.message}</ErrorText>
              )}
            </Field>

            <Field>
              <Label htmlFor="settings-savings-basis">Calculate from</Label>
              <Select
                id="settings-savings-basis"
                {...register("savings_basis")}
              >
                <option value="income">Income</option>
                <option value="current_savings">Current savings</option>
              </Select>
            </Field>
          </TwoColumn>
        </SectionCard>

        {updateMutation.error && (
          <ErrorText role="alert">
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : "Could not save your settings."}
          </ErrorText>
        )}

        {savedAt && !updateMutation.isPending && !updateMutation.error && (
          <SuccessText role="status">Your settings are saved.</SuccessText>
        )}

        <Actions>
          <SubmitButton type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </SubmitButton>
        </Actions>
      </Form>
    </Page>
  );
}

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--color-text);
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 600;
  letter-spacing: -0.04em;
`;

const SubTitle = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
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

const Help = styled.p`
  margin: 2px 0 0;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  min-height: 44px;
  padding: 0 20px;
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

const ErrorText = styled.p`
  margin: 0;
  color: var(--color-error);
  font-size: 13px;
`;

const SuccessText = styled.p`
  margin: 0;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
`;

const Message = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
`;
