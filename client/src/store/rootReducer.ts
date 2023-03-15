import { combineReducers } from '@reduxjs/toolkit';

import { helloWorldReducer } from '../features/helloWorld/slices';
import { walletReducer } from '../features/wallet/slice';

export default combineReducers({
  wallet: walletReducer,
  helloWorld: helloWorldReducer,
});
