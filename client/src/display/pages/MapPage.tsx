import React, {useState} from "react";
import ESRIMap, { ESRIMapModeNames, MapPolygon } from "../components/ESRIMap/ESRIMap";
import styled from "styled-components";
import CountDisplayButton, { CountDisplayButtonClickEvent } from "../components/CountDisplayButton/CountDisplayButton";
import RegionDisplayBar from "../components/RegionDisplayBar/RegionDisplayBar";
import RegionSelectBreadcrumbs, { BreadCrumbItem } from "../components/RegionSelectBreadcrumbs/RegionSelectBreadcrumbs";
import { ListMenuSelectEvent } from "../components/ListMenu/ListMenuItem/ListMenuItem";
import countries from "i18n-iso-countries";
import {RegionChangeEvent} from "../../state/containers/MapPageContainer/types";
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  language: string;
  displayedConfirmedCasesCount: number;
  displayedRecoveredCasesCount: number;
  displayedDeathsCount: number;
  name: Array<string>;
  layer: ESRIMapModeNames;
  regionSelectData: BreadCrumbItem;
  mapPolygonData: Array<MapPolygon>;
  enableMapPopup: boolean;
}

export interface MapPageStyleProps {}

export interface MapPageEventProps {
  handleCountDisplayTypeChange(e: CountDisplayButtonClickEvent): void;
  handleRegionSelect(e: RegionChangeEvent): void;
}

export interface CurrentRegion {
  name: Array<string>;
  moveMap: boolean;
}

export const StyledMapPage = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  background-color: #f8f8f8;
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
    displayedConfirmedCasesCount,
    displayedRecoveredCasesCount,
    displayedDeathsCount,
    language,
    name,
    layer,
    regionSelectData,
    mapPolygonData,
    enableMapPopup,
    handleCountDisplayTypeChange,
    handleRegionSelect,
  } = props;

  const [currentRegion, setCurrentRegion] = useState<CurrentRegion>({name: ["World"], moveMap: false});

  const handleCountDisplayButtonClick = (e: CountDisplayButtonClickEvent): void => {
    handleCountDisplayTypeChange(e);
  };

  const handleRegionSelectInterceptor = (e: RegionChangeEvent): void => {
    setCurrentRegion({
      name: [...e.name],
      moveMap: false
    });
    handleRegionSelect(e);
  };

  const handleMenuItemSelect = (e: ListMenuSelectEvent): void => {
    setCurrentRegion({
      name: [...e.name],
      moveMap: true
    });
    handleRegionSelect(e);
  };

  const countryCode: string = countries.getAlpha2Code(name[0], "en");
  const countryName: string = name.length > 0 ? name[name.length - 1] : countries.getName(countryCode, language);
  return (
    <StyledMapPage className={"map-page"}>
      <RegionSelectBreadcrumbs data={regionSelectData} currentRegion={currentRegion.name} handleMenuItemSelect={handleMenuItemSelect} />
      <StyledMapContainer>
        <ESRIMap mapPolygons={mapPolygonData} moveMap={currentRegion.moveMap} currentRegion={currentRegion.name} displayedLayer={layer} handleRegionChange={handleRegionSelectInterceptor} handleMapPolygonClick={handleRegionSelectInterceptor} enableMapPopup={enableMapPopup}/>
      </StyledMapContainer>
      <RegionDisplayBar countryCode={countryCode} countryName={countryName} />
      <StyledCountDisplayButtonListWrapper className={"count-display-buttons-wrapper"}>
        <CountDisplayButton
          handleClick={handleCountDisplayButtonClick}
          key={ESRIMapModeNames.confirmedCases}
          name={ESRIMapModeNames.confirmedCases}
          color={"#FFFF00"}
          count={displayedConfirmedCasesCount}
          text={ESRIMapModeNames.confirmedCases}
        />
        <CountDisplayButton
          handleClick={handleCountDisplayButtonClick}
          key={ESRIMapModeNames.deaths}
          name={ESRIMapModeNames.deaths}
          color={"#FF0000"}
          count={displayedDeathsCount}
          text={ESRIMapModeNames.deaths}
        />
        <CountDisplayButton
          handleClick={handleCountDisplayButtonClick}
          key={ESRIMapModeNames.recoveredCases}
          name={ESRIMapModeNames.recoveredCases}
          color={"#00AA00"}
          count={displayedRecoveredCasesCount}
          text={ESRIMapModeNames.recoveredCases}
        />
      </StyledCountDisplayButtonListWrapper>
    </StyledMapPage>
  );
};

export default MapPage;
