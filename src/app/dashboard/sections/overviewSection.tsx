import BalanceCard from "../components/balanceCard";
import styled from "styled-components";

export default function OverviewSection() {
  return (
    <StyledOverviewSection>
      <StyledOverviewSection_Heading>
        <StyledOverviewSection_Title>Overview</StyledOverviewSection_Title>
      </StyledOverviewSection_Heading>

      <StyledOverviewSection_Cards>
        <BalanceCard title="Total Balance" amount={5250} />
        <BalanceCard title="Income" amount={3200} />
        <BalanceCard title="Expenses" amount={1450} />
      </StyledOverviewSection_Cards>
    </StyledOverviewSection>
  );
}

const StyledOverviewSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledOverviewSection_Heading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const StyledOverviewSection_Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StyledOverviewSection_Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;
