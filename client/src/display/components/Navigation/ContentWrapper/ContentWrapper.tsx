import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {appBarHeightLg, appBarHeightMd, appBarHeightSm, appBarHeightXs} from "../Navigation";
import LoadingPage from "../../../pages/statelessPages/LoadingPage";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";

export type ContentWrapperProps = ContentWrapperDataProps & ContentWrapperStyleProps & ContentWrapperEventProps;

export interface ContentWrapperDataProps {
  isLoading: boolean;
}

export interface ContentWrapperStyleProps {
  width: Breakpoint;
  themeColor: string;
}

export interface ContentWrapperEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      position: "relative",
      width: "100%",
      height: `calc(100% - ${appBarHeightXs}px)`,
      top: appBarHeightXs,
      [theme.breakpoints.up("sm")]: {
        height: `calc(100% - ${appBarHeightSm}px)`,
        top: appBarHeightSm,
      },
      [theme.breakpoints.up("md")]: {
        height: `calc(100% - ${appBarHeightMd}px)`,
        top: appBarHeightMd,
      },
      [theme.breakpoints.up("lg")]: {
        height: `calc(100% - ${appBarHeightLg}px)`,
        top: appBarHeightLg,
      },
    },
  })
);

const ContentWrapper: React.FC<ContentWrapperProps> = (props) => {
  const classes = useStyles();

  const {
    width,
    themeColor,
    isLoading,
  } = props;

  return (
    <React.Fragment>
      <main className={classes.content}>
        {
          props.children
        }
      </main>
      {
        isLoading ? (
          <LoadingPage width={width} themeColor={themeColor}/>
        ) : null
      }
    </React.Fragment>
  );
};

export default ContentWrapper;

