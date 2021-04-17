import React, {useState} from "react";
import {createStyles, Theme} from "@material-ui/core";
import ControlBar from "./ControlBar/ControlBar";
import ContentWrapper from "./ContentWrapper/ContentWrapper";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {useHistory} from "react-router-dom";
import {History} from "history";
import ProgressBar from "../ProgressBar/ProgressBar";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import NavigationDrawer, {NavigationDrawerMenuItem} from "./NavigationDrawer/NavigationDrawer";
import {Pages, SubPages} from "../../../state/global/App/types";

export type PageNavigationControlProps = PageNavigationControlDataProps & PageNavigationControlStyleProps & PageNavigationControlEventProps;

export interface PageNavigationControlDataProps {
  pageTitle: string;
  menuItems: Array<NavigationDrawerMenuItem>;
  displayLoadingBar: boolean;
  displayLoadingPage: boolean;
  version: string;
}

export interface PageNavigationControlStyleProps {
  width: Breakpoint;
}

export interface PageNavigationControlEventProps {
  handleMenuItemClick(parentKey: Pages, history: History): void;
  handleMenuItemChildClick(parentKey: Pages, key: SubPages, history: History): void;
}

export const drawerWidthExpanded: number = 220;
export const drawerWidthLg: number = 55;
export const drawerWidthMd: number = 54;
export const appBarHeightXs: number = 42;
export const appBarHeightSm: number = 44;
export const appBarHeightMd: number = 47;
export const appBarHeightLg: number = 50;
export const expandBarHeightLg: number = 47;
export const expandBarHeightMd: number = 46;
export const menuItemHeaderWidth: number = 5;
export const menuItemHoverBrightnessChangeAmount: number = 5;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigationControl: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      width: "100%",
    },
    controlBarContentWrapper: {
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: "0",
      left: "0",
      height: "100%",
      width: "100%",
      marginLeft: "0",
      overflow: "hidden",
    },
    controlBarContentWrapperDrawerOpen: {
      width: `calc(100% - ${drawerWidthMd}px)`,
      marginLeft: drawerWidthMd,
      transition: theme.transitions.create(["width", "margin-left"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.up("lg")]: {
        width: `calc(100% - ${drawerWidthLg}px)`,
        marginLeft: drawerWidthLg,
      },
    },
    controlBarContentWrapperDrawerOpenExpanded: {
      width: `calc(100% - ${drawerWidthExpanded}px)`,
      marginLeft: drawerWidthExpanded,
      transition: theme.transitions.create(["width", "margin-left"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  })
);

const Navigation: React.FC<PageNavigationControlProps> = (props) => {
  const classes = useStyles();
  const history: History = useHistory();

  const {
    pageTitle,
    menuItems,
    width,
    displayLoadingBar,
    displayLoadingPage,
    version,
    handleMenuItemClick,
    handleMenuItemChildClick,
  } = props;

  const isSmXs: boolean = /xs|sm/.test(width);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(!isSmXs);
  const [drawerExpanded, setDrawerExpanded] = useState<boolean>(!isSmXs);

  const handleDrawerToggle = (open: boolean): void => {
    setDrawerOpen(open);
  };

  const handleDrawerExpand = (expanded: boolean): void => {
    setDrawerExpanded(expanded);
  };

  const onMenuItemClick = (parentKey: Pages): void => {
    handleMenuItemClick(parentKey, history);
  };

  const onMenuItemChildClick = (parentKey: Pages, key: SubPages): void => {
    handleMenuItemChildClick(parentKey, key, history);
  };

  return (
    <React.Fragment>
      <div className={classes.navigationControl}>
        <NavigationDrawer width={width} drawerOpen={drawerOpen} drawerExpanded={drawerExpanded} menuItems={menuItems} version={version} handleDrawerToggle={handleDrawerToggle} handleDrawerExpand={handleDrawerExpand} handleMenuItemClick={onMenuItemClick} handleMenuItemChildClick={onMenuItemChildClick}/>
        <div className={clsx(classes.controlBarContentWrapper, {
          [classes.controlBarContentWrapperDrawerOpen]: drawerOpen && !drawerExpanded && !isSmXs,
          [classes.controlBarContentWrapperDrawerOpenExpanded]: drawerOpen && drawerExpanded && !isSmXs,
        })}>
          <ControlBar width={width} title={pageTitle} drawerOpen={drawerOpen} drawerExpanded={drawerExpanded} handleDrawerToggle={handleDrawerToggle}/>
          <ContentWrapper width={width} displayLoadingPage={displayLoadingPage}>
            {
              props.children
            }
          </ContentWrapper>
        </div>
      </div>
      <ProgressBar isLoading={displayLoadingBar}/>
    </React.Fragment>
  );
};

export default Navigation;

