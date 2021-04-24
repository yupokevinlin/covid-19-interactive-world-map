import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

export type HomePageProps = HomePageDataProps & HomePageStyleProps & HomePageEventProps;

export interface HomePageDataProps {

}

export interface HomePageStyleProps {

}

export interface HomePageEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
);

const HomePage: React.FC<HomePageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {

  } = props;

  return (
    <div/>
  );
};

export default HomePage;

