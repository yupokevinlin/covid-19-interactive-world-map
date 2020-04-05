import React, {useState} from "react";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import MapPageContainer from "./MapPageContainer";
import {PageName} from "../../state/containers/PageWrapperContainer/types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePageContainer from "./HomePageContainer";

export interface PageWrapperContainerProps {}

const history: any = createBrowserHistory();

const PageWrapperContainer: React.FC<PageWrapperContainerProps> = props => {
  const [title, setTitle] = useState<string>(PageName.Home);
  const menuItems: JSX.Element = (
    <List>
      <ListItem button component={Link} to={"/"} onClick={() => {setTitle(PageName.Home);}}>
        <ListItemIcon>
          <MailIcon/>
        </ListItemIcon>
        <ListItemText primary={PageName.Home} />
      </ListItem>
      <ListItem button component={Link} to={"/map"} onClick={() => {setTitle(PageName.CurrentMap);}}>
        <ListItemIcon>
          <MailIcon/>
        </ListItemIcon>
        <ListItemText primary={PageName.CurrentMap} />
      </ListItem>
    </List>
  );
  return (
    <Router history={history}>
      <PageWrapper menuItems={menuItems} title={title}>
        <Route exact path={"/"} component={HomePageContainer}/>
        <Route path={"/map"} component={MapPageContainer}/>
      </PageWrapper>
    </Router>
  );
};

export default PageWrapperContainer;
