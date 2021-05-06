import React from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {WorldSummaryDataSelectBarValue} from "../WorldSummaryDataSelectBar/types";
import {WorldSummary, WorldSummaryData} from "../../../../../../shared/types/data/Cases/CasesTypes";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

export type WorldSummaryDataDisplayProps = WorldSummaryDataDisplayDataProps & WorldSummaryDataDisplayStyleProps & WorldSummaryDataDisplayEventProps;

export interface WorldSummaryDataDisplayDataProps {
  worldData: WorldSummary;
  worldDataType: WorldSummaryDataSelectBarValue;
}

export interface WorldSummaryDataDisplayStyleProps {
  width: Breakpoint;
}

export interface WorldSummaryDataDisplayEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "max-content",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      [theme.breakpoints.up("lg")]: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
      },
    },
    displayItem: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        height: "80px",
        width: "90%",
        marginTop: "10px",
        marginBottom: "10px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "100px",
        width: "90%",
        marginTop: "10px",
        marginBottom: "10px",
      },
      [theme.breakpoints.up("md")]: {
        height: "120px",
        width: "90%",
        marginTop: "15px",
        marginBottom: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "120px",
        width: "30%",
        marginTop: "20px",
        marginBottom: "20px",
      },
    },
    displayItemAll: {
      alignItems: "center",
      justifyContent: "center",
    },
    displayItemTitleText: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "16px",
        marginTop: "10px",
        marginLeft: "30px",
        fontWeight: "bold",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "18px",
        marginTop: "16px",
        marginLeft: "40px",
        fontWeight: "bold",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "22px",
        marginTop: "20px",
        marginLeft: "50px",
        fontWeight: "bold",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "24px",
        marginTop: "16px",
        marginLeft: "24px",
        fontWeight: "bold",
      },
    },
    displayItemTitleTextAll: {
      [theme.breakpoints.up("lg")]: {
        marginTop: "0px",
        marginLeft: "0px",
      },
    },
    displayItemText: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "10px",
        marginTop: "4px",
        marginLeft: "30px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "12px",
        marginTop: "4px",
        marginLeft: "40px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "14px",
        marginTop: "5px",
        marginLeft: "50px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "16px",
        marginTop: "5px",
        marginLeft: "24px",
      },
    }
  }),
);

