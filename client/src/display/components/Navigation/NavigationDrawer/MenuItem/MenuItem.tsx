import React from "react";
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MaterialIcon from "../../../MaterialIcon/MaterialIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {NavigationDrawerMenuItem} from "../NavigationDrawer";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {menuItemHoverBrightnessChangeAmount} from "../../Navigation";
import MenuItemChild from "./MenuItemChild/MenuItemChild";
import Menu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindHover,
  bindMenu, PopupState,
} from "material-ui-popup-state/hooks"
import MenuItemSideMenuHeader from "./MenuItemSideMenuHeader/MenuItemSideMenuHeader";
import MenuItemSideMenuItem from "./MenuItemSideMenuItem/MenuItemSideMenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import {Pages, SubPages} from "../../../../../state/global/App/types";

export type MenuItemProps = MenuItemDataProps & MenuItemStyleProps & MenuItemEventProps;

export interface MenuItemDataProps {
  index: number;
  menuItem: NavigationDrawerMenuItem;
  drawerExpanded: boolean;
}

export interface MenuItemStyleProps {
  iconFontSize: number;
}

export interface MenuItemEventProps {
  handleMenuItemClick(parentKey: Pages): void;
  handleMenuItemChildClick(parentKey: Pages, key: SubPages): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItemWrapper: {
      width: "100%",
      height: "max-content",
      ["&:hover"]: {
        filter: `brightness(${100 - 2 * menuItemHoverBrightnessChangeAmount}%)`,
      },
    },
    menuItemChildListWrapper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "max-content",
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

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    index,
    menuItem,
    drawerExpanded,
    iconFontSize,
    handleMenuItemClick,
    handleMenuItemChildClick,
  } = props;

  const popupState: PopupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const hasChildren: boolean = menuItem.children.length > 0;
  const disabled: boolean = !!menuItem.disabled;
  const renderToolTip: boolean = menuItem.active && !drawerExpanded;
  const renderSideMenu: boolean = !menuItem.active && !disabled;
  const isChildrenActive: boolean = hasChildren ? menuItem.children.map(child => child.active).reduce((accumulator, value) => accumulator || value) : false;
  const backgroundColor: string = isChildrenActive || menuItem.active ? menuItem.backgroundColor : theme.palette.background.paper;
  const key: string = `item-${index}`;
  const sideMenuHeaderKey: string = `side-menu-item-${index}`;

  const onClick = (): void => {
    if (!disabled) {
      handleMenuItemClick(menuItem.text);
    }
  };

  const handleSideMenuHeaderClick = (parentKey: Pages): void => {
    popupState.close();
    handleMenuItemClick(parentKey);
  };

  const handleSideMenuItemClick = (parentKey: Pages, key: SubPages): void => {
    popupState.close();
    handleMenuItemChildClick(parentKey, key);
  };
  
  return (
    <React.Fragment>
      <div className={classes.menuItemWrapper} {...bindHover(popupState)}>
        {
          renderToolTip ? (
            <Tooltip classes={{tooltip: classes.toolTip}} title={menuItem.toolTip} placement={"right"}>
              <ListItem key={key} onClick={onClick} style={{backgroundColor: disabled ? theme.palette.action.disabledBackground : backgroundColor, cursor: disabled ? "default" : "pointer"}}>
                <ListItemIcon>
                  <MaterialIcon iconName={menuItem.iconName} style={{fontSize: iconFontSize, color: disabled ? theme.palette.action.disabled : menuItem.color}}/>
                </ListItemIcon>
                <ListItemText disableTypography primary={<Typography variant={"h5"} style={{fontWeight: menuItem.active ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular, color: disabled ? theme.palette.text.disabled : theme.palette.text.primary}}>{menuItem.text}</Typography>}/>
              </ListItem>
            </Tooltip>
          ) : (
            <ListItem key={key} onClick={onClick} style={{backgroundColor: disabled ? theme.palette.action.disabledBackground : backgroundColor, cursor: disabled ? "default" : "pointer"}}>
              <ListItemIcon>
                <MaterialIcon iconName={menuItem.iconName} style={{fontSize: iconFontSize, color: disabled ? theme.palette.action.disabled : menuItem.color}}/>
              </ListItemIcon>
              <ListItemText disableTypography primary={<Typography variant={"h5"} style={{fontWeight: menuItem.active ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular, color: disabled ? theme.palette.text.disabled : theme.palette.text.primary}}>{menuItem.text}</Typography>}/>
            </ListItem>
          )
        }
        {
          renderSideMenu ? (
            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItemSideMenuHeader key={sideMenuHeaderKey} keyString={sideMenuHeaderKey} menuItem={menuItem} handleSideMenuHeaderClick={handleSideMenuHeaderClick}/>
              {
                menuItem.children.map((child, childIndex) => {
                  const sideMenuItemKey: string = `side-menu-item-${index}-child-${childIndex}`;
                  const childDisabled: boolean = disabled || !!child.disabled;
                  return (
                    <MenuItemSideMenuItem key={sideMenuItemKey} keyString={sideMenuItemKey} iconName={child.iconName} parentText={menuItem.text} text={child.text} disabled={childDisabled} handleSideMenuItemClick={handleSideMenuItemClick}/>
                  );
                })
              }
            </Menu>
          ) : null
        }
      </div>
      {
        hasChildren ? (
          <Collapse in={isChildrenActive}>
            <div className={classes.menuItemChildListWrapper}>
              {
                menuItem.children.map((child, childIndex) => {
                  const childKey: string = `item-${index}-child-${childIndex}`;
                  const childHeaderColor: string = child.active ? menuItem.color : theme.palette.grey["500"];
                  const childDisabled: boolean = disabled || !!child.disabled;
                  return (
                    <MenuItemChild key={childKey} keyString={childKey} index={childIndex} iconName={child.iconName} parentText={menuItem.text} text={child.text} toolTip={child.toolTip} active={child.active} disabled={childDisabled} renderToolTip={renderToolTip} childHeaderColor={childHeaderColor} backgroundColor={backgroundColor} iconFontSize={iconFontSize} handleMenuItemChildClick={handleMenuItemChildClick}/>
                  );
                })
              }
            </div>
          </Collapse>
        ) : null
      }
      <Divider/>
    </React.Fragment>
  );
};

export default MenuItem;

