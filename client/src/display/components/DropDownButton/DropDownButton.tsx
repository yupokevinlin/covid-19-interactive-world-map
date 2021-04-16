import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import DropDownButtonMenuItem from "./DropDownButtonMenuItem/DropDownButtonMenuItem";
import Divider from "@material-ui/core/Divider";

export type DropDownButtonProps = DropDownButtonDataProps & DropDownButtonStyleProps & DropDownButtonEventProps;

export interface DropDownButtonDataProps {
  name: string;
  children: Array<string>;
  getDisplayedName(s: string): string;
}

export interface DropDownButtonStyleProps {

}

export interface DropDownButtonEventProps {
  handleSelect(name: string);
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      [theme.breakpoints.up("xs")]: {
        padding: "9px 8px",
        minWidth: "64px",
        "& .MuiButton-label": {
          height: "9px",
          fontSize: "9px",
          lineHeight: "9px",
        }
      },
      [theme.breakpoints.up("sm")]: {
        padding: "9px 10px",
        minWidth: "66px",
        "& .MuiButton-label": {
          height: "10px",
          fontSize: "10px",
          lineHeight: "10px",
        }
      },
      [theme.breakpoints.up("md")]: {
        padding: "11px 12px",
        minWidth: "70px",
        "& .MuiButton-label": {
          height: "12px",
          fontSize: "12px",
          lineHeight: "12px",
        }
      },
      [theme.breakpoints.up("lg")]: {
        padding: "13px 14px",
        minWidth: "74px",
        "& .MuiButton-label": {
          height: "14px",
          fontSize: "14px",
          lineHeight: "14px",
        }
      },
    }
  }),
);

const DropDownButton: React.FC<DropDownButtonProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    name,
    children,
    getDisplayedName,
    handleSelect,
  } = props;

  const [anchorElement, setAnchorElement] = useState<Element>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorElement(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorElement(null);
  };

  const handleMenuItemSelect = (menuItemName: string): void => {
    handleSelect(menuItemName);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button className={classes.button} disableRipple aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        {
          getDisplayedName(name)
        }
      </Button>
      <Menu
        anchorEl={anchorElement}
        open={!!anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
      >
        <DropDownButtonMenuItem name={name} getDisplayedName={getDisplayedName} handleSelect={handleMenuItemSelect}/>
        <Divider/>
        {
          children.map((child) => (
            <DropDownButtonMenuItem name={child} getDisplayedName={getDisplayedName} handleSelect={handleMenuItemSelect}/>
          ))
        }
      </Menu>
    </React.Fragment>
  );
};

export default DropDownButton;

