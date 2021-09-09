import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import Navigation from '../../components/templates/Navigation';
import { GET_ACCOUNT } from '../../queries/account';
import history from '../../utils/routes/history';
import routes from '../../utils/routes/routes';
import useAuth from '../Auth/useAuth';

const Dashboard: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { accountId: '1' },
  });
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const redirectToLogin = async () => {
    const response = await isLoggedIn();
    if (!response) {
      history.push('/auth/login');
    }
  };

  useEffect(() => {
    redirectToLogin();
  }, [location.pathname]);

  return (
    <Route path={[routes.dashboard, routes.base]}>
      <Navigation />
    </Route>
  );
};

export default Dashboard;
