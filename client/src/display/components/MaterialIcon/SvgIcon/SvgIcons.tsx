import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import {SvgIconData, svgIconDataObject} from "./types";


export const SkullIcon: React.FC<SvgIconProps> = (props) => {
  const data: SvgIconData = svgIconDataObject["Skull"];
  return (
    <SvgIcon {...props} viewBox={data.viewBox}>
      {
        data.path.map((path, index) => (
          <path key={index} d={path}/>
        ))
      }
    </SvgIcon>
  );
};