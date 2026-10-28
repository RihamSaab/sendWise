import Link from "next/link";
import styled from "styled-components";

import theme from "@/styles/theme";

export default function LandingFinalCta() {
  return (
    <FinalCta>
      <CtaDecoration aria-hidden="true">
        <CtaCircle />
        <CtaCircle />
      </CtaDecoration>

      <CtaContent>
        <CtaEyebrow>YOUR NEXT CHAPTER STARTS HERE</CtaEyebrow>

        <CtaTitle>
          Make your money
          <br />
          easier to understand.
        </CtaTitle>

        <CtaDescription>
          Take control of your finances with a clearer, simpler way to track
          your money.
        </CtaDescription>

        <CtaButton href="/onboarding">
          Get started for free <span aria-hidden="true">↗</span>
        </CtaButton>
      </CtaContent>
    </FinalCta>
  );
}

const FinalCta = styled.section`
  position: relative;
  overflow: hidden;
  margin: ${theme.spacing.xl} ${theme.spacing["2xl"]};
  border-radius: ${theme.radius.xl};
  background: ${theme.gradient.primary};
  box-shadow:
    ${theme.specular.topDark},
    ${theme.elevation.high};
  color: ${theme.colors.textOnPrimary};

  @media (max-width: 700px) {
    margin: ${theme.spacing.lg};
  }
`;

const CtaDecoration = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const CtaCircle = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border: ${theme.stroke} solid rgb(255 255 255 / 12%);
  border-radius: 50%;

  &:first-child {
    top: -180px;
    right: -60px;
  }

  &:last-child {
    right: 100px;
    bottom: -260px;
    width: 420px;
    height: 420px;
  }
`;

const CtaContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
  padding: ${theme.spacing["3xl"]} ${theme.spacing.xl};
  text-align: center;

  @media (max-width: 600px) {
    padding: ${theme.spacing["2xl"]} ${theme.spacing.lg};
  }
`;

const CtaEyebrow = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.primarySoft};
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
`;

const CtaTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textOnPrimary};
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.1;
`;

const CtaDescription = styled.p`
  max-width: 480px;
  margin: ${theme.spacing.lg} auto ${theme.spacing.xl};
  color: rgb(255 255 255 / 78%);
  font-size: 0.95rem;
  line-height: 1.75;
`;

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: 14px 28px;
  border-radius: ${theme.radius.pill};
  background: ${theme.gradient.surface};
  box-shadow:
    ${theme.specular.top},
    ${theme.elevation.medium};
  color: ${theme.colors.primary};
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform ${theme.duration.base} ${theme.ease.silk},
    background ${theme.duration.base} ${theme.ease.silk},
    box-shadow ${theme.duration.base} ${theme.ease.silk};

  &:hover {
    transform: translateY(-2px);
    background: ${theme.colors.primarySoft};
    box-shadow:
      ${theme.specular.top},
      ${theme.elevation.high};
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      ${theme.specular.top},
      ${theme.elevation.high},
      0 0 0 3px rgb(196 138 74 / 35%);
  }
`;
