import React, { useEffect, useRef, useState } from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";
import { ClassNameMap } from "@material-ui/styles";
import Spacer from "../Spacer/Spacer";
import { StyleUtils } from "../../../helper/StyleUtils";
import { Hidden } from "@material-ui/core";

export type PageWrapperProps = PageWrapperDataProps & PageWrapperStyleProps & PageWrapperEventProps;

export interface PageWrapperDataProps {
  title?: string;
  menuItems: JSX.Element;
}

export interface PageWrapperStyleProps {}

export interface PageWrapperEventProps {}

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

const ContentWrapper = styled.div`
  height: calc(100% - 64px);
  @media (max-width: 600px) {
    height: calc(100% - 56px);
  }
  width: 100%;
`;

const ContentSpacer = styled.div`
  height: 64px;
  @media (max-width: 600px) {
    height: 56px;
  }
  width: 0%;
`;

const drawerWidth: number = 210;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const PageWrapper: React.FC<PageWrapperProps> = props => {
  const { title = "Title", menuItems = [] } = props;

  const classes: ClassNameMap<string> = useStyles();
  const theme: Theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const appBarRef: React.MutableRefObject<HTMLHeadElement> = useRef();

  const handleDrawerToggle = (): void => {
    setOpen(!open);
  };

  const drawer: JSX.Element = (
    <React.Fragment>
      <div className={classes.toolbar} />
      <Divider />
      {
        menuItems
      }
    </React.Fragment>
  );

  return (
    <StyledPageWrapper className={"page-wrapper"}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} ref={appBarRef}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={open}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <ContentAndSpacerWrapper>
        <ContentSpacer className={"content-spacer"} />
        <ContentWrapper className={"content-wrapper"}>{props.children}</ContentWrapper>
      </ContentAndSpacerWrapper>
    </StyledPageWrapper>
  );
};

export default PageWrapper;
