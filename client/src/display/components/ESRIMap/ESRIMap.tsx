import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { loadModules } from "esri-loader";
import "./ESRIMap.css";
import MapView = __esri.MapView;
import Map = __esri.Map;
import chroma, { Color, Scale } from "chroma-js";
import FeatureLayer = __esri.FeatureLayer;
import FieldProperties = __esri.FieldProperties;
import {
  ClassBreakColors,
  LatLon,
  MapConfirmedCasesClassBreakColors,
  MapDeathsClassBreakColors,
  MapRecoveredCasesClassBreakColors,
} from "../../../api/MapApi/types";
import { usePreviousProps } from "../../../hooks/usePreviousProps";
import Legend = __esri.Legend;
import ReactResizeDetector from "react-resize-detector";
import { MathUtils } from "../../../helper/MathUtils";

export type ESRIMapProps = ESRIMapDataProps & ESRIMapStyleProps & ESRIMapEventProps;

export interface ESRIMapDataProps {
  initialBaseMap?: string;
  mapPolygons: Array<MapPolygon>;
  displayedLayer: ESRIMapModeNames;
}

export interface ESRIMapStyleProps {}

export interface ESRIMapEventProps {}

export interface MapPolygon {
  internalId: number;
  name: Array<string>;
  confirmedCasesCount: number;
  recoveredCasesCount: number;
  deathsCount: number;
  geometry: Array<Array<LatLon>>;
}

const StyledESRIMap = styled.div`
  height: 100%;
  width: 100%;
`;

let map: Map = null;
let mapView: MapView = null;
let polygonLayer: FeatureLayer = null;
let isSmall: boolean = false;

export enum ESRIMapLayerNames {
  polygonLayer = "polygon-layer",
}

export enum ESRIMapModeNames {
  confirmedCases = "Confirmed Cases",
  recoveredCases = "Recovered Cases",
  deaths = "Deaths",
}

const ESRIMap: React.FC<ESRIMapProps> = props => {
  const { initialBaseMap = "streets", mapPolygons = [], displayedLayer } = props;

  const mapRef: React.MutableRefObject<HTMLDivElement> = useRef();

  const prevProps: ESRIMapProps = usePreviousProps<ESRIMapProps>(props);
  useEffect(() => {
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/widgets/Expand"],
      {
        css: true,
      }
    ).then(([Map, MapView, FeatureLayer, Legend, Expand]) => {
      isSmall = window.innerWidth <= 710;
      if (!map) {
        initialize(Map, MapView, FeatureLayer, Legend, Expand);
      }

      if (prevProps) {
        if (prevProps.mapPolygons !== mapPolygons) {
          if (polygonLayer) {
            updatePolygonLayerData();
          }
        }
        if (prevProps.displayedLayer !== displayedLayer) {
          if (polygonLayer) {
            updatePolygonLayerRenderer();
          }
        }
      }
      return cleanUp;
    });
  }, [mapPolygons, displayedLayer]);

  const initialize = (Map, MapView, FeatureLayer, Legend, Expand): void => {
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

    const legend: Legend = new Legend({
      view: mapView,
    });

    mapView.ui.add(legend, "bottom-left");
    updatePolygonLayerData();
  };

  const cleanUp = (): void => {
    if (mapView) {
      mapView.container = null;
    }
  };

  const updatePolygonLayerRenderer = (): void => {
    const renderer = (polygonLayer.renderer as __esri.ClassBreaksRenderer).clone();
    renderer.legendOptions = {
      title: displayedLayer,
    };
    switch (displayedLayer) {
      case ESRIMapModeNames.confirmedCases: {
        renderer.field = "confirmedCases";
        renderer.classBreakInfos = generateLogarithmicClassStep(7, MapConfirmedCasesClassBreakColors, [
          0,
          1.5,
          4,
          5.5,
          8,
        ]);
        break;
      }
      case ESRIMapModeNames.recoveredCases: {
        renderer.field = "recoveredCases";
        renderer.classBreakInfos = generateLogarithmicClassStep(7, MapRecoveredCasesClassBreakColors, [0, 2, 4, 6, 8]);
        break;
      }
      case ESRIMapModeNames.deaths: {
        renderer.field = "deaths";
        renderer.classBreakInfos = generateLogarithmicClassStep(7, MapDeathsClassBreakColors, [0, 2, 4, 6, 8]);
        break;
      }
    }
    polygonLayer.renderer = renderer;
  };

  const updatePolygonLayerData = (): void => {
    polygonLayer.queryObjectIds().then(oldObjectIds => {
      const renderer = (polygonLayer.renderer as __esri.ClassBreaksRenderer).clone();

      const addFeatures: Array<any> = mapPolygons.map(mapPolygon => ({
        attributes: {
          name: mapPolygon.name[mapPolygon.name.length - 1],
          internalId: mapPolygon.internalId,
          confirmedCases: mapPolygon.confirmedCasesCount,
          recoveredCases: mapPolygon.recoveredCasesCount,
          deaths: mapPolygon.deathsCount,
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
      {
        name: "recoveredCases",
        alias: "recoveredCases",
        type: "integer",
      },
      {
        name: "deaths",
        alias: "deaths",
        type: "integer",
      },
    ];

    const renderer = {
      type: "class-breaks",
      field: "confirmedCases",
      legendOptions: {
        title: ESRIMapModeNames.confirmedCases,
      },
      defaultSymbol: {
        type: "simple-fill",
        style: "backward-diagonal",
        color: [0, 0, 0, 0.4],
        outline: {
          width: 1,
          color: [126, 126, 126, 1],
        },
      },
      defaultLabel: "no data",
      classBreakInfos: generateLogarithmicClassStep(7, MapConfirmedCasesClassBreakColors, [0, 1.5, 4, 5.5, 8]),
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
    const backgroundOpacity: number = 0.4;
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
          label: "0",
        });
      } else {
        const color: Color = colorScale(step);
        const minValue: number = Math.pow(10, step - 1);
        const maxValue: number = step === steps ? Number.MAX_SAFE_INTEGER : Math.pow(10, step) - 0.1;
        let label: string = "";
        if (isSmall) {
          label =
            step === steps ? `>${MathUtils.abbreviateNumber(minValue)}` : `${MathUtils.abbreviateNumber(minValue)}'s`;
        } else {
          label =
            step === steps
              ? `>${MathUtils.abbreviateNumber(minValue)}`
              : `${MathUtils.abbreviateNumber(minValue)} - ${MathUtils.abbreviateNumber(
                  maxValue < 100 ? Math.floor(maxValue) : Math.ceil(maxValue)
                )}`;
        }
        classBreakInfos.push({
          minValue: minValue,
          maxValue: maxValue,
          symbol: {
            type: "simple-fill",
            style: "solid",
            color: [...color.rgb(), backgroundOpacity],
            outline: {
              width: outlineWidth,
              color: [126, 126, 126, outlineOpacity],
            },
          },
          label: label,
        });
      }
    }
    return classBreakInfos;
  };

  const onResize = (): void => {
    const newWidth: number = window.innerWidth;
    if (newWidth > 710 && isSmall) {
      isSmall = false;
      updatePolygonLayerRenderer();
    } else if (newWidth <= 710 && !isSmall) {
      isSmall = true;
      updatePolygonLayerRenderer();
    }
  };

  return (
    <React.Fragment>
      <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
      <StyledESRIMap className={"esri-map"} ref={mapRef} />
    </React.Fragment>
  );
};

export default ESRIMap;