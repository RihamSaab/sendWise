import Link from "next/link";
import styled from "styled-components";

import theme from "@/styles/theme";

export default function LandingFooter() {
  return (
    <Footer>
      <FooterInner>
        <FooterBrand href="/" aria-label="SpendWise home">
          Spend<span>Wise</span>
          <BrandDot />
        </FooterBrand>

        <FooterText>Clarity for every financial decision.</FooterText>

        <FooterCopyright>
          © {new Date().getFullYear()} SpendWise. All rights reserved.
        </FooterCopyright>
      </FooterInner>
    </Footer>
  );
}

const Footer = styled.footer`
  width: 100%;
  border-top: ${theme.stroke} solid ${theme.colors.border};
`;

const FooterInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing["2xl"]};

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${theme.spacing.xl} ${theme.spacing.lg};
  }
`;

const FooterBrand = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${theme.colors.primary};
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  text-decoration: none;

  span {
    color: ${theme.colors.text};
  }
`;

const BrandDot = styled.span`
  width: 6px;
  height: 6px;
  margin-left: 4px;
  border-radius: 50%;
  background: ${theme.colors.amber};
`;

const FooterText = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: var(--text-sm);
`;

const FooterCopyright = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: var(--text-xs);
`;
