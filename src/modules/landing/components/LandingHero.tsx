import styled, { keyframes } from "styled-components";

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
  return (
    <Hero>
      <HeroContent>
        <Eyebrow>
          <EyebrowDot />A clearer way to manage your money
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
          <PrimaryButton href="/onboarding">
            Create my financial plan
            <ButtonArrow aria-hidden="true">↗</ButtonArrow>
          </PrimaryButton>

          <SecondaryButton href="#how-it-works">
            See how it works
            <span aria-hidden="true">↓</span>
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
              Dashboard preview
            </PreviewStatus>
          </PreviewHeader>

          <PreviewGreeting>
            <div>
              <GreetingLabel>Your money at a glance</GreetingLabel>
              <GreetingTitle>A clearer picture.</GreetingTitle>
            </div>
            <PreviewAvatar aria-hidden="true">✳</PreviewAvatar>
          </PreviewGreeting>

          <BalanceCard>
            <BalanceTop>
              <BalanceLabel>Available balance</BalanceLabel>
              <BalanceIcon aria-hidden="true">↗</BalanceIcon>
            </BalanceTop>
            <BalanceAmount>$2,840.00</BalanceAmount>
            <BalanceCaption>
              An example of how your balance could appear
            </BalanceCaption>
          </BalanceCard>

          <SummaryGrid>
            <SummaryCard>
              <SummaryIcon $kind="income" aria-hidden="true">
                ↙
              </SummaryIcon>
              <SummaryLabel>Income</SummaryLabel>
              <SummaryAmount>$3,600</SummaryAmount>
              <SummaryCaption>Illustrative</SummaryCaption>
            </SummaryCard>

            <SummaryCard>
              <SummaryIcon $kind="expense" aria-hidden="true">
                ↗
              </SummaryIcon>
              <SummaryLabel>Expenses</SummaryLabel>
              <SummaryAmount>$760</SummaryAmount>
              <SummaryCaption>Illustrative</SummaryCaption>
            </SummaryCard>
          </SummaryGrid>

          <ChartCard>
            <ChartHeader>
              <div>
                <ChartTitle>Spending overview</ChartTitle>
                <ChartSubtitle>
                  An example of a spending trend
                </ChartSubtitle>
              </div>
              <ChartBadge>Sample data</ChartBadge>
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

          <PreviewFooter>
            <PreviewFooterIcon aria-hidden="true">✳</PreviewFooterIcon>
            <span>
              Your real dashboard reflects the information you enter.
            </span>
          </PreviewFooter>
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
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatSoftly = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
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
  max-width: 1280px;
  min-height: 650px;
  margin: 0 auto;
  padding: 76px ${theme.spacing["2xl"]} 92px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 54px;
    padding-top: 64px;
  }

  @media (max-width: 600px) {
    gap: 44px;
    padding: 48px ${theme.spacing.lg} 64px;
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
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.025em;
`;

const EyebrowDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.amber};
  box-shadow: 0 0 0 4px ${theme.colors.sage};
`;

const HeroTitle = styled.h1`
  max-width: 600px;
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(3.2rem, 6vw, 5.35rem);
  font-weight: 600;
  letter-spacing: -0.075em;
  line-height: 0.99;

  @media (max-width: 600px) {
    font-size: clamp(3rem, 12vw, 4rem);
  }
`;

const HeroTitleAccent = styled.span`
  display: block;
  color: ${theme.colors.primary};
`;

const HeroDescription = styled.p`
  max-width: 490px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 1.05rem;
  line-height: 1.85;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  min-height: 52px;
  padding: 0 ${theme.spacing.lg};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.primary};
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;

  &:hover {
    transform: translateY(-2px);
    background: ${theme.colors.primaryHover};
    box-shadow: 0 9px 22px rgb(36 75 59 / 15%);
  }

  &:focus-visible {
    outline: 3px solid ${theme.colors.amber};
    outline-offset: 3px;
  }
`;

const ButtonArrow = styled.span`
  font-size: 1.05rem;
  transition: transform 180ms ease;

  ${PrimaryButton}:hover & {
    transform: translate(2px, -2px);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  min-height: 52px;
  padding: 0 ${theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${theme.radius.md};
  color: ${theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 180ms ease,
    border-color 180ms ease;

  &:hover {
    border-color: ${theme.colors.border};
    background: ${theme.colors.surface};
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
  background: ${theme.colors.sage};
  color: ${theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
`;

const PreviewArea = styled.div`
  position: relative;
  width: 100%;
  max-width: 570px;
  margin: 0 auto;
  animation: ${floatIn} 800ms 120ms ease both;

  @media (prefers-reduced-motion: no-preference) {
    animation:
      ${floatIn} 800ms 120ms ease both,
      ${floatSoftly} 6s 1s ease-in-out infinite;
  }
`;

const PreviewGlow = styled.div`
  position: absolute;
  inset: 10% -8% 5%;
  border-radius: 50%;
  background: ${theme.colors.sage};
  filter: blur(55px);
  opacity: 0.65;
  pointer-events: none;
`;

const PreviewCard = styled.div`
  position: relative;
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.surface};
  box-shadow:
    0 28px 75px rgb(37 41 35 / 9%),
    0 3px 12px rgb(37 41 35 / 3%);

  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`;

const PreviewBrand = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text};
  font-size: 0.83rem;
  font-weight: 650;
