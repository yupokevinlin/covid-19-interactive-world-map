import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import MailIcon from "@material-ui/icons/Mail";
import Paper from "@material-ui/core/Paper";

export type InfoPageProps = InfoPageDataProps & InfoPageStyleProps & InfoPageEventProps;

export interface InfoPageDataProps {
  github: string;
  email: string;
}

export interface InfoPageStyleProps {

}

export interface InfoPageEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      [theme.breakpoints.up("xs")]: {
        height: "168px",
        width: "280px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "192px",
        width: "320px",
      },
      [theme.breakpoints.up("md")]: {
        height: "216px",
        width: "360px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "240px",
        width: "400px",
      },
    },
    titleWrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.primary.main,
      [theme.breakpoints.up("xs")]: {
        height: "28px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "32px",
      },
      [theme.breakpoints.up("md")]: {
        height: "36px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "40px",
      },
    },
    titleText: {
      color: theme.palette.primary.contrastText,
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "16px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "18px",
      },
    },
    buttonWrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-evenly",
      [theme.breakpoints.up("xs")]: {
        height: "140px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "160px",
      },
      [theme.breakpoints.up("md")]: {
        height: "180px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "200px",
      },
    },
    buttonRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "60%",
      height: "20%",
    },
    buttonIcon: {
      color: "#fff",
      marginLeft: "25%",
      [theme.breakpoints.up("xs")]: {
        height: "18px",
        width: "18px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "20px",
        width: "20px",
      },
      [theme.breakpoints.up("md")]: {
        height: "22px",
        width: "22px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "24px",
        width: "24px",
      },
    },
    buttonText: {
      color: "#fff",
      [theme.breakpoints.up("xs")]: {
        fontSize: "10px",
        lineHeight: "10px",
        marginLeft: "10px",
      },
      [theme.breakpoints.up("sm")]: {
        fontSize: "12px",
        lineHeight: "12px",
        marginLeft: "12px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "14px",
        lineHeight: "14px",
        marginLeft: "14px",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "16px",
        lineHeight: "16px",
        marginLeft: "16px",
      },
    },
  }),
);

const InfoPage: React.FC<InfoPageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    email,
    github,
  } = props;

  const handleEmailClick = (e: React.MouseEvent<HTMLElement>): void => {
    const newWindow: Window = window.open(`mailto:${email}`, "_blank", "noopener,noreferrer")
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const handleGithubClick = (e: React.MouseEvent<HTMLElement>): void => {
    const newWindow: Window = window.open(github, "_blank", "noopener,noreferrer")
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  return (
    <Paper className={classes.root} >
      <div className={classes.titleWrapper}>
        <Typography className={classes.titleText}>
          {
            "Contact Us"
          }
        </Typography>
      </div>
      <div className={classes.buttonWrapper}>
        <Button
          variant={"contained"}
          className={classes.buttonRow}
          style={{backgroundColor: "#24292e"}}
          onClick={handleGithubClick}
        >
          <GitHubIcon className={classes.buttonIcon}/>
          <Typography className={classes.buttonText}>
            Github
          </Typography>
        </Button>
        <Button
          variant={"contained"}
          className={classes.buttonRow}
          style={{backgroundColor: "#3e65cf"}}
          onClick={handleEmailClick}
        >
          <MailIcon className={classes.buttonIcon}/>
          <Typography className={classes.buttonText}>
            {
              "Email"
            }
          </Typography>
        </Button>
      </div>
    </Paper>
  );
};

export default InfoPage;

