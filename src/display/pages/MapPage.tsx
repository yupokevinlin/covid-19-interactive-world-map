import React, { useState } from "react";
import ESRIMap, { ESRIMapLayerNames, ESRIMapModeNames, MapPolygon } from "../components/ESRIMap/ESRIMap";
import { CountryOutline, LatLon } from "../../api/MapApi/types";
import { MapApi } from "../../api/MapApi/MapApi";
import styled from "styled-components";
import CountDisplayButton, { CountDisplayButtonClickEvent } from "../components/CountDisplayButton/CountDisplayButton";
import RegionDisplayBar from "../components/RegionDisplayBar/RegionDisplayBar";
import ListMenu, { ListMenuItem } from "../components/ListMenu/ListMenu";
import RegionSelectBreadcrumbs, { BreadCrumbItem } from "../components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";
import { ListMenuSelectEvent } from "../components/ListMenu/ListMenuItem/ListMenuItem";

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  confirmedCasesCount: number;
  recoveredCasesCount: number;
  deathsCount: number;
  countryName: string;
  countryCode: string;
  layer: ESRIMapModeNames;
  regionSelectData: BreadCrumbItem;
  mapPolygonData: Array<MapPolygon>;
}

export interface MapPageStyleProps {}

export interface MapPageEventProps {
  handleCountDisplayTypeChange(e: CountDisplayButtonClickEvent): void;
  handleRegionSelect(e: ListMenuSelectEvent): void;
}

export interface MapPageRegionData {
  countryCode: string;
  countryName: string;
}

export const StyledMapPage = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

export const StyledMapContainer = styled.div`
  height: calc(100% - 210px);
  width: 100%;
  @media (max-width: 710px) {
    flex-direction: column;
    height: calc(100% - 168px);
  }
`;

const StyledCountDisplayButtonListWrapper = styled.div`
  height: 108px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: nowrap;
  @media (max-width: 710px) {
    flex-direction: column;
  }
`;

const MapPage: React.FC<MapPageProps> = props => {
  const {
    confirmedCasesCount,
    recoveredCasesCount,
    deathsCount,
    countryName,
    countryCode,
    layer,
    regionSelectData,
    mapPolygonData,
    handleCountDisplayTypeChange,
    handleRegionSelect,
  } = props;

  const handleCountDisplayButtonClick = (e: CountDisplayButtonClickEvent): void => {
    handleCountDisplayTypeChange(e);
  };

  const handleMenuItemSelect = (e: ListMenuSelectEvent): void => {
    handleRegionSelect(e);
  };

  return (
    <StyledMapPage className={"map-page"}>
      <RegionSelectBreadcrumbs data={regionSelectData} handleMenuItemSelect={handleMenuItemSelect} />
      <StyledMapContainer>
        <ESRIMap mapPolygons={mapPolygonData} displayedLayer={layer} />
      </StyledMapContainer>
      <RegionDisplayBar countryCode={countryCode} countryName={countryName} />
      <StyledCountDisplayButtonListWrapper className={"count-display-buttons-wrapper"}>
        <CountDisplayButton
          handleClick={handleCountDisplayButtonClick}
          key={ESRIMapModeNames.confirmedCases}
          name={ESRIMapModeNames.confirmedCases}
          color={"#FFFF00"}
          count={confirmedCasesCount}
          text={ESRIMapModeNames.confirmedCases}
        />
        <CountDisplayButton
          handleClick={handleCountDisplayButtonClick}
          key={ESRIMapModeNames.deaths}
          name={ESRIMapModeNames.deaths}
          color={"#FF0000"}
          count={deathsCount}
          text={ESRIMapModeNames.deaths}
        />
        <CountDisplayButton
          handleClick={handleCountDisplayButtonClick}
          key={ESRIMapModeNames.recoveredCases}
          name={ESRIMapModeNames.recoveredCases}
          color={"#00AA00"}
          count={recoveredCasesCount}
          text={ESRIMapModeNames.recoveredCases}
        />
      </StyledCountDisplayButtonListWrapper>
    </StyledMapPage>
  );
};

export default MapPage;
