import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SliderControl from "../components/SliderControl/SliderControl";
import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import BreadcrumbsControl from "../components/BreadcrumbsControl/BreadcrumbsControl";
import {ESRIMapPolygon} from "../components/ESRIMap/types";
import ESRIMap from "../components/ESRIMap/ESRIMap";
import {MapSubPages} from "../../state/global/App/types";

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  dateValues: Array<string>;
  dataTree: TreeItem;
  date: string;
  mapPolygons: Array<ESRIMapPolygon>;
  focusMapGeometry: Array<Array<[number, number]>>;
  subPage: MapSubPages;
}

export interface MapPageStyleProps {

}

export interface MapPageEventProps {
  handleDateChange(date: string): void;
  handleRegionChange(hierarchicalName: string): void;
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
        height: "calc(100% - 69px)",
      },
      [theme.breakpoints.up("sm")]: {
        height: "calc(100% - 72px)",
      },
      [theme.breakpoints.up("md")]: {
        height: "calc(100% - 78px)",
      },
      [theme.breakpoints.up("lg")]: {
        height: "calc(100% - 84px)",
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
    focusMapGeometry,
    subPage,
    handleDateChange,
    handleRegionChange,
    handleMapUpdateStart,
    handleMapUpdateComplete,
  } = props;

  const [esriMapRegion, setEsriMapRegion] = useState<string>("World");

  const handleEsriMapRegionChange = (hierarchicalName: string): void => {
    handleRegionChange(hierarchicalName);
    setEsriMapRegion(hierarchicalName);
  };

  return (
    <div className={classes.root}>
      <BreadcrumbsControl dataTree={dataTree} handleChange={handleRegionChange} value={esriMapRegion}/>
      <div className={classes.map}>
        <ESRIMap mapPolygons={mapPolygons} subPage={subPage} date={date} initialBaseMap={"streets"} focusMapGeometry={focusMapGeometry} handleUpdateStart={handleMapUpdateStart} handleUpdateComplete={handleMapUpdateComplete} handleRegionChange={handleEsriMapRegionChange}/>
      </div>
      <SliderControl values={dateValues} handleChange={handleDateChange}/>
    </div>
  );
};

export default MapPage;

