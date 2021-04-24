import {HomePageState} from "./types";
import {HomePageAction} from "./actions";

export const initialState: HomePageState = {
  initComplete: false,
};

export const reducer = (state: HomePageState = initialState, action: HomePageAction): HomePageState => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};