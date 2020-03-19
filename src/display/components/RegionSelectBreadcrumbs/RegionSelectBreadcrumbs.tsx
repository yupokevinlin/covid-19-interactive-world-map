import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ListMenu, { ListMenuItem } from "../ListMenu/ListMenu";
import { ListMenuSelectEvent } from "../ListMenu/ListMenuItem/ListMenuItem";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

export type RegionSelectBreadcrumbsProps = RegionSelectBreadcrumbsDataProps &
  RegionSelectBreadcrumbsStyleProps &
  RegionSelectBreadcrumbsEventProps;

export interface RegionSelectBreadcrumbsDataProps {
  data: BreadCrumbItem;
}

export interface RegionSelectBreadcrumbsStyleProps {}

export interface RegionSelectBreadcrumbsEventProps {
  handleMenuItemSelect?(e: ListMenuSelectEvent): void;
}

export type BreadCrumbItem = ListMenuItem;

const StyledRegionSelectBreadcrumbs = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  width: calc(100% - 30px);
  margin-left: 30px;
  @media (max-width: 710px) {
    width: calc(100% - 20px);
    margin-left: 20px;
  }
`;

const RegionSelectBreadcrumbs: React.FC<RegionSelectBreadcrumbsProps> = props => {
  const { data, handleMenuItemSelect } = props;

  const [currentPosition, setCurrentPosition] = useState<Array<string>>(data.name);

  const listMenuItems: Array<ListMenuItem> = [];
  const getListMenuItems = (): Array<ListMenuItem> => {
    for (let index = 0; index < currentPosition.length; index++) {
      const elementName: string = currentPosition[index];
      if (index === 0) {
        listMenuItems.push(data);
      } else {
        listMenuItems.push(
          listMenuItems[listMenuItems.length - 1].childElements.find(element => element.name[index] === elementName)
        );
      }
    }
    return listMenuItems;
  };

  const handleListMenuItemSelect = (e: ListMenuSelectEvent): void => {
    setCurrentPosition([...e.name]);
    if (handleMenuItemSelect) {
      handleMenuItemSelect(e);
    }
  };

  let keyIndex: number = 0;
  return (
    <StyledRegionSelectBreadcrumbs className={"bread-crumbs"}>
      {getListMenuItems().map((props, index) => {
        if (index === 0) {
          keyIndex = keyIndex + 1;
        } else {
          keyIndex = keyIndex + 2;
        }

        const filteredListMenuItem: ListMenuItem = {
          ...props,
          childElements: props.childElements.sort((a, b) => {
            const nameA: string = a?.name[index + 1]?.toUpperCase();
            const nameB: string = b?.name[index + 1]?.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          }),
        };
        return index === 0 ? (
          <ListMenu key={keyIndex} {...filteredListMenuItem} handleListMenuItemSelect={handleListMenuItemSelect} />
        ) : (
          <React.Fragment>
            <NavigateNextIcon key={keyIndex} fontSize="small" />
            <ListMenu
              key={keyIndex + 1}
              {...filteredListMenuItem}
              handleListMenuItemSelect={handleListMenuItemSelect}
            />
          </React.Fragment>
        );
      })}
    </StyledRegionSelectBreadcrumbs>
  );
};

export default RegionSelectBreadcrumbs;
