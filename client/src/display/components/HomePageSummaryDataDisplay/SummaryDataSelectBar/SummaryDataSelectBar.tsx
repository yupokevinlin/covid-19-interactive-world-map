import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {SummaryDataSelectBarValue} from "./types";
import clsx from "clsx";

export type SummaryDataSelectBarProps = SummaryDataSelectBarDataProps & SummaryDataSelectBarStyleProps & SummaryDataSelectBarEventProps;

export interface SummaryDataSelectBarDataProps {
  value: SummaryDataSelectBarValue
}

export interface SummaryDataSelectBarStyleProps {

}

export interface SummaryDataSelectBarEventProps {
  handleWorldDataTypeChange(value: SummaryDataSelectBarValue): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: "100%",
      position: "relative",
      [theme.breakpoints.up("xs")]: {
        height: "29px",
        minHeight: "29px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "32px",
        minHeight: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "36px",
        minHeight: "36px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "39px",
        minHeight: "39px",
      },
    },
    tabsBar: {
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.up("xs")]: {
        height: "29px",
        minHeight: "29px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "32px",
        minHeight: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "36px",
        minHeight: "36px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "39px",
        minHeight: "39px",
      },
    },
    tabs: {
      "& .MuiTabs-scroller": {
        display: "flex",
        flexDirection: "column",
        "& .MuiTabs-indicator": {
          position: "relative",
          width: "20% !important",
          left: "0% !important",
          [theme.breakpoints.up("xs")]: {
            height: "2px",
          },
          [theme.breakpoints.up("sm")]: {
            height: "2px",
          },
          [theme.breakpoints.up("md")]: {
            height: "3px",
          },
          [theme.breakpoints.up("lg")]: {
            height: "3px",
          },
        },
      },
      [theme.breakpoints.up("xs")]: {
        height: "29px",
        minHeight: "29px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "32px",
        minHeight: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "36px",
        minHeight: "36px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "39px",
        minHeight: "39px",
      },
    },
    tabs1: {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-indicator": {
          left: "20% !important",
        },
      },
    },
    tabs2: {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-indicator": {
          left: "40% !important",
        },
      },
    },
    tabs3: {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-indicator": {
          left: "60% !important",
        },
      },
    },
    tabs4: {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-indicator": {
          left: "80% !important",
        },
      },
    },
    tab: {
      minWidth: "0px",
      [theme.breakpoints.up("xs")]: {
        height: "27px",
        minHeight: "27px",
        padding: "6px 12px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "30px",
        minHeight: "30px",
        padding: "6px 12px",
      },
      [theme.breakpoints.up("md")]: {
        height: "33px",
        minHeight: "33px",
        padding: "6px 12px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "36px",
        minHeight: "36px",
        padding: "6px 12px",
      },
      "& .MuiTab-wrapper": {
        [theme.breakpoints.up("xs")]: {
          fontSize: "9px",
        },
        [theme.breakpoints.up("sm")]: {
          fontSize: "12px",
        },
        [theme.breakpoints.up("md")]: {
          fontSize: "14px",
        },
        [theme.breakpoints.up("lg")]: {
          fontSize: "16px",
        },
      },
    }
  }),
);

const SummaryDataSelectBar: React.FC<SummaryDataSelectBarProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    value,
    handleWorldDataTypeChange,
  } = props;

  const handleChange = (event: React.MouseEvent<HTMLDivElement>, newValue: SummaryDataSelectBarValue) => {
    handleWorldDataTypeChange(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar>
        {/*<Tabs*/}
        {/*  className={clsx(classes.tabs, {*/}
        {/*    [classes.tabs1]: value === SummaryDataSelectBarValue.WEEKLY,*/}
        {/*    [classes.tabs2]: value === SummaryDataSelectBarValue.MONTHLY,*/}
        {/*    [classes.tabs3]: value === SummaryDataSelectBarValue.YEARLY,*/}
        {/*    [classes.tabs4]: value === SummaryDataSelectBarValue.ALL,*/}
        {/*  })}*/}
        {/*  value={value}*/}
        {/*  onChange={handleChange}*/}
        {/*  indicatorColor={"primary"}*/}
        {/*  textColor={"primary"}*/}
        {/*  variant={"fullWidth"}*/}
        {/*>*/}
        {/*  <Tab className={classes.tab} key={0} label={SummaryDataSelectBarValue.DAILY} value={SummaryDataSelectBarValue.DAILY}/>*/}
        {/*  <Tab className={classes.tab} key={1} label={SummaryDataSelectBarValue.WEEKLY} value={SummaryDataSelectBarValue.WEEKLY}/>*/}
        {/*  <Tab className={classes.tab} key={2} label={SummaryDataSelectBarValue.MONTHLY} value={SummaryDataSelectBarValue.MONTHLY}/>*/}
        {/*  <Tab className={classes.tab} key={3} label={SummaryDataSelectBarValue.YEARLY} value={SummaryDataSelectBarValue.YEARLY}/>*/}
        {/*  <Tab className={classes.tab} key={4} label={SummaryDataSelectBarValue.ALL} value={SummaryDataSelectBarValue.ALL}/>*/}
        {/*</Tabs>*/}
      </AppBar>
    </div>
  );
};

export default SummaryDataSelectBar;
