import React from "react";
import { ButtonBase, createMuiTheme, Theme, Typography } from "@material-ui/core";
import { StyleUtils } from "../../../helper/StyleUtils";
import styled from "styled-components";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { ESRIMapModeNames } from "../ESRIMap/ESRIMap";

export type CountDisplayButtonProps = CountDisplayButtonDataProps &
  CountDisplayButtonStyleProps &
  CountDisplayButtonEventProps;

export interface CountDisplayButtonDataProps {}

export interface CountDisplayButtonStyleProps {
  name: ESRIMapModeNames;
  color: string;
  count: number;
  text: string;
  borderWidth?: number;
}

export interface CountDisplayButtonEventProps {
  handleClick?(e: CountDisplayButtonClickEvent): void;
}

export interface CountDisplayButtonClickEvent {
  name: ESRIMapModeNames;
}

const StyledCountDisplayButton = styled.div<{ borderWidth: number }>`
  height: 100%;
  width: 100%;
  min-width: 126px;
  max-width: 300px;
  max-height: 70px;
  @media (max-width: 710px) {
    max-height: 36px;
    max-width: 390px;
  }
`;

const StyledTextWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  @media (max-width: 710px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const CountDisplayButton: React.FC<CountDisplayButtonProps> = props => {
  const { name, color, count, text, borderWidth = 2, handleClick } = props;

  const theme: Theme = createMuiTheme();
  theme.typography.overline = {
    fontSize: "14px",
    lineHeight: "20px",
    "@media (max-width:710px)": {
      fontSize: "14px",
      lineHeight: "16px",
      marginLeft: "30px",
    },
  };
  theme.typography.subtitle1 = {
    fontSize: "24px",
    lineHeight: "28px",
    fontWeight: 300,
    "@media (max-width:710px)": {
      fontSize: "14px",
      lineHeight: "16px",
      marginRight: "30px",
    },
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (handleClick) {
      handleClick({
        name: name,
      });
    }
  };

  return (
    <StyledCountDisplayButton className={"count-display-button"} onClick={onClick} borderWidth={borderWidth}>
      <ButtonBase
        style={{
          height: `100%`,
          width: `100%`,
          backgroundColor: `${color}22`,
          borderStyle: "solid",
          borderWidth: StyleUtils.getCssPixelString(borderWidth),
          borderColor: color,
        }}
      >
        <StyledTextWrapper className={"text-wrapper"}>
          <ThemeProvider theme={theme}>
            <Typography variant="overline" noWrap>
              {text}
            </Typography>
            <Typography variant="subtitle1" noWrap>
              {count.toLocaleString()}
            </Typography>
          </ThemeProvider>
        </StyledTextWrapper>
      </ButtonBase>
    </StyledCountDisplayButton>
  );
};

export default CountDisplayButton;
