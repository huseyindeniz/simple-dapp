import { createAction } from '@reduxjs/toolkit';

import { SetMessageRequest } from './types';

export const getMessage = createAction('GET_MESSAGE');

export const setMessage = createAction<SetMessageRequest>('SET_MESSAGE');
