import { bindActionCreators } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { getMessage, setMessage } from './actions';

const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(
    {
      getMessage,
      setMessage,
    },
    dispatch
  );
};

export default useActions;
