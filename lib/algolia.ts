import algoliasearch from 'algoliasearch/lite';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '';

// Industry standard: Validate critical environment variables at build time
if (typeof window === 'undefined' && (!appId || !searchApiKey)) {
    console.warn('⚠️  Algolia credentials missing. Search functionality will be disabled.');
    console.warn('   Set NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY in your .env.local file');
}

// Industry standard: Create a noop client if credentials are missing (graceful degradation)
export const searchClient = appId && searchApiKey 
    ? algoliasearch(appId, searchApiKey)
    : {
        search: () => Promise.resolve({ results: [{ hits: [], nbHits: 0, page: 0, nbPages: 0, hitsPerPage: 20 }] }),
        searchForFacetValues: () => Promise.resolve([]),
        // Add other methods as needed for compatibility
    } as any;

export const ALGOLIA_INDEX_NAME = 'opportunities';

// Industry standard: Export flag to check if search is available
export const isAlgoliaConfigured = Boolean(appId && searchApiKey);

