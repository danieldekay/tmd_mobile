import { apiBaseUrl } from './tmd';

/** GraphQL endpoint derived from the WordPress root of the API base URL */
export const graphqlUrl: string = `${new URL(apiBaseUrl).origin}/graphql`;

export const LOGIN_MUTATION = `
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      authToken
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshAuthToken($input: RefreshJwtAuthTokenInput!) {
    refreshJwtAuthToken(input: $input) {
      authToken
    }
  }
`;
