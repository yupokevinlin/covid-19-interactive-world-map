import React, {ChangeEvent, useEffect, useState} from "react";
import {createStyles, Slider, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {asyncScheduler, Observable, Subject} from "rxjs";
import {distinctUntilChanged, throttleTime} from "rxjs/operators";
import Typography from "@material-ui/core/Typography";
import MaterialIcon, {MaterialIconNames} from "../MaterialIcon/MaterialIcon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {useInterval} from "../../../hooks/useInterval";

export type SliderControlProps = SliderControlDataProps & SliderControlStyleProps & SliderControlEventProps;

export interface SliderControlDataProps {
  values: Array<string>;
}

export interface SliderControlStyleProps {

}

export interface SliderControlEventProps {
  handleChange(value: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sliderWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "42px",
      [theme.breakpoints.up("xs")]: {
        width: "calc(100% - 50px)",
        marginLeft: "25px",
        marginRight: "25px",
      },
      [theme.breakpoints.up("sm")]: {
        width: "calc(100% - 54px)",
        marginLeft: "27px",
        marginRight: "27px",
      },
      [theme.breakpoints.up("md")]: {
        width: "calc(100% - 60px)",
        marginLeft: "30px",
        marginRight: "30px",
      },
    },
    labelWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.up("xs")]: {
        width: "41px",
      },
      [theme.breakpoints.up("md")]: {
        width: "48px",
      },
    },
    label: {
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
        lineHeight: "12px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "14px",
        lineHeight: "14px",
      },
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      [theme.breakpoints.up("xs")]: {
        width: "60px",
        paddingLeft: "15px",
        paddingRight: "15px",
      },
      [theme.breakpoints.up("md")]: {
        width: "75px",
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },
    button: {
      padding: "0px",
      [theme.breakpoints.up("xs")]: {
        width: "20px",
        height: "20px",
        "& .MuiIconButton-label": {
          "& .MuiSvgIcon-root": {
            width: "20px",
            height: "20px",
          }
        }
      },
      [theme.breakpoints.up("md")]: {
        width: "25px",
        height: "25px",
        "& .MuiIconButton-label": {
          "& .MuiSvgIcon-root": {
            width: "25px",
            height: "25px",
          }
        }
      },
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
    slider: {
      [theme.breakpoints.up("xs")]: {
        width: "calc(100% - 131px)",
        "& .MuiSlider-thumb": {
          "& .MuiSlider-valueLabel": {
            backgroundColor: theme.palette.primary.main,
            fontSize: "9px",
            lineHeight: "9px",
            width: "40px",
            height: "32px",
            "& span": {
              width: "40px",
              height: "40px",
              display: "flex",
              transform: "rotate(-45deg) translate(7px, -7px)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50% 50% 50% 0",
              clipPath: "polygon(20% 0%,100% 80%,100% 100%,0% 100%,0% 0%)",
              "& span": {
                transform: "rotate(45deg) translateY(6px)",
                clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
              }
            }
          }
        },
      },
      [theme.breakpoints.up("sm")]: {
        "& .MuiSlider-thumb": {
          "& .MuiSlider-valueLabel": {
            backgroundColor: theme.palette.primary.main,
            fontSize: "10px",
            lineHeight: "10px",
            width: "44px",
            height: "32px",
            "& span": {
              width: "44px",
              height: "44px",
              display: "flex",
              transform: "rotate(-45deg) translate(10px, -10px)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50% 50% 50% 0",
              clipPath: "polygon(20% 0%,100% 80%,100% 100%,0% 100%,0% 0%)",
              "& span": {
                transform: "rotate(45deg) translateY(8px)",
                clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
              }
            }
          }
        },
      },
      [theme.breakpoints.up("md")]: {
        width: "calc(100% - 163px)",
        "& .MuiSlider-thumb": {
          "& .MuiSlider-valueLabel": {
            backgroundColor: theme.palette.primary.main,
            fontSize: "11px",
            lineHeight: "11px",
            width: "50px",
            height: "32px",
            "& span": {
              width: "50px",
              height: "50px",
              display: "flex",
              transform: "rotate(-45deg) translate(15px, -15px)",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50% 50% 50% 0",
              clipPath: "polygon(10% 0%,100% 90%,100% 100%,0% 100%,0% 0%)",
              "& span": {
                transform: "rotate(45deg) translateY(12px)",
                clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
              }
            }
          }
        },
      },
    },
  }),
);

