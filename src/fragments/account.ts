import { gql } from '@apollo/client';

export const CORE_ACCOUNT_DETAILS = gql`
    fragment AccountDetails on Account {
        id
        name,
        permissions {
            id,
            name
        },
        createdDate,
    }
`;

const fragments = {
  CORE_ACCOUNT_DETAILS,
};

export default fragments;
