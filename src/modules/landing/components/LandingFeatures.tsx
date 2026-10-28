import styled from "styled-components";

import theme from "@/styles/theme";

const features = [
  {
    number: "01",
    icon: "↗",
    title: "Know your balance",
    description:
      "See your current balance, income, and expenses in one clear overview.",
    link: "Explore your overview",
  },
  {
    number: "02",
    icon: "◷",
    title: "Track every transaction",
    description:
      "Keep your income and spending organized with a simple transaction history.",
    link: "View transactions",
  },
  {
    number: "03",
    icon: "◉",
    title: "Understand your spending",
    description:
      "Discover where your money goes with visual spending categories.",
    link: "Understand your habits",
  },
];

export default function LandingFeatures() {
  return (
    <FeatureSection id="features">
      <SectionHeading>
        <SectionEyebrow>YOUR MONEY, IN FOCUS</SectionEyebrow>

        <SectionTitle>
          Everything you need.
          <br />
          <SectionTitleAccent>Nothing you don&apos;t.</SectionTitleAccent>
        </SectionTitle>

        <SectionDescription>
          Simple tools to help you understand your finances and make more
          confident decisions.
        </SectionDescription>
      </SectionHeading>

      <FeatureGrid>
        {features.map((feature) => (
          <FeatureCard key={feature.number}>
            <FeatureTop>
              <FeatureIcon aria-hidden="true">{feature.icon}</FeatureIcon>
              <FeatureNumber>{feature.number}</FeatureNumber>
            </FeatureTop>

            <FeatureTitle>{feature.title}</FeatureTitle>

            <FeatureDescription>{feature.description}</FeatureDescription>

            <FeatureLink href="/dashboard">
              {feature.link} <span aria-hidden="true">↗</span>
            </FeatureLink>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </FeatureSection>
  );
}

const FeatureSection = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing["3xl"]} ${theme.spacing["2xl"]};

  @media (max-width: 700px) {
    padding: ${theme.spacing["3xl"]} ${theme.spacing.lg};
  }
`;

const SectionHeading = styled.div`
  max-width: 650px;
  margin-bottom: ${theme.spacing["2xl"]};
`;

const SectionEyebrow = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.primary};
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2.2rem, 4.5vw, 3.2rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.1;
`;

const SectionTitleAccent = styled.span`
  color: ${theme.colors.primary};
`;

const SectionDescription = styled.p`
  max-width: 500px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.75;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: flex-start;
  padding: ${theme.spacing.xl};
  border: ${theme.stroke} solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.surface};
  box-shadow: ${theme.elevation.low};
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.elevation.medium};
  }
`;

const FeatureTop = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
`;

const FeatureIcon = styled.span`
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.primarySoft};
  color: ${theme.colors.primary};
  font-size: 1.4rem;
`;

const FeatureNumber = styled.span`
  color: ${theme.colors.textMuted};
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.text};
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const FeatureDescription = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.7;
`;

const FeatureLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: auto;
  color: ${theme.colors.primary};
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;
