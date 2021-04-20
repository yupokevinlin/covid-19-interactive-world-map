import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {MapDataTypeSelectData} from "./types";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MapDataTypeSelectItem from "./MapDataTypeSelectItem/MapDataTypeSelectItem";
import Typography from "@material-ui/core/Typography";

export type MapDataTypeSelectProps = MapDataTypeSelectDataProps & MapDataTypeSelectStyleProps & MapDataTypeSelectEventProps;

export interface MapDataTypeSelectDataProps {
  label: string;
  data: Array<MapDataTypeSelectData>;
  initialValue: string;
}

export interface MapDataTypeSelectStyleProps {

}

export interface MapDataTypeSelectEventProps {
  handleSelectionChange(value: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "130px",
      },
      [theme.breakpoints.up("md")]: {
        width: "165px",
      },
    },
    labelWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        height: "16px",
        width: "100px",
      },
      [theme.breakpoints.up("md")]: {
        height: "24px",
        width: "125px",
      },
    },
    label: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "10px",
        lineHeight: "10px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "14px",
        lineHeight: "14px",
      },
    },
    button: {
      paddingLeft: "10px",
      paddingRight: "10px",
      [theme.breakpoints.up("xs")]: {
        height: "20px",
        width: "100px",
        "& .MuiButton-label": {
          fontSize: "9px",
          lineHeight: "9px",
        }
      },
      [theme.breakpoints.up("md")]: {
        height: "30px",
        width: "125px",
        "& .MuiButton-label": {
          fontSize: "12px",
          lineHeight: "12px",
        }
      },
    },
  }),
);

const MapDataTypeSelect: React.FC<MapDataTypeSelectProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    label,
    data,
    initialValue,
    handleSelectionChange,
  } = props;

  const [anchorElement, setAnchorElement] = useState<Element>(null);
  const [value, setValue] = useState<string>(initialValue);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorElement(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorElement(null);
  };

  const handleMapDataTypeSelectItemClick = (value: string): void => {
    handleClose();
    setValue(value);
    handleSelectionChange(value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.labelWrapper}>
        <Typography className={classes.label} variant={"h5"}>{label}</Typography>
      </div>
      <Button className={classes.button} color={"primary"} variant={"contained"} onClick={handleClick}>
        {
          value
        }
      </Button>
      <Menu
        anchorEl={anchorElement}
        open={!!anchorElement}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
      >
        {
          data.map((selectItemData, index) => (
            <MapDataTypeSelectItem key={index} {...selectItemData} handleClick={handleMapDataTypeSelectItemClick}/>
          ))
        }
      </Menu>
    </div>
  );
};

export default MapDataTypeSelect;
