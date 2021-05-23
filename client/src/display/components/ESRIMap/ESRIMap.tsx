import React, {MutableRefObject, useEffect, useRef} from "react";
import "./ESRIMap.css";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {
  ClassBreakColors,
  ESRIMapLayerNames,
  ESRIMapModeNames,
  ESRIMapPolygon,
  MapDailyCasesClassBreakDomain,
  MapDailyDeathsClassBreakDomain, MapDailyRecoveriesClassBreakDomain,
  MapMonthlyCasesClassBreakDomain, MapMonthlyDeathsClassBreakDomain, MapMonthlyRecoveriesClassBreakDomain,
  MapTotalCasesClassBreakColors,
  MapTotalCasesClassBreakDomain,
  MapTotalDeathsClassBreakColors,
  MapTotalDeathsClassBreakDomain,
  MapTotalRecoveriesClassBreakColors,
  MapTotalRecoveriesClassBreakDomain,
  MapWeeklyCasesClassBreakDomain,
  MapWeeklyDeathsClassBreakDomain, MapWeeklyRecoveriesClassBreakDomain,
  MapYearlyCasesClassBreakDomain, MapYearlyDeathsClassBreakDomain, MapYearlyRecoveriesClassBreakDomain
} from "./types";
import {usePreviousProps} from "../../../hooks/usePreviousProps";
import {loadModules} from "esri-loader";
import chroma, {Color, Scale} from "chroma-js";
import {MathUtils} from "../../../helper/MathUtils";
import {
  CasesInformationDataObject,
  DailyCasesData,
  DailyCasesDataNull,
  DailyCasesInformationData,
  DailyCasesInformationDataNull,
} from "../../../../../shared/types/data/Cases/CasesTypes";
import {CasesDataTypes, CasesTypes} from "../../../state/global/App/types";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {CasesUtils} from "../../../helper/CasesUtils";
import Map = __esri.Map;
import MapView = __esri.MapView;
import FeatureLayer = __esri.FeatureLayer;
import Legend = __esri.Legend;
import FieldProperties = __esri.FieldProperties;
import ClassBreaksRenderer = __esri.ClassBreaksRenderer;
import Graphic = __esri.Graphic;
import Polygon = __esri.Polygon;
import GraphicsLayer = __esri.GraphicsLayer;
import getDailyCasesData = CasesUtils.getDailyCasesData;
import getDailyCasesInformationData = CasesUtils.getDailyCasesInformationData;
import getCasesInformationDataObject = CasesUtils.getCasesInformationDataObject;

export type ESRIMapProps = ESRIMapDataProps & ESRIMapStyleProps & ESRIMapEventProps;

export interface ESRIMapDataProps {
  caseType: CasesTypes;
  mapPolygons: Array<ESRIMapPolygon>;
  date: string;
  initialBaseMap: string;
  mapRegionUpdateGeometry: Array<Array<[number, number]>>;
  breadcrumbsRegionUpdateGeometry: Array<Array<[number, number]>>;
  casesDataType: CasesDataTypes;
  dailyCasesInformationDataObject: CasesInformationDataObject;
  weeklyCasesInformationDataObject: CasesInformationDataObject;
  monthlyCasesInformationDataObject: CasesInformationDataObject;
  yearlyCasesInformationDataObject: CasesInformationDataObject;
}

