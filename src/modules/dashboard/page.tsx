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
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;
