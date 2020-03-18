import React, { useState } from "react";
import ESRIMap, { ESRIMapLayerNames, ESRIMapModeNames, MapPolygon } from "../components/ESRIMap/ESRIMap";
import { CountryOutline, LatLon } from "../../api/MapApi/types";
import { MapApi } from "../../api/MapApi/MapApi";
import styled from "styled-components";
import CountDisplayButton, { CountDisplayButtonClickEvent } from "../components/CountDisplayButton/CountDisplayButton";
import RegionDisplayBar from "../components/RegionDisplayBar/RegionDisplayBar";
import ListMenu, { ListMenuItem } from "../components/ListMenu/ListMenu";
import RegionSelectBreadcrumbs, { BreadCrumbItem } from "../components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";

const countryOutlines: Array<CountryOutline> = MapApi.getCountryOutlines();
const testNumbers: Array<number> = [
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  10,
  10,
  10,
  10,
  10,
  10,
  100,
  100,
  100,
  1000,
  1000,
  10000,
  100000,
  1000000,
];
const mapPolygons: Array<MapPolygon> = countryOutlines.map((countryOutline, index) => {
  return {
    internalId: index,
    name: countryOutline.name.en,
    confirmedCasesCount: testNumbers[Math.floor(Math.random() * testNumbers.length)],
    recoveredCasesCount: testNumbers[Math.floor(Math.random() * testNumbers.length)],
    deathsCount: testNumbers[Math.floor(Math.random() * testNumbers.length)],
    geometry: countryOutline.geometry,
  };
});

const regionSelectData: BreadCrumbItem = {
  name: ["World"],
  childElements: [
    {
      name: ["World", "Canada"],
      childElements: [
        {
          name: ["World", "Canada", "British Columbia"],
          childElements: [],
        },
        {
          name: ["World", "Canada", "Alberta"],
          childElements: [],
        },
        {
          name: ["World", "Canada", "Saskatchewan"],
          childElements: [],
        },
        {
          name: ["World", "Canada", "Manitoba"],
          childElements: [],
        },
        {
          name: ["World", "Canada", "Ontario"],
          childElements: [],
        },
        {
          name: ["World", "Canada", "Quebec"],
          childElements: [],
        },
      ],
    },
  ],
};

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  confirmedCasesCount: number;
  recoveredCasesCount: number;
  deathsCount: number;
  countryName: string;
  countryCode: string;
}

export interface MapPageStyleProps {}

export interface MapPageEventProps {}

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
  const { confirmedCasesCount, recoveredCasesCount, deathsCount, countryName, countryCode } = props;

  const [layer, setLayer] = useState<ESRIMapModeNames>(ESRIMapModeNames.confirmedCases);

  const handleCountDisplayButtonClick = (e: CountDisplayButtonClickEvent): void => {
    setLayer(e.name);
  };

  return (
    <StyledMapPage className={"map-page"}>
      <RegionSelectBreadcrumbs data={regionSelectData} />
      <StyledMapContainer>
        <ESRIMap mapPolygons={mapPolygons} displayedLayer={layer} />
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
