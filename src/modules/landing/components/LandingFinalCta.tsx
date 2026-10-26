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
  margin: 32px ${theme.spacing["2xl"]};
  border-radius: ${theme.radius.lg};
  background: ${theme.colors.primary};
  color: #ffffff;

  @media (max-width: 700px) {
    margin: 24px ${theme.spacing.lg};
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
  border: 1px solid rgb(255 255 255 / 12%);
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
  padding: 72px ${theme.spacing.xl};
  text-align: center;

  @media (max-width: 600px) {
    padding: 56px ${theme.spacing.lg};
  }
`;

const CtaEyebrow = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.sage};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
`;

const CtaTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 650;
  letter-spacing: -0.065em;
  line-height: 1.12;
`;

const CtaDescription = styled.p`
  max-width: 480px;
  margin: ${theme.spacing.lg} auto ${theme.spacing.xl};
  color: rgb(255 255 255 / 78%);
  font-size: 0.95rem;
  line-height: 1.8;
`;

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: 13px 20px;
  border-radius: ${theme.radius.sm};
  background: #ffffff;
  color: ${theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    transform 180ms ease,
    background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    background: ${theme.colors.sage};
  }

  &:focus-visible {
    outline: 3px solid ${theme.colors.amber};
    outline-offset: 3px;
  }
`;
