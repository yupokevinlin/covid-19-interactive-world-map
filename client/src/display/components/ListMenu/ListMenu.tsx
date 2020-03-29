import React from "react";
import styled from "styled-components";
import { Button, ButtonBase, createMuiTheme, Theme } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { ListMenuSelectEvent } from "./ListMenuItem/ListMenuItem";
import ListMenuItemComponent from "./ListMenuItem/ListMenuItem";
import { Divider } from "@material-ui/core";

export type ListMenuProps = ListMenuDataProps & ListMenuStyleProps & ListMenuEventProps;

export interface ListMenuDataProps extends ListMenuItem {}

export interface ListMenuStyleProps {}

export interface ListMenuEventProps {
  handleListMenuItemSelect?(e: ListMenuSelectEvent): void;
}

export interface ListMenuItem {
  name: Array<string>;
  countryCode?: string;
  hasChildren: boolean;
  childElements: Array<ListMenuItem>;
}

const StyledListMenu = styled.div``;

const StyledMenuButton = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  max-width: 500px;
  max-height: 32px;
  min-height: 32px;
  padding: 0 20px;
  border-radius: 5px;
  :hover {
    background-color: #cccccc;
  }
  @media (max-width: 950px) {
    max-height: 32px;
    min-height: 32px;
    max-width: 350px;
    padding: 0 10px;
  }
  @media (max-width: 710px) {
    max-height: 20px;
    min-height: 20px;
    max-width: 150px;
    padding: 0 5px;
  }
`;

const ListMenu: React.FC<ListMenuProps> = props => {
  const { childElements, name, handleListMenuItemSelect, hasChildren } = props;

  const [anchorElement, setAnchorElement] = React.useState<Element>(null);

  const theme: Theme = createMuiTheme();
  if (hasChildren) {
    theme.typography.h6 = {
      fontSize: "26px",
      lineHeight: "30px",
      fontWeight: 300,
      textDecoration: "underline",
      "@media (min-width:710px) and (max-width: 950px)": {
        fontSize: "20x",
        lineHeight: "20px",
      },
      "@media (max-width:710px)": {
        fontSize: "16px",
        lineHeight: "16px",
      },
    };
  } else {
    theme.typography.h6 = {
      fontSize: "26px",
      lineHeight: "30px",
      fontWeight: 300,
      "@media (min-width:710px) and (max-width: 950px)": {
        fontSize: "20x",
        lineHeight: "20px",
      },
      "@media (max-width:710px)": {
        fontSize: "16px",
        lineHeight: "16px",
      },
    };
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorElement(e.currentTarget);
  };

  const onClose = (): void => {
    setAnchorElement(null);
  };

  const handleListMenuItemClick = (e: ListMenuSelectEvent): void => {
    if (handleListMenuItemSelect) {
      handleListMenuItemSelect(e);
    }
    onClose();
  };

  return (
    <StyledListMenu className={"list-menu"}>
      <StyledMenuButton className={"menu-button"} onClick={onClick}>
        <ButtonBase
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <ThemeProvider theme={theme}>
            <Typography variant="h6" noWrap>
              {name[name.length - 1]}
            </Typography>
          </ThemeProvider>
        </ButtonBase>
      </StyledMenuButton>
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        id="customized-menu"
        anchorEl={anchorElement}
        keepMounted
        open={!!anchorElement}
        onClose={onClose}
      >
        <MenuItem key={0}>
          <ListMenuItemComponent item={props} handleListMenuItemClick={handleListMenuItemClick} />
        </MenuItem>
        <Divider />
        {childElements.map((item, index) => (
          <MenuItem key={index + 1}>
            <ListMenuItemComponent item={item} handleListMenuItemClick={handleListMenuItemClick} />
          </MenuItem>
        ))}
      </Menu>
    </StyledListMenu>
  );
};

export default ListMenu;
