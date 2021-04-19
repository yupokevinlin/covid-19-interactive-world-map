import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {MapSubPages} from "../../../state/global/App/types";
import {CasesData, DailyCasesData, DailyCasesDataNull} from "../../../../../shared/types/data/Cases/CasesTypes";
import {CasesUtils} from "../../../helper/CasesUtils";
import Typography from "@material-ui/core/Typography";
import {findFlagUrlByIso3Code} from "country-flags-svg";
import MaterialIcon, {MaterialIconNames} from "../MaterialIcon/MaterialIcon";
import getDailyCasesData = CasesUtils.getDailyCasesData;

export type MapPageInformationProps = MapPageInformationDataProps & MapPageInformationStyleProps & MapPageInformationEventProps;

export interface MapPageInformationDataProps {
  date: string;
  casesData: CasesData;
  subPage: MapSubPages;
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
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        height: "20px",
        width: "calc(100% - 50px)",
        margin: "21px 25px 0px 25px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "27px",
        width: "calc(100% - 54px)",
        margin: "21px 27px 0px 27px",
      },
      [theme.breakpoints.up("md")]: {
        height: "33px",
        width: "calc(100% - 60px)",
        margin: "21px 30px 0px 30px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "40px",
        width: "calc(100% - 60px)",
        margin: "21px 30px 0px 30px",
      },
    },
    text: {
      [theme.breakpoints.up("xs")]: {
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: "12px",
        marginLeft: "5px",
        marginRight: "5px",
      },
      [theme.breakpoints.up("sm")]: {
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "17px",
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
  }),
);

const MapPageInformation: React.FC<MapPageInformationProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    date,
    casesData,
    subPage,
    countryCode,
    regionName,
  } = props;

  const getDisplayedText = (subPage: MapSubPages): string => {
    switch (subPage) {
      case MapSubPages.CASES: {
        return "Total Cases:";
      }
      case MapSubPages.DEATHS: {
        return "Total Deaths:";
      }
      case MapSubPages.RECOVERIES: {
        return "Total Recoveries:";
      }
    }
  };

  const getDataNumber = (subPage: MapSubPages, casesData: CasesData, date: string): string => {
    const dailyCasesData: DailyCasesData | DailyCasesDataNull = getDailyCasesData(casesData.data, date);
    let dataNumber: number = 0;
    switch (subPage) {
      case MapSubPages.CASES: {
        dataNumber = dailyCasesData.totalCases || 0;
        break;
      }
      case MapSubPages.DEATHS: {
        dataNumber = dailyCasesData.totalDeaths || 0;
        break;
      }
      case MapSubPages.RECOVERIES: {
        dataNumber = dailyCasesData.totalRecoveries || 0;
        break;
      }
    }
    return dataNumber.toLocaleString();
  };

  return (
    <div className={classes.root}>
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
          regionName
        }
      </Typography>
      <Typography className={classes.text} variant={"h5"}>
        {
          getDisplayedText(subPage)
        }
      </Typography>
      <Typography className={classes.text} variant={"h5"}>
        {
          getDataNumber(subPage, casesData, date)
        }
      </Typography>
      <Typography className={classes.text} variant={"h5"}>Date:</Typography>
      <Typography className={classes.text} variant={"h5"}>
        {
          date
        }
      </Typography>
    </div>
  );
};

export default MapPageInformation;