const WorldSummaryDataDisplay: React.FC<WorldSummaryDataDisplayProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    width,
    worldData,
    worldDataType,
  } = props;

  const isLg: boolean = width !== "xs" && width !== "sm" && width !== "md";

  const getWorldSummaryData = (type: WorldSummaryDataSelectBarValue, worldData: WorldSummary): WorldSummaryData => {
    switch (type) {
      case WorldSummaryDataSelectBarValue.DAILY: {
        return worldData.daily;
      }
      case WorldSummaryDataSelectBarValue.WEEKLY: {
        return worldData.weekly;
      }
      case WorldSummaryDataSelectBarValue.MONTHLY: {
        return worldData.monthly;
      }
      case WorldSummaryDataSelectBarValue.YEARLY: {
        return worldData.yearly;
      }
      case WorldSummaryDataSelectBarValue.ALL: {
        return worldData.all;
      }
    }
  };

  const getDataLabel = (type: WorldSummaryDataSelectBarValue): string => {
    switch (type) {
      case WorldSummaryDataSelectBarValue.DAILY:
      case WorldSummaryDataSelectBarValue.WEEKLY:
      case WorldSummaryDataSelectBarValue.MONTHLY:
      case WorldSummaryDataSelectBarValue.YEARLY: {
        return type.toLowerCase().replace("past", "Previous");
      }
      case WorldSummaryDataSelectBarValue.ALL: {
        return "";
      }
    }
  };

  const getSignText = (count: number): string => {
    if (count < 0) {
      return `${count.toLocaleString()}`;
    } else {
      return `+${count.toLocaleString()}`;
    }
  };

  const getPercentText = (percent: number): string => {
    if (percent < 0) {
      return `${(Math.round(percent * 10) / 10).toFixed(1)}%`;
    } else {
      return `+${(Math.round(percent * 10) / 10).toFixed(1)}%`;
    }
  };

  const data: WorldSummaryData = getWorldSummaryData(worldDataType, worldData);

  return (
    <div className={classes.root}>
      <Paper key={0} className={clsx(classes.displayItem, {
        [classes.displayItemAll]: worldDataType === WorldSummaryDataSelectBarValue.ALL
      })} style={{backgroundColor: theme.palette.warning.main}}>
        <Typography className={clsx(classes.displayItemTitleText, {
          [classes.displayItemTitleTextAll]: worldDataType === WorldSummaryDataSelectBarValue.ALL
        })} variant={"h5"}>
          {
            `Cases ${getSignText(data.casesChange)}`
          }
        </Typography>
        {
          worldDataType !== WorldSummaryDataSelectBarValue.ALL ? (
            <React.Fragment>
              <Typography className={classes.displayItemText} variant={"h5"}>
                {
                  `${getDataLabel(worldDataType)} ${getSignText(data.previousCasesChange)}`
                }
              </Typography>
              <Typography className={classes.displayItemText} variant={"h5"}>
                {
                  `Change ${getPercentText((data.casesChange - data.previousCasesChange) / data.previousCasesChange * 100)} (${getSignText(data.casesChange - data.previousCasesChange)})`
                }
              </Typography>
            </React.Fragment>
          ) : null
        }
      </Paper>
      <Paper key={1} className={clsx(classes.displayItem, {
        [classes.displayItemAll]: worldDataType === WorldSummaryDataSelectBarValue.ALL
      })} style={{backgroundColor: theme.palette.error.main}}>
        <Typography className={clsx(classes.displayItemTitleText, {
          [classes.displayItemTitleTextAll]: worldDataType === WorldSummaryDataSelectBarValue.ALL
        })} variant={"h5"}>
          {
            `Deaths ${getSignText(data.deathsChange)}`
          }
        </Typography>
        {
          worldDataType !== WorldSummaryDataSelectBarValue.ALL ? (
            <React.Fragment>
              <Typography className={classes.displayItemText} variant={"h5"}>
                {
                  `${getDataLabel(worldDataType)} ${getSignText(data.previousDeathsChange)}`
                }
              </Typography>
              <Typography className={classes.displayItemText} variant={"h5"}>
                {
                  `Change ${getPercentText((data.deathsChange - data.previousDeathsChange) / data.previousDeathsChange * 100)} (${getSignText(data.deathsChange - data.previousDeathsChange)})`
                }
              </Typography>
            </React.Fragment>
          ) : null
        }
      </Paper>
      <Paper key={2} className={clsx(classes.displayItem, {
        [classes.displayItemAll]: worldDataType === WorldSummaryDataSelectBarValue.ALL
      })} style={{backgroundColor: theme.palette.success.main}}>
        <Typography className={clsx(classes.displayItemTitleText, {
          [classes.displayItemTitleTextAll]: worldDataType === WorldSummaryDataSelectBarValue.ALL
        })} variant={"h5"}>
          {
            `Recoveries ${getSignText(data.recoveriesChange)}`
          }
        </Typography>
        {
          worldDataType !== WorldSummaryDataSelectBarValue.ALL ? (
            <React.Fragment>
              <Typography className={classes.displayItemText} variant={"h5"}>
                {
                  `${getDataLabel(worldDataType)} ${getSignText(data.previousRecoveriesChange)}`
                }
              </Typography>
              <Typography className={classes.displayItemText} variant={"h5"}>
                {
                  `Change ${getPercentText((data.recoveriesChange - data.previousRecoveriesChange) / data.previousRecoveriesChange * 100)} (${getSignText(data.recoveriesChange - data.previousRecoveriesChange)})`
                }
              </Typography>
            </React.Fragment>
          ) : null
        }
      </Paper>
    </div>
  );
};

export default withWidth()(WorldSummaryDataDisplay);

