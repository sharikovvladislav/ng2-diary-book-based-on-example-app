import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Params, RouterStateSnapshot } from '@angular/router';
import {
  routerReducer,
  RouterReducerState,
  RouterStateSerializer,
} from '@ngrx/router-store';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromLayout from '../core/reducers/layout';
import * as fromUser from '../core/reducers/user';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  layout: fromLayout.State;
  user: fromUser.State;
  routerReducer: RouterReducerState<RouterStateUrl>;
}

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;

    // Only return an object including the URL and query params
    // instead of the entire snapshot
    return { url, queryParams };
  }
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  layout: fromLayout.reducer,
  user: fromUser.reducer,
  routerReducer: routerReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<any, any> {
  return function(state: State, action: any): State {
    // console.log('state', state);
    // console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: ActionReducer<any, any>[] = !environment.production
  ? [logger]
  : [];

/**
 * Layout Reducers
 */
export const getLayoutState = createFeatureSelector<fromLayout.State>('layout');

export const getShowSidenav = createSelector(
  getLayoutState,
  fromLayout.getShowSidenav,
);
export const getIsSpinnerShown = createSelector(
  getLayoutState,
  fromLayout.getIsSpinnerShown,
);

export const getUserState = createFeatureSelector<fromUser.State>('user');

export const getUserIsLoggedIn = createSelector(
  getUserState,
  fromUser.isLoggedIn,
);

export const getUserUid = createSelector(getUserState, fromUser.getUid);
export const getDisplayName = createSelector(
  getUserState,
  fromUser.getDisplayName,
);
export const getPhotoURL = createSelector(getUserState, fromUser.getPhotoURL);
export const getUser = createSelector(getUserState, fromUser.getUser);
export const getUserToken = createSelector(getUserState, fromUser.getToken);
