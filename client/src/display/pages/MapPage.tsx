import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SliderControl from "../components/SliderControl/SliderControl";
import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import BreadcrumbsControl from "../components/BreadcrumbsControl/BreadcrumbsControl";
import {ESRIMapPolygon} from "../components/ESRIMap/types";
import ESRIMap from "../components/ESRIMap/ESRIMap";
import {MapSubPages} from "../../state/global/App/types";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {CasesData} from "../../../../shared/types/data/Cases/CasesTypes";
import MapPageInformation from "../components/MapPageInformation/MapPageInformation";

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  dateValues: Array<string>;
  dataTree: TreeItem;
  date: string;
  mapPolygons: Array<ESRIMapPolygon>;
  mapRegionUpdateGeometry: Array<Array<[number, number]>>;
  breadcrumbsRegionUpdateGeometry: Array<Array<[number, number]>>;
  subPage: MapSubPages;
  countryCode: string;
  casesData: CasesData;
  regionName: string;
}

export interface MapPageStyleProps {
  width: Breakpoint;
}

export interface MapPageEventProps {
  handleDateChange(date: string): void;
  handleBreadCrumbsRegionChange(hierarchicalName: string): void;
  handleMapRegionChange(hierarchicalName: string): void;
  handleMapUpdateStart(): void;
  handleMapUpdateComplete(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    map: {
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "calc(100% - 110px)",
      },
      [theme.breakpoints.up("sm")]: {
        height: "calc(100% - 120px)",
      },
      [theme.breakpoints.up("md")]: {
        height: "calc(100% - 132px)",
      },
      [theme.breakpoints.up("lg")]: {
        height: "calc(100% - 145px)",
      },
    }
  }),
);

const MapPage: React.FC<MapPageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    dateValues,
    dataTree,
    date,
    mapPolygons,
    mapRegionUpdateGeometry,
    breadcrumbsRegionUpdateGeometry,
    subPage,
    countryCode,
    casesData,
    regionName,
    width,
    handleDateChange,
    handleBreadCrumbsRegionChange,
    handleMapRegionChange,
    handleMapUpdateStart,
    handleMapUpdateComplete,
  } = props;

  const [esriMapRegion, setEsriMapRegion] = useState<string>("World");

  const handleEsriMapRegionChange = (hierarchicalName: string): void => {
    handleMapRegionChange(hierarchicalName);
    setEsriMapRegion(hierarchicalName);
  };

  return (
    <div className={classes.root}>
      <BreadcrumbsControl dataTree={dataTree} handleChange={handleBreadCrumbsRegionChange} value={esriMapRegion}/>
      <div className={classes.map}>
        <ESRIMap mapPolygons={mapPolygons} subPage={subPage} date={date} initialBaseMap={"streets"} mapRegionUpdateGeometry={mapRegionUpdateGeometry} breadcrumbsRegionUpdateGeometry={breadcrumbsRegionUpdateGeometry} width={width} handleUpdateStart={handleMapUpdateStart} handleUpdateComplete={handleMapUpdateComplete} handleRegionChange={handleEsriMapRegionChange}/>
      </div>
      <MapPageInformation date={date} casesData={casesData} subPage={subPage} countryCode={countryCode} regionName={regionName}/>
      <SliderControl values={dateValues} handleChange={handleDateChange}/>
    </div>
  );
};

export default MapPage;

