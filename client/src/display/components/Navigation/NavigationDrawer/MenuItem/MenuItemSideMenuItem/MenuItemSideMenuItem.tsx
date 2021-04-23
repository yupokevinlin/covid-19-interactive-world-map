import React from "react";
import MaterialIcon, {MaterialIconNames} from "../../../../MaterialIcon/MaterialIcon";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";
import {ListItemIcon} from "@material-ui/core";
import {Pages, SubPages} from "../../../../../../state/global/App/types";

export type MenuItemSideMenuItemProps = MenuItemSideMenuItemDataProps & MenuItemSideMenuItemStyleProps & MenuItemSideMenuItemEventProps;

export interface MenuItemSideMenuItemDataProps {
  keyString: string;
  iconName: MaterialIconNames;
  parentText: Pages;
  text: SubPages;
  disabled: boolean;
}

export interface MenuItemSideMenuItemStyleProps {

}

export interface MenuItemSideMenuItemEventProps {
  handleSideMenuItemClick(parentKey: Pages, key: SubPages): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 26,
      minHeight: 26,
      padding: "3px 10px",
    },
    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      height: 26,
      width: 26,
      minWidth: 26,
      padding: 0,
    },
    icon: {
      color: theme.palette.text.primary,
      fontSize: 18,
      height: 18,
      width: 18,
      padding: 0,
    },
  }),
);

const MenuItemSideMenuItem: React.FC<MenuItemSideMenuItemProps> = (props) => {
  const classes = useStyles();
  const theme: Theme = useTheme();

  const {
    keyString,
    parentText,
    text,
    iconName,
    disabled,
    handleSideMenuItemClick,
  } = props;

  const onClick = (): void => {
    if (!disabled) {
      handleSideMenuItemClick(parentText, text);
    }
  };

  return (
    <MenuItem onClick={onClick} key={keyString} className={classes.root} disabled={disabled}>
      <ListItemIcon className={classes.iconWrapper}>
        <MaterialIcon className={classes.icon} iconName={iconName}/>
      </ListItemIcon>
      <Typography variant={"h6"} style={{color: theme.palette.text.primary}}>
        {
          text
        }
      </Typography>
    </MenuItem>
  );
};

export default MenuItemSideMenuItem;

