import OverviewSection from "./sections/overviewSection";
import IncomeExpensesSection from "./sections/incomeExpensesSection";
import SpendingCategoriesSection from "./sections/spendingCategoriesSection";
import WelcomeSection from "./sections/welcomeSection";
import RecentTransactionsSection from "./sections/recentTransactionsSection";
import styled from "styled-components";

export default function DashboardPage() {
  return (
    <StyledDashboard>
      <WelcomeSection />
      <OverviewSection />
      <IncomeExpensesSection />
      <SpendingCategoriesSection />
      <RecentTransactionsSection />
    </StyledDashboard>
  );
}

const StyledDashboard = styled.main`
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    padding: var(--spacing-lg);
  }

  @media (max-width: 480px) {
    padding: var(--spacing-md);
  }
`;
