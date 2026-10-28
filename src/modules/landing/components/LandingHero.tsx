"use client";

import { useQuery } from "@tanstack/react-query";
import styled, { keyframes } from "styled-components";

import { transactionQueries } from "@/api/transactions";
import theme from "@/styles/theme";

const previewBars = [
  { label: "Jan", height: 42 },
  { label: "Feb", height: 58 },
  { label: "Mar", height: 48 },
  { label: "Apr", height: 72 },
  { label: "May", height: 62 },
  { label: "Jun", height: 88 },
  { label: "Jul", height: 76 },
];

export default function LandingHero() {
  const { data: settings } = useQuery({
    ...transactionQueries.settings(),
    retry: false,
  });

  const hasPlan = settings?.onboarding_completed === true;
  const ctaHref = hasPlan ? "/dashboard" : "/onboarding";
  const ctaLabel = hasPlan ? "Open my dashboard" : "Create my financial plan";

  return (
    <Hero>
      <HeroContent>
        <Eyebrow>
          <EyebrowDot />
          A clearer way to manage your money
        </Eyebrow>

        <HeroTitle>
          Your money,
          <HeroTitleAccent> with a plan.</HeroTitleAccent>
        </HeroTitle>

        <HeroDescription>
          Understand your finances, plan for what matters, and make more
          informed decisions about your money — all in one place.
        </HeroDescription>

        <HeroActions>
          <PrimaryButton href={ctaHref}>
            {ctaLabel}
            <ButtonArrow aria-hidden="true">→</ButtonArrow>
          </PrimaryButton>

          <SecondaryButton href="#how-it-works">
            See how it works
          </SecondaryButton>
        </HeroActions>

        <TrustNote>
          <TrustIcon aria-hidden="true">✓</TrustIcon>
          <span>Your finances, organized around your own goals.</span>
        </TrustNote>
      </HeroContent>

      <PreviewArea aria-label="Illustrative SpendWise dashboard preview">
        <PreviewGlow />

        <PreviewCard>
          <PreviewHeader>
            <PreviewBrand>
              <PreviewBrandMark aria-hidden="true">S</PreviewBrandMark>
              <span>Financial overview</span>
            </PreviewBrand>
            <PreviewStatus>
              <StatusDot />
              Preview
            </PreviewStatus>
          </PreviewHeader>

          <PreviewGreeting>
            <GreetingLabel>Available balance</GreetingLabel>
            <BalanceAmount>$2,840.00</BalanceAmount>
          </PreviewGreeting>

          <SummaryGrid>
            <SummaryCard>
              <SummaryIcon $kind="income" aria-hidden="true">↙</SummaryIcon>
              <SummaryBody>
                <SummaryLabel>Income</SummaryLabel>
                <SummaryAmount>$3,600</SummaryAmount>
              </SummaryBody>
            </SummaryCard>

            <SummaryCard>
              <SummaryIcon $kind="expense" aria-hidden="true">↗</SummaryIcon>
              <SummaryBody>
                <SummaryLabel>Expenses</SummaryLabel>
                <SummaryAmount>$760</SummaryAmount>
              </SummaryBody>
            </SummaryCard>
          </SummaryGrid>

          <ChartCard>
            <ChartHeader>
              <div>
                <ChartTitle>Spending overview</ChartTitle>
                <ChartSubtitle>A sample 7-month trend</ChartSubtitle>
              </div>
              <ChartBadge>Sample</ChartBadge>
            </ChartHeader>

            <Chart>
              {previewBars.map((bar, index) => (
                <ChartColumn key={bar.label}>
                  <BarTrack>
                    <Bar
                      $height={bar.height}
                      $highlight={index === previewBars.length - 1}
                      $delay={index * 80}
                    />
                  </BarTrack>
                  <BarLabel>{bar.label}</BarLabel>
                </ChartColumn>
              ))}
            </Chart>
          </ChartCard>
        </PreviewCard>

        <FloatingNote>
          <FloatingIcon aria-hidden="true">✓</FloatingIcon>
          <div>
            <FloatingTitle>Built around you</FloatingTitle>
            <FloatingDescription>Your goals. Your plan.</FloatingDescription>
          </div>
        </FloatingNote>
      </PreviewArea>
    </Hero>
  );
}

const floatIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatSoftly = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const growBar = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: center;
  gap: clamp(32px, 5vw, 72px);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing["4xl"]} ${theme.spacing["2xl"]};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 56px;
    padding: ${theme.spacing["3xl"]} ${theme.spacing.lg};
  }
`;

const HeroContent = styled.div`
  animation: ${floatIn} 650ms ease both;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.primary};
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const EyebrowDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${theme.colors.amber};
  box-shadow: 0 0 0 4px ${theme.colors.primarySoft};
`;

const HeroTitle = styled.h1`
  max-width: 600px;
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2.6rem, 5vw, 4.4rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 1.02;
`;

const HeroTitleAccent = styled.span`
  display: block;
  color: ${theme.colors.primary};
`;

const HeroDescription = styled.p`
  max-width: 480px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.75;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  min-height: 52px;
  padding: 0 ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.radius.pill};
  background: ${theme.gradient.primary};
  box-shadow:
    ${theme.specular.topDark},
    ${theme.elevation.low};
  color: ${theme.colors.textOnPrimary};
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background ${theme.duration.base} ${theme.ease.silk},
    transform ${theme.duration.base} ${theme.ease.silk},
    box-shadow ${theme.duration.base} ${theme.ease.silk};

  &:hover {
    transform: translateY(-2px);
    background: ${theme.gradient.primaryHover};
    box-shadow:
      ${theme.specular.topDark},
      ${theme.elevation.high};
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      ${theme.specular.topDark},
      ${theme.elevation.high},
      0 0 0 3px rgb(196 138 74 / 35%);
  }
`;

const ButtonArrow = styled.span`
  font-size: 1.05rem;
  transition: transform 180ms ease;

  ${PrimaryButton}:hover & {
    transform: translateX(2px);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 ${theme.spacing.xl};
  border: none;
  border-radius: ${theme.radius.pill};
  background: ${theme.gradient.surface};
  box-shadow:
    ${theme.specular.top},
    ${theme.elevation.low};
  color: ${theme.colors.text};
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    color ${theme.duration.base} ${theme.ease.silk},
    box-shadow ${theme.duration.base} ${theme.ease.silk},
    transform ${theme.duration.base} ${theme.ease.silk};

  &:hover {
    transform: translateY(-1px);
    color: ${theme.colors.primary};
    box-shadow:
      ${theme.specular.top},
      ${theme.elevation.medium};
  }
`;

const TrustNote = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  line-height: 1.6;
`;

const TrustIcon = styled.span`
  display: grid;
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  background: ${theme.colors.primarySoft};
  color: ${theme.colors.primary};
  font-size: 0.72rem;
  font-weight: 700;
`;

const PreviewArea = styled.div`
  position: relative;
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  animation: ${floatIn} 800ms 120ms ease both;

  @media (prefers-reduced-motion: no-preference) {
    animation:
      ${floatIn} 800ms 120ms ease both,
      ${floatSoftly} 7s 1s ease-in-out infinite;
  }
`;

const PreviewGlow = styled.div`
  position: absolute;
  inset: 10% -8% 5%;
  border-radius: 50%;
  background: ${theme.colors.primarySoft};
  filter: blur(60px);
  opacity: 0.65;
  pointer-events: none;
`;

const PreviewCard = styled.div`
  position: relative;
  padding: ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.radius.xl};
  background: ${theme.gradient.surface};
  box-shadow:
    ${theme.specular.top},
    ${theme.elevation.high};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.md};
  border-bottom: ${theme.stroke} solid ${theme.colors.border};
`;

const PreviewBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text};
  font-size: var(--text-sm);
  font-weight: 600;
