import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import "./ESRIMap.css";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {
  ClassBreakColors, classBreakSteps,
  ESRIMapLayerNames,
  ESRIMapModeNames,
  ESRIMapPolygon,
  MapTotalCasesClassBreakColors,
  MapTotalCasesClassBreakDomain,
  MapTotalDeathsClassBreakColors,
  MapTotalDeathsClassBreakDomain,
  MapTotalRecoveriesClassBreakColors, MapTotalRecoveriesClassBreakDomain
} from "./types";
import {usePreviousProps} from "../../../hooks/usePreviousProps";
import {loadModules} from "esri-loader";
import chroma, {Color, Scale} from "chroma-js";
import {MathUtils} from "../../../helper/MathUtils";
import {
  DailyCasesData,
  DailyCasesDataNull,
  DailyCasesDataObject
} from "../../../../../shared/types/data/Cases/CasesTypes";
import {DateUtils} from "../../../helper/DateUtils";
import {Moment} from "moment";
import {MapSubPages} from "../../../state/global/App/types";
import Map = __esri.Map;
import MapView = __esri.MapView;
import FeatureLayer = __esri.FeatureLayer;
import Legend = __esri.Legend;
import FieldProperties = __esri.FieldProperties;
import ClassBreaksRenderer = __esri.ClassBreaksRenderer;
import getMomentDateFromDateString = DateUtils.getMomentDateFromDateString;
import getDateStringFromMomentDate = DateUtils.getDateStringFromMomentDate;
import Graphic = __esri.Graphic;
import Polygon = __esri.Polygon;
import GraphicsLayer = __esri.GraphicsLayer;
import {MapPolygon} from "../../../../../shared/types/data/Map/MapTypes";

export type ESRIMapProps = ESRIMapDataProps & ESRIMapStyleProps & ESRIMapEventProps;

export interface ESRIMapDataProps {
  subPage: MapSubPages;
  mapPolygons: Array<ESRIMapPolygon>;
  date: string;
  initialBaseMap: string;
  focusMapGeometry: Array<Array<[number, number]>>;
}

export interface ESRIMapStyleProps {

}

export interface ESRIMapEventProps {
  handleUpdateStart(): void;
  handleUpdateComplete(): void;
  handleRegionChange(hierarchicalName: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
    }
  }),
);

let isInitialLoad: boolean = true;
let map: Map = null;
let mapView: MapView = null;
let polygonLayer: FeatureLayer = null;
let highlightLayer: GraphicsLayer = null;
let localMapPolygons: Array<ESRIMapPolygon> = [];

export const destroyESRIMap = (): void => {
  isInitialLoad = true;
  map = null;
  mapView = null;
  polygonLayer = null;
  highlightLayer = null;
  localMapPolygons = [];
};

