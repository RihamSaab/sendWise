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
          <EmptyText>Add your first income to see it here.</EmptyText>
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
  gap: 28px;
  width: 100%;
  max-width: 1200px;
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
  flex-wrap: wrap;
  align-items: flex-end;
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

const AddButton = styled.button`
  min-height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.92;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.article<{ $muted: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 20px;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  opacity: ${({ $muted }) => ($muted ? 0.6 : 1)};

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

const CardMain = styled.div`
  min-width: 0;
`;

const CardName = styled.h3`
  margin: 0;
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
`;

const CardMeta = styled.p`
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const CardNotes = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
`;

const CardAmount = styled.p`
  margin: 0;
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const RowButton = styled.button<{ $danger?: boolean }>`
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: ${({ $danger }) =>
    $danger ? "var(--color-error)" : "var(--color-text)"};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: var(--color-background);
  }
`;

const EmptyCard = styled.div`
  padding: 40px 24px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  text-align: center;
`;

const EmptyTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 600;
`;

const EmptyText = styled.p`
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
`;

const Message = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
`;
