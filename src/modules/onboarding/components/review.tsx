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
  color: #244b3b;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.04em;
`;

const Description = styled.p`
  margin: 12px 0 28px;
  color: #6b756f;
  font-size: 0.95rem;
  line-height: 1.7;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled.div`
  padding: 20px;
  border: 1px solid #dce7dc;
  border-radius: 14px;
  background: #f0f6ef;
`;

const OverviewLabel = styled.p`
  margin: 0;
  color: #526c5c;
  font-size: 0.85rem;
`;

const OverviewAmount = styled.p`
  margin: 10px 0 6px;
  color: #244b3b;
  font-size: clamp(1.3rem, 3vw, 1.75rem);
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const OverviewNote = styled.p`
  margin: 0;
  color: #6b756f;
  font-size: 0.75rem;
  line-height: 1.5;
`;

const Section = styled.section`
  margin-top: 20px;
  padding: 22px;
  border: 1px solid #e3e7df;
  border-radius: 14px;
  background: #fcfcf9;

  @media (max-width: 560px) {
    padding: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #244b3b;
  font-size: 1.05rem;
  font-weight: 600;
`;

const StepNumber = styled.span`
  color: #a0afa2;
  font-size: 0.8rem;
  font-weight: 600;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;

  & + & {
    border-top: 1px solid #edf0e9;
  }
`;

const DetailLabel = styled.span`
  color: #6b756f;
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  color: #273b31;
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
  gap: 16px;
  padding: 14px 0;

  & + & {
    border-top: 1px solid #edf0e9;
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
  color: #273b31;
  font-size: 0.9rem;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

const ItemSubtitle = styled.p`
  margin: 5px 0 0;
  color: #7a837c;
  font-size: 0.8rem;
  line-height: 1.5;
`;

const ItemAmount = styled.span`
  color: #244b3b;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
  overflow-wrap: anywhere;
`;

const GoalAmount = styled(ItemAmount)`
  font-size: 0.85rem;
`;

const GoalTrack = styled.div`
  width: 100%;
  height: 6px;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #e5ebe2;
`;

const GoalProgress = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: inherit;
  background: #73967b;
  transition: width 180ms ease;
`;

const Divider = styled.div`
  height: 1px;
  margin: 12px 0;
  background: #e3e7df;
`;

const EmptyMessage = styled.p`
  margin: 0;
  color: #7a837c;
  font-size: 0.875rem;
  line-height: 1.6;
`;

const FooterNote = styled.p`
  margin: 18px 0 0;
  color: #7a837c;
  font-size: 0.8rem;
  line-height: 1.6;
`;
