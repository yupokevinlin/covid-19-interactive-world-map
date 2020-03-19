import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactCountryFlag from "react-country-flag";
import { createMuiTheme, Theme, Typography } from "@material-ui/core";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import ReactResizeDetector from "react-resize-detector";
import LanguageIcon from "@material-ui/icons/Language";
import { StyleUtils } from "../../../helper/StyleUtils";

export type RegionDisplayBarProps = RegionDisplayBarDataProps & RegionDisplayBarStyleProps & RegionDisplayBarEventProps;

export interface RegionDisplayBarDataProps {
  countryName: string;
  countryCode: string;
}

export interface RegionDisplayBarStyleProps {}

export interface RegionDisplayBarEventProps {}

const StyledRegionDisplayBar = styled.div`
  height: 90px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  @media (max-width: 710px) {
    height: 40px;
  }
`;

const StyledWorldFlag = styled.div`
  height: 66px;
  width: 88px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  background-color: #0000cd;
  margin-right: 30px;
  @media (max-width: 710px) {
    height: 30px;
    width: 40px;
    margin-right: 20px;
  }
`;

const RegionDisplayBar: React.FC<RegionDisplayBarProps> = props => {
  const { countryCode, countryName } = props;

  const [height, setHeight] = useState<number>(0);

  const ref: React.MutableRefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    setHeight(ref.current.offsetHeight);
  }, []);

  const theme: Theme = createMuiTheme();
  theme.typography.h2 = {
    fontSize: "60px",
    lineHeight: "70px",
    fontWeight: 300,
    "@media (min-width: 1150px) and (max-width: 1350px)": {
      fontSize: "45px",
      lineHeight: "50px",
    },
    "@media (min-width: 950px) and (max-width: 1150px)": {
      fontSize: "30px",
      lineHeight: "40px",
    },
    "@media (min-width: 710px) and (max-width: 950px)": {
      fontSize: "25px",
      lineHeight: "35px",
    },
    "@media (max-width: 710px)": {
      fontSize: "20px",
      lineHeight: "30px",
    },
  };

  const onResize = (): void => {
    setHeight(ref.current.offsetHeight);
  };

  const isWorld: boolean = countryName === "World" || countryCode === "World";

  return (
    <React.Fragment>
      <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
      <StyledRegionDisplayBar className={"region-display-bar"} ref={ref}>
        {isWorld ? (
          <StyledWorldFlag>
            <LanguageIcon style={{ fontSize: height > 40 ? "50px" : "20px", color: "#FFFFFF" }} />
          </StyledWorldFlag>
        ) : (
          <ReactCountryFlag
            className="emojiFlag"
            svg
            countryCode={countryCode}
            style={{
              fontSize: `${StyleUtils.getCssPixelString(height)}`,
              lineHeight: `${StyleUtils.getCssPixelString(height)}`,
              marginRight: height > 40 ? "30px" : "20px",
            }}
          />
        )}
        <ThemeProvider theme={theme}>
          <Typography variant="h2" noWrap>
            {isWorld ? "World" : countryName}
          </Typography>
        </ThemeProvider>
      </StyledRegionDisplayBar>
    </React.Fragment>
  );
};

export default RegionDisplayBar;