const SliderControl: React.FC<SliderControlProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    values,
    handleChange,
  } = props;

  const [subject, setSubject] = useState<Subject<string>>(new Subject());
  const [value, setValue] = useState<number>(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

  useEffect(() => {
    const observable: Observable<string> = subject.pipe(throttleTime(350, asyncScheduler, { leading: true, trailing: true }), distinctUntilChanged());
    observable.subscribe((value) => {
      handleChange(value);
    });
  }, []);

  useEffect(() => {
    setValue(values.length - 1);
  }, [values]);

  useInterval(() => {
    if (values.length > 0 && isAutoScrolling) {
      setValue(prevState => {
        if (prevState + 1 === values.length) {
          setIsAutoScrolling(false);
          return prevState;
        } else {
          const newValue: number = prevState + 1;
          handleChange(values[newValue]?.toString());
          return newValue;
        }
      });
    }
  }, 500);

  const getValueText = (value: number): string => {
    return values[value]?.toString();
  };

  const onChange = (e: ChangeEvent, value: number): void => {
    setValue(value);
    subject.next(values[value]?.toString());
  };

  const handleGoToStartButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const newValue: number = 0;
    setIsAutoScrolling(false);
    setValue(newValue);
    handleChange(values[newValue]?.toString());
  };

  const handleStopButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setIsAutoScrolling(false);
  };

  const handleStartButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setIsAutoScrolling(true);
  };

  const handleGoToEndButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const newValue: number = values.length - 1;
    setIsAutoScrolling(false);
    setValue(newValue);
    handleChange(values[newValue]?.toString());
  };

  if (values.length === 0) {
    return null;
  } else {
    return (
      <div className={classes.sliderWrapper}>
        <div className={classes.labelWrapper}>
          <Typography className={classes.label} variant={"h6"}>
            {
              values[value]?.toString()
            }
          </Typography>
        </div>
        <div className={classes.buttons}>
          <Tooltip classes={{tooltip: classes.toolTip}} title={"Go To Start"} placement="top">
            <IconButton className={classes.button} color={"primary"} onClick={handleGoToStartButtonClick}>
              <MaterialIcon iconName={MaterialIconNames.FirstPage}/>
            </IconButton>
          </Tooltip>
          {
            isAutoScrolling ? (
              <Tooltip classes={{tooltip: classes.toolTip}} title={"Stop"} placement="top">
                <IconButton className={classes.button} color={"primary"} onClick={handleStopButtonClick}>
                  <MaterialIcon iconName={MaterialIconNames.Stop}/>
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip classes={{tooltip: classes.toolTip}} title={"Auto Play"} placement="top">
                <IconButton className={classes.button} color={"primary"} onClick={handleStartButtonClick}>
                  <MaterialIcon iconName={MaterialIconNames.PlayArrow}/>
                </IconButton>
              </Tooltip>
            )
          }
          <Tooltip classes={{tooltip: classes.toolTip}} title={"Go To End"} placement="top">
            <IconButton className={classes.button} color={"primary"} onClick={handleGoToEndButtonClick}>
              <MaterialIcon iconName={MaterialIconNames.LastPage}/>
            </IconButton>
          </Tooltip>
        </div>
        <Slider
          className={classes.slider}
          value={value}
          valueLabelDisplay="auto"
          valueLabelFormat={getValueText}
          min={0}
          max={values.length - 1}
          onChange={onChange}
        />
      </div>
    );
  }
};

export default SliderControl;

