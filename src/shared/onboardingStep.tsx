import styled from "styled-components";
import type { ReactNode } from "react";

type OnboardingStepProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function OnboardingStep({
  title,
  description,
  children,
}: OnboardingStepProps) {
  return (
    <Container>
      <Heading>{title}</Heading>
      <Description>{description}</Description>
      {children}
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
`;

const Heading = styled.h1`
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.035em;
`;

const Description = styled.p`
  margin: 12px 0 28px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
`;
