import React from "react";
import ListItemText from "@material-ui/core/ListItemText";

export type ListMenuItemProps = ListMenuItemDataProps & ListMenuItemStyleProps & ListMenuItemEventProps;

export interface ListMenuItemDataProps {
  name: Array<string>;
}

export interface ListMenuItemStyleProps {}

export interface ListMenuItemEventProps {
  handleListMenuItemClick(e: ListMenuSelectEvent): void;
}

export interface ListMenuSelectEvent {
  name: Array<string>;
}

const ListMenuItem: React.FC<ListMenuItemProps> = props => {
  const { name, handleListMenuItemClick } = props;

  const onClick = (e: React.MouseEvent<HTMLElement>): void => {
    handleListMenuItemClick({
      name: name,
    });
  };

  return <ListItemText primary={name[name.length - 1]} onClick={onClick} />;
};

export default ListMenuItem;
