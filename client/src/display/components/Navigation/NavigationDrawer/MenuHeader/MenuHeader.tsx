import React, {useState} from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import {drawerWidthExpanded} from "../../Navigation";
import {ListItemIcon} from "@material-ui/core";
export type MenuHeaderProps = MenuHeaderDataProps & MenuHeaderStyleProps & MenuHeaderEventProps;

export interface MenuHeaderDataProps {
  version: string;
}

export interface MenuHeaderStyleProps {
  iconFontSize: number;
}

export interface MenuHeaderEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    companyIconWrapper: {
      width: "100%",
      ...theme.mixins.toolbar,
      backgroundColor: theme.palette.background.paper,
      overflow: "hidden",
    },
    companyTextVersionWrapper: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      overflow: "hidden",
    },
    companyTextIconWrapper: {
      height: "100%",
      minWidth: drawerWidthExpanded - 88,
      width: drawerWidthExpanded - 88,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      transform: `translate(-${drawerWidthExpanded - 88}px)`,
    },
    versionTextWrapper: {
      height: "100%",
      minWidth: drawerWidthExpanded - 88,
      width: drawerWidthExpanded - 88,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.palette.background.paper,
      zIndex: theme.zIndex.drawer + 1,
    },
  })
);


const MenuHeader: React.FC<MenuHeaderProps> = (props) => {
  const classes = useStyles();
  const {
    version,
    iconFontSize,
  } = props;

  const [isHover, setIsHover] = useState<boolean>(false);

  const versionText: string = `Version ${version}`;

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>): void => {
    setIsHover(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>): void => {
    setIsHover(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>): void => {
    setIsHover(true);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>): void => {
    setIsHover(false);
  };

  return (
    <React.Fragment>
      <ListItem className={classes.companyIconWrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <ListItemIcon>
          <img src={"/resources/icon.svg"} style={{height: iconFontSize, width: iconFontSize}}/>
        </ListItemIcon>
        <div className={classes.companyTextVersionWrapper}>
          <Fade in={isHover}>
            <div className={classes.versionTextWrapper}>
              <ListItemText disableTypography primary={<Typography variant={"h5"} style={{transform: "translate(0px, 1px)"}}>{versionText}</Typography>}/>
            </div>
          </Fade>
          <div className={classes.companyTextIconWrapper}>
            <ListItemText disableTypography primary={<Typography variant={"h5"} style={{fontWeight: 600, transform: "translate(0px, 1px)"}}>COVID-19 Tracker</Typography>}/>
          </div>
        </div>
      </ListItem>
      <Divider />
    </React.Fragment>
  )
};

export default MenuHeader;

