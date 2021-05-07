import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CasesSummaryTypeData} from "../../../../../../../shared/types/data/Cases/CasesTypes";
import {CountriesSummaryDataTableType} from "./types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {SummaryDataSelectBarValue} from "../../SummaryDataSelectBar/types";
import {findFlagUrlByIso3Code} from "country-flags-svg";

export type CountriesSummaryDataTableProps = CountriesSummaryDataTableDataProps & CountriesSummaryDataTableStyleProps & CountriesSummaryDataTableEventProps;

export interface CountriesSummaryDataTableDataProps {
  countriesDataType: SummaryDataSelectBarValue;
  type: CountriesSummaryDataTableType;
  data: Array<CasesSummaryTypeData>;
}

export interface CountriesSummaryDataTableStyleProps {

}

export interface CountriesSummaryDataTableEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      height: "max-content",
      [theme.breakpoints.up("xs")]: {
        width: "90%",
        marginTop: "10px",
        marginBottom: "10px",
      },
      [theme.breakpoints.up("sm")]: {
        width: "90%",
        marginTop: "10px",
        marginBottom: "10px",
      },
      [theme.breakpoints.up("md")]: {
        width: "90%",
        marginTop: "15px",
        marginBottom: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        width: "30%",
        marginTop: "20px",
        marginBottom: "20px",
      },
    },
    titleWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "21px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "26px",
      },
      [theme.breakpoints.up("md")]: {
        height: "31px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "36px",
      },
    },
    title: {
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "16px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "20px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "24px",
      },
    },
    headerRowWrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "21px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "26px",
      },
      [theme.breakpoints.up("md")]: {
        height: "31px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "36px",
      },
    },
    headerRowText: {
      color: theme.palette.text.primary,
      marginLeft: "10px",
      fontWeight: "bold",
      fontSize: "12px",
    },
    rowWrapper: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "42px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "52px",
      },
      [theme.breakpoints.up("md")]: {
        height: "62px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "108px",
      },
    },
    rowCellWrapper: {
      color: theme.palette.text.primary,
      marginLeft: "10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      [theme.breakpoints.up("xs")]: {
        height: "42px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "52px",
      },
      [theme.breakpoints.up("md")]: {
        height: "62px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "108px",
      },
    },
    rowCell: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
        height: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "14px",
        height: "14px",
      },
    },
    rowFlag: {
      [theme.breakpoints.up("xs")]: {
        height: "14px",
      },
      height: "16px"
    },
  }),
);

const CountriesSummaryDataTable: React.FC<CountriesSummaryDataTableProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    countriesDataType,
    type,
    data,
  } = props;

  const getTitleBackgroundColor = (type: CountriesSummaryDataTableType): string => {
    switch (type) {
      case CountriesSummaryDataTableType.Cases: {
        return "#ff9800";
      }
      case CountriesSummaryDataTableType.Deaths: {
        return "#f44336";
      }
      case CountriesSummaryDataTableType.Recoveries: {
        return "#4caf50";
      }
    }
  };

  const getHeaderBarBackgroundColor = (type: CountriesSummaryDataTableType): string => {
    switch (type) {
      case CountriesSummaryDataTableType.Cases: {
        return "#ffb74d";
      }
      case CountriesSummaryDataTableType.Deaths: {
        return "#e57373";
      }
      case CountriesSummaryDataTableType.Recoveries: {
        return "#81c784";
      }
    }
  };

  const getRowBackgroundColor = (type: CountriesSummaryDataTableType, index: number): string => {
    const isEven: boolean = index % 2 === 0;
    switch (type) {
      case CountriesSummaryDataTableType.Cases: {
        return isEven ? "#fff3e0" : "#ffe0b2";
      }
      case CountriesSummaryDataTableType.Deaths: {
        return isEven ? "#ffebee" : "#ffcdd2";
      }
      case CountriesSummaryDataTableType.Recoveries: {
        return isEven ? "#e8f5e9" : "#c8e6c9";
      }
    }
  };

  const getPreviousDataLabel = (countriesDataType: SummaryDataSelectBarValue): string => {
    switch (countriesDataType) {
      case SummaryDataSelectBarValue.DAILY:
      case SummaryDataSelectBarValue.WEEKLY:
      case SummaryDataSelectBarValue.MONTHLY:
      case SummaryDataSelectBarValue.YEARLY: {
        return countriesDataType.toLowerCase().replace("past", "Previous");
      }
      case SummaryDataSelectBarValue.ALL: {
        return "";
      }
    }
  };

  const getPastDataLabel = (countriesDataType: SummaryDataSelectBarValue, type: CountriesSummaryDataTableType): string => {
    switch (countriesDataType) {
      case SummaryDataSelectBarValue.DAILY:
      case SummaryDataSelectBarValue.WEEKLY:
      case SummaryDataSelectBarValue.MONTHLY:
      case SummaryDataSelectBarValue.YEARLY: {
        return countriesDataType.toLowerCase().replace("past", "Past");
      }
      case SummaryDataSelectBarValue.ALL: {
        return type;
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

  const isAll: boolean = countriesDataType === SummaryDataSelectBarValue.ALL;

  return (
    <Paper className={classes.root} square>
      <div className={classes.titleWrapper} style={{backgroundColor: getTitleBackgroundColor(type)}}>
        <Typography className={classes.title} variant={"h5"}>
          {
            type
          }
        </Typography>
      </div>
      <div className={classes.headerRowWrapper} style={{backgroundColor: getHeaderBarBackgroundColor(type)}}>
        <Typography className={classes.headerRowText} variant={"h5"} style={{width: isAll ? "50%" : "40%"}}>
          Country
        </Typography>
        <Typography className={classes.headerRowText} variant={"h5"} style={{width: isAll ? "50%" : "30%"}}>
          {
            getPastDataLabel(countriesDataType, type)
          }
        </Typography>
        {
          !isAll ? (
            <Typography className={classes.headerRowText} variant={"h5"} style={{width: "30%"}}>
              {
                getPreviousDataLabel(countriesDataType)
              }
            </Typography>
          ) : null
        }
      </div>
      {
        data.map((summary, index) => (
          <div key={index} className={classes.rowWrapper} style={{backgroundColor: getRowBackgroundColor(type, index)}}>
            <div className={classes.rowCellWrapper} style={{width: isAll ? "50%" : "40%"}}>
              <Typography className={classes.rowCell}>
                {
                  summary.nameString
                }
              </Typography>
              <img className={classes.rowFlag} src={findFlagUrlByIso3Code(summary.countryCode)}/>
            </div>
            <div className={classes.rowCellWrapper} style={{width: isAll ? "50%" : "30%"}}>
              <Typography className={classes.rowCell}>
                {
                  getSignText(summary.change)
                }
              </Typography>
            </div>
            {
              !isAll ? (
                <div className={classes.rowCellWrapper} style={{width: isAll ? "50%" : "30%"}}>
                  <Typography className={classes.rowCell}>
                    {
                      getSignText(summary.previousChange)
                    }
                  </Typography>
                  <Typography className={classes.rowCell}>
                    {
                      getPercentText((summary.change - summary.previousChange) * 100 / summary.previousChange)
                    }
                  </Typography>
                </div>
              ) : null
            }
          </div>
        ))
      }
    </Paper>
  );
};

export default CountriesSummaryDataTable;

