import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {WorldSummary} from "../../../../../shared/types/data/Cases/CasesTypes";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {Moment} from "moment";
import {DateUtils} from "../../../helper/DateUtils";
import getMomentDateFromDateString = DateUtils.getMomentDateFromDateString;
import WorldSummaryDataSelectBar from "./HomePageSummary/WorldSummaryDataSelectBar";
import {SummaryDataSelectBarValue} from "./HomePageSummary/types";
import WorldSummaryDataDisplay from "./WorldSummaryDataDisplay/WorldSummaryDataDisplay";

export type HomePageWorldSummaryBarProps = HomePageWorldSummaryBarDataProps & HomePageWorldSummaryBarStyleProps & HomePageWorldSummaryBarEventProps;

export interface HomePageWorldSummaryBarDataProps {
  currentDate: string;
  worldData: WorldSummary;
}

export interface HomePageWorldSummaryBarStyleProps {

}

export interface HomePageWorldSummaryBarEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: "100%",
      height: "max-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    dataWrapper: {
      width: "100%",
      height: "max-content",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    updateFontSize: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "18px",
        lineHeight: "18px",
        height: "18px",
        marginBottom: "18px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "20px",
        lineHeight: "20px",
        height: "20px",
        marginBottom: "20px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "22px",
        lineHeight: "22px",
        height: "22px",
        marginBottom: "22px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "24px",
        lineHeight: "24px",
        height: "24px",
        marginBottom: "24px",
      },
    },
    worldSummaryLabel: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
        lineHeight: "12px",
        height: "12px",
        marginBottom: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "14px",
        lineHeight: "14px",
        height: "14px",
        marginBottom: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
        lineHeight: "16px",
        height: "16px",
        marginBottom: "16px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "18px",
        lineHeight: "18px",
        height: "18px",
        marginBottom: "18px",
      },
    }
  }),
);

const HomePageSummary: React.FC<HomePageWorldSummaryBarProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    currentDate,
    worldData,
  } = props;

  const [worldDataType, setWorldDataType] = React.useState<SummaryDataSelectBarValue>(SummaryDataSelectBarValue.DAILY);

  const currentDateMoment: Moment = getMomentDateFromDateString(currentDate);
  currentDateMoment.add(23, "hours");

  const currentDateText: string = `Last Updated: ${currentDateMoment.format("LLLL")}`;

  const handleWorldDataTypeChange = (value: SummaryDataSelectBarValue): void => {
    console.log(value);
    setWorldDataType(value);
  };

  return (
    <div className={classes.wrapper}>
      {/*<Typography className={classes.updateFontSize} variant={"h5"}>*/}
      {/*  {*/}
      {/*    currentDateText*/}
      {/*  }*/}
      {/*</Typography>*/}
      <Typography className={classes.worldSummaryLabel} variant={"h5"}>
        World Summary
      </Typography>
      <Paper className={classes.dataWrapper} elevation={3}>
        <WorldSummaryDataSelectBar handleWorldDataTypeChange={handleWorldDataTypeChange}/>
        <WorldSummaryDataDisplay worldDataType={worldDataType} worldData={worldData}/>
      </Paper>
    </div>
  );
};

export default HomePageSummary;

