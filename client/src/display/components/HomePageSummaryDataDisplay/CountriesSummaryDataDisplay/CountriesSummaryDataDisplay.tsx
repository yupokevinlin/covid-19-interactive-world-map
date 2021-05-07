import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {SummaryDataSelectBarValue} from "../SummaryDataSelectBar/types";
import {CasesSummaryData, CountriesSummary} from "../../../../../../shared/types/data/Cases/CasesTypes";
import CountriesSummaryDataTable from "./CountriesSummaryDataTable/CountriesSummaryDataTable";
import {CountriesSummaryDataTableType} from "./CountriesSummaryDataTable/types";

export type CountriesSummaryDataDisplayProps = CountriesSummaryDataDisplayDataProps & CountriesSummaryDataDisplayStyleProps & CountriesSummaryDataDisplayEventProps;

export interface CountriesSummaryDataDisplayDataProps {
  countriesSummary: CountriesSummary;
  countriesDataType: SummaryDataSelectBarValue;
}

export interface CountriesSummaryDataDisplayStyleProps {

}

export interface CountriesSummaryDataDisplayEventProps {

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
  }),
);

const CountriesSummaryDataDisplay: React.FC<CountriesSummaryDataDisplayProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    countriesDataType,
    countriesSummary,
  } = props;

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

  const data: CasesSummaryData = getCasesSummaryData(countriesSummary, countriesDataType);

  return (
    <div className={classes.root}>
      <CountriesSummaryDataTable key={0} type={CountriesSummaryDataTableType.Cases} data={data.casesChange} countriesDataType={countriesDataType}/>
      <CountriesSummaryDataTable key={1} type={CountriesSummaryDataTableType.Deaths} data={data.deathsChange} countriesDataType={countriesDataType}/>
      <CountriesSummaryDataTable key={2} type={CountriesSummaryDataTableType.Recoveries} data={data.recoveriesChange} countriesDataType={countriesDataType}/>
    </div>
  );
};

export default CountriesSummaryDataDisplay;

