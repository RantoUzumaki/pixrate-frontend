import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout(props) {
  const Router = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userLoggedInDetails');
    props.logval(false);
    Router('/');
  });

	return null
}
