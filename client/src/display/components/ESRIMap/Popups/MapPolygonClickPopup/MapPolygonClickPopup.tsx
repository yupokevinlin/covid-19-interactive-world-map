import React from "react";
import {RegionChangeEvent} from "../../../../../state/containers/MapPageContainer/types";
import styled from "styled-components";
import {StyleUtils} from "../../../../../helper/StyleUtils";
import {createMuiTheme, Theme, Typography} from "@material-ui/core";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import Button from '@material-ui/core/Button';
import has = Reflect.has;

export type MapPolygonClickPopupProps = MapPolygonClickPopupDataProps & MapPolygonClickPopupStyleProps & MapPolygonClickPopupEventProps;

export interface MapPolygonClickPopupDataProps {
  name: Array<string>;
  confirmedCases: number;
  deaths: number;
  recoveredCases: number;
  hasChildren: boolean;
}

export interface MapPolygonClickPopupStyleProps {

}

export interface MapPolygonClickPopupEventProps {
  handleRegionChange(e: RegionChangeEvent);
}

export const StyledMapPolygonClickPopup = styled.div`
  height: 100px;
`;

export const StyledDisplayRow = styled.div`
  height: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const StyledButtonWrapper = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
`;

const MapPolygonClickPopup: React.FC<MapPolygonClickPopupProps> = (props) => {
  const {
    name,
    confirmedCases,
    deaths,
    recoveredCases,
    hasChildren,
    handleRegionChange
  } = props;

  const theme: Theme = createMuiTheme();
  theme.typography.subtitle1 = {
    fontSize: "16px",
    lineHeight: "20px",
    height: "20px",
    fontWeight: 300,
  };

  const handleClick = (): void => {
    handleRegionChange({
      name: ["World", ...name],
      hasChildren: hasChildren,
    });
  };

  return (
    <StyledMapPolygonClickPopup className={"map-polygon-popup"}>
      <ThemeProvider theme={theme}>
        <StyledDisplayRow>
          <Typography variant="subtitle1" noWrap>
            Confirmed Cases
          </Typography>
          <Typography variant="subtitle1" noWrap>
            {confirmedCases.toLocaleString()}
          </Typography>
        </StyledDisplayRow>
        <StyledDisplayRow>
          <Typography variant="subtitle1" noWrap>
            Deaths
          </Typography>
          <Typography variant="subtitle1" noWrap>
            {deaths.toLocaleString()}
          </Typography>
        </StyledDisplayRow>
        <StyledDisplayRow>
        <Typography variant="subtitle1" noWrap>
          Recovered Cases
        </Typography>
        <Typography variant="subtitle1" noWrap>
          {recoveredCases.toLocaleString()}
        </Typography>
      </StyledDisplayRow>
      </ThemeProvider>
      <StyledButtonWrapper>
        <Button variant={"outlined"} size={"small"} disabled={!hasChildren} onClick={handleClick}>{hasChildren ? "View Subdivisions" : "No Subdivisions"}</Button>
      </StyledButtonWrapper>
    </StyledMapPolygonClickPopup>
  )
};

export default MapPolygonClickPopup;

