import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { loadModules } from "esri-loader";
import MapView = __esri.MapView;
import Map = __esri.Map;

export type ESRIMapProps = ESRIMapDataProps & ESRIMapStyleProps & ESRIMapEventProps;

export interface ESRIMapDataProps {
  initialBaseMap?: string;
}

export interface ESRIMapStyleProps {}

export interface ESRIMapEventProps {}

const StyledESRIMap = styled.div`
  height: 100%;
  width: 100%;
`;

let map: Map = null;
let mapView: MapView = null;

const ESRIMap: React.FC<ESRIMapProps> = props => {
  const { initialBaseMap = "streets" } = props;

  const mapRef: React.MutableRefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    loadModules(["esri/Map", "esri/views/MapView"], { css: true }).then(([Map, MapView]) => {
      if (!map) {
        initialize(Map, MapView);
      }
    });
  }, []);

  const initialize = (Map, MapView): void => {
    map = new Map({
      basemap: initialBaseMap,
    });

    mapView = new MapView({
      container: mapRef.current,
      map: map,
      ui: {
        components: ["attribution", "zoom", "compass"],
      },
    });
  };

  return <StyledESRIMap className={"esri-map"} ref={mapRef} />;
};

export default ESRIMap;
