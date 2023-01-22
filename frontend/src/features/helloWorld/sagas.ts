import { put, takeLatest, call, delay, spawn } from 'redux-saga/effects';

import * as actions from './actions';
import { SLOW_DOWN_IN_MS } from './config';
import * as slicesActions from './slices';
import {
  HelloWorldNetworkType,
  IHelloWorldAPI,
  LoadingStatusType,
  SET_MESSAGE_ERROR,
  SET_MESSAGE_STATE,
} from './types';

// ACTION EFFECTS
export function* ActionEffectLoadContract(helloWorldApi: IHelloWorldAPI) {
  try {
    const initResult: boolean = yield call(helloWorldApi.init);
    if (initResult) {
      const network: HelloWorldNetworkType | null = helloWorldApi.getNetwork();
      if (network === null) {
        throw Error('network is null');
      }
      yield put(slicesActions.setNetwork(network));
      const isContractLoaded: boolean = yield call(helloWorldApi.initContract);
      yield put(slicesActions.setIsContractLoaded(isContractLoaded));
    } else {
      throw Error('not initialized');
    }
  } catch (error) {
    yield put(slicesActions.setNetwork(null));
    yield put(slicesActions.setIsContractLoaded(false));
  }
}

export function* ActionEffectGetMessage(helloWorldApi: IHelloWorldAPI) {
  yield put(slicesActions.reset());
  yield call(HandleGetMessage, helloWorldApi);
}

export function* ActionEffectSetMessage(
  helloWorldApi: IHelloWorldAPI,
  action: ReturnType<typeof actions.setMessage>
) {
  yield put(slicesActions.reset());
  yield put(slicesActions.setMessageOpLoading(LoadingStatusType.PENDING));
  yield put(slicesActions.setMessageOpState(SET_MESSAGE_STATE.REQUESTED));
  yield call(HandleSetMessageRequest, helloWorldApi, action.payload);
  yield put(slicesActions.setMessageOpLoading(LoadingStatusType.IDLE));
}

// Handlers
export function* HandleGetMessage(helloWorldApi: IHelloWorldAPI) {
  try {
    yield put(slicesActions.setMessageLoading(LoadingStatusType.PENDING));
    yield call(SlowDown, SLOW_DOWN_IN_MS);
    const message: string = yield call(helloWorldApi.getMessage);
    console.log(message);
    yield put(slicesActions.setMessageData(message));
  } catch (error) {
    console.debug(error);
    yield put(slicesActions.setMessageError((error as Error).message));
  } finally {
    yield put(slicesActions.setMessageLoading(LoadingStatusType.IDLE));
  }
}

export function* HandleSetMessageRequest(
  helloWorldApi: IHelloWorldAPI,
  message: string
) {
  try {
    const setMessageResult: true | SET_MESSAGE_ERROR | undefined = yield call(
      helloWorldApi.setMessage,
      message
    );
    if (setMessageResult === true) {
      yield put(slicesActions.setMessageOpState(SET_MESSAGE_STATE.SUCCESS));
      yield spawn(HandleGetMessage, helloWorldApi);
    } else {
      yield put(slicesActions.setMessageOpState(SET_MESSAGE_STATE.FAILURE));
      yield put(
        slicesActions.setMessageOpError(
          setMessageResult ?? SET_MESSAGE_ERROR.UNDEFINED
        )
      );
    }
  } catch (error: any) {
    yield put(slicesActions.setMessageOpState(SET_MESSAGE_STATE.FAILURE));
    yield put(slicesActions.setMessageOpError(SET_MESSAGE_ERROR.GENERIC));
  }
}

// helpers
function* SlowDown(ms: number) {
  yield delay(ms);
}

// WATCHERS
export function* watchHelloWorldSaga(helloWorldApi: IHelloWorldAPI) {
  //yield takeLatest(actions.resetOps.type, ActionEffectResetOps);
  yield takeLatest(
    actions.getMessage.type,
    ActionEffectGetMessage,
    helloWorldApi
  );
  yield takeLatest(
    actions.setMessage.type,
    ActionEffectSetMessage,
    helloWorldApi
  );
}

export function* watchAuthenticationAnnouncementsForHelloWorldSaga(
  helloWorldApi: IHelloWorldAPI,
  action: string
) {
  yield takeLatest(action, ActionEffectLoadContract, helloWorldApi);
}
