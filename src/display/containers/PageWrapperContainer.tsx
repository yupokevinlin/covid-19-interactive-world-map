import React from "react";
import PageWrapper, { MenuItem } from "../components/PageWrapper/PageWrapper";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

export interface PageWrapperContainerProps {}

const PageWrapperContainer: React.FC<PageWrapperContainerProps> = props => {
  const list: Array<MenuItem> = [];
  return <PageWrapper children={props.children} menuItems={list} />;
};

export default PageWrapperContainer;
