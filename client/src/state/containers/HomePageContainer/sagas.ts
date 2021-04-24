import {call, put, select, takeEvery, all, delay} from "redux-saga/effects";
import {HomePageActionTypes} from "./types";
import {HomePageInitAction} from "./actions";
import {Store} from "../../store";
import {AppActionTypes, AppState, Pages, SubPages} from "../../global/App/types";
import {getDefaultSubPage, getPageColorTheme, getUpdatedMenuItems} from "../../global/App/sagas";
import {NavigationDrawerMenuItem} from "../../../display/components/Navigation/NavigationDrawer/NavigationDrawer";

export const homePageSagas = {
  initSaga: takeEvery(HomePageActionTypes.INIT, initSaga),
}

function * initSaga(action: HomePageInitAction): any {
  const appState: AppState = yield select(getAppStateSelector);

  const defaultSubPage: SubPages = getDefaultSubPage(Pages.HOME);
  yield put({
    type: AppActionTypes.SET_PAGE,
    page: Pages.HOME,
    subPage: defaultSubPage,
  });
  yield put({
    type: AppActionTypes.SET_THEME,
    theme: getPageColorTheme(Pages.HOME, appState.theme),
  });
  const newMenuItems: Array<NavigationDrawerMenuItem> = getUpdatedMenuItems(Pages.HOME, defaultSubPage, appState.menuItems);
  yield put({
    type: AppActionTypes.SET_MENU_ITEMS,
    menuItems: newMenuItems,
  });
  
  yield put({
    type: HomePageActionTypes.SET_INIT_COMPLETE,
    initComplete: true,
  });
}

function getAppStateSelector(store: Store): AppState {
  return store.app;
}

export default homePageSagas;