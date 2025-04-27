import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../../Redux/UserSlice';
import { useDispatch } from 'react-redux';

const GoogleSuccess = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    // Get the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const name = queryParams.get('name');
    const email = queryParams.get('email')?.trim();  // Trim any extra spaces/newlines
    const role = queryParams.get('role');
    const userId = queryParams.get('_id') || '';  // You can pass userId from your backend

    if (token) {
      // Prepare user data in the required structure
      const userData = {
        token: token,
        user: {
          _id: userId,
          username: name,
          email: email,
          user_role: role,
        }
      };

      dispatch(signInSuccess((userData)));
      navigate('/summarize')


    } else {
    }
  }, []);
  return (
    <><div></div></>
  )

};

export default GoogleSuccess;
