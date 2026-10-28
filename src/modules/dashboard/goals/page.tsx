"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import {
  goalQueries,
  useCreateFinancialGoal,
  useDeleteFinancialGoal,
  useUpdateFinancialGoal,
  type FinancialGoal,
} from "@/api/financialGoals";
import { transactionQueries } from "@/api/transactions";
import ConfirmDialog from "@/designSystem/confirmDialog";
import { formatCurrency } from "@/shared/formatCurrency";

import GoalModal, { type GoalFormValues } from "./goalModal";

function toFormValues(goal: FinancialGoal): GoalFormValues {
  return {
    name: goal.name,
    target_amount: Number(goal.target_amount),
    current_amount: Number(goal.current_amount),
    target_date: goal.target_date,
    notes: goal.notes,
    is_active: goal.is_active,
  };
}

function emptyFormValues(): GoalFormValues {
  return {
    name: "",
    target_amount: 0,
    current_amount: 0,
    target_date: null,
    notes: null,
    is_active: true,
  };
}

function progressFor(goal: FinancialGoal): number {
  const target = Number(goal.target_amount);
  const current = Number(goal.current_amount);
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, (current / target) * 100));
}

export default function GoalsPage() {
  const [editing, setEditing] = useState<FinancialGoal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleting, setDeleting] = useState<FinancialGoal | null>(null);

  const { data: goals = [], isPending, isError } = useQuery(goalQueries.list());
  const { data: settings } = useQuery(transactionQueries.settings());
  const currency = settings?.currency ?? "USD";

  const createMutation = useCreateFinancialGoal();
  const updateMutation = useUpdateFinancialGoal();
  const deleteMutation = useDeleteFinancialGoal();

  function closeModal() {
    setIsCreating(false);
    setEditing(null);
  }

  function handleSubmit(values: GoalFormValues) {
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
          <Title>Financial goals</Title>
          <SubTitle>Track what you&apos;re saving for and how far you&apos;ve come.</SubTitle>
        </div>

        <AddButton type="button" onClick={() => setIsCreating(true)}>
          + Add goal
        </AddButton>
      </Header>

      {isPending ? (
        <Message>Loading goals...</Message>
      ) : isError ? (
        <Message>Could not load goals.</Message>
      ) : goals.length === 0 ? (
        <EmptyCard>
          <EmptyTitle>No goals yet</EmptyTitle>
          <EmptyText>
            Add a goal to track savings for something that matters.
          </EmptyText>
        </EmptyCard>
      ) : (
        <List>
          {goals.map((goal) => {
            const progress = progressFor(goal);
            return (
              <Card key={goal.id} $muted={!goal.is_active}>
                <CardMain>
                  <CardName>{goal.name}</CardName>
                  <CardMeta>
                    {formatCurrency(goal.current_amount, currency)} saved of{" "}
                    {formatCurrency(goal.target_amount, currency)}
                    {goal.target_date ? ` · by ${goal.target_date}` : ""}
                    {!goal.is_active ? " · inactive" : ""}
                  </CardMeta>

                  <ProgressTrack
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    aria-label={`${goal.name} progress`}
                  >
                    <ProgressFill $progress={progress} />
                  </ProgressTrack>

                  {goal.notes ? <CardNotes>{goal.notes}</CardNotes> : null}
                </CardMain>

                <CardActions>
                  <RowButton type="button" onClick={() => setEditing(goal)}>
                    Edit
                  </RowButton>
                  <RowButton
                    type="button"
                    $danger
                    onClick={() => setDeleting(goal)}
                  >
                    Delete
                  </RowButton>
                </CardActions>
              </Card>
            );
          })}
        </List>
      )}

      {(isCreating || editing) && (
        <GoalModal
          title={editing ? "Edit goal" : "Add goal"}
          description="Set a savings target and track your progress."
          submitLabel={editing ? "Save changes" : "Add goal"}
          initialValues={editing ? toFormValues(editing) : emptyFormValues()}
          isPending={activeMutation.isPending}
          errorMessage={
            activeMutation.error
              ? activeMutation.error instanceof Error
                ? activeMutation.error.message
                : "Could not save this goal."
              : null
          }
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this goal?"
          description={`"${deleting.name}" will be permanently removed.`}
          confirmLabel="Delete"
          isPending={deleteMutation.isPending}
          errorMessage={
            deleteMutation.error
              ? deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : "Could not delete this goal."
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
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
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
  margin: 4px 0 10px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
`;

const CardNotes = styled.p`
  margin: 10px 0 0;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  line-height: 1.6;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-border);
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: var(--color-primary);
  transition: width 180ms ease;
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
