import React from "react";
import clsx from "clsx";
import ListItem from "@material-ui/core/ListItem";
import {
  menuItemHeaderWidth, menuItemHoverBrightnessChangeAmount
} from "../../../Navigation";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MaterialIcon, {MaterialIconNames} from "../../../../MaterialIcon/MaterialIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import {Pages, SubPages} from "../../../../../../state/global/App/types";

export type MenuItemChildProps = MenuItemChildDataProps & MenuItemChildStyleProps & MenuItemChildEventProps;

export interface MenuItemChildDataProps {
  key: string;
  index: number;
  iconName: MaterialIconNames;
  parentText: Pages;
  text: SubPages;
  toolTip: string;
  active: boolean;
  disabled: boolean;
  renderToolTip: boolean;
}

export interface MenuItemChildStyleProps {
  childHeaderColor: string;
  backgroundColor: string;
  iconFontSize: number;
}

export interface MenuItemChildEventProps {
  handleMenuItemChildClick(parentKey: Pages, key: SubPages): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItemChildElement: {
      width: `calc(100% - ${menuItemHeaderWidth}px)`,
      height: "max-content",
      ["&:hover"]: {
        filter: `brightness(${100 - 2 * menuItemHoverBrightnessChangeAmount}%)`,
      },
    },
    menuItemChildElementWrapper: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "max-content",
    },
    menuItemChildElementHeader: {
      width: menuItemHeaderWidth,
      height: 40,
      zIndex: theme.zIndex.drawer + 1,
      [theme.breakpoints.up("sm")]: {
        height: 41,
      },
      [theme.breakpoints.up("md")]: {
        height: 44,
      },
    },
    menuItemChildElementActive: {
      width: `calc(100% - ${menuItemHeaderWidth}px)`,
      height: "max-content",
      filter: `brightness(${100 - menuItemHoverBrightnessChangeAmount}%)`,
      ["&:hover"]: {
        filter: `brightness(${100 - 3 * menuItemHoverBrightnessChangeAmount}%)`,
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
  })
);

const MenuItemChild: React.FC<MenuItemChildProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();
  const {
    key,
    index,
    iconName,
    text,
    parentText,
    toolTip,
    active,
    childHeaderColor,
    backgroundColor,
    iconFontSize,
    disabled,
    renderToolTip,
    handleMenuItemChildClick,
  } = props;

  const childKey: string = `${key}-child-${index}`;

  const onClick = (): void => {
    if (!disabled) {
      handleMenuItemChildClick(parentText, text);
    }
  };

  return (
    <div className={classes.menuItemChildElementWrapper}>
      <div className={classes.menuItemChildElementHeader} style={{backgroundColor: childHeaderColor}}/>
      <div className={clsx(classes.menuItemChildElement, {
        [classes.menuItemChildElementActive]: active,
      })}>
        {
          renderToolTip ? (
            <Tooltip classes={{tooltip: classes.toolTip}} title={toolTip} placement={"right"}>
              <ListItem button key={childKey} onClick={onClick} style={{backgroundColor: disabled ? theme.palette.action.disabledBackground : backgroundColor, position: "relative", left: `-${menuItemHeaderWidth}px`, width: `calc(100% + ${menuItemHeaderWidth}px)`, cursor: disabled ? "default" : "pointer"}} disableRipple={disabled}>
                <ListItemIcon>
                  <MaterialIcon iconName={iconName} style={{fontSize: iconFontSize, color: disabled ? theme.palette.action.disabled : theme.palette.action.active}}/>
                </ListItemIcon>
                <ListItemText disableTypography primary={<Typography variant={"h5"} style={{fontWeight: active ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular, color: disabled ? theme.palette.text.disabled : theme.palette.text.primary}}>{text}</Typography>}/>
              </ListItem>
            </Tooltip>
          ) : (
            <ListItem button key={childKey} onClick={onClick} style={{backgroundColor: disabled ? theme.palette.action.disabledBackground : backgroundColor, position: "relative", left: `-${menuItemHeaderWidth}px`, width: `calc(100% + ${menuItemHeaderWidth}px)`, cursor: disabled ? "default" : "pointer"}} disableRipple={disabled}>
              <ListItemIcon>
                <MaterialIcon iconName={iconName} style={{fontSize: iconFontSize, color: disabled ? theme.palette.action.disabled : theme.palette.action.active}}/>
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography variant={"h5"} style={{fontWeight: active ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular, color: disabled ? theme.palette.text.disabled : theme.palette.text.primary}}>{text}</Typography>}/>
            </ListItem>
          )
        }
      </div>
    </div>
  );
};

export default MenuItemChild;

