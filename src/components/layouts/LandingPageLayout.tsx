import { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";

interface LandingPageLayoutProps {
  children: ReactNode;
}

const HeaderBoxWrapper = styled(Box)({});
const HeaderBox = styled(Box)({});
const ContentBoxWrapper = styled(Box)({});
const ContentBox = styled(Box)({});
const FooterBoxWrapper = styled(Box)({});
const FooterBox = styled(Box)({});

const LandingPageLayout: FC<LandingPageLayoutProps> = ({ children }) => (
  <>
    <HeaderBoxWrapper>
      <HeaderBox>Header</HeaderBox>
    </HeaderBoxWrapper>

    <ContentBoxWrapper>
      <ContentBox>{children}</ContentBox>
    </ContentBoxWrapper>

    <FooterBoxWrapper>
      <FooterBox>Footer</FooterBox>
    </FooterBoxWrapper>
  </>
);

export default LandingPageLayout;
