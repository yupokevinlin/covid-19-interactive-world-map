import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {
  CurrentCasesSummary,
} from "../../../../shared/types/data/Cases/CasesTypes";
import HomePageSummaryDataDisplay from "../components/HomePageSummaryDataDisplay/HomePageSummaryDataDisplay";
import {Scrollbars} from "react-custom-scrollbars";

export type HomePageProps = HomePageDataProps & HomePageStyleProps & HomePageEventProps;

export interface HomePageDataProps {
  summaryData: CurrentCasesSummary;
}

export interface HomePageStyleProps {

}

export interface HomePageEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    homePageWrapper: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      overflowY: "auto",
      overflowX: "hidden",
    },
    homePage: {
      height: "1000px",
      [theme.breakpoints.up("xs")]: {
        margin: "20px",
        width: "calc(100% - 40px)",
      },
      [theme.breakpoints.up("sm")]: {
        margin: "25px",
        width: "calc(100% - 50px)",
      },
      [theme.breakpoints.up("md")]: {
        margin: "30px",
        width: "calc(100% - 60px)",
      },
      [theme.breakpoints.up("lg")]: {
        margin: "35px",
        width: "calc(100% - 70px)",
      },
    },
  }),
);

const HomePage: React.FC<HomePageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    summaryData,
  } = props;

  return (
    <div className={classes.homePageWrapper}>
      <Scrollbars>
        <div className={classes.homePage}>
          <HomePageSummaryDataDisplay currentDate={summaryData.currentDate} worldData={summaryData.world} countriesData={summaryData.countries}/>
        </div>
      </Scrollbars>
    </div>
  );
};

export default HomePage;

