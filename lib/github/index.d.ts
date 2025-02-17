import { graphql } from '@octokit/graphql';
import Octokit from '@octokit/rest';
import { Logger } from './logging';
export declare const ProbotOctokit: Octokit.Static;
/**
 * the [@octokit/rest Node.js module](https://github.com/octokit/rest.js),
 * which wraps the [GitHub API](https://developer.github.com/v3/) and allows
 * you to do almost anything programmatically that you can do through a web
 * browser.
 * @see {@link https://github.com/octokit/rest.js}
 */
export declare function GitHubAPI(options?: Options): GitHubAPI;
export interface Options extends Octokit.Options {
    debug?: boolean;
    logger: Logger;
    Octokit: Octokit.Static;
}
export interface RequestOptions {
    baseUrl?: string;
    method?: string;
    url?: string;
    headers?: any;
    query?: string;
    variables?: Variables;
    data?: any;
}
export interface Result {
    headers: {
        status: string;
    };
}
export interface OctokitError extends Error {
    status: number;
}
interface Paginate extends Octokit.Paginate {
    (responsePromise: Promise<Octokit.AnyResponse>, callback?: (response: Octokit.AnyResponse, done: () => void) => any): Promise<any[]>;
}
declare type Graphql = (query: string, variables?: Variables, headers?: Headers) => ReturnType<typeof graphql>;
export interface GitHubAPI extends Octokit {
    paginate: Paginate;
    graphql: Graphql;
    /**
     * @deprecated `.query()` is deprecated, use `.graphql()` instead
     */
    query: Graphql;
}
export interface GraphQlQueryResponse {
    data: {
        [key: string]: any;
    } | null;
    errors?: [{
        message: string;
        path: [string];
        extensions: {
            [key: string]: any;
        };
        locations: [{
            line: number;
            column: number;
        }];
    }];
}
export interface Headers {
    [key: string]: string;
}
export interface Variables {
    [key: string]: any;
}
export { GraphQLError } from './graphql';
