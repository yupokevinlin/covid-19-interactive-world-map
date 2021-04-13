import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export type ProgressBarProps = ProgressBarDataProps & ProgressBarStyleProps & ProgressBarEventProps;

export interface ProgressBarDataProps {
  isLoading: boolean;
}

export interface ProgressBarStyleProps {

}

export interface ProgressBarEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progressBarWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 2,
      zIndex: theme.zIndex.drawer + 1,
      [theme.breakpoints.up("md")]: {
        height: 3,
      },
    },
    progressBarBackground: {
      backgroundColor: "#ffffff00",
      height: 2,
      [theme.breakpoints.up("md")]: {
        height: 3,
      },
    },
  })
);

let isLoadingLocal: boolean = false;

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const classes = useStyles();

  const {
    isLoading,
  } = props;

  const [progress, setProgress] = React.useState(0);

  isLoadingLocal = isLoading;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        let returnValue: number = oldProgress;
        if (!isLoadingLocal) {
          returnValue = 0;
        } else if (oldProgress === 100) {
          returnValue = 100;
        } else {
          const diff = Math.random() * 10;
          returnValue =  Math.min(oldProgress + diff, 100);
        }
        return returnValue;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.progressBarWrapper}>
      <LinearProgress classes={{root: classes.progressBarBackground}} variant={"determinate"} color={"secondary"} value={progress}/>
    </div>
  );
};

export default ProgressBar;

