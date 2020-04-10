import React, {useState} from "react";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import HomeIcon from "@material-ui/icons/Home";
import MapIcon from "@material-ui/icons/Map";
import MapPageContainer from "./MapPageContainer";
import {PageName} from "../../state/containers/PageWrapperContainer/types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePageContainer from "./HomePageContainer";
import {reloadMap} from "../components/ESRIMap/ESRIMap";

export interface PageWrapperContainerProps {}

const history: any = createBrowserHistory();

const PageWrapperContainer: React.FC<PageWrapperContainerProps> = props => {
  const [title, setTitle] = useState<string>(PageName.Home);
  const menuItems: JSX.Element = (
    <List>
      <ListItem button component={Link} to={"/"} onClick={() => {setTitle(PageName.Home); reloadMap();}}>
        <ListItemIcon>
          <HomeIcon/>
        </ListItemIcon>
        <ListItemText primary={PageName.Home} />
      </ListItem>
      <ListItem button component={Link} to={"/map"} onClick={() => {setTitle(PageName.CurrentMap);}}>
        <ListItemIcon>
          <MapIcon/>
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
