import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import saga from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import {
  watchHelloWorldSaga,
  watchAuthenticationAnnouncementsForHelloWorldSaga,
} from '../features/helloWorld/sagas';
import { announceWalletLoaded } from '../features/wallet/models/account/actions';
import { watchWalletSaga } from '../features/wallet/sagas';
import { EthersHelloWorldAPI } from '../services/Ethers/HelloWorldAPI/HelloWorldAPI';
import { EthersWalletAPI } from '../services/Ethers/WalletAPI/EthersWalletAPI';

import RootReducer from './rootReducer';

enableMapSet();

const ethersWalletApi = EthersWalletAPI.getInstance();
const helloWorldApi = EthersHelloWorldAPI.getInstance(ethersWalletApi);

function* RootSaga() {
  yield all([
    fork(watchWalletSaga, ethersWalletApi),
    fork(watchHelloWorldSaga, helloWorldApi),
    fork(
      watchAuthenticationAnnouncementsForHelloWorldSaga,
      helloWorldApi,
      announceWalletLoaded.type
    ),
  ]);
}

const sagaMiddleware = saga();

const store = configureStore({
  reducer: RootReducer,
  middleware: [sagaMiddleware],
  devTools: process.env.NODE_ENV === 'development',
});

sagaMiddleware.run(RootSaga);

export type RootState = ReturnType<typeof store.getState>;

export default store;
