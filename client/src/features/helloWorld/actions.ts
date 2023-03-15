import { createAction } from '@reduxjs/toolkit';

export const getMessage = createAction('GET_MESSAGE');

export const setMessage = createAction<string>('SET_MESSAGE');
