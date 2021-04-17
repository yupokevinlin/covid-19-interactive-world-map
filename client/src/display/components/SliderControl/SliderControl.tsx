import React, {ChangeEvent, useEffect, useState} from "react";
import {createStyles, Slider, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {asyncScheduler, Observable, Subject} from "rxjs";
import {distinctUntilChanged, throttleTime} from "rxjs/operators";

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
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
    slider: {
      [theme.breakpoints.up("xs")]: {
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

  useEffect(() => {
    const observable: Observable<string> = subject.pipe(throttleTime(350, asyncScheduler, { leading: true, trailing: true }), distinctUntilChanged());
    observable.subscribe((value) => {
      handleChange(value);
    });
  }, []);

  const getValueText = (value: number): string => {
    return values[value]?.toString();
  };

  const onChange = (e: ChangeEvent, value: number): void => {
    subject.next(values[value]?.toString());
  };

  if (values.length === 0) {
    return null;
  } else {
    return (
      <div className={classes.root}>
        <Slider
          className={classes.slider}
          defaultValue={values.length - 1}
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