`;

const PreviewBrandMark = styled.span`
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.primary};
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
`;

const PreviewStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.textSecondary};
  font-size: 0.68rem;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${theme.colors.amber};
`;

const PreviewGreeting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg} 0;
`;

const GreetingLabel = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.76rem;
`;

const GreetingTitle = styled.h2`
  margin: 5px 0 0;
  color: ${theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.045em;
`;

const PreviewAvatar = styled.div`
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  background: ${theme.colors.sage};
  color: ${theme.colors.primary};
  font-size: 1.1rem;
`;

const BalanceCard = styled.div`
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.primary};
  color: #ffffff;
`;

const BalanceTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const BalanceLabel = styled.span`
  color: rgb(255 255 255 / 75%);
  font-size: 0.78rem;
`;

const BalanceIcon = styled.span`
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: ${theme.radius.sm};
  font-size: 0.9rem;
`;

const BalanceAmount = styled.p`
  margin: ${theme.spacing.sm} 0;
  font-size: clamp(1.8rem, 4vw, 2.35rem);
  font-weight: 600;
  letter-spacing: -0.06em;
`;

const BalanceCaption = styled.p`
  margin: 0;
  color: rgb(255 255 255 / 70%);
  font-size: 0.68rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const SummaryCard = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 5px ${theme.spacing.sm};
  min-width: 0;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
`;

const SummaryIcon = styled.span<{ $kind: "income" | "expense" }>`
  display: grid;
  grid-row: span 2;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: ${theme.radius.sm};
  background: ${({ $kind }) =>
    $kind === "income" ? theme.colors.sage : "#F8EDE3"};
  color: ${({ $kind }) =>
    $kind === "income" ? theme.colors.primary : theme.colors.amber};
  font-size: 1rem;
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.72rem;
`;

const SummaryAmount = styled.span`
  overflow: hidden;
  color: ${theme.colors.text};
  font-size: clamp(0.95rem, 2.3vw, 1.12rem);
  font-weight: 650;
  letter-spacing: -0.035em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SummaryCaption = styled.span`
  grid-column: 2;
  color: ${theme.colors.textSecondary};
  font-size: 0.65rem;
`;

const ChartCard = styled.div`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
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
  font-size: 0.82rem;
  font-weight: 650;
`;

const ChartSubtitle = styled.p`
  margin: 5px 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.67rem;
`;

const ChartBadge = styled.span`
  flex: 0 0 auto;
  padding: 5px 7px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.sage};
  color: ${theme.colors.primary};
  font-size: 0.63rem;
  font-weight: 600;
`;

const Chart = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: ${theme.spacing.sm};
  height: 115px;
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
  max-width: 27px;
  height: 90px;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 6px 6px 3px 3px;
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
  border-radius: 6px 6px 3px 3px;
  background: ${({ $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.sage};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${growBar} 700ms ${({ $delay }) => $delay}ms ease both;
  }
`;

const BarLabel = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.64rem;
`;

const PreviewFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: 0.69rem;
  line-height: 1.5;
`;

const PreviewFooterIcon = styled.span`
  display: grid;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: ${theme.colors.sage};
  color: ${theme.colors.primary};
`;

const FloatingNote = styled.div`
  position: absolute;
  right: -24px;
  bottom: 88px;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.surface};
  box-shadow: 0 12px 35px rgb(37 41 35 / 10%);
  animation: ${floatIn} 900ms 350ms ease both;

  @media (max-width: 600px) {
    right: -5px;
    bottom: 68px;
    padding: ${theme.spacing.sm};
  }
`;

const FloatingIcon = styled.span`
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.sage};
  color: ${theme.colors.primary};
  font-weight: 700;
`;

const FloatingTitle = styled.p`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 0.77rem;
  font-weight: 650;
`;

const FloatingDescription = styled.p`
  margin: 4px 0 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.69rem;
`;