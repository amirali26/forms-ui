interface CognitoConfig {
    poolId: string;
    clientId: string;
    storage: Storage;
}

interface EnvironmentConfig {
    REACT_APP_API_URL: string;
}

// Default is development
// eslint-disable-next-line import/no-mutable-exports
let environmentVars: EnvironmentConfig = {
  REACT_APP_API_URL: 'http://localhost:8080/graphql',
};

if (window.location.href.startsWith('https://solicitor.helpmycase.co.uk')) {
  // Default is development
  environmentVars = {
    REACT_APP_API_URL: 'https://dashboard-api.helpmycase.co.uk/graphql',
  };
}

export default environmentVars;
