import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

export type MenuCollapseButtonProps = MenuCollapseButtonDataProps & MenuCollapseButtonStyleProps & MenuCollapseButtonEventProps;

export interface MenuCollapseButtonDataProps {
  isSmXs: boolean;
  drawerExpanded: boolean;
}

export interface MenuCollapseButtonStyleProps {
  expandIconFontSize: number;
}

export interface MenuCollapseButtonEventProps {
  handleDrawerExpand(expanded: boolean): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expandBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 0.5),
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

const MenuCollapseButton: React.FC<MenuCollapseButtonProps> = (props) => {
  const classes = useStyles();
  const {
    isSmXs,
    drawerExpanded,
    expandIconFontSize,
    handleDrawerExpand,
  } = props;

  const onExpandClick = (): void => {
    handleDrawerExpand(!drawerExpanded);
  };

  return (
    isSmXs ? null : (
      <div className={classes.expandBar}>
        <Tooltip classes={{tooltip: classes.toolTip}} title={drawerExpanded ? "Collapse Menu" : "Expand Menu"} placement={"right"}>
          <IconButton onClick={onExpandClick}>
            {drawerExpanded ? <ChevronLeftIcon style={{fontSize: expandIconFontSize}}/> : <ChevronRightIcon style={{fontSize: expandIconFontSize}}/>}
          </IconButton>
        </Tooltip>
      </div>
    )
  );
};

export default MenuCollapseButton;

