import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CasesDataTypes, CasesTypes} from "../../../state/global/App/types";
import {
  CasesData, CasesInformationDataObject,
  DailyCasesData,
  DailyCasesDataNull,
  DailyCasesInformationData
} from "../../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "../../../helper/CasesUtils";
import Typography from "@material-ui/core/Typography";
import {findFlagUrlByIso3Code} from "country-flags-svg";
import MaterialIcon, {MaterialIconNames} from "../MaterialIcon/MaterialIcon";
import getDailyCasesData = CasesUtils.getDailyCasesData;
import getDailyCasesInformationData = CasesUtils.getDailyCasesInformationData;
import getCasesInformationDataObject = CasesUtils.getCasesInformationDataObject;
import {getName} from "../../../../../shared/helpers/General";

export type MapPageInformationProps = MapPageInformationDataProps & MapPageInformationStyleProps & MapPageInformationEventProps;

export interface MapPageInformationDataProps {
  date: string;
  casesData: CasesData;
  dailyCasesInformationDataObject: CasesInformationDataObject;
  weeklyCasesInformationDataObject: CasesInformationDataObject;
  monthlyCasesInformationDataObject: CasesInformationDataObject;
  yearlyCasesInformationDataObject: CasesInformationDataObject;
  casesDataType: CasesDataTypes;
  caseType: CasesTypes;
  countryCode: string;
  regionName: string;
}

export interface MapPageInformationStyleProps {

}

export interface MapPageInformationEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.up("xs")]: {
        alignItems: "center",
        alignContent: "space-around",
        justifyContent: "center",
        flexWrap: "wrap",
        height: "41px",
        width: "calc(100% - 10px)",
        margin: "0px 5px 0px 5px",
      },
      [theme.breakpoints.up("sm")]: {
        alignItems: "center",
        alignContent: "space-around",
        justifyContent: "center",
        flexWrap: "wrap",
        height: "48px",
        width: "calc(100% - 14px)",
        margin: "0px 7px 0px 7px",
      },
      [theme.breakpoints.up("md")]: {
        alignItems: "center",
        justifyContent: "center",
        height: "33px",
        width: "calc(100% - 60px)",
        margin: "21px 30px 0px 30px",
      },
      [theme.breakpoints.up("lg")]: {
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        width: "calc(100% - 60px)",
        margin: "21px 30px 0px 30px",
      },
    },
    text: {
      [theme.breakpoints.up("xs")]: {
        fontWeight: 600,
        fontSize: "10px",
        lineHeight: "10px",
        marginLeft: "5px",
        marginRight: "5px",
      },
      [theme.breakpoints.up("sm")]: {
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: "13px",
        marginLeft: "10px",
        marginRight: "10px",
      },
      [theme.breakpoints.up("md")]: {
        fontWeight: 400,
        fontSize: "20px",
        lineHeight: "23px",
        marginLeft: "15px",
        marginRight: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        fontWeight: 400,
        fontSize: "24px",
        lineHeight: "28px",
        marginLeft: "20px",
        marginRight: "20px",
      },
    },
    flag: {
      boxShadow: "0px 0px 5px #aaa",
      [theme.breakpoints.up("xs")]: {
        height: "20px",
        marginRight: "5px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "27px",
        marginRight: "10px",
      },
      [theme.breakpoints.up("md")]: {
        height: "33px",
        marginRight: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "40px",
        marginRight: "20px",
      },
    },
    worldFlagWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0000cd",
      boxShadow: "0px 0px 5px #aaa",
      [theme.breakpoints.up("xs")]: {
        height: "20px",
        width: "38px",
        marginRight: "5px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "27px",
        width: "51px",
        marginRight: "10px",
      },
      [theme.breakpoints.up("md")]: {
        height: "33px",
        width: "63px",
        marginRight: "15px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "40px",
        width: "76px",
        marginRight: "20px",
      },
    },
    worldFlagIcon: {
      color: "#FFFFFF",
      [theme.breakpoints.up("xs")]: {
        height: "15px",
        width: "15px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "20px",
        width: "20px",
      },
      [theme.breakpoints.up("md")]: {
        height: "25px",
        width: "25px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "30px",
        width: "30px",
      },
    },
    textWrapper: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
      height: "max-content",
      width: "max-content",
    },
    textFlagWrapper: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
      height: "max-content",
      [theme.breakpoints.up("xs")]: {
        width: "100%",
        justifyContent: "center",
      },
      [theme.breakpoints.up("md")]: {
        width: "max-content",
      },
    },
  }),
);

