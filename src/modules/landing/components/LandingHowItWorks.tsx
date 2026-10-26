import styled from "styled-components";

import theme from "@/styles/theme";

const steps = [
  {
    number: "01",
    title: "Set up your finances",
    description:
      "Start with your balance, currency, income, and regular expenses.",
  },
  {
    number: "02",
    title: "Track your activity",
    description:
      "Record your transactions and keep your financial activity organized.",
  },
  {
    number: "03",
    title: "See the bigger picture",
    description:
      "Review your balance, spending categories, and income versus expenses.",
  },
];

export default function LandingHowItWorks() {
  return (
    <HowSection id="how-it-works">
      <HowContent>
        <SectionEyebrow>HOW IT WORKS</SectionEyebrow>

        <HowTitle>
          A clearer view of your money,
          <br />
          <HowTitleAccent>in three simple steps.</HowTitleAccent>
        </HowTitle>

        <HowDescription>
          SpendWise helps you build a clearer picture of your finances without
          making money management complicated.
        </HowDescription>
      </HowContent>

      <StepsList>
        {steps.map((step, index) => (
          <StepItem key={step.number}>
            <StepNumber>{step.number}</StepNumber>

            <StepText>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepText>

            {index < steps.length - 1 && (
              <StepArrow aria-hidden="true">↘</StepArrow>
            )}
          </StepItem>
        ))}
      </StepsList>
    </HowSection>
  );
}

const HowSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 64px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 88px ${theme.spacing["2xl"]};
  border-top: 1px solid ${theme.colors.border};

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  @media (max-width: 700px) {
    padding: 72px ${theme.spacing.lg};
  }
`;

const HowContent = styled.div`
  max-width: 540px;
`;

const SectionEyebrow = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
`;

const HowTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 650;
  letter-spacing: -0.06em;
  line-height: 1.15;
`;

const HowTitleAccent = styled.span`
  color: ${theme.colors.primary};
`;

const HowDescription = styled.p`
  max-width: 460px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.8;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const StepItem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const StepNumber = styled.span`
  display: grid;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 50%;
  background: ${theme.colors.sage};
  color: ${theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 700;
`;

const StepText = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.text};
  font-size: 1.05rem;
  font-weight: 650;
`;

const StepDescription = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.75;
`;

const StepArrow = styled.span`
  color: ${theme.colors.amber};
  font-size: 1.25rem;
`;
