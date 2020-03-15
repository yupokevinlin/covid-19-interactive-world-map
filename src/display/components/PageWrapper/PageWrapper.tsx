import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import styled from "styled-components";
import { ClassNameMap } from "@material-ui/styles";
import Spacer from "../Spacer/Spacer";
import { StyleUtils } from "../../../helper/StyleUtils";

export type PageWrapperProps = PageWrapperDataProps & PageWrapperStyleProps & PageWrapperEventProps;

export interface PageWrapperDataProps {
  title?: string;
  menuItems?: Array<MenuItem>;
}

export interface PageWrapperStyleProps {}

export interface PageWrapperEventProps {}

export interface MenuItem {
  title: string;
  icon: JSX.Element;
  clickHandler(): void;
}

const StyledPageWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const ContentAndSpacerWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const ContentWrapper = styled.div<{ height: number }>`
  height: ${props => `calc(100% - ${StyleUtils.getCssPixelString(props.height)})`};
  width: 100%;
`;

const drawerWidth: number = 240;
const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

const PageWrapper: React.FC<PageWrapperProps> = props => {
  const { title = "Title", menuItems = [] } = props;

  const classes: ClassNameMap<string> = useStyles();
  const theme: Theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [appBarHeight, setAppBarHeight] = useState<number>(64);
  const appBarRef: React.MutableRefObject<HTMLHeadElement> = useRef();

  useEffect(() => {
    setAppBarHeight(appBarRef.current.offsetHeight);
  }, []);

  const handleDrawerOpen = (): void => {
    setOpen(true);
  };

  const handleDrawerClose = (): void => {
    setOpen(false);
  };
  return (
    <StyledPageWrapper className={"page-wrapper"}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        ref={appBarRef}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={item.clickHandler}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <ContentAndSpacerWrapper>
        <Spacer height={appBarHeight} />
        <ContentWrapper height={appBarHeight}>{props.children}</ContentWrapper>
      </ContentAndSpacerWrapper>
    </StyledPageWrapper>
  );
};

export default PageWrapper;
