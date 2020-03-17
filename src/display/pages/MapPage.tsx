import React, { useState } from "react";
import ESRIMap, { ESRIMapLayerNames, ESRIMapModeNames, MapPolygon } from "../components/ESRIMap/ESRIMap";
import { CountryOutline, LatLon } from "../../api/MapApi/types";
import { MapApi } from "../../api/MapApi/MapApi";
import styled from "styled-components";
import CountDisplayButton from "../components/CountDisplayButton/CountDisplayButton";

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

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  confirmedCasesCount: number;
  recoveredCasesCount: number;
  deathsCount: number;
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
  height: calc(100% - 108px);
  width: 100%;
  @media (max-width: 710px) {
    flex-direction: column;
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
  const { confirmedCasesCount, recoveredCasesCount, deathsCount } = props;

  const [layer, setLayer] = useState<ESRIMapModeNames>(ESRIMapModeNames.confirmedCases);

  const handleClick = (e: any): void => {
    const randomNumber: number = Math.random() * 10;
    if (randomNumber >= 0 && randomNumber < 3.3) {
      setLayer(ESRIMapModeNames.confirmedCases);
    } else if (randomNumber >= 3.3 && randomNumber < 6.7) {
      setLayer(ESRIMapModeNames.recoveredCases);
    } else {
      setLayer(ESRIMapModeNames.deaths);
    }
  };

  console.log(layer);
  return (
    <StyledMapPage className={"map-page"}>
      <StyledMapContainer>
        <ESRIMap mapPolygons={mapPolygons} displayedLayer={layer} />
      </StyledMapContainer>
      <StyledCountDisplayButtonListWrapper className={"count-display-buttons-wrapper"}>
        <CountDisplayButton
          handleClick={handleClick}
          key={ESRIMapModeNames.confirmedCases}
          name={ESRIMapModeNames.confirmedCases}
          color={"#FFFF00"}
          count={confirmedCasesCount}
          text={ESRIMapModeNames.confirmedCases}
        />
        <CountDisplayButton
          handleClick={handleClick}
          key={ESRIMapModeNames.deaths}
          name={ESRIMapModeNames.deaths}
          color={"#FF0000"}
          count={deathsCount}
          text={ESRIMapModeNames.deaths}
        />
        <CountDisplayButton
          handleClick={handleClick}
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
