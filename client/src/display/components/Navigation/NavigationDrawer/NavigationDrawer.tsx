import React from "react";
import clsx from "clsx";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import {
  appBarHeightLg,
  appBarHeightMd,
  appBarHeightSm,
  appBarHeightXs,
  drawerWidthExpanded,
  drawerWidthLg,
  drawerWidthMd,
  expandBarHeightLg,
  expandBarHeightMd,
} from "../Navigation";
import {Dialog} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import {TransitionProps} from "@material-ui/core/transitions";
import {MaterialIconNames} from "../../MaterialIcon/MaterialIcon";
import {Scrollbars} from "react-custom-scrollbars";
import MenuItem from "./MenuItem/MenuItem";
import MenuHeader from "./MenuHeader/MenuHeader";
import MenuCollapseButton from "./MenuCollapseButton/MenuCollapseButton";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {Pages, SubPages} from "../../../../state/global/App/types";

export type NavigationDrawerProps = NavigationDrawerDataProps & NavigationDrawerStyleProps & NavigationDrawerEventProps;

export interface NavigationDrawerDataProps {
  width: Breakpoint;
  drawerOpen: boolean;
  drawerExpanded: boolean;
  menuItems: Array<NavigationDrawerMenuItem>;
  version: string;
}

export interface NavigationDrawerStyleProps {

}

export interface NavigationDrawerEventProps {
  handleDrawerToggle(open: boolean): void;
  handleDrawerExpand(expanded: boolean): void;
  handleMenuItemClick(parentKey: Pages): void;
  handleMenuItemChildClick(parentKey: Pages, key: SubPages): void;
}

export interface NavigationDrawerMenuItem {
  iconName: MaterialIconNames;
  backgroundColor: string;
  color: string;
  text: Pages;
  toolTip: string;
  active: boolean;
  disabled?: boolean;
  children: Array<NavigationDrawerMenuChildItem>;
}

export interface NavigationDrawerMenuChildItem {
  iconName: MaterialIconNames;
  text: SubPages;
  toolTip: string;
  active: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: 0,
      flexShrink: 0,
      whiteSpace: "nowrap",
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerOpen: {
      width: drawerWidthMd,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.up("lg")]: {
        width: drawerWidthLg,
      },
    },
    drawerOpenExpanded: {
      width: drawerWidthExpanded,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuItemsListOuterWrapper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: `calc(100% - ${appBarHeightXs}px)`,
      top: appBarHeightXs,
      [theme.breakpoints.up("sm")]: {
        height: `calc(100% - ${appBarHeightSm}px)`,
        top: appBarHeightSm,
      },
      [theme.breakpoints.up("md")]: {
        height: `calc(100% - ${appBarHeightMd + expandBarHeightMd}px)`,
        top: appBarHeightMd,
      },
      [theme.breakpoints.up("lg")]: {
        height: `calc(100% - ${appBarHeightLg + expandBarHeightLg}px)`,
        top: appBarHeightLg,
      },
    },
    menuItemsListInnerWrapper: {
      height: "max-content",
      width: "100%",
      overflowX: "hidden",
    },
    drawerListWrapper: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const NavigationDrawer: React.FC<NavigationDrawerProps> = (props) => {
  const classes = useStyles();
  const {
    width,
    drawerOpen,
    drawerExpanded,
    menuItems,
    version,
    handleDrawerToggle,
    handleDrawerExpand,
    handleMenuItemClick,
    handleMenuItemChildClick,
  } = props;

  const isXs: boolean = /xs/.test(width);
  const isSm: boolean = /sm/.test(width);
  const isMd: boolean = /md/.test(width);
  const iconFontSize: number = isXs ? 20 : isSm ? 21 : isMd ? 22 : 23;

  const expandIconFontSize: number = isMd ? 22 : 23;

  const isSmXs: boolean = /xs|sm/.test(width);
  const isDrawerExpanded: boolean = drawerExpanded || isSmXs;

  const onDialogClose = (): void => {
    handleDrawerToggle(false);
  };

  const renderDrawer = (): JSX.Element => (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpen && !isDrawerExpanded,
        [classes.drawerOpenExpanded]: drawerOpen && isDrawerExpanded,
      })}
      classes={{
        paper: clsx(classes.drawer, {
          [classes.drawerOpen]: drawerOpen && !isDrawerExpanded,
          [classes.drawerOpenExpanded]: drawerOpen && isDrawerExpanded,
        }),
      }}
    >
      <div className={classes.drawerListWrapper}>
        <MenuHeader version={version} iconFontSize={iconFontSize}/>
        <div className={classes.menuItemsListOuterWrapper}>
          <Scrollbars autoHide>
            <div className={classes.menuItemsListInnerWrapper}>
              {
                menuItems.map((menuItem, index) => {
                  return (
                    <MenuItem key={index} index={index} menuItem={menuItem} drawerExpanded={drawerExpanded} iconFontSize={iconFontSize} handleMenuItemClick={handleMenuItemClick} handleMenuItemChildClick={handleMenuItemChildClick}/>
                  );
                })
              }
            </div>
          </Scrollbars>
        </div>
        <MenuCollapseButton isSmXs={isSmXs} drawerExpanded={drawerExpanded} expandIconFontSize={expandIconFontSize} handleDrawerExpand={handleDrawerExpand}/>
      </div>
    </Drawer>
  );

  return (
    isSmXs ? (
      <Dialog open={drawerOpen} TransitionComponent={Transition} onClose={onDialogClose}>
        {
          renderDrawer()
        }
      </Dialog>
    ) : renderDrawer()
  );
};

export default NavigationDrawer;

