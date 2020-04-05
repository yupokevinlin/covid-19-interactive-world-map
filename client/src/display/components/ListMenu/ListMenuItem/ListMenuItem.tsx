import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import { ListMenuItem as ListMenuItemObject } from "../ListMenu";

export type ListMenuItemProps = ListMenuItemDataProps & ListMenuItemStyleProps & ListMenuItemEventProps;

export interface ListMenuItemDataProps {
  item: ListMenuItemObject;
}

export interface ListMenuItemStyleProps {}

export interface ListMenuItemEventProps {
  handleListMenuItemClick(e: ListMenuSelectEvent): void;
}

export interface ListMenuSelectEvent {
  name: Array<string>;
  hasChildren: boolean;
}

const ListMenuItem: React.FC<ListMenuItemProps> = props => {
  const { item, handleListMenuItemClick } = props;

  const onClick = (e: React.MouseEvent<HTMLElement>): void => {
    handleListMenuItemClick({
      name: item.name,
      hasChildren: item.hasChildren
    });
  };

  return <ListItemText primary={item.name[item.name.length - 1]} onClick={onClick} />;
};

export default ListMenuItem;
