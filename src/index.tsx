import {
  ApolloClient, ApolloProvider, InMemoryCache,
} from '@apollo/client';
import Amplify from 'aws-amplify';
import { ThemeProvider } from 'helpmycase-storybook/dist/components/External';
import theme from 'helpmycase-storybook/dist/theme/theme';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import amplifyConfiguration from './awsexports';
import './index.css';
import reportWebVitals from './reportWebVitals';
import history from './utils/routes/history';

Amplify.configure(amplifyConfiguration);

const client = new ApolloClient({
  uri: 'localhost:8080/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <App />
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
