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
  overflow: hidden;
  background: #f7f6f0;
  color: #252923;
  font-family: Arial, Helvetica, sans-serif;
`;

const Main = styled.main`
  width: 100%;
`;
