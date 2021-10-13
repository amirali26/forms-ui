import { createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { Auth } from 'aws-amplify';

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = (await Auth.currentSession()).getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
    );
  },
  authLink.concat(createHttpLink({ uri: 'http://localhost:8081/graphql' })),
);

export default splitLink;
