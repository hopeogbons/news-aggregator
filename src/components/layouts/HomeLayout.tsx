import { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";

interface HomeLayoutProps {
  children: ReactNode;
}

const HeaderBoxWrapper = styled(Box)({
  backgroundColor: "purple",
});
const HeaderBox = styled(Box)({
  backgroundColor: "green",
});
const ContentBoxWrapper = styled(Box)({
  backgroundColor: "red",
});
const ContentBox = styled(Box)({
  backgroundColor: "blue",
});
const FooterBoxWrapper = styled(Box)({
  backgroundColor: "yellow",
});
const FooterBox = styled(Box)({
  backgroundColor: "blue",
});

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => (
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

export default HomeLayout;
