import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import {
  appBarHeightLg,
  appBarHeightMd,
  appBarHeightSm,
  appBarHeightXs,
  drawerWidthExpanded,
  drawerWidthLg,
  drawerWidthMd, menuItemHoverBrightnessChangeAmount
} from "../Navigation";
import clsx from "clsx";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import Tooltip from "@material-ui/core/Tooltip";
import MaterialIcon, {MaterialIconNames} from "../../MaterialIcon/MaterialIcon";


export type ControlBarProps = ControlBarDataProps & ControlBarStyleProps & ControlBarEventProps;

export interface ControlBarDataProps {
  title: string;
  drawerOpen: boolean;
  drawerExpanded: boolean;
}

export interface ControlBarStyleProps {
  width: Breakpoint;
}

export interface ControlBarEventProps {
  handleDrawerToggle(open: boolean): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidthMd,
      width: `calc(100% - ${drawerWidthMd}px) !important`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.up("lg")]: {
        marginLeft: drawerWidthLg,
        width: `calc(100% - ${drawerWidthLg}px) !important`,
      },
    },
    appBarShiftExpanded: {
      marginLeft: drawerWidthExpanded,
      width: `calc(100% - ${drawerWidthExpanded}px) !important`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    badge: {
      fontSize: 8,
      top: 2,
      height: 16,
      [theme.breakpoints.up("sm")]: {
        fontSize: 8,
        top: 2,
        height: 16,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 8.5,
        top: 3,
        height: 18,
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: 8.5,
        top: 3,
        height: 20,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    buttons: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      marginLeft: theme.spacing(2),
      cursor: "pointer",
      height: appBarHeightXs - 8,
      width: appBarHeightXs - 8,
      [theme.breakpoints.up("sm")]: {
        height: appBarHeightSm - 8,
        width: appBarHeightSm - 8,
      },
      [theme.breakpoints.up("md")]: {
        height: appBarHeightMd - 8,
        width: appBarHeightMd - 8,
      },
      [theme.breakpoints.up("lg")]: {
        height: appBarHeightLg - 8,
        width: appBarHeightLg - 8,
      },
      ["&:hover"]: {
        filter: `brightness(${100 - 2 * menuItemHoverBrightnessChangeAmount}%)`,
      },
    },
    toolTip: {
      fontSize: 11,
      height: 16,
      lineHeight: "16px",
      [theme.breakpoints.up("sm")]: {
        fontSize: 11,
        height: 16,
        lineHeight: "16px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 12,
        height: 18,
        lineHeight: "18px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: 12,
        height: 20,
        lineHeight: "20px",
      },
    },
  }),
);

const ControlBar: React.FC<ControlBarProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    title,
    drawerOpen,
    drawerExpanded,
    width,
    handleDrawerToggle,
  } = props;

  const isXs: boolean = /xs/.test(width);
  const isSm: boolean = /sm/.test(width);
  const isMd: boolean = /md/.test(width);
  const iconFontSize: number = (isXs ? appBarHeightXs : isSm ? appBarHeightSm : isMd ? appBarHeightMd : appBarHeightLg) - 24;

  const isSmXs: boolean = /xs|sm/.test(width);

  const onMenuIconClick = (): void => {
    handleDrawerToggle(!drawerOpen);
  };

  return (
    <AppBar position="fixed" className={clsx(classes.appBar, {
      [classes.appBarShift]: drawerOpen && !drawerExpanded && !isSmXs,
      [classes.appBarShiftExpanded]: drawerOpen && drawerExpanded && !isSmXs,
    })}>
      <Toolbar>
        <Tooltip classes={{tooltip: classes.toolTip}} title={"Toggle Menu"}>
          <IconButton edge={"start"} className={classes.menuButton} color={"inherit"} onClick={onMenuIconClick}>
            <MaterialIcon iconName={MaterialIconNames.Menu} style={{fontSize: iconFontSize}}/>
          </IconButton>
        </Tooltip>
        <Typography variant={"h4"}>
          {
            title
          }
        </Typography>
        <div className={classes.grow} />
          <div className={classes.buttons}>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default ControlBar;

