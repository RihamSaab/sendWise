import { Terrain } from "@lucasmarkes/hairline/react";

import styled from "styled-components";

export default function WelcomeSection() {
  return (
    <StyledWelcomeSection>
      <StyledWelcomeSection_Content>
        <StyledWelcomeSection_Eyebrow>
          YOUR FINANCIAL SPACE
        </StyledWelcomeSection_Eyebrow>

        <StyledWelcomeSection_Title>
          Make every dollar count.
        </StyledWelcomeSection_Title>

        <StyledWelcomeSection_Description>
          Understand your spending, follow your progress, and feel more
          confident about your money.
        </StyledWelcomeSection_Description>
      </StyledWelcomeSection_Content>

      <StyledWelcomeSection_Illustration>
        <Terrain
          intensity={0.2}
          theme="light"
          label="Interactive geometric landscape"
        />
      </StyledWelcomeSection_Illustration>
    </StyledWelcomeSection>
  );
}

const StyledWelcomeSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  align-items: center;
  gap: var(--spacing-lg);
  min-height: 210px;
  padding: var(--spacing-xl) var(--spacing-2xl);
  overflow: hidden;
  border: none;
  border-radius: var(--radius-xl);
  background:
    radial-gradient(
      circle at 85% 50%,
      var(--color-primary-soft),
      transparent 50%
    ),
    var(--gradient-surface);
  box-shadow:
    var(--specular-top),
    var(--elevation-2);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
  }
`;

const StyledWelcomeSection_Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 520px;
`;

const StyledWelcomeSection_Eyebrow = styled.p`
  margin: 0 0 var(--spacing-sm);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
`;

const StyledWelcomeSection_Title = styled.h2`
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.035em;
`;

const StyledWelcomeSection_Description = styled.p`
  max-width: 420px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: 1.7;
`;

const StyledWelcomeSection_Illustration = styled.div`
  width: 100%;
  min-width: 0;

  & > div {
    width: 100%;
  }

  @media (max-width: 640px) {
    max-width: 180px;
    margin: 0 auto;
  }
`;
