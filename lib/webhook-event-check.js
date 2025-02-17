"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var appMeta = null;
var didFailRetrievingAppMeta = false;
/**
 * Check if an application is subscribed to an event.
 *
 * @returns Returns `false` if the app is not subscribed to an event. Otherwise,
 * returns `true`. Returns `undefined` if the webhook-event-check feature is
 * disabled or if Probot failed to retrieve the GitHub App's metadata.
 */
function webhookEventCheck(app, eventName) {
    return __awaiter(this, void 0, void 0, function () {
        var baseEventName, userFriendlyBaseEventName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isWebhookEventCheckEnabled() === false) {
                        return [2 /*return*/];
                    }
                    baseEventName = eventName.split('.')[0];
                    return [4 /*yield*/, isSubscribedToEvent(app, baseEventName)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/, true];
                    }
                    else if (didFailRetrievingAppMeta === false) {
                        userFriendlyBaseEventName = baseEventName.split('_').join(' ');
                        app.log.error("Your app is attempting to listen to \"" + eventName + "\", but your GitHub App is not subscribed to the \"" + userFriendlyBaseEventName + "\" event.");
                    }
                    return [2 /*return*/, didFailRetrievingAppMeta ? undefined : false];
            }
        });
    });
}
/**
 * @param {string} baseEventName The base event name refers to the part before
 * the first period mark (e.g. the `issues` part in `issues.opened`).
 * @returns Returns `false` when the application is not subscribed to a webhook
 * event. Otherwise, returns `true`. Returns `undefined` if Probot failed to
 * retrieve GitHub App metadata.
 *
 * **Note**: Probot will only check against a list of events known to be in the
 * `GET /app` response. Therefore, only the `false` value should be considered
 * truthy.
 */
function isSubscribedToEvent(app, baseEventName) {
    return __awaiter(this, void 0, void 0, function () {
        var knownBaseEvents, eventMayExistInAppResponse, events, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    knownBaseEvents = [
                        'check_run',
                        'check_suite',
                        'commit_comment',
                        'content_reference',
                        'create',
                        'delete',
                        'deployment',
                        'deployment_status',
                        'deploy_key',
                        'fork',
                        'gollum',
                        'issues',
                        'issue_comment',
                        'label',
                        'member',
                        'membership',
                        'milestone',
                        'organization',
                        'org_block',
                        'page_build',
                        'project',
                        'project_card',
                        'project_column',
                        'public',
                        'pull_request',
                        'pull_request_review',
                        'pull_request_review_comment',
                        'push',
                        'release',
                        'repository',
                        'repository_dispatch',
                        'star',
                        'status',
                        'team',
                        'team_add',
                        'watch'
                    ];
                    eventMayExistInAppResponse = knownBaseEvents.includes(baseEventName);
                    if (!eventMayExistInAppResponse) {
                        return [2 /*return*/, true];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, retrieveAppMeta(app)];
                case 2:
                    events = (_a.sent()).data.events;
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    if (!didFailRetrievingAppMeta) {
                        app.log.warn(e_1);
                    }
                    didFailRetrievingAppMeta = true;
                    return [2 /*return*/];
                case 4: return [2 /*return*/, events.includes(baseEventName)];
            }
        });
    });
}
function retrieveAppMeta(app) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (appMeta)
                return [2 /*return*/, appMeta];
            appMeta = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var api, meta, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, app.auth()];
                        case 1:
                            api = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, api.apps.getAuthenticated()];
                        case 3:
                            meta = _a.sent();
                            return [2 /*return*/, resolve(meta)];
                        case 4:
                            e_2 = _a.sent();
                            app.log.trace(e_2);
                            /**
                             * There are a few reasons why Probot might be unable to retrieve
                             * application metadata.
                             *
                             * - Probot may not be connected to the Internet.
                             * - The GitHub API is not responding to requests (see
                             *   https://www.githubstatus.com/).
                             * - The user has incorrectly configured environment variables (e.g.
                             *   APP_ID, PRIVATE_KEY, etc.) used for authentication between the Probot
                             *   app and the GitHub API.
                             */
                            return [2 /*return*/, reject([
                                    'Probot is unable to retrieve app information from GitHub for event subscription verification.',
                                    '',
                                    'If this error persists, feel free to raise an issue at:',
                                    '  - https://github.com/probot/probot/issues'
                                ].join('\n'))];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, appMeta];
        });
    });
}
function isWebhookEventCheckEnabled() {
    if (process.env.DISABLE_WEBHOOK_EVENT_CHECK && process.env.DISABLE_WEBHOOK_EVENT_CHECK.toLowerCase() === 'true') {
        return false;
    }
    else if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') {
        return false;
    }
    return true;
}
exports.default = webhookEventCheck;
/**
 * A helper function used in testing that resets the cached result of /app.
 */
function clearCache() {
    appMeta = null;
    didFailRetrievingAppMeta = false;
}
exports.clearCache = clearCache;
//# sourceMappingURL=webhook-event-check.js.map