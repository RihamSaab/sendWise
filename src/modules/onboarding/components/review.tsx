"use client";

import styled from "styled-components";
import type {
  FixedExpense,
  FinancialGoal,
  IncomeSource,
  OnboardingSettings,
} from "@/api/onboarding";

type ReviewProps = {
  settings: OnboardingSettings;
  incomeSources: Array<IncomeSource>;
  fixedExpenses: Array<FixedExpense>;
  financialGoals: Array<FinancialGoal>;
};
import {
  formatAmount,
  formatBasis,
  formatDate,
  formatFrequency,
} from "../helpers";

export default function Review({
  settings,
  incomeSources,
  fixedExpenses,
  financialGoals,
}: ReviewProps) {
  const activeIncome = incomeSources.filter((item) => item.is_active);

  const activeExpenses = fixedExpenses.filter((item) => item.is_active);

  const activeGoals = financialGoals.filter((item) => item.is_active);

  const totalIncome = activeIncome.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const totalExpenses = activeExpenses.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  const totalGoalTargets = activeGoals.reduce(
    (total, goal) => total + Number(goal.target_amount),
    0,
  );

  const totalAlreadySaved = activeGoals.reduce(
    (total, goal) => total + Number(goal.current_amount),
    0,
  );

  return (
    <Container>
      <Heading>Review your finances</Heading>
      <Description>
        Take a final look at your financial setup before finishing. You can go
        back to any previous step to make changes.
      </Description>

      <OverviewGrid>
        <OverviewCard>
          <OverviewLabel>Total listed income</OverviewLabel>
          <OverviewAmount>
            {formatAmount(totalIncome, settings.currency)}
          </OverviewAmount>
          <OverviewNote>
            Sum of entered amounts, before frequency adjustments
          </OverviewNote>
        </OverviewCard>

        <OverviewCard>
          <OverviewLabel>Total listed expenses</OverviewLabel>
          <OverviewAmount>
            {formatAmount(totalExpenses, settings.currency)}
          </OverviewAmount>
          <OverviewNote>
            Sum of entered amounts, before frequency adjustments
          </OverviewNote>
        </OverviewCard>
      </OverviewGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Starting point</SectionTitle>
          <StepNumber>01</StepNumber>
        </SectionHeader>

        <DetailRow>
          <DetailLabel>Currency</DetailLabel>
          <DetailValue>{settings.currency}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Starting balance</DetailLabel>
          <DetailValue>
            {formatAmount(settings.starting_balance, settings.currency)}
          </DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Tracking starts</DetailLabel>
          <DetailValue>{formatDate(settings.tracking_start_date)}</DetailValue>
        </DetailRow>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Income sources</SectionTitle>
          <StepNumber>02</StepNumber>
        </SectionHeader>

        {activeIncome.length === 0 ? (
          <EmptyMessage>No income sources added.</EmptyMessage>
        ) : (
          <ItemList>
            {activeIncome.map((income, index) => (
              <Item key={income.id ?? `${income.name}-${index}`}>
                <ItemMain>
                  <ItemName>{income.name}</ItemName>
                  <ItemSubtitle>
                    {formatFrequency(income.frequency)}
                  </ItemSubtitle>
                </ItemMain>
                <ItemAmount>
                  {formatAmount(income.amount, settings.currency)}
                </ItemAmount>
              </Item>
            ))}
          </ItemList>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Fixed expenses</SectionTitle>
          <StepNumber>03</StepNumber>
        </SectionHeader>

        {activeExpenses.length === 0 ? (
          <EmptyMessage>No fixed expenses added.</EmptyMessage>
        ) : (
          <ItemList>
            {activeExpenses.map((expense, index) => (
              <Item key={expense.id ?? `${expense.name}-${index}`}>
                <ItemMain>
                  <ItemName>{expense.name}</ItemName>
                  <ItemSubtitle>
                    {formatFrequency(expense.frequency)}
                  </ItemSubtitle>
                </ItemMain>
                <ItemAmount>
                  {formatAmount(expense.amount, settings.currency)}
                </ItemAmount>
              </Item>
            ))}
          </ItemList>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Savings and goals</SectionTitle>
          <StepNumber>04</StepNumber>
        </SectionHeader>

        <DetailRow>
          <DetailLabel>Savings target</DetailLabel>
          <DetailValue>{Number(settings.savings_percentage)}%</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Calculated from</DetailLabel>
          <DetailValue>{formatBasis(settings.savings_basis)}</DetailValue>
        </DetailRow>

        {activeGoals.length === 0 ? (
          <EmptyMessage>No financial goals added.</EmptyMessage>
        ) : (
          <>
            <ItemList>
              {activeGoals.map((goal, index) => (
                <GoalItem key={goal.id ?? `${goal.name}-${index}`}>
                  <ItemMain>
                    <ItemName>{goal.name}</ItemName>
                    <ItemSubtitle>
                      {formatAmount(goal.current_amount, settings.currency)}{" "}
                      saved of{" "}
                      {formatAmount(goal.target_amount, settings.currency)}
                    </ItemSubtitle>
                    <GoalTrack aria-label={`${goal.name} savings progress`}>
                      <GoalProgress
                        $progress={
                          Number(goal.target_amount) > 0
                            ? Math.min(
                                100,
                                Math.max(
                                  0,
                                  (Number(goal.current_amount) /
                                    Number(goal.target_amount)) *
                                    100,
                                ),
                              )
                            : 0
                        }
                      />
                    </GoalTrack>
                    {goal.target_date ? (
                      <ItemSubtitle>
                        Target date: {formatDate(goal.target_date)}
                      </ItemSubtitle>
                    ) : null}
                  </ItemMain>

                  <GoalAmount>
                    {formatAmount(goal.target_amount, settings.currency)}
                  </GoalAmount>
                </GoalItem>
              ))}
            </ItemList>

            <Divider />

            <DetailRow>
              <DetailLabel>Total goal targets</DetailLabel>
              <DetailValue>
                {formatAmount(totalGoalTargets, settings.currency)}
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>Total already saved</DetailLabel>
              <DetailValue>
                {formatAmount(totalAlreadySaved, settings.currency)}
              </DetailValue>
            </DetailRow>
          </>
        )}
      </Section>

      <FooterNote>
        Income and expense totals above are simple sums of the entered amounts.
        Weekly, monthly, yearly, and one-time amounts have not been normalized
        to a common period.
      </FooterNote>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
`;

const Heading = styled.h1`
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.035em;
`;

const Description = styled.p`
  margin: 12px 0 28px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled.div`
  padding: var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-primary-soft);
`;

const OverviewLabel = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const OverviewAmount = styled.p`
  margin: 10px 0 6px;
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: clamp(1.3rem, 3vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  overflow-wrap: anywhere;
`;

const OverviewNote = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  line-height: 1.5;
`;

const Section = styled.section`
  margin-top: var(--spacing-md);
  padding: var(--spacing-lg);
  border: var(--stroke) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-muted);

  @media (max-width: 560px) {
    padding: var(--spacing-md);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: var(--color-primary);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.015em;
`;

const StepNumber = styled.span`
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: 12px 0;

  & + & {
    border-top: var(--stroke) solid var(--color-border);
  }
`;

const DetailLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: right;
  overflow-wrap: anywhere;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 14px 0;

  & + & {
    border-top: var(--stroke) solid var(--color-border);
  }
`;

const GoalItem = styled(Item)`
  align-items: flex-start;
`;

const ItemMain = styled.div`
  min-width: 0;
  flex: 1;
`;

const ItemName = styled.p`
  margin: 0;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const ItemSubtitle = styled.p`
  margin: 5px 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  line-height: 1.5;
`;

const ItemAmount = styled.span`
  color: var(--color-primary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
  overflow-wrap: anywhere;
`;

const GoalAmount = styled(ItemAmount)`
  font-size: var(--text-sm);
`;

const GoalTrack = styled.div`
  width: 100%;
  height: 6px;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-border);
`;

const GoalProgress = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 180ms ease;
`;

const Divider = styled.div`
  height: 1px;
  margin: 12px 0;
  background: var(--color-border);
`;

const EmptyMessage = styled.p`
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
`;

const FooterNote = styled.p`
  margin: var(--spacing-md) 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  line-height: 1.6;
`;
