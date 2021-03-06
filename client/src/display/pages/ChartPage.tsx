import React, {useState} from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import BreadcrumbsControl from "../components/BreadcrumbsControl/BreadcrumbsControl";
import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import ChartPageLineChart from "../components/ChartPageLineChart/ChartPageLineChart";
import {CasesDataObject, CasesInformationDataObject} from "../../../../shared/types/data/Cases/CasesTypes";
import {ChartUtils} from "../../helper/ChartUtils";
import {CasesDataTypes, CasesTypes} from "../../state/global/App/types";
import getChartPageLineChartDataPropsFromCasesDataObject = ChartUtils.getChartPageLineChartDataPropsFromCasesDataObject;
import getChartPageLineChartDataPropsFromDailyCasesInformationDataObject = ChartUtils.getChartPageLineChartDataPropsFromDailyCasesInformationDataObject;

export type ChartPageProps = ChartPageDataProps & ChartPageStyleProps & ChartPageEventProps;

export interface ChartPageDataProps {
  dataTree: TreeItem;
  region: string;
  caseType: CasesTypes;
  countryCode: string;
  casesDataObject: CasesDataObject;
  dailyCasesInformationDataObject: CasesInformationDataObject;
  weeklyCasesInformationDataObject: CasesInformationDataObject;
  monthlyCasesInformationDataObject: CasesInformationDataObject;
  yearlyCasesInformationDataObject: CasesInformationDataObject;
}

export interface ChartPageStyleProps {

}

export interface ChartPageEventProps {
  handleBreadCrumbsRegionChange(hierarchicalName: string): void;
  handlePreloadClick(value: string): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    lineChartWrapper: {
      [theme.breakpoints.up("xs")]: {
        height: "calc(100% - 27px)",
      },
      [theme.breakpoints.up("sm")]: {
        height: "calc(100% - 30px)",
      },
      [theme.breakpoints.up("md")]: {
        height: "calc(100% - 36px)",
      },
      [theme.breakpoints.up("lg")]: {
        height: "calc(100% - 42px)",
      },
    },
  }),
);

const ChartPage: React.FC<ChartPageProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    dataTree,
    region,
    caseType,
    casesDataObject,
    countryCode,
    dailyCasesInformationDataObject,
    handleBreadCrumbsRegionChange,
    handlePreloadClick,
  } = props;

  const [casesDataType, setCasesDataType] = useState<CasesDataTypes>(CasesDataTypes.Total);

  const handleCasesDataTypeChange = (value: string): void => {
    setCasesDataType(value as CasesDataTypes);
  };

  return (
    <div className={classes.root}>
      <BreadcrumbsControl dataTree={dataTree} handleChange={handleBreadCrumbsRegionChange} value={region}/>
      <div className={classes.lineChartWrapper}>
        <ChartPageLineChart chartData={casesDataType === CasesDataTypes.Total ? getChartPageLineChartDataPropsFromCasesDataObject(casesDataObject, region, caseType, countryCode) : getChartPageLineChartDataPropsFromDailyCasesInformationDataObject(dailyCasesInformationDataObject, region, caseType, countryCode)} casesDataType={casesDataType} casesDataObject={casesDataObject} dailyCasesInformationDataObject={dailyCasesInformationDataObject} handleSelectionChange={handleCasesDataTypeChange} handlePreloadClick={handlePreloadClick}/>
      </div>
    </div>
  );
};

export default ChartPage;

