import environmentVars from './env.variables';

const awsExports = {
  Auth: {
    userPoolId: environmentVars.REACT_APP_COGNITO.poolId,
    userPoolWebClientId: environmentVars.REACT_APP_COGNITO.clientId,
    storage: environmentVars.REACT_APP_COGNITO.storage,
  },
};

export default awsExports;
