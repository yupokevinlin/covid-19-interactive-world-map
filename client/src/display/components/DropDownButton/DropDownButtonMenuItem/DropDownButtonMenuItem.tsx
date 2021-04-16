import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";

export type DropDownButtonMenuItemProps = DropDownButtonMenuItemDataProps & DropDownButtonMenuItemStyleProps & DropDownButtonMenuItemEventProps;

export interface DropDownButtonMenuItemDataProps {
  name: string;
  getDisplayedName(s: string): string;
}

export interface DropDownButtonMenuItemStyleProps {

}

export interface DropDownButtonMenuItemEventProps {
  handleSelect(name: string);
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "9px",
        lineHeight: "9px",
        minHeight: "auto",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "10px",
        lineHeight: "10px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "12px",
        lineHeight: "12px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "14px",
        lineHeight: "14px",
      },
    }
  }),
);

const DropDownButtonMenuItem: React.FC<DropDownButtonMenuItemProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    name,
    getDisplayedName,
    handleSelect,
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLLIElement>): void => {
    handleSelect(name);
  };

  return (
    <MenuItem className={classes.root} onClick={handleClick} >
      {
        getDisplayedName(name)
      }
    </MenuItem>
  );
};

export default DropDownButtonMenuItem;

