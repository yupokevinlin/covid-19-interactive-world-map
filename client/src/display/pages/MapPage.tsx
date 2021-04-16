import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SliderControl from "../components/SliderControl/SliderControl";
import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import BreadcrumbsControl from "../components/BreadcrumbsControl/BreadcrumbsControl";

export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  dateValues: Array<string>;
  dataTree: TreeItem;
}

export interface MapPageStyleProps {

}

export interface MapPageEventProps {
  handleDateChange(date: string): void;
  handleRegionChange(hierarchicalName: string): void;
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
    handleDateChange,
    handleRegionChange,
  } = props;

  return (
    <div className={classes.root}>
      <BreadcrumbsControl dataTree={dataTree} handleChange={handleRegionChange}/>
      <div className={classes.map}/>
      <SliderControl values={dateValues} handleChange={handleDateChange}/>
    </div>
  );
};

export default MapPage;

