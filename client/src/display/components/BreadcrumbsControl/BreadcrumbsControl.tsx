import React, {useEffect, useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {TreeItem} from "../../../../../shared/types/data/Tree/TreeTypes";
import {getNameArray, getSequentialHierarchicalNames, getTreeItem} from "../../../../../shared/helpers/General";
import Typography from "@material-ui/core/Typography";
import DropDownButton from "../DropDownButton/DropDownButton";
import MaterialIcon, {MaterialIconNames} from "../MaterialIcon/MaterialIcon";

export type BreadcrumbsControlProps = BreadcrumbsControlDataProps & BreadcrumbsControlStyleProps & BreadcrumbsControlEventProps;


export interface BreadcrumbsControlDataProps {
  dataTree: TreeItem;
  value: string;
}

export interface BreadcrumbsControlStyleProps {

}

export interface BreadcrumbsControlEventProps {
  handleChange(hierarchicalName: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      [theme.breakpoints.up("xs")]: {
        height: "27px",
        width: "calc(100% - 30px)",
        marginLeft: "15px",
        marginRight: "15px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "30px",
        width: "calc(100% - 30px)",
        marginLeft: "15px",
        marginRight: "15px",
      },
      [theme.breakpoints.up("md")]: {
        height: "36px",
        width: "calc(100% - 36px)",
        marginLeft: "18px",
        marginRight: "18px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "42px",
        width: "calc(100% - 42px)",
        marginLeft: "21px",
        marginRight: "21px",
      },
    },
    text: {
      whiteSpace: "nowrap",
      [theme.breakpoints.up("xs")]: {
        overflow: "hidden",
        padding: "9px 8px",
        minWidth: "64px",
        height: "9px",
        fontSize: "9px",
        lineHeight: "9px",
      },
      [theme.breakpoints.up("sm")]: {
        padding: "9px 10px",
        minWidth: "66px",
        height: "10px",
        fontSize: "10px",
        lineHeight: "10px",
      },
      [theme.breakpoints.up("md")]: {
        padding: "11px 12px",
        minWidth: "70px",
        height: "12px",
        fontSize: "12px",
        lineHeight: "12px",
      },
      [theme.breakpoints.up("lg")]: {
        padding: "13px 14px",
        minWidth: "74px",
        height: "14px",
        fontSize: "14px",
        lineHeight: "14px",
      },
    },
    icon: {
      [theme.breakpoints.up("xs")]: {
        width: "11px",
        height: "11px",
      },
      [theme.breakpoints.up("sm")]: {
        width: "12px",
        height: "12px",
      },
      [theme.breakpoints.up("md")]: {
        width: "14px",
        height: "14px",
      },
      [theme.breakpoints.up("lg")]: {
        width: "16px",
        height: "16px",
      },
    }
  }),
);

const BreadcrumbsControl: React.FC<BreadcrumbsControlProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    dataTree,
    value,
    handleChange,
  } = props;

  useEffect(() => {
    setCurrentSelection(value);
  }, [value]);

  const [currentSelection, setCurrentSelection] = useState<string>("World");
  const treeItems: Array<TreeItem> = getSequentialHierarchicalNames(currentSelection).map((hierarchicalName) => getTreeItem(dataTree, hierarchicalName));

  const getDisplayedName = (hierarchicalName: string): string => {
    const name: Array<string> = getNameArray(hierarchicalName);
    return name[name.length - 1];
  };

  const handleSelect = (hierarchicalName: string): void => {
    setCurrentSelection(hierarchicalName);
    handleChange(hierarchicalName);
  };

  return (
    <div className={classes.root}>
      {
        treeItems.map((treeItem, index) => {
          if (treeItem.children.length === 0) {
            return (
              <Typography className={classes.text} variant={"button"}>
                {
                  getDisplayedName(treeItem.hierarchicalName)
                }
              </Typography>
            );
          } else {
            if (index === treeItems.length - 1) {
              return <DropDownButton name={treeItem.hierarchicalName} children={treeItem.children.map((child) => child.hierarchicalName)} getDisplayedName={getDisplayedName} handleSelect={handleSelect}/>
            } else {
              return (
                <React.Fragment>
                  <DropDownButton name={treeItem.hierarchicalName} children={treeItem.children.map((child) => child.hierarchicalName)} getDisplayedName={getDisplayedName} handleSelect={handleSelect}/>
                  <MaterialIcon className={classes.icon} iconName={MaterialIconNames.NavigateNext}/>
                </React.Fragment>
              );
            }
          }
        })
      }
    </div>
  );
};

export default BreadcrumbsControl;

