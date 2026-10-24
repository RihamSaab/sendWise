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
  gap: 24px;
  min-height: 210px;
  padding: 28px 36px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background:
    radial-gradient(circle at 85% 50%, rgb(221 233 223 / 65%), transparent 45%),
    var(--color-surface);

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    padding: 24px;
  }
`;

const StyledWelcomeSection_Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 520px;
`;

const StyledWelcomeSection_Eyebrow = styled.p`
  margin: 0 0 12px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.12em;
`;

const StyledWelcomeSection_Title = styled.h2`
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.045em;
`;

const StyledWelcomeSection_Description = styled.p`
  max-width: 420px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.8;
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
