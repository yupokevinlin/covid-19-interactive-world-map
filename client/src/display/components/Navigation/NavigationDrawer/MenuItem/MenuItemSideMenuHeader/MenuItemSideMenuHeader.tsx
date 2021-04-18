import React from "react";
import {NavigationDrawerMenuItem} from "../../NavigationDrawer";
import MenuItem from "@material-ui/core/MenuItem";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {Pages} from "../../../../../../state/global/App/types";

export type MenuItemSideMenuHeaderProps = MenuItemSideMenuHeaderDataProps & MenuItemSideMenuHeaderStyleProps & MenuItemSideMenuHeaderEventProps;

export interface MenuItemSideMenuHeaderDataProps {
  key: string;
  menuItem: NavigationDrawerMenuItem;
}

export interface MenuItemSideMenuHeaderStyleProps {

}

export interface MenuItemSideMenuHeaderEventProps {
  handleSideMenuHeaderClick(parentKey: Pages): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 26,
      minHeight: 26,
      padding: "3px 10px",
    }
  }),
);

const MenuItemSideMenuHeader: React.FC<MenuItemSideMenuHeaderProps> = (props) => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const {
    key,
    menuItem,
    handleSideMenuHeaderClick,
  } = props;

  const onClick = (): void => {
    if (!menuItem.disabled) {
      handleSideMenuHeaderClick(menuItem.text);
    }
  };

  return (
    <MenuItem onClick={onClick} key={key} className={classes.root} disabled={menuItem.disabled}>
      <Typography variant={"h6"} style={{fontWeight: theme.typography.fontWeightBold, color: theme.palette.text.primary}}>
        {
          menuItem.text
        }
      </Typography>
    </MenuItem>
  )
};

export default MenuItemSideMenuHeader;