export interface ESRIMapStyleProps {
  width: Breakpoint;
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
    caseType,
    date,
    initialBaseMap,
    mapRegionUpdateGeometry,
    breadcrumbsRegionUpdateGeometry,
    casesDataType,
    dailyCasesInformationDataObject,
    weeklyCasesInformationDataObject,
    monthlyCasesInformationDataObject,
    yearlyCasesInformationDataObject,
    width,
    handleUpdateStart,
    handleUpdateComplete,
    handleRegionChange,
  } = props;

  const prevProps: ESRIMapProps = usePreviousProps<ESRIMapProps>(props);
  useEffect(() => {
    loadModules(
      ["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/widgets/Legend", "esri/geometry/Polygon", "esri/Graphic"],
      {
        css: true,
      }
    ).then(([esriConfig, Map, MapView, FeatureLayer, GraphicsLayer, Legend, Polygon, Graphic]) => {

      if (!map) {
        initialize(esriConfig, Map, MapView, FeatureLayer, GraphicsLayer, Legend);
      }

      if (prevProps) {
        if (prevProps.mapPolygons !== mapPolygons) {
          handleMapPolygonsChange();
        }
        if (prevProps.caseType !== caseType) {
          handleCaseTypeChange();
        }
        if (prevProps.date !== date) {
          handleDateChange();
        }
        if (prevProps.mapRegionUpdateGeometry !== mapRegionUpdateGeometry) {
          handleMapRegionUpdateGeometryChange(Polygon, Graphic);
        }
        if (prevProps.breadcrumbsRegionUpdateGeometry !== breadcrumbsRegionUpdateGeometry) {
          handleBreadcrumbsRegionUpdateGeometryChange(Polygon, Graphic);
        }
        if (prevProps.casesDataType !== casesDataType) {
          handleCasesDataTypeChange();
        }
        if (prevProps.width !== width) {
          handleWidthChange();
        }
      }
      return destroyESRIMap;
    });
  }, [mapPolygons, caseType, date, mapRegionUpdateGeometry, breadcrumbsRegionUpdateGeometry, casesDataType, width]);

  const initialize = (esriConfig, Map, MapView, FeatureLayer, GraphicsLayer, Legend): void => {

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
              cases: null,
              recoveries: null,
              deaths: null,
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
          const matchingCasesInformationDataObject: CasesInformationDataObject | null = getCasesInformationDataObject(casesDataType, dailyCasesInformationDataObject, weeklyCasesInformationDataObject, monthlyCasesInformationDataObject, yearlyCasesInformationDataObject);
          if (!!matchingCasesInformationDataObject) {
            const matchingDailyCasesInformationDataObject: DailyCasesInformationData | DailyCasesInformationDataNull = getDailyCasesInformationData(matchingCasesInformationDataObject[mapPolygon.hierarchicalName], date);
            return {
              attributes: {
                hierarchicalName: mapPolygon.hierarchicalName,
                totalCases: matchingDailyCasesData.totalCases,
                totalRecoveries: matchingDailyCasesData.totalRecoveries,
                totalDeaths: matchingDailyCasesData.totalDeaths,
                cases: matchingDailyCasesInformationDataObject.cases,
                recoveries: matchingDailyCasesInformationDataObject.recoveries,
                deaths: matchingDailyCasesInformationDataObject.deaths,
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
            return {
              attributes: {
                hierarchicalName: mapPolygon.hierarchicalName,
                totalCases: matchingDailyCasesData.totalCases,
                totalRecoveries: matchingDailyCasesData.totalRecoveries,
                totalDeaths: matchingDailyCasesData.totalDeaths,
                cases: null,
                recoveries: null,
                deaths: null,
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

  const handleCaseTypeChange = (): void => {
    const renderer = (polygonLayer.renderer as __esri.ClassBreaksRenderer).clone();
    switch (caseType) {
      case CasesTypes.CASES: {
        switch (casesDataType) {
          case CasesDataTypes.Total: {
            renderer.legendOptions = {
              title: ESRIMapModeNames.totalCases,
            };
            renderer.field = "totalCases";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapTotalCasesClassBreakDomain[4], MapTotalCasesClassBreakColors, MapTotalCasesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Daily: {
            renderer.legendOptions = {
              title: `Daily Cases`,
            };
            renderer.field = "cases";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapDailyCasesClassBreakDomain[4], MapTotalCasesClassBreakColors, MapDailyCasesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Weekly: {
            renderer.legendOptions = {
              title: `Weekly Cases`,
            };
            renderer.field = "cases";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapWeeklyCasesClassBreakDomain[4], MapTotalCasesClassBreakColors, MapWeeklyCasesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Monthly: {
            renderer.legendOptions = {
              title: `Monthly Cases`,
            };
            renderer.field = "cases";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapMonthlyCasesClassBreakDomain[4], MapTotalCasesClassBreakColors, MapMonthlyCasesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Yearly: {
            renderer.legendOptions = {
              title: `Yearly Cases`,
            };
            renderer.field = "cases";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapYearlyCasesClassBreakDomain[4], MapTotalCasesClassBreakColors, MapYearlyCasesClassBreakDomain);
            break;
          }
        }
        break;
      }
      case CasesTypes.DEATHS: {
        switch (casesDataType) {
          case CasesDataTypes.Total: {
            renderer.legendOptions = {
              title: ESRIMapModeNames.totalDeaths,
            };
            renderer.field = "totalDeaths";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapTotalDeathsClassBreakDomain[4], MapTotalDeathsClassBreakColors, MapTotalDeathsClassBreakDomain);
            break;
          }
          case CasesDataTypes.Daily: {
            renderer.legendOptions = {
              title: `Daily Deaths`,
            };
            renderer.field = "deaths";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapDailyDeathsClassBreakDomain[4], MapTotalDeathsClassBreakColors, MapDailyDeathsClassBreakDomain);
            break;
          }
          case CasesDataTypes.Weekly: {
            renderer.legendOptions = {
              title: `Weekly Deaths`,
            };
            renderer.field = "deaths";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapWeeklyDeathsClassBreakDomain[4], MapTotalDeathsClassBreakColors, MapWeeklyDeathsClassBreakDomain);
            break;
          }
          case CasesDataTypes.Monthly: {
            renderer.legendOptions = {
              title: `Monthly Deaths`,
            };
            renderer.field = "deaths";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapMonthlyDeathsClassBreakDomain[4], MapTotalDeathsClassBreakColors, MapMonthlyDeathsClassBreakDomain);
            break;
          }
          case CasesDataTypes.Yearly: {
            renderer.legendOptions = {
              title: `Yearly Deaths`,
            };
            renderer.field = "deaths";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapYearlyDeathsClassBreakDomain[4], MapTotalDeathsClassBreakColors, MapYearlyDeathsClassBreakDomain);
            break;
          }
        }
        break;
      }
      case CasesTypes.RECOVERIES: {
        switch (casesDataType) {
          case CasesDataTypes.Total: {
            renderer.legendOptions = {
              title: ESRIMapModeNames.totalRecoveries,
            };
            renderer.field = "totalRecoveries";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapTotalRecoveriesClassBreakDomain[4], MapTotalRecoveriesClassBreakColors, MapTotalRecoveriesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Daily: {
            renderer.legendOptions = {
              title: `Daily Recoveries`,
            };
            renderer.field = "recoveries";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapDailyRecoveriesClassBreakDomain[4], MapTotalRecoveriesClassBreakColors, MapDailyRecoveriesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Weekly: {
            renderer.legendOptions = {
              title: `Weekly Recoveries`,
            };
            renderer.field = "recoveries";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapWeeklyRecoveriesClassBreakDomain[4], MapTotalRecoveriesClassBreakColors, MapWeeklyRecoveriesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Monthly: {
            renderer.legendOptions = {
              title: `Monthly Recoveries`,
            };
            renderer.field = "recoveries";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapMonthlyRecoveriesClassBreakDomain[4], MapTotalRecoveriesClassBreakColors, MapMonthlyRecoveriesClassBreakDomain);
            break;
          }
          case CasesDataTypes.Yearly: {
            renderer.legendOptions = {
              title: `Yearly Recoveries`,
            };
            renderer.field = "recoveries";
            renderer.classBreakInfos = generateLogarithmicClassStep(MapYearlyRecoveriesClassBreakDomain[4], MapTotalRecoveriesClassBreakColors, MapYearlyRecoveriesClassBreakDomain);
            break;
          }
        }
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
            existingFeature.attributes.cases = null;
            existingFeature.attributes.recoveries = null;
            existingFeature.attributes.deaths = null;
          } else {
            const matchingDailyCasesData: DailyCasesData | DailyCasesDataNull = getDailyCasesData(matchingMapPolygon.data, date);
            const matchingCasesInformationDataObject: CasesInformationDataObject | null = getCasesInformationDataObject(casesDataType, dailyCasesInformationDataObject, weeklyCasesInformationDataObject, monthlyCasesInformationDataObject, yearlyCasesInformationDataObject);
            if (!!matchingCasesInformationDataObject) {
              const matchingDailyCasesInformationDataObject: DailyCasesInformationData | DailyCasesInformationDataNull = getDailyCasesInformationData(matchingCasesInformationDataObject[matchingMapPolygon.hierarchicalName], date);
              existingFeature.attributes.cases = matchingDailyCasesInformationDataObject.cases;
              existingFeature.attributes.recoveries = matchingDailyCasesInformationDataObject.recoveries;
              existingFeature.attributes.deaths = matchingDailyCasesInformationDataObject.deaths;
            } else {
              existingFeature.attributes.cases = null;
              existingFeature.attributes.recoveries = null;
              existingFeature.attributes.deaths = null;
            }
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

  const handleMapRegionUpdateGeometryChange = (Polygon, Graphic): void => {
    if (mapRegionUpdateGeometry.length === 0) {
      highlightLayer.removeAll();
      return;
    }
    const polygon: Polygon = new Polygon({
      rings: mapRegionUpdateGeometry,
      spatialReference: { wkid: 4326 }
    })
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

  const handleBreadcrumbsRegionUpdateGeometryChange = (Polygon, Graphic): void => {
    if (breadcrumbsRegionUpdateGeometry.length === 0) {
      highlightLayer.removeAll();
      return;
    }
    const polygon: Polygon = new Polygon({
      rings: breadcrumbsRegionUpdateGeometry,
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

  const handleCasesDataTypeChange = (): void => {
    if (!polygonLayer) {
      return;
    }

    handleCaseTypeChange();

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
            const matchingCasesInformationDataObject: CasesInformationDataObject | null = getCasesInformationDataObject(casesDataType, dailyCasesInformationDataObject, weeklyCasesInformationDataObject, monthlyCasesInformationDataObject, yearlyCasesInformationDataObject);
            if (!!matchingCasesInformationDataObject) {
              const matchingDailyCasesInformationDataObject: DailyCasesInformationData | DailyCasesInformationDataNull = getDailyCasesInformationData(matchingCasesInformationDataObject[matchingMapPolygon.hierarchicalName], date);
              existingFeature.attributes.cases = matchingDailyCasesInformationDataObject.cases;
              existingFeature.attributes.recoveries = matchingDailyCasesInformationDataObject.recoveries;
              existingFeature.attributes.deaths = matchingDailyCasesInformationDataObject.deaths;
            } else {
              existingFeature.attributes.cases = null;
              existingFeature.attributes.recoveries = null;
              existingFeature.attributes.deaths = null;
            }
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

  const handleWidthChange = (): void => {
    handleCaseTypeChange();
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
        let label: string = "";
        if (width === "xs" || width === "sm") {
          label =
            step === steps ? `>${MathUtils.abbreviateNumber(minValue)}` : `${MathUtils.abbreviateNumber(minValue)}'s`;
        } else {
          label = step === steps ? (
            `>${MathUtils.abbreviateNumber(minValue)}`
          ) : (
            `${MathUtils.abbreviateNumber(minValue)} - ${MathUtils.abbreviateNumber(maxValue < 100 ? Math.floor(maxValue) : Math.ceil(maxValue))}`
          );
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
      {
        name: "cases",
        alias: "cases",
        type: "integer",
      },
      {
        name: "recoveries",
        alias: "recoveries",
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
      classBreakInfos: generateLogarithmicClassStep(MapTotalCasesClassBreakDomain[4], MapTotalCasesClassBreakColors, MapTotalCasesClassBreakDomain),
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
