import React from "react";
import {createStyles, Theme, useTheme, withWidth} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CasesSummaryData, CountriesSummary, WorldSummary} from "../../../../../shared/types/data/Cases/CasesTypes";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {Moment} from "moment";
import {DateUtils} from "../../../helper/DateUtils";
import getMomentDateFromDateString = DateUtils.getMomentDateFromDateString;
import SummaryDataSelectBar from "./SummaryDataSelectBar/SummaryDataSelectBar";
import {SummaryDataSelectBarValue} from "./SummaryDataSelectBar/types";
import WorldSummaryDataDisplay from "./WorldSummaryDataDisplay/WorldSummaryDataDisplay";
import CountriesSummaryDataDisplay from "./CountriesSummaryDataDisplay/CountriesSummaryDataDisplay";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {CountriesSummaryDataTableType} from "./CountriesSummaryDataDisplay/CountriesSummaryDataTable/types";
import CountriesSummaryDataTable
  from "./CountriesSummaryDataDisplay/CountriesSummaryDataTable/CountriesSummaryDataTable";

export type HomePageSummaryDataDisplayProps = HomePageSummaryDataDisplayDataProps & HomePageSummaryDataDisplayStyleProps & HomePageSummaryDataDisplayEventProps;

export interface HomePageSummaryDataDisplayDataProps {
  currentDate: string;
  worldData: WorldSummary;
  countriesData: CountriesSummary;
}

export interface HomePageSummaryDataDisplayStyleProps {
  width: Breakpoint;
}

export interface HomePageSummaryDataDisplayEventProps {

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
        fontSize: "12px",
        lineHeight: "12px",
        height: "14px",
        marginBottom: "4px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "16px",
        lineHeight: "16px",
        height: "16px",
        marginBottom: "6px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "18px",
        lineHeight: "18px",
        height: "18px",
        marginBottom: "8px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "20px",
        lineHeight: "20px",
        height: "20px",
        marginBottom: "10px",
      },
    },
    summaryLabel: {
      fontWeight: "bold",
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
        lineHeight: "12px",
        height: "12px",
        marginTop: "12px",
        marginBottom: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "14px",
        lineHeight: "14px",
        height: "14px",
        marginTop: "14px",
        marginBottom: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
        lineHeight: "16px",
        height: "16px",
        marginTop: "16px",
        marginBottom: "16px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "18px",
        lineHeight: "18px",
        height: "18px",
        marginTop: "18px",
        marginBottom: "18px",
      },
    },
    summaryDataWrapper: {
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
  }),
);

const HomePageSummaryDataDisplay: React.FC<HomePageSummaryDataDisplayProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    currentDate,
    worldData,
    countriesData,
    width,
  } = props;

  const [worldDataType, setWorldDataType] = React.useState<SummaryDataSelectBarValue>(SummaryDataSelectBarValue.DAILY);
  const [countriesDataType, setCountriesDataType] = React.useState<SummaryDataSelectBarValue>(SummaryDataSelectBarValue.DAILY);


  const currentDateMoment: Moment = getMomentDateFromDateString(currentDate);
  currentDateMoment.add(25, "hours");

  const currentDateText: string = `Last Updated: ${currentDateMoment.format("LLLL")}`;

  const handleWorldDataTypeChange = (value: SummaryDataSelectBarValue): void => {
    setWorldDataType(value);
  };

  const handleCountriesDataTypeChange = (value: SummaryDataSelectBarValue): void => {
    setCountriesDataType(value);
  };

  const getCasesSummaryData = (countriesSummary: CountriesSummary, type: SummaryDataSelectBarValue): CasesSummaryData => {
    switch (type) {
      case SummaryDataSelectBarValue.DAILY: {
        return countriesSummary.daily;
      }
      case SummaryDataSelectBarValue.WEEKLY: {
        return countriesSummary.weekly;
      }
      case SummaryDataSelectBarValue.MONTHLY: {
        return countriesSummary.monthly;
      }
      case SummaryDataSelectBarValue.YEARLY: {
        return countriesSummary.yearly;
      }
      case SummaryDataSelectBarValue.ALL: {
        return countriesSummary.all;
      }
    }
  };

  const isLg: boolean = width === "lg" || width === "xl";
  const countriesSummaryData: CasesSummaryData = getCasesSummaryData(countriesData, countriesDataType);

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.updateFontSize} variant={"h5"}>
        {
          currentDateText
        }
      </Typography>
      <Typography className={classes.summaryLabel} variant={"h5"}>
        World Summary
      </Typography>
      <Paper className={classes.dataWrapper} elevation={3}>
        <SummaryDataSelectBar value={worldDataType} handleWorldDataTypeChange={handleWorldDataTypeChange}/>
        <WorldSummaryDataDisplay worldDataType={worldDataType} worldData={worldData}/>
      </Paper>
      <Typography className={classes.summaryLabel} variant={"h5"}>
        Countries Summary
      </Typography>
      <Paper className={classes.dataWrapper} elevation={3}>
        {
          isLg ? (
            <React.Fragment>
              <SummaryDataSelectBar value={countriesDataType} handleWorldDataTypeChange={handleCountriesDataTypeChange}/>
              <CountriesSummaryDataDisplay countriesDataType={countriesDataType} countriesSummary={countriesData}/>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <SummaryDataSelectBar value={countriesDataType} handleWorldDataTypeChange={handleCountriesDataTypeChange}/>
              <div className={classes.summaryDataWrapper}>
                <CountriesSummaryDataTable type={CountriesSummaryDataTableType.Cases} data={countriesSummaryData.casesChange} countriesDataType={countriesDataType}/>
              </div>
              <SummaryDataSelectBar value={countriesDataType} handleWorldDataTypeChange={handleCountriesDataTypeChange}/>
              <div className={classes.summaryDataWrapper}>
                <CountriesSummaryDataTable type={CountriesSummaryDataTableType.Deaths} data={countriesSummaryData.deathsChange} countriesDataType={countriesDataType}/>
              </div>
              <SummaryDataSelectBar value={countriesDataType} handleWorldDataTypeChange={handleCountriesDataTypeChange}/>
              <div className={classes.summaryDataWrapper}>
                <CountriesSummaryDataTable type={CountriesSummaryDataTableType.Recoveries} data={countriesSummaryData.recoveriesChange} countriesDataType={countriesDataType}/>
              </div>
            </React.Fragment>
          )
        }
      </Paper>
    </div>
  );
};

export default withWidth()(HomePageSummaryDataDisplay);

