import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  HelloWorldNetworkType,
  HelloWorldStoreState,
  LoadingStatusType,
  SET_MESSAGE_ERROR,
  SET_MESSAGE_STATE,
} from './types';

export const initialState = Object.freeze({
  network: null,
  isContractLoaded: false,
  message: {
    loading: LoadingStatusType.IDLE,
    data: null,
    error: null,
  },
  setMessageOperation: {
    loading: LoadingStatusType.IDLE,
    opState: SET_MESSAGE_STATE.IDLE,
    errors: [],
  },
}) as HelloWorldStoreState;

const helloWorld = createSlice({
  name: 'helloWorld',
  initialState: initialState,
  reducers: {
    // network and contract
    setNetwork: (
      state,
      { payload }: PayloadAction<HelloWorldNetworkType | null>
    ) => {
      state.network = payload;
    },
    setIsContractLoaded: (state, { payload }: PayloadAction<boolean>) => {
      state.isContractLoaded = payload;
    },

    // message
    setMessageLoading: (
      state,
      { payload }: PayloadAction<LoadingStatusType>
    ) => {
      state.message.loading = payload;
    },

    setMessageData: (state, { payload }: PayloadAction<string>) => {
      state.message.data = payload;
    },

    setMessageError: (state, { payload }: PayloadAction<string>) => {
      state.message.error = payload;
    },

    // setMessage OP
    setMessageOpLoading: (
      state,
      { payload }: PayloadAction<LoadingStatusType>
    ) => {
      state.setMessageOperation.loading = payload;
    },

    setMessageOpState: (
      state,
      { payload }: PayloadAction<SET_MESSAGE_STATE>
    ) => {
      state.setMessageOperation.opState = payload;
    },

    setMessageOpError: (
      state,
      { payload }: PayloadAction<SET_MESSAGE_ERROR>
    ) => {
      state.setMessageOperation.errors.push(payload);
    },

    // RESET
    reset: state => {
      state.message = initialState.message;
      state.setMessageOperation = initialState.setMessageOperation;
    },
  },
});

export const {
  setNetwork,
  setIsContractLoaded,
  setMessageLoading,
  setMessageData,
  setMessageError,
  setMessageOpLoading,
  setMessageOpState,
  setMessageOpError,
  reset,
} = helloWorld.actions;

export const helloWorldReducer = helloWorld.reducer;