const ESRIMap: React.FC<ESRIMapProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const mapRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const {
    mapPolygons,
    subPage,
    date,
    initialBaseMap,
    focusMapGeometry,
    handleUpdateStart,
    handleUpdateComplete,
    handleRegionChange,
  } = props;

  const prevProps: ESRIMapProps = usePreviousProps<ESRIMapProps>(props);
  useEffect(() => {
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/widgets/Legend", "esri/geometry/Point", "esri/geometry/Polygon", "esri/Graphic"],
      {
        css: true,
      }
    ).then(([Map, MapView, FeatureLayer, GraphicsLayer, Legend, Point, Polygon, Graphic]) => {

      if (!map) {
        initialize(Map, MapView, FeatureLayer, GraphicsLayer, Legend, Point);
      }

      if (prevProps) {
        if (prevProps.mapPolygons !== mapPolygons) {
          handleMapPolygonsChange();
        }
        if (prevProps.subPage !== subPage) {
          handleSubPageChange();
        }
        if (prevProps.date !== date) {
          handleDateChange();
        }
        if (prevProps.focusMapGeometry !== focusMapGeometry) {
          handleFocusMapGeometryChange(Polygon, Graphic);
        }
      }
      return destroyESRIMap;
    });
  }, [mapPolygons, subPage, date, focusMapGeometry]);

  const initialize = (Map, MapView, FeatureLayer, GraphicsLayer, Legend, Point): void => {
    map = new Map({
      basemap: initialBaseMap,
    });

    mapView = new MapView({
      container: mapRef.current,
      map: map,
      center: [-98.35, 39.5],
      zoom: 4,
      ui: {
        components: ["attribution", "zoom", "compass"],
      },
    });
    mapView.popup.collapseEnabled = false;
    mapView.popup.dockOptions = {
      position: "top-right"
    };

    polygonLayer = getPolygonLayer(FeatureLayer);
    highlightLayer = getHighlightLayer(GraphicsLayer);

    const layers: Array<FeatureLayer | GraphicsLayer> = [polygonLayer, highlightLayer];
    layers.forEach(layer => map.add(layer));

    const legend: Legend = new Legend({
      view: mapView,
    });

    mapView.ui.add(legend, "bottom-left");

    mapView.on("click", (event) => {
      console.log(event.button);
      switch (event.button) {
        case 0: {
          mapView.hitTest(event).then((rsp => {
            const hitResults: Array<any> = rsp.results;
            hitResults.forEach(result => {
              const sourceLayerName: string = result?.graphic?.sourceLayer?.id;
              if (!!sourceLayerName) {
                switch (sourceLayerName) {
                  case ESRIMapLayerNames.polygonLayer: {
                    const objectId: number = result.graphic.attributes.OBJECTID;
                    polygonLayer.queryFeatures().then((featureRsp) => {
                      const features: Array<any> = featureRsp.features;
                      for (let i = 0; i < features.length; i++) {
                        const feature: any = features[i];
                        if (feature.attributes.OBJECTID === objectId) {
                          const hierarchicalName: string = feature.attributes.hierarchicalName;
                          handleRegionChange(hierarchicalName);
                          break;
                        }
                      }
                    });
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
            });
          }));
          break;
        }
        case 2: {
          handleRegionChange("World");
        }
      }
    });
  };

  const getDailyCasesData = (dailyCasesDataObject: DailyCasesDataObject, dateString: string): DailyCasesData | DailyCasesDataNull => {
    const data: DailyCasesData | undefined = dailyCasesDataObject[dateString];
    if (!!data) {
      return data;
    } else {
      const date: Moment = getMomentDateFromDateString(dateString);
      for (let i = 0; i < 10; i++) {
        date.subtract(1, "days");
        const previousDayData: DailyCasesData | undefined = dailyCasesDataObject[getDateStringFromMomentDate(date)];
        if (!!previousDayData) {
          return previousDayData;
        } else {
          if (i === 9) {
            console.error(`Unable to get cases data on day: ${dateString}.`);
            console.error("Daily Cases Object");
            console.log(dailyCasesDataObject);
            return {
              totalCases: null,
              totalRecoveries: null,
              totalDeaths: null,
            }
          }
        }
      }
    }
  };

  const handleMapPolygonsChange = (): void => {
    if (!polygonLayer) {
      return;
    }
    if (isInitialLoad) {
      isInitialLoad = false;
    } else {
      handleUpdateStart();
    }
    
    polygonLayer.queryFeatures().then(result => {
      const renderer = (polygonLayer.renderer as ClassBreaksRenderer).clone();
      const newHierarchicalNames: Array<string> = mapPolygons.map(mapPolygon => mapPolygon.hierarchicalName);
      const oldHierarchicalNames: Array<string> = prevProps?.mapPolygons.map(mapPolygon => mapPolygon.hierarchicalName) || [];
      const removeHierarchicalNames: Array<string> = oldHierarchicalNames.filter(hierarchicalName => !newHierarchicalNames.includes(hierarchicalName));
      const addHierarchicalNames: Array<string> = newHierarchicalNames.filter(hierarchicalName => !oldHierarchicalNames.includes(hierarchicalName));
      const addMapPolygons: Array<ESRIMapPolygon> = mapPolygons.filter(mapPolygon => addHierarchicalNames.includes(mapPolygon.hierarchicalName));

      const addFeatures: Array<any> = addMapPolygons.map(mapPolygon => {
        if (mapPolygon.isMissingData) {
          return {
            attributes: {
              hierarchicalName: mapPolygon.hierarchicalName,
              totalCases: null,
              totalRecoveries: null,
              totalDeaths: null,
            },
            geometry: {
              type: "polygon",
              hasZ: false,
              hasM: false,
              rings: mapPolygon.geometry,
              spatialReference: { wkid: 4326 },
            },
          }
        } else {
          const matchingDailyCasesData: DailyCasesData | DailyCasesDataNull = getDailyCasesData(mapPolygon.data, date);
          return {
            attributes: {
              hierarchicalName: mapPolygon.hierarchicalName,
              totalCases: matchingDailyCasesData.totalCases,
              totalRecoveries: matchingDailyCasesData.totalRecoveries,
              totalDeaths: matchingDailyCasesData.totalDeaths,
            },
            geometry: {
              type: "polygon",
              hasZ: false,
              hasM: false,
              rings: mapPolygon.geometry,
              spatialReference: { wkid: 4326 },
            },
          }
        }
      });

      const deleteFeatures: Array<{ objectId: number }> = result.features.filter(feature => removeHierarchicalNames.includes(feature.attributes.hierarchicalName)).map(feature => ({ objectId: feature.attributes.OBJECTID }));

      polygonLayer.renderer = renderer;
      polygonLayer.applyEdits({
        addFeatures: addFeatures,
        deleteFeatures: deleteFeatures,
      }).then(rsp => {
        handleUpdateComplete();
      });
    });
  };

  const handleSubPageChange = (): void => {
    const renderer = (polygonLayer.renderer as __esri.ClassBreaksRenderer).clone();
    switch (subPage) {
      case MapSubPages.CASES: {
        renderer.legendOptions = {
          title: ESRIMapModeNames.totalCases,
        };
        renderer.field = "totalCases";
        renderer.classBreakInfos = generateLogarithmicClassStep(classBreakSteps, MapTotalCasesClassBreakColors, MapTotalCasesClassBreakDomain);
        break;
      }
      case MapSubPages.DEATHS: {
        renderer.legendOptions = {
          title: ESRIMapModeNames.totalDeaths,
        };
        renderer.field = "totalDeaths";
        renderer.classBreakInfos = generateLogarithmicClassStep(classBreakSteps, MapTotalDeathsClassBreakColors, MapTotalDeathsClassBreakDomain);
        break;
      }
      case MapSubPages.RECOVERIES: {
        renderer.legendOptions = {
          title: ESRIMapModeNames.totalRecovered,
        };
        renderer.field = "totalRecoveries";
        renderer.classBreakInfos = generateLogarithmicClassStep(classBreakSteps, MapTotalRecoveriesClassBreakColors, MapTotalRecoveriesClassBreakDomain);
        break;
      }
    }
    polygonLayer.renderer = renderer;
  };

  const handleDateChange = (): void => {
    if (!polygonLayer) {
      return;
    }

    polygonLayer.queryFeatures().then(result => {
      const renderer = (polygonLayer.renderer as ClassBreaksRenderer).clone();

      const existingFeatures: Array<Graphic> = result.features;

      const updateFeatures: Array<Graphic> = [];
      existingFeatures.forEach((existingFeature) => {
        const hierarchicalName: string = existingFeature.attributes.hierarchicalName;
        const matchingMapPolygon: ESRIMapPolygon | null = mapPolygons.find(mapPolygon => mapPolygon.hierarchicalName === hierarchicalName);
        if (!!matchingMapPolygon) {
          if (matchingMapPolygon.isMissingData) {
            existingFeature.attributes.totalCases = null;
            existingFeature.attributes.totalRecoveries = null;
            existingFeature.attributes.totalDeaths = null;
          } else {
            const matchingDailyCasesData: DailyCasesData | DailyCasesDataNull = getDailyCasesData(matchingMapPolygon.data, date);
            existingFeature.attributes.totalCases = matchingDailyCasesData.totalCases;
            existingFeature.attributes.totalRecoveries = matchingDailyCasesData.totalRecoveries;
            existingFeature.attributes.totalDeaths = matchingDailyCasesData.totalDeaths;
          }
        }
        updateFeatures.push(existingFeature);
      });

      polygonLayer.renderer = renderer;
      polygonLayer.applyEdits({
        updateFeatures: updateFeatures,
      }).then(rsp => {
      });
    });
  };

  const handleFocusMapGeometryChange = (Polygon, Graphic): void => {
    if (focusMapGeometry.length === 0) {
      highlightLayer.removeAll();
      return;
    }
    const polygon: Polygon = new Polygon({
      rings: focusMapGeometry,
      spatialReference: { wkid: 4326 }
    })
    mapView.goTo(polygon.extent, {
      duration: 1000
    });
    if (!highlightLayer) {
      return;
    }
    highlightLayer.removeAll();
    const simpleFillSymbol = {
      type: "simple-fill",
      color: [0, 0, 0, 0],
      outline: {
        color: [128, 222, 234],
        width: 3,
      }
    };
    const polygonGraphic: Graphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol,
    })
    highlightLayer.add(polygonGraphic);
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
          label: "0",
        });
      } else {
        const color: Color = colorScale(step);
        const minValue: number = Math.pow(10, step - 1);
        const maxValue: number = step === steps ? Number.MAX_SAFE_INTEGER : Math.pow(10, step) - 0.1;
        const label: string = step === steps ?
          `>${MathUtils.abbreviateNumber(minValue)}`
            :
          `${MathUtils.abbreviateNumber(minValue)} - ${MathUtils.abbreviateNumber(
            maxValue < 100 ? Math.floor(maxValue) : Math.ceil(maxValue)
            )}`;
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

  const getPolygonLayer = (FeatureLayer): FeatureLayer => {
    const fields: Array<FieldProperties> = [
      {
        name: "OBJECTID",
        alias: "OBJECTID",
        type: "oid",
      },
      {
        name: "hierarchicalName",
        alias: "hierarchicalName",
        type: "string",
      },
      {
        name: "totalCases",
        alias: "totalCases",
        type: "integer",
      },
      {
        name: "totalRecoveries",
        alias: "totalRecoveries",
        type: "integer",
      },
      {
        name: "totalDeaths",
        alias: "totalDeaths",
        type: "integer",
      },
    ];

    const renderer = {
      type: "class-breaks",
      field: "totalCases",
      legendOptions: {
        title: ESRIMapModeNames.totalCases,
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
      classBreakInfos: generateLogarithmicClassStep(classBreakSteps, MapTotalCasesClassBreakColors, MapTotalCasesClassBreakDomain),
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

  const getHighlightLayer = (GraphicsLayer): GraphicsLayer => {
    return new GraphicsLayer({
      id: ESRIMapLayerNames.highlightLayer,
    });
  };

  return (
    <div className={classes.root} ref={mapRef}/>
  );
};

export default ESRIMap;
