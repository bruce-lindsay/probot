"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_enterprise_compatibility_1 = require("@octokit/plugin-enterprise-compatibility");
var plugin_retry_1 = require("@octokit/plugin-retry");
var plugin_throttling_1 = require("@octokit/plugin-throttling");
var rest_1 = __importDefault(require("@octokit/rest"));
var graphql_1 = require("./graphql");
var logging_1 = require("./logging");
var pagination_1 = require("./pagination");
exports.ProbotOctokit = rest_1.default
    .plugin([plugin_throttling_1.throttling, plugin_retry_1.retry, plugin_enterprise_compatibility_1.enterpriseCompatibility]);
/**
 * the [@octokit/rest Node.js module](https://github.com/octokit/rest.js),
 * which wraps the [GitHub API](https://developer.github.com/v3/) and allows
 * you to do almost anything programmatically that you can do through a web
 * browser.
 * @see {@link https://github.com/octokit/rest.js}
 */
function GitHubAPI(options) {
    if (options === void 0) { options = { Octokit: exports.ProbotOctokit }; }
    var octokit = new options.Octokit(Object.assign(options, {
        throttle: Object.assign({
            onAbuseLimit: function (retryAfter) {
                options.logger.warn("Abuse limit hit, retrying in " + retryAfter + " seconds");
                return true;
            },
            onRateLimit: function (retryAfter) {
                options.logger.warn("Rate limit hit, retrying in " + retryAfter + " seconds");
                return true;
            }
        }, options.throttle)
    }));
    pagination_1.addPagination(octokit);
    logging_1.addLogging(octokit, options.logger);
    graphql_1.addGraphQL(octokit);
    return octokit;
}
exports.GitHubAPI = GitHubAPI;
//# sourceMappingURL=index.js.map