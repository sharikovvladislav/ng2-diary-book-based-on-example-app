import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';

import * as fromRoot from '../reducers';

import * as friendsActions from '../actions/friends';
import * as spinnerActions from '../actions/layout';
import * as diaryActions from '../actions/diary-entries';
import { FriendsService } from '../services/friends';
import { DiaryEntry } from '../models/diary-entry';

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application.
 * The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * Documentation on `toPayload` can be found here:
 * https://github.com/ngrx/effects/blob/master/docs/api.md#topayload
 *
 * If you are unfamiliar with the operators being used in these examples, please
 * check out the sources below:
 *
 * Official Docs: http://reactivex.io/rxjs/manual/overview.html#categories-of-operators
 * RxJS 5 Operators By Example: https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35
 */

@Injectable()
export class SpinnerEffects {

  @Effect()
  showSpinner$: Observable<Action> = this.actions$
    .ofType(diaryActions.LOAD_LIST)
    .mapTo(new spinnerActions.ShowSpinnerAction());

  @Effect()
  hideSpinner$: Observable<Action> = this.actions$
    .ofType(diaryActions.LOAD_LIST_SUCCESS, diaryActions.LOAD_LIST_FAILURE)
    .mapTo(new spinnerActions.HideSpinnerAction());

  constructor(
      private actions$: Actions,
      private store: Store<fromRoot.State>,
    ) {
  }

}