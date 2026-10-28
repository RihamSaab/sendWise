"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import {
  fixedExpenseQueries,
  useCreateFixedExpense,
  useDeleteFixedExpense,
  useUpdateFixedExpense,
  type FixedExpense,
} from "@/api/fixedExpenses";
import { transactionQueries } from "@/api/transactions";
import ConfirmDialog from "@/designSystem/confirmDialog";
import { formatCurrency } from "@/shared/formatCurrency";

import RecurringItemModal, {
  type RecurringItemFormValues,
} from "../recurring/recurringItemModal";

function todayISO(): string {
  return new Date().toLocaleDateString("en-CA");
}

function formatFrequency(frequency: string): string {
  const labels: Record<string, string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    one_time: "One-time",
  };
  return labels[frequency] ?? frequency;
}

function toFormValues(expense: FixedExpense): RecurringItemFormValues {
  return {
    name: expense.name,
    amount: Number(expense.amount),
    frequency: expense.frequency,
    start_date: expense.start_date,
    end_date: expense.end_date,
    notes: expense.notes,
    is_active: expense.is_active,
  };
}

function emptyFormValues(): RecurringItemFormValues {
  return {
    name: "",
    amount: 0,
    frequency: "monthly",
    start_date: todayISO(),
    end_date: null,
    notes: null,
    is_active: true,
  };
}

export default function ExpensesPage() {
  const [editing, setEditing] = useState<FixedExpense | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleting, setDeleting] = useState<FixedExpense | null>(null);

  const { data: expenses = [], isPending, isError } = useQuery(
    fixedExpenseQueries.list(),
  );
  const { data: settings } = useQuery(transactionQueries.settings());
  const currency = settings?.currency ?? "USD";

  const createMutation = useCreateFixedExpense();
  const updateMutation = useUpdateFixedExpense();
  const deleteMutation = useDeleteFixedExpense();

  function closeModal() {
    setIsCreating(false);
    setEditing(null);
  }

  function handleSubmit(values: RecurringItemFormValues) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: values },
        { onSuccess: closeModal },
      );
      return;
    }
    createMutation.mutate(values, { onSuccess: closeModal });
  }

  const activeMutation = editing ? updateMutation : createMutation;

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>YOUR FINANCES</Eyebrow>
          <Title>Fixed expenses</Title>
          <SubTitle>Recurring bills and other regular commitments.</SubTitle>
        </div>

        <AddButton type="button" onClick={() => setIsCreating(true)}>
          + Add fixed expense
        </AddButton>
      </Header>

      {isPending ? (
        <Message>Loading expenses...</Message>
      ) : isError ? (
        <Message>Could not load expenses.</Message>
      ) : expenses.length === 0 ? (
        <EmptyCard>
          <EmptyTitle>No fixed expenses yet</EmptyTitle>
          <EmptyText>Add rent, utilities, subscriptions, and more.</EmptyText>
        </EmptyCard>
      ) : (
        <List>
          {expenses.map((expense) => (
            <Card key={expense.id} $muted={!expense.is_active}>
              <CardMain>
                <CardName>{expense.name}</CardName>
                <CardMeta>
                  {formatFrequency(expense.frequency)} · from{" "}
                  {expense.start_date}
                  {expense.end_date ? ` to ${expense.end_date}` : ""}
                  {!expense.is_active ? " · inactive" : ""}
                </CardMeta>
                {expense.notes ? <CardNotes>{expense.notes}</CardNotes> : null}
              </CardMain>

              <CardAmount>
                {formatCurrency(expense.amount, currency)}
              </CardAmount>

              <CardActions>
                <RowButton type="button" onClick={() => setEditing(expense)}>
                  Edit
                </RowButton>
                <RowButton
                  type="button"
                  $danger
                  onClick={() => setDeleting(expense)}
                >
                  Delete
                </RowButton>
              </CardActions>
            </Card>
          ))}
        </List>
      )}

      {(isCreating || editing) && (
        <RecurringItemModal
          title={editing ? "Edit fixed expense" : "Add fixed expense"}
          description="Record a recurring or one-time expense."
          submitLabel={editing ? "Save changes" : "Add expense"}
          initialValues={editing ? toFormValues(editing) : emptyFormValues()}
          isPending={activeMutation.isPending}
          errorMessage={
            activeMutation.error
              ? activeMutation.error instanceof Error
                ? activeMutation.error.message
                : "Could not save this expense."
              : null
          }
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this fixed expense?"
          description={`"${deleting.name}" will be permanently removed.`}
          confirmLabel="Delete"
          isPending={deleteMutation.isPending}
          errorMessage={
            deleteMutation.error
              ? deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : "Could not delete this expense."
              : null
          }
          onConfirm={() =>
            deleteMutation.mutate(deleting.id, {
              onSuccess: () => setDeleting(null),
            })
          }
          onCancel={() => setDeleting(null)}
        />
      )}
    </Page>
  );
}

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl);

  @media (max-width: 768px) {
    padding: var(--spacing-lg);
  }

  @media (max-width: 480px) {
    padding: var(--spacing-md);
  }
`;

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--color-text);
  font-size: clamp(26px, 4vw, 32px);
  font-weight: 600;
  letter-spacing: -0.035em;
`;

const SubTitle = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
`;

const AddButton = styled.button`
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

  &:hover {
    transform: translateY(-1px);
    background: var(--color-primary-hover);
    box-shadow: var(--elevation-2);
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Card = styled.article<{ $muted: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--elevation-1);
  opacity: ${({ $muted }) => ($muted ? 0.6 : 1)};
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--elevation-2);
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-sm);
  }
`;

const CardMain = styled.div`
  min-width: 0;
`;

const CardName = styled.h3`
  margin: 0;
  color: var(--color-text);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.015em;
`;

const CardMeta = styled.p`
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
`;

const CardNotes = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  line-height: 1.6;
`;

const CardAmount = styled.p`
  margin: 0;
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;

const CardActions = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const RowButton = styled.button<{ $danger?: boolean }>`
  min-height: 34px;
  padding: 0 var(--spacing-sm);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: ${({ $danger }) =>
    $danger ? "var(--color-error)" : "var(--color-text)"};
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${({ $danger }) =>
      $danger ? "var(--color-error)" : "var(--color-primary)"};
  }
`;

const EmptyCard = styled.div`
  padding: var(--spacing-2xl) var(--spacing-lg);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  text-align: center;
`;

const EmptyTitle = styled.h2`
  margin: 0;
  color: var(--color-primary);
  font-size: var(--text-md);
  font-weight: 600;
`;

const EmptyText = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
`;

const Message = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
`;
