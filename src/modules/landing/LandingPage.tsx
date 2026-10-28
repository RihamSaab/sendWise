import styled from "styled-components";

import LandingFinalCta from "./components/LandingFinalCta";
import LandingFeatures from "./components/LandingFeatures";
import LandingFooter from "./components/LandingFooter";
import LandingHeader from "./components/LandingHeader";
import LandingHero from "./components/LandingHero";
import LandingHowItWorks from "./components/LandingHowItWorks";

export default function LandingPage() {
  return (
    <Page>
      <LandingHeader />

      <Main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFinalCta />
      </Main>

      <LandingFooter />
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
`;

const Main = styled.main`
  width: 100%;
`;