`;

const PreviewBrandMark = styled.span`
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.primary};
  color: ${theme.colors.textOnPrimary};
  font-size: 0.9rem;
  font-weight: 700;
`;

const PreviewStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${theme.colors.amber};
`;

const PreviewGreeting = styled.div`
  padding: ${theme.spacing.lg} 0 ${theme.spacing.md};
  border-bottom: ${theme.stroke} solid ${theme.colors.border};
`;

const GreetingLabel = styled.p`
  margin: 0 0 6px;
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const BalanceAmount = styled.p`
  margin: 0;
  color: ${theme.colors.primary};
  font-family: var(--font-mono);
  font-size: clamp(1.9rem, 4vw, 2.4rem);
  font-weight: 500;
  letter-spacing: -0.03em;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const SummaryCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-width: 0;
  padding: ${theme.spacing.md};
  border: none;
  border-radius: ${theme.radius.lg};
  background: ${theme.gradient.surfaceMuted};
  box-shadow: ${theme.specular.top};
`;

const SummaryBody = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
`;

const SummaryIcon = styled.span<{ $kind: "income" | "expense" }>`
  display: grid;
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: ${theme.radius.md};
  background: ${({ $kind }) =>
    $kind === "income" ? theme.colors.primarySoft : theme.colors.amberSoft};
  color: ${({ $kind }) =>
    $kind === "income" ? theme.colors.primary : theme.colors.amber};
  font-size: 1rem;
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const SummaryAmount = styled.span`
  overflow: hidden;
  color: ${theme.colors.text};
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChartCard = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border: ${theme.stroke} solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const ChartTitle = styled.h3`
  margin: 0;
  color: ${theme.colors.text};
  font-size: var(--text-sm);
  font-weight: 600;
`;

const ChartSubtitle = styled.p`
  margin: 4px 0 0;
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
`;

const ChartBadge = styled.span`
  flex: 0 0 auto;
  padding: 4px 8px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.primarySoft};
  color: ${theme.colors.primary};
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Chart = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: ${theme.spacing.sm};
  height: 120px;
  margin-top: ${theme.spacing.md};
`;

const ChartColumn = styled.div`
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

const BarTrack = styled.div`
  display: flex;
  width: 100%;
  max-width: 26px;
  height: 92px;
  align-items: flex-end;
  overflow: hidden;
  border-radius: ${theme.radius.sm} ${theme.radius.sm} 2px 2px;
  background: ${theme.colors.background};
`;

const Bar = styled.div<{
  $height: number;
  $highlight: boolean;
  $delay: number;
}>`
  width: 100%;
  height: ${({ $height }) => $height}%;
  transform-origin: bottom;
  border-radius: ${theme.radius.sm} ${theme.radius.sm} 2px 2px;
  background: ${({ $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.primarySoft};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${growBar} 700ms ${({ $delay }) => $delay}ms ease both;
  }
`;

const BarLabel = styled.span`
  color: ${theme.colors.textMuted};
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const FloatingNote = styled.div`
  position: absolute;
  right: -24px;
  bottom: 72px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border: none;
  border-radius: ${theme.radius.pill};
  background: ${theme.gradient.surface};
  box-shadow:
    ${theme.specular.top},
    ${theme.elevation.high};
  animation: ${floatIn} 900ms 350ms ${theme.ease.silk} both;

  @media (max-width: 600px) {
    right: -5px;
    bottom: 56px;
    padding: ${theme.spacing.sm};
  }
`;

const FloatingIcon = styled.span`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.primarySoft};
  color: ${theme.colors.primary};
  font-weight: 700;
`;

const FloatingTitle = styled.p`
  margin: 0;
  color: ${theme.colors.text};
  font-size: var(--text-sm);
  font-weight: 600;
`;

const FloatingDescription = styled.p`
  margin: 4px 0 0;
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
`;
