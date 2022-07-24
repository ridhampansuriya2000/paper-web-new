import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../auth/store/userSlice';

const Logout = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(logoutUser())
  }, [])
  return null
}

export default Logout;