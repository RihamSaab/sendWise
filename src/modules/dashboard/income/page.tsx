"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import {
  incomeQueries,
  useCreateIncomeSource,
  useDeleteIncomeSource,
  useUpdateIncomeSource,
  type IncomeSource,
} from "@/api/incomeSources";
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

function toFormValues(source: IncomeSource): RecurringItemFormValues {
  return {
    name: source.name,
    amount: Number(source.amount),
    frequency: source.frequency,
    start_date: source.start_date,
    end_date: source.end_date,
    notes: source.notes,
    is_active: source.is_active,
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

export default function IncomePage() {
  const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingSource, setDeletingSource] = useState<IncomeSource | null>(
    null,
  );

  const { data: sources = [], isPending, isError } = useQuery(
    incomeQueries.list(),
  );
  const { data: settings } = useQuery(transactionQueries.settings());
  const currency = settings?.currency ?? "USD";

  const createMutation = useCreateIncomeSource();
  const updateMutation = useUpdateIncomeSource();
  const deleteMutation = useDeleteIncomeSource();

  function closeModal() {
    setIsCreating(false);
    setEditingSource(null);
  }

  function handleSubmit(values: RecurringItemFormValues) {
    if (editingSource) {
      updateMutation.mutate(
        { id: editingSource.id, input: values },
        { onSuccess: closeModal },
      );
      return;
    }
    createMutation.mutate(values, { onSuccess: closeModal });
  }

  const activeMutation = editingSource ? updateMutation : createMutation;

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>YOUR FINANCES</Eyebrow>
          <Title>Income sources</Title>
          <SubTitle>Manage the money coming in each period.</SubTitle>
        </div>

        <AddButton type="button" onClick={() => setIsCreating(true)}>
          + Add income source
        </AddButton>
      </Header>

      {isPending ? (
        <Message>Loading income sources...</Message>
      ) : isError ? (
        <Message>Could not load income sources.</Message>
      ) : sources.length === 0 ? (
        <EmptyCard>
          <EmptyTitle>No income sources yet</EmptyTitle>
          <EmptyText>
            Add your salary, freelance income, or any other regular money
            coming in.
          </EmptyText>
          <EmptyAddButton type="button" onClick={() => setIsCreating(true)}>
            + Add an income source
          </EmptyAddButton>
        </EmptyCard>
      ) : (
        <List>
          {sources.map((source) => (
            <Card key={source.id} $muted={!source.is_active}>
              <CardMain>
                <CardName>{source.name}</CardName>
                <CardMeta>
                  {formatFrequency(source.frequency)} · from{" "}
                  {source.start_date}
                  {source.end_date ? ` to ${source.end_date}` : ""}
                  {!source.is_active ? " · inactive" : ""}
                </CardMeta>
                {source.notes ? <CardNotes>{source.notes}</CardNotes> : null}
              </CardMain>

              <CardAmount>
                {formatCurrency(source.amount, currency)}
              </CardAmount>

              <CardActions>
                <RowButton
                  type="button"
                  onClick={() => setEditingSource(source)}
                >
                  Edit
                </RowButton>
                <RowButton
                  type="button"
                  $danger
                  onClick={() => setDeletingSource(source)}
                >
                  Delete
                </RowButton>
              </CardActions>
            </Card>
          ))}
        </List>
      )}

      {(isCreating || editingSource) && (
        <RecurringItemModal
          title={editingSource ? "Edit income source" : "Add income source"}
          description="Record a recurring or one-time source of income."
          submitLabel={editingSource ? "Save changes" : "Add income"}
          initialValues={
            editingSource ? toFormValues(editingSource) : emptyFormValues()
          }
          isPending={activeMutation.isPending}
          errorMessage={
            activeMutation.error
              ? activeMutation.error instanceof Error
                ? activeMutation.error.message
                : "Could not save this income source."
              : null
          }
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {deletingSource && (
        <ConfirmDialog
          title="Delete this income source?"
          description={`"${deletingSource.name}" will be permanently removed.`}
          confirmLabel="Delete"
          isPending={deleteMutation.isPending}
          errorMessage={
            deleteMutation.error
              ? deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : "Could not delete this income source."
              : null
          }
          onConfirm={() =>
            deleteMutation.mutate(deletingSource.id, {
              onSuccess: () => setDeletingSource(null),
            })
          }
          onCancel={() => setDeletingSource(null)}
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

  &:hover {
    transform: translateY(-2px);
    background: var(--gradient-primary-hover);
    box-shadow:
      var(--specular-top-dark),
      var(--elevation-3);
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
  border: none;
  border-radius: var(--radius-xl);
  background: var(--gradient-surface);
  box-shadow:
    var(--specular-top),
    var(--elevation-1);
  opacity: ${({ $muted }) => ($muted ? 0.6 : 1)};
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      var(--specular-top),
      var(--elevation-3);
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

const EmptyAddButton = styled.button`
  margin-top: var(--spacing-lg);
  min-height: 42px;
  padding: 0 var(--spacing-lg);
  border: none;
  border-radius: var(--radius-pill);
  background: var(--gradient-primary);
  box-shadow:
    var(--specular-top-dark),
    var(--elevation-1);
  color: var(--color-text-on-primary);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-base) var(--ease-silk),
    transform var(--dur-base) var(--ease-silk),
    box-shadow var(--dur-base) var(--ease-silk);

  &:hover {
    transform: translateY(-2px);
    background: var(--gradient-primary-hover);
    box-shadow:
      var(--specular-top-dark),
      var(--elevation-3);
  }
`;

const Message = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
`;
