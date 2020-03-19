import React from "react";
import styled from "styled-components";
import { StyleUtils } from "../../../helper/StyleUtils";

export interface SpacerProps {
  height?: number | string;
  width?: number | string;
}

export const StyledSpacer = styled.div<{ height: number | string; width: number | string }>`
  height: ${props => StyleUtils.getCssPixelString(props.height)};
  width: ${props => StyleUtils.getCssPixelString(props.width)};
`;

const Spacer: React.FC<SpacerProps> = props => {
  const { height = 0, width = 0 } = props;
  return <StyledSpacer className={"spacer"} height={height} width={width} />;
};

export default Spacer;
