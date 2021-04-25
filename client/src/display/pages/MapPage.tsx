import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import SliderControl from "../components/SliderControl/SliderControl";
import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import BreadcrumbsControl from "../components/BreadcrumbsControl/BreadcrumbsControl";
import {ESRIMapPolygon} from "../components/ESRIMap/types";
import ESRIMap from "../components/ESRIMap/ESRIMap";
import {CasesDataTypes, CasesTypes} from "../../state/global/App/types";
import {Breakpoint} from "@material-ui/core/styles/createBreakpoints";
import {CasesData, CasesDataObject, CasesInformationDataObject} from "../../../../shared/types/data/Cases/CasesTypes";
import MapPageInformation from "../components/MapPageInformation/MapPageInformation";
import {MapDataTypeSelectData} from "../components/MapDataTypeSelect/types";
import MapDataTypeSelect from "../components/MapDataTypeSelect/MapDataTypeSelect";


export type MapPageProps = MapPageDataProps & MapPageStyleProps & MapPageEventProps;

export interface MapPageDataProps {
  dateValues: Array<string>;
  dataTree: TreeItem;
  date: string;
  mapPolygons: Array<ESRIMapPolygon>;
  mapRegionUpdateGeometry: Array<Array<[number, number]>>;
  breadcrumbsRegionUpdateGeometry: Array<Array<[number, number]>>;
  caseType: CasesTypes;
  countryCode: string;
  casesData: CasesData;
  regionName: string;
  casesDataObject: CasesDataObject;
  dailyCasesInformationDataObject: CasesInformationDataObject;
  weeklyCasesInformationDataObject: CasesInformationDataObject;
  monthlyCasesInformationDataObject: CasesInformationDataObject;
  yearlyCasesInformationDataObject: CasesInformationDataObject;
}

export interface MapPageStyleProps {
  width: Breakpoint;
}

export interface MapPageEventProps {
  handleDateChange(date: string): void;
  handleBreadCrumbsRegionChange(hierarchicalName: string): void;
  handleMapRegionChange(hierarchicalName: string): void;
  handleMapUpdateStart(): void;
  handleMapUpdateComplete(): void;
  handlePreloadClick(value): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    map: {
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "calc(100% - 110px)",
      },
      [theme.breakpoints.up("sm")]: {
        height: "calc(100% - 120px)",
      },
      [theme.breakpoints.up("md")]: {
        height: "calc(100% - 132px)",
      },
      [theme.breakpoints.up("lg")]: {
        height: "calc(100% - 145px)",
      },
    },
    informationSelectWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      [theme.breakpoints.up("xs")]: {
        height: "41px",
      },
      [theme.breakpoints.up("sm")]: {
        height: "48px",
      },
      [theme.breakpoints.up("md")]: {
        height: "54px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "61px",
      },
    },
    informationWrapper: {
      height: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "calc(100% - 130px)",
      },
      [theme.breakpoints.up("md")]: {
        width: "calc(100% - 165px)",
      },
    },
    selectWrapper: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      [theme.breakpoints.up("xs")]: {
        width: "130px",
      },
      [theme.breakpoints.up("md")]: {
        width: "165px",
      },
    }
  }),
);

const MapPage: React.FC<MapPageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    dateValues,
    dataTree,
    date,
    mapPolygons,
    mapRegionUpdateGeometry,
    breadcrumbsRegionUpdateGeometry,
    caseType,
    countryCode,
    casesData,
    regionName,
    casesDataObject,
    dailyCasesInformationDataObject,
    weeklyCasesInformationDataObject,
    monthlyCasesInformationDataObject,
    yearlyCasesInformationDataObject,
    width,
    handleDateChange,
    handleBreadCrumbsRegionChange,
    handleMapRegionChange,
    handleMapUpdateStart,
    handleMapUpdateComplete,
    handlePreloadClick,
  } = props;

  const [esriMapRegion, setEsriMapRegion] = useState<string>("World");
  const [casesDataType, setCasesDataType] = useState<CasesDataTypes>(CasesDataTypes.Total);

  const handleEsriMapRegionChange = (hierarchicalName: string): void => {
    handleMapRegionChange(hierarchicalName);
    setEsriMapRegion(hierarchicalName);
  };

  const handleCasesDataTypeChange = (value: string): void => {
    setCasesDataType(value as CasesDataTypes);
  };

  const casesDataTypeSelectControls: Array<MapDataTypeSelectData> = [
    {
      value: CasesDataTypes.Daily,
      text: CasesDataTypes.Daily,
      isLoaded: !!dailyCasesInformationDataObject,
    },
    {
      value: CasesDataTypes.Weekly,
      text: CasesDataTypes.Weekly,
      isLoaded: !!weeklyCasesInformationDataObject,
    },
    // {
    //   value: CasesDataTypes.Monthly,
    //   text: CasesDataTypes.Monthly,
    //   isLoaded: !!monthlyCasesInformationDataObject,
    // },
    // {
    //   value: CasesDataTypes.Yearly,
    //   text: CasesDataTypes.Yearly,
    //   isLoaded: !!yearlyCasesInformationDataObject,
    // },
    {
      value: CasesDataTypes.Total,
      text: CasesDataTypes.Total,
      isLoaded: !!casesDataObject,
    },
  ];

  return (
    <div className={classes.root}>
      <BreadcrumbsControl dataTree={dataTree} handleChange={handleBreadCrumbsRegionChange} value={esriMapRegion}/>
      <div className={classes.map}>
        <ESRIMap mapPolygons={mapPolygons} caseType={caseType} date={date} initialBaseMap={"streets"} mapRegionUpdateGeometry={mapRegionUpdateGeometry} breadcrumbsRegionUpdateGeometry={breadcrumbsRegionUpdateGeometry} casesDataType={casesDataType} dailyCasesInformationDataObject={dailyCasesInformationDataObject} weeklyCasesInformationDataObject={weeklyCasesInformationDataObject} monthlyCasesInformationDataObject={monthlyCasesInformationDataObject} yearlyCasesInformationDataObject={yearlyCasesInformationDataObject} width={width} handleUpdateStart={handleMapUpdateStart} handleUpdateComplete={handleMapUpdateComplete} handleRegionChange={handleEsriMapRegionChange}/>
      </div>
      <div className={classes.informationSelectWrapper}>
        <div className={classes.selectWrapper}>
          <MapDataTypeSelect initialValue={CasesDataTypes.Total} label={"Time Range"} data={casesDataTypeSelectControls} handleSelectionChange={handleCasesDataTypeChange} handlePreloadClick={handlePreloadClick}/>
        </div>
        <div className={classes.informationWrapper}>
          <MapPageInformation date={date} casesData={casesData} caseType={caseType} countryCode={countryCode} regionName={regionName} casesDataType={casesDataType} dailyCasesInformationDataObject={dailyCasesInformationDataObject} weeklyCasesInformationDataObject={weeklyCasesInformationDataObject} monthlyCasesInformationDataObject={monthlyCasesInformationDataObject} yearlyCasesInformationDataObject={yearlyCasesInformationDataObject}/>
        </div>
      </div>
      <SliderControl values={dateValues} handleChange={handleDateChange}/>
    </div>
  );
};

export default MapPage;

