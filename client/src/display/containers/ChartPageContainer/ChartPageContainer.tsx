import React, {useEffect, useState} from "react";
import ChartPage from "../../pages/ChartPage";
import {AppState, CasesTypes, ChartSubPages} from "../../../state/global/App/types";
import {Store} from "../../../state/store";
import {Dispatch} from "redux";
import {AppAction} from "../../../state/global/App/actions";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {ChartPageActionTypes, ChartPageState} from "../../../state/containers/ChartPageContainer/types";
import {ChartPageAction} from "../../../state/containers/ChartPageContainer/actions";

export type ChartPageContainerProps = ChartPageContainerDataProps & ChartPageContainerStyleProps & ChartPageContainerEventProps;

export interface ChartPageContainerDataProps {

}

export interface ChartPageContainerStyleProps {

}

export interface ChartPageContainerEventProps {

}

const ChartPageContainer: React.FC<ChartPageContainerProps> = (props) => {
  const appState: AppState = useSelector<Store, AppState>(store => store.app, shallowEqual);
  const appDispatch: Dispatch<AppAction> = useDispatch<Dispatch<AppAction>>();
  const chartPageState: ChartPageState = useSelector<Store, ChartPageState>(store => store.chartPage, shallowEqual);
  const chartPageDispatch: Dispatch<ChartPageAction> = useDispatch<Dispatch<ChartPageAction>>();

  useEffect(() => {
    if (!!appState.casesDataObject) {
      chartPageDispatch({
        type: ChartPageActionTypes.INIT,
      });
    }
  }, []);

  const [region, setRegion] = useState<string>("World");

  const handleBreadcrumbsRegionChange = (hierarchicalName: string): void => {
    setRegion(hierarchicalName);
    // chartPageDispatch({
    //   type: ChartPageActionTypes.HANDLE_BREADCRUMBS_REGION_CHANGE,
    //   hierarchicalName: hierarchicalName,
    // });
  };

  const chartSubPage: ChartSubPages = appState.subPage as ChartSubPages;

  const getCaseType = (chartSubPage: ChartSubPages): CasesTypes => {
    switch (chartSubPage) {
      case ChartSubPages.CASES: {
        return CasesTypes.CASES;
      }
      case ChartSubPages.DEATHS: {
        return CasesTypes.DEATHS;
      }
      case ChartSubPages.RECOVERIES: {
        return CasesTypes.RECOVERIES;
      }
    }
  }

  if (!!appState.casesDataObject) {
    return (
      <ChartPage dataTree={appState.dataTree} region={region} casesDataObject={appState.casesDataObject} dailyCasesInformationDataObject={appState.dailyCasesInformationDataObject} weeklyCasesInformationDataObject={appState.weeklyCasesInformationDataObject} monthlyCasesInformationDataObject={appState.monthlyCasesInformationDataObject} yearlyCasesInformationDataObject={appState.yearlyCasesInformationDataObject} caseType={getCaseType(chartSubPage)} handleBreadCrumbsRegionChange={handleBreadcrumbsRegionChange}/>
    );
  } else {
    return null;
  }
};

export default ChartPageContainer;

