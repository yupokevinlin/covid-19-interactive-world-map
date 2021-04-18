import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SliderControl from "../components/SliderControl/SliderControl";
import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import BreadcrumbsControl from "../components/BreadcrumbsControl/BreadcrumbsControl";
import {ESRIMapModeNames, ESRIMapPolygon} from "../components/ESRIMap/types";
import ESRIMap from "../components/ESRIMap/ESRIMap";

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  dateValues: Array<string>;
  dataTree: TreeItem;
  date: string;
  mapPolygons: Array<ESRIMapPolygon>;
  focusMapGeometry: Array<Array<[number, number]>>;
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
    handleDateChange,
    handleRegionChange,
    handleMapUpdateStart,
    handleMapUpdateComplete,
  } = props;

  const [displayMode, setDisplayMode] = useState<ESRIMapModeNames>(ESRIMapModeNames.totalCases);

  return (
    <div className={classes.root}>
      <BreadcrumbsControl dataTree={dataTree} handleChange={handleRegionChange}/>
      <div className={classes.map}>
        <ESRIMap mapPolygons={mapPolygons} displayMode={displayMode} date={date} initialBaseMap={"streets"} focusMapGeometry={focusMapGeometry} handleUpdateStart={handleMapUpdateStart} handleUpdateComplete={handleMapUpdateComplete}/>
      </div>
      <SliderControl values={dateValues} handleChange={handleDateChange}/>
    </div>
  );
};

export default MapPage;

