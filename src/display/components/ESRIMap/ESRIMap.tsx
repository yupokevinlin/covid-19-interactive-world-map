import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { loadModules } from "esri-loader";
import MapView = __esri.MapView;
import Map = __esri.Map;
import chroma, { Color, Scale } from "chroma-js";
import FeatureLayer = __esri.FeatureLayer;
import FieldProperties = __esri.FieldProperties;
import { ClassBreakColors, LatLon, MapConfirmedCasesClassBreakColors } from "../../../api/MapApi/types";
import { usePreviousProps } from "../../../hooks/usePreviousProps";

export type ESRIMapProps = ESRIMapDataProps & ESRIMapStyleProps & ESRIMapEventProps;

export interface ESRIMapDataProps {
  initialBaseMap?: string;
  mapPolygons: Array<MapPolygon>;
}

export interface ESRIMapStyleProps {}

export interface ESRIMapEventProps {}

export interface MapPolygon {
  internalId: number;
  name: string;
  confirmedCasesCount: number;
  geometry: Array<Array<LatLon>>;
}

const StyledESRIMap = styled.div`
  height: 100%;
  width: 100%;
`;

let map: Map = null;
let mapView: MapView = null;
let polygonLayer: FeatureLayer = null;

export enum ESRIMapLayerNames {
  polygonLayer = "polygonLayer",
}

const ESRIMap: React.FC<ESRIMapProps> = props => {
  const { initialBaseMap = "streets", mapPolygons = [] } = props;

  const mapRef: React.MutableRefObject<HTMLDivElement> = useRef();
  const prevProps: ESRIMapProps = usePreviousProps<ESRIMapProps>(props);
  useEffect(() => {
    loadModules(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], { css: true }).then(
      ([Map, MapView, FeatureLayer]) => {
        if (!map) {
          initialize(Map, MapView, FeatureLayer);
        }
      }
    );

    if (prevProps) {
      if (prevProps.mapPolygons !== mapPolygons) {
        updatePolygonLayer();
      }
    }
  }, [mapPolygons]);

  const initialize = (Map, MapView, FeatureLayer): void => {
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

    polygonLayer = getPolygonLayer(FeatureLayer);

    const layers: Array<FeatureLayer> = [polygonLayer];
    layers.forEach(layer => map.add(layer));
    updatePolygonLayer();
  };

  const updatePolygonLayer = (): void => {
    polygonLayer.queryObjectIds().then(oldObjectIds => {
      const renderer = (polygonLayer.renderer as __esri.ClassBreaksRenderer).clone();

      const addFeatures: Array<any> = mapPolygons.map(mapPolygon => ({
        attributes: {
          name: mapPolygon.name,
          internalId: mapPolygon.internalId,
          confirmedCases: mapPolygon.confirmedCasesCount,
        },
        geometry: {
          type: "polygon",
          hasZ: false,
          hasM: false,
          rings: mapPolygon.geometry.map(element => element.map(coordinates => [coordinates.lon, coordinates.lat])),
          spatialReference: { wkid: 4326 },
        },
      }));

      const deleteFeatures: Array<{ objectId: number }> = oldObjectIds.map(oldObjectId => ({ objectId: oldObjectId }));

      polygonLayer.renderer = renderer;
      polygonLayer
        .applyEdits({
          addFeatures: addFeatures,
          deleteFeatures: deleteFeatures,
        })
        .then(rsp => {});
    });
  };

  const getPolygonLayer = (FeatureLayer): FeatureLayer => {
    const fields: Array<FieldProperties> = [
      {
        name: "OBJECTID",
        alias: "OBJECTID",
        type: "oid",
      },
      {
        name: "name",
        alias: "name",
        type: "string",
      },
      {
        name: "internalId",
        alias: "internalId",
        type: "integer",
      },
      {
        name: "confirmedCases",
        alias: "confirmedCases",
        type: "integer",
      },
    ];

    const outline = {
      width: 1,
      color: [126, 126, 126, 1],
    };

    const renderer = {
      type: "class-breaks",
      field: "confirmedCases",
      defaultSymbol: {
        type: "simple-fill",
        style: "solid",
        color: [0, 0, 0, 0.3],
        outline: {
          width: 1,
          color: outline,
        },
      },
      classBreakInfos: generateLogarithmicClassStep(8, MapConfirmedCasesClassBreakColors, [0, 1, 5, 7, 8]),
    };

    return new FeatureLayer({
      id: ESRIMapLayerNames.polygonLayer,
      title: "",
      geometryType: "polygon",
      source: [],
      fields: fields,
      objectIdField: "OBJECTID",
      renderer: renderer,
    });
  };

  const generateLogarithmicClassStep = (steps: number, colors: ClassBreakColors, domain: Array<number>): Array<any> => {
    const backgroundOpacity: number = 0.3;
    const outlineOpacity: number = 1;
    const outlineWidth: number = 1;
    const classBreakInfos: Array<any> = [];
    const colorScale: Scale<Color> = chroma
      .scale([colors.none, colors.low, colors.medium, colors.high, colors.extreme])
      .domain([domain[0], domain[1], domain[2], domain[3], domain[4]]);
    for (let step = 0; step <= steps; step++) {
      if (step === 0) {
        const color: Color = colorScale(domain[0]);
        classBreakInfos.push({
          minValue: 0,
          maxValue: 0,
          symbol: {
            type: "simple-fill",
            style: "solid",
            color: [...color.rgb(), backgroundOpacity],
            outline: {
              width: outlineWidth,
              color: [126, 126, 126, outlineOpacity],
            },
          },
        });
      } else {
        const color: Color = colorScale(step);
        classBreakInfos.push({
          minValue: Math.pow(10, step - 1),
          maxValue: step === steps ? Number.MAX_SAFE_INTEGER : Math.pow(10, step) - 0.1,
          symbol: {
            type: "simple-fill",
            style: "solid",
            color: [...color.rgb(), backgroundOpacity],
            outline: {
              width: outlineWidth,
              color: [...color.rgb(), outlineOpacity],
            },
          },
        });
      }
    }
    return classBreakInfos;
  };

  return <StyledESRIMap className={"esri-map"} ref={mapRef} />;
};

export default ESRIMap;
