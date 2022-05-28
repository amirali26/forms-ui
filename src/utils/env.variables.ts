/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const env = require(`../config.${process.env.REACT_APP_ENV}.json`);

interface EnvironmentConfig {
  REACT_APP_API_URL: string;
}
// Default is development
const environmentVars: EnvironmentConfig = {
  REACT_APP_API_URL: env.url,
};

export default environmentVars;
