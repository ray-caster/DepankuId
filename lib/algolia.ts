import algoliasearch from 'algoliasearch/lite';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '';

export const searchClient = algoliasearch(appId, searchApiKey);

export const ALGOLIA_INDEX_NAME = 'opportunities';

