import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {MapDataTypeSelectData} from "../types";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";


export type MapDataTypeSelectItemProps = MapDataTypeSelectItemDataProps & MapDataTypeSelectItemStyleProps & MapDataTypeSelectItemEventProps;

export type MapDataTypeSelectItemDataProps = MapDataTypeSelectData;

export interface MapDataTypeSelectItemStyleProps {

}

export interface MapDataTypeSelectItemEventProps {
  handleClick(value): void;
  handlePreloadClick(value): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "auto",
      paddingLeft: "10px",
      paddingRight: "10px",
      [theme.breakpoints.up("xs")]: {
        width: "100px",
      },
      [theme.breakpoints.up("md")]: {
        width: "125px",
      },
    },
    menuItemDisabled: {
      color: theme.palette.text.disabled,
      cursor: "default",
    },
    label: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "9px",
        lineHeight: "9px",
        marginLeft: "9px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "12px",
        lineHeight: "12px",
        marginLeft: "12px",
      },
    },
    progress: {
      [theme.breakpoints.up("xs")]: {
        height: "9px !important",
        width: "9px !important",
      },
      [theme.breakpoints.up("md")]: {
        height: "12px !important",
        width: "12px !important",
      },
    },
  }),
);

const MapDataTypeSelectItem: React.FC<MapDataTypeSelectItemProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    isLoaded,
    value,
    text,
    handleClick,
    handlePreloadClick,
  } = props;

  const [hasStartedLoading, setHasStartedLoading] = useState<boolean>(false);

  const onClick = (e: React.MouseEvent<HTMLLIElement>): void => {
    if (isLoaded) {
      handleClick(value);
    } else {
      if (!hasStartedLoading) {
        setHasStartedLoading(prevState => {
          if (!prevState) {
            handlePreloadClick(value);
          }
          return true;
        });
      }
    }
  };

  const showProgress: boolean = isLoaded || (!isLoaded && !hasStartedLoading);

  return (
    <MenuItem className={clsx(classes.menuItem, {
      [classes.menuItemDisabled]: !showProgress
    })} onClick={onClick}>
      {
        showProgress ? (
          <div className={classes.progress}/>
        ) : (
          <CircularProgress className={classes.progress} disableShrink/>
        )
      }
      <Typography variant={"h5"} className={classes.label}>
        {
          text
        }
      </Typography>
    </MenuItem>
  );
};

export default MapDataTypeSelectItem;