const MapPageInformation: React.FC<MapPageInformationProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    date,
    casesData,
    casesDataType,
    dailyCasesInformationDataObject,
    weeklyCasesInformationDataObject,
    monthlyCasesInformationDataObject,
    yearlyCasesInformationDataObject,
    caseType,
    countryCode,
    regionName,
  } = props;

  const getDisplayedText = (caseType: CasesTypes, casesDataType: CasesDataTypes): string => {
    switch (caseType) {
      case CasesTypes.CASES: {
        switch (casesDataType) {
          case CasesDataTypes.Total: {
            return "Total Cases:";
          }
          case CasesDataTypes.Daily: {
            return "Daily Cases:";
          }
          case CasesDataTypes.Weekly: {
            return "Weekly Cases:";
          }
          case CasesDataTypes.Monthly: {
            return "Monthly Cases:";
          }
          case CasesDataTypes.Yearly: {
            return "Yearly Cases:";
          }
        }
        break;
      }
      case CasesTypes.DEATHS: {
        switch (casesDataType) {
          case CasesDataTypes.Total: {
            return "Total Deaths:";
          }
          case CasesDataTypes.Daily: {
            return "Daily Deaths:";
          }
          case CasesDataTypes.Weekly: {
            return "Weekly Deaths:";
          }
          case CasesDataTypes.Monthly: {
            return "Monthly Deaths:";
          }
          case CasesDataTypes.Yearly: {
            return "Yearly Deaths:";
          }
        }
        break;
      }
      case CasesTypes.RECOVERIES: {
        switch (casesDataType) {
          case CasesDataTypes.Total: {
            return "Total Recoveries:";
          }
          case CasesDataTypes.Daily: {
            return "Daily Recoveries:";
          }
          case CasesDataTypes.Weekly: {
            return "Weekly Recoveries:";
          }
          case CasesDataTypes.Monthly: {
            return "Monthly Recoveries:";
          }
          case CasesDataTypes.Yearly: {
            return "Yearly Recoveries:";
          }
        }
        break;
      }
    }
  };

  const getDataNumber = (caseType: CasesTypes, casesData: CasesData, date: string, casesDataType: CasesDataTypes, dailyCasesInformationDataObject: CasesInformationDataObject, weeklyCasesInformationDataObject: CasesInformationDataObject, monthlyCasesInformationDataObject: CasesInformationDataObject, yearlyCasesInformationDataObject: CasesInformationDataObject): string => {
    if (casesDataType === CasesDataTypes.Total) {
      const dailyCasesData: DailyCasesData | DailyCasesDataNull = getDailyCasesData(casesData.data, date);
      let dataNumber: number = 0;
      switch (caseType) {
        case CasesTypes.CASES: {
          dataNumber = dailyCasesData.totalCases || 0;
          break;
        }
        case CasesTypes.DEATHS: {
          dataNumber = dailyCasesData.totalDeaths || 0;
          break;
        }
        case CasesTypes.RECOVERIES: {
          dataNumber = dailyCasesData.totalRecoveries || 0;
          break;
        }
      }
      return dataNumber.toLocaleString();
    } else {
      const matchingCasesInformationDataObject: CasesInformationDataObject | null = getCasesInformationDataObject(casesDataType, dailyCasesInformationDataObject, weeklyCasesInformationDataObject, monthlyCasesInformationDataObject, yearlyCasesInformationDataObject);
      let dataNumber: number = 0;
      if (!matchingCasesInformationDataObject) {
        return dataNumber.toLocaleString();
      }
      const dailyCasesInformationData: DailyCasesInformationData = getDailyCasesInformationData(matchingCasesInformationDataObject[regionName], date);
      switch (caseType) {
        case CasesTypes.CASES: {
          dataNumber = dailyCasesInformationData.cases || 0;
          break;
        }
        case CasesTypes.DEATHS: {
          dataNumber = dailyCasesInformationData.deaths || 0;
          break;
        }
        case CasesTypes.RECOVERIES: {
          dataNumber = dailyCasesInformationData.recoveries || 0;
          break;
        }
      }
      return dataNumber.toLocaleString();
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.textFlagWrapper}>
        {
          regionName === "World" ? (
            <div className={classes.worldFlagWrapper}>
              <MaterialIcon className={classes.worldFlagIcon} iconName={MaterialIconNames.Language}/>
            </div>
          ) : (
            <img className={classes.flag} src={findFlagUrlByIso3Code(countryCode)}/>
          )
        }
        <Typography className={classes.text} variant={"h5"}>
          {
            getName(regionName)
          }
        </Typography>
      </div>
      <div className={classes.textWrapper}>
        <Typography className={classes.text} variant={"h5"}>
          {
            getDisplayedText(caseType, casesDataType)
          }
        </Typography>
        <Typography className={classes.text} variant={"h5"}>
          {
            getDataNumber(caseType, casesData, date, casesDataType, dailyCasesInformationDataObject, weeklyCasesInformationDataObject, monthlyCasesInformationDataObject, yearlyCasesInformationDataObject)
          }
        </Typography>
      </div>
      <div className={classes.textWrapper}>
        <Typography className={classes.text} variant={"h5"}>Date:</Typography>
        <Typography className={classes.text} variant={"h5"}>
          {
            date
          }
        </Typography>
      </div>
    </div>
  );
};

export default MapPageInformation;

