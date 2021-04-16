import React, {MutableRefObject, useRef, useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import DropDownButtonMenuItem from "./DropDownButtonMenuItem/DropDownButtonMenuItem";
import Divider from "@material-ui/core/Divider";
import {useEventListener} from "../../../hooks/useEventListener";

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

  const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const {
    name,
    children,
    getDisplayedName,
    handleSelect,
  } = props;

  const [anchorElement, setAnchorElement] = useState<Element>(null);

  const onKeyPress = (e: KeyboardEvent): void => {
    const keyString: string = e.key;
    const isLetter: RegExpMatchArray = keyString.match(/[a-z]/i);
    if (!!isLetter) {
      const menuElement: HTMLDivElement = ref.current;
      if (!!menuElement) {
        const childrenList: NodeList = menuElement.querySelectorAll("div.MuiPaper-root > ul > li");
        let moved: boolean = false;
        childrenList.forEach((child, index) => {
          const text: string = child.textContent;
          const firstCharacter: string = text.charAt(0).toLowerCase();
          if (!moved && firstCharacter === keyString.toLowerCase() && index > 0) {
            const childElement: Element = child as Element;
            childElement.scrollIntoView();
            moved = true;
          }
        });
      }
    }
  };

  useEventListener("keypress", onKeyPress, document);

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
        ref={ref}
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

