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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line: no-var-requires
require('dotenv').config();
var app_1 = require("@octokit/app");
var rest_1 = __importDefault(require("@octokit/rest"));
exports.Octokit = rest_1.default;
var webhooks_1 = __importDefault(require("@octokit/webhooks"));
var bottleneck_1 = __importDefault(require("bottleneck"));
var bunyan_sfdx_no_dtrace_1 = __importDefault(require("bunyan-sfdx-no-dtrace"));
exports.Logger = bunyan_sfdx_no_dtrace_1.default;
var ioredis_1 = __importDefault(require("ioredis"));
var application_1 = require("./application");
exports.Application = application_1.Application;
var setup_1 = __importDefault(require("./apps/setup"));
var cache_1 = require("./cache");
var context_1 = require("./context");
exports.Context = context_1.Context;
var github_1 = require("./github");
var logger_1 = require("./logger");
var log_request_errors_1 = require("./middleware/log-request-errors");
var private_key_1 = require("./private-key");
var resolver_1 = require("./resolver");
var server_1 = require("./server");
var webhook_proxy_1 = require("./webhook-proxy");
var cache = cache_1.createDefaultCache();
// tslint:disable:no-var-requires
var defaultAppFns = [
    require('./apps/default'),
    require('./apps/sentry'),
    require('./apps/stats')
];
// tslint:enable:no-var-requires
var Probot = /** @class */ (function () {
    function Probot(options) {
        var _this = this;
        options.webhookPath = options.webhookPath || '/';
        options.secret = options.secret || 'development';
        this.options = options;
        this.logger = logger_1.logger;
        this.apps = [];
        this.webhook = new webhooks_1.default({
            path: options.webhookPath,
            secret: options.secret
        });
        this.githubToken = options.githubToken;
        this.Octokit = options.Octokit || github_1.ProbotOctokit;
        if (this.options.id) {
            if (process.env.GHE_HOST && /^https?:\/\//.test(process.env.GHE_HOST)) {
                throw new Error('Your \`GHE_HOST\` environment variable should not begin with https:// or http://');
            }
            this.app = new app_1.App({
                baseUrl: process.env.GHE_HOST && (process.env.GHE_PROTOCOL || 'https') + "://" + process.env.GHE_HOST + "/api/v3",
                id: options.id,
                privateKey: options.cert
            });
        }
        var createExpress = options.createExpress || server_1.createServer;
        this.server = createExpress({ webhook: this.webhook.middleware, logger: logger_1.logger });
        // Log all received webhooks
        this.webhook.on('*', function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.receive(event)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Log all webhook errors
        this.webhook.on('error', this.errorHandler);
        if (options.redisConfig || process.env.REDIS_URL) {
            var client = void 0;
            if (options.redisConfig) {
                client = new ioredis_1.default(options.redisConfig);
            }
            else if (process.env.REDIS_URL) {
                client = new ioredis_1.default(process.env.REDIS_URL);
            }
            var connection = new bottleneck_1.default.IORedisConnection({ client: client });
            connection.on('error', this.logger.error);
            this.throttleOptions = {
                Bottleneck: bottleneck_1.default,
                connection: connection
            };
        }
    }
    Probot.run = function (appFn) {
        return __awaiter(this, void 0, void 0, function () {
            var pkgConf, program, readOptions, options, probot, pkg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pkgConf = require('pkg-conf');
                        program = require('commander');
                        readOptions = function () {
                            if (Array.isArray(appFn)) {
                                program
                                    .usage('[options] <apps...>')
                                    .option('-p, --port <n>', 'Port to start the server on', process.env.PORT || 3000)
                                    .option('-W, --webhook-proxy <url>', 'URL of the webhook proxy service.`', process.env.WEBHOOK_PROXY_URL)
                                    .option('-w, --webhook-path <path>', 'URL path which receives webhooks. Ex: `/webhook`', process.env.WEBHOOK_PATH)
                                    .option('-a, --app <id>', 'ID of the GitHub App', process.env.APP_ID)
                                    .option('-s, --secret <secret>', 'Webhook secret of the GitHub App', process.env.WEBHOOK_SECRET)
                                    .option('-P, --private-key <file>', 'Path to certificate of the GitHub App', process.env.PRIVATE_KEY_PATH)
                                    .parse(appFn);
                                return {
                                    cert: private_key_1.findPrivateKey(program.privateKey) || undefined,
                                    id: program.app,
                                    port: program.port,
                                    secret: program.secret,
                                    webhookPath: program.webhookPath,
                                    webhookProxy: program.webhookProxy
                                };
                            }
                            var privateKey = private_key_1.findPrivateKey();
                            return {
                                cert: (privateKey && privateKey.toString()) || undefined,
                                id: Number(process.env.APP_ID),
                                port: Number(process.env.PORT) || 3000,
                                secret: process.env.WEBHOOK_SECRET,
                                webhookPath: process.env.WEBHOOK_PATH,
                                webhookProxy: process.env.WEBHOOK_PROXY_URL
                            };
                        };
                        options = readOptions();
                        probot = new Probot(options);
                        if (!(!options.id || !options.cert)) return [3 /*break*/, 1];
                        if (process.env.NODE_ENV === 'production') {
                            if (!options.id) {
                                throw new Error('Application ID is missing, and is required to run in production mode. ' +
                                    'To resolve, ensure the APP_ID environment variable is set.');
                            }
                            else if (!options.cert) {
                                throw new Error('Certificate is missing, and is required to run in production mode. ' +
                                    'To resolve, ensure either the PRIVATE_KEY or PRIVATE_KEY_PATH environment variable is set and contains a valid certificate');
                            }
                        }
                        probot.load(setup_1.default);
                        return [3 /*break*/, 4];
                    case 1:
                        if (!Array.isArray(appFn)) return [3 /*break*/, 3];
                        return [4 /*yield*/, pkgConf('probot')];
                    case 2:
                        pkg = _a.sent();
                        probot.setup(program.args.concat(pkg.apps || pkg.plugins || []));
                        return [3 /*break*/, 4];
                    case 3:
                        probot.load(appFn);
                        _a.label = 4;
                    case 4:
                        probot.start();
                        return [2 /*return*/, probot];
                }
            });
        });
    };
    Probot.prototype.errorHandler = function (err) {
        var errMessage = (err.message || '').toLowerCase();
        if (errMessage.includes('x-hub-signature')) {
            logger_1.logger.error({ err: err }, 'Go to https://github.com/settings/apps/YOUR_APP and verify that the Webhook secret matches the value of the WEBHOOK_SECRET environment variable.');
        }
        else if (errMessage.includes('pem') || errMessage.includes('json web token')) {
            logger_1.logger.error({ err: err }, 'Your private key (usually a .pem file) is not correct. Go to https://github.com/settings/apps/YOUR_APP and generate a new PEM file. If you\'re deploying to Now, visit https://probot.github.io/docs/deployment/#now.');
        }
        else {
            logger_1.logger.error(err);
        }
    };
    Probot.prototype.receive = function (event) {
        this.logger.debug({ event: event }, 'Webhook received');
        return Promise.all(this.apps.map(function (app) { return app.receive(event); }));
    };
    Probot.prototype.load = function (appFn) {
        if (typeof appFn === 'string') {
            appFn = resolver_1.resolve(appFn);
        }
        var app = new application_1.Application({
            Octokit: this.Octokit,
            app: this.app,
            cache: cache,
            githubToken: this.githubToken,
            throttleOptions: this.throttleOptions
        });
        // Connect the router from the app to the server
        this.server.use(app.router);
        // Initialize the ApplicationFunction
        app.load(appFn);
        this.apps.push(app);
        return app;
    };
    Probot.prototype.setup = function (appFns) {
        var _this = this;
        // Log all unhandled rejections
        process.on('unhandledRejection', this.errorHandler);
        // Load the given appFns along with the default ones
        appFns.concat(defaultAppFns).forEach(function (appFn) { return _this.load(appFn); });
        // Register error handler as the last middleware
        this.server.use(log_request_errors_1.logRequestErrors);
    };
    Probot.prototype.start = function () {
        if (this.options.webhookProxy) {
            webhook_proxy_1.createWebhookProxy({
                logger: logger_1.logger,
                path: this.options.webhookPath,
                port: this.options.port,
                url: this.options.webhookProxy
            });
        }
        this.httpServer = this.server.listen(this.options.port);
        logger_1.logger.info('Listening on http://localhost:' + this.options.port);
    };
    return Probot;
}());
exports.Probot = Probot;
exports.createProbot = function (options) { return new Probot(options); };
//# sourceMappingURL=index.js.map