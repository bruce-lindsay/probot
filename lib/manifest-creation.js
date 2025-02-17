"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var path_1 = __importDefault(require("path"));
var update_dotenv_1 = __importDefault(require("update-dotenv"));
var github_1 = require("./github");
var ManifestCreation = /** @class */ (function () {
    function ManifestCreation() {
    }
    Object.defineProperty(ManifestCreation.prototype, "pkg", {
        get: function () {
            var pkg;
            try {
                pkg = require(path_1.default.join(process.cwd(), 'package.json'));
            }
            catch (e) {
                pkg = {};
            }
            return pkg;
        },
        enumerable: true,
        configurable: true
    });
    ManifestCreation.prototype.createWebhookChannel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // tslint:disable:no-var-requires
                }
                catch (err) {
                    // Smee is not available, so we'll just move on
                    // tslint:disable:no-console
                    console.warn('Unable to connect to smee.io, try restarting your server.');
                }
                return [2 /*return*/];
            });
        });
    };
    ManifestCreation.prototype.getManifest = function (pkg, baseUrl) {
        var manifest = {};
        try {
            var file = fs_1.default.readFileSync(path_1.default.join(process.cwd(), 'app.yml'), 'utf8');
            manifest = js_yaml_1.default.safeLoad(file);
        }
        catch (err) {
            // App config does not exist, which is ok.
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
        var generatedManifest = JSON.stringify(Object.assign({
            description: manifest.description || pkg.description,
            hook_attributes: {
                url: process.env.WEBHOOK_PROXY_URL || baseUrl + "/"
            },
            name: process.env.PROJECT_DOMAIN || manifest.name || pkg.name,
            public: manifest.public || true,
            redirect_url: baseUrl + "/probot/setup",
            // TODO: add setup url
            // setup_url:`${baseUrl}/probot/success`,
            url: manifest.url || pkg.homepage || pkg.repository,
            version: 'v1'
        }, manifest));
        return generatedManifest;
    };
    ManifestCreation.prototype.createAppFromCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var github, options, response, _a, id, webhook_secret, pem;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        github = github_1.GitHubAPI();
                        options = __assign({ code: code, headers: { accept: 'application/vnd.github.fury-preview+json' } }, process.env.GHE_HOST && { baseUrl: (process.env.GHE_PROTOCOL || 'https') + "://" + process.env.GHE_HOST + "/api/v3" });
                        return [4 /*yield*/, github.request('POST /app-manifests/:code/conversions', options)];
                    case 1:
                        response = _b.sent();
                        _a = response.data, id = _a.id, webhook_secret = _a.webhook_secret, pem = _a.pem;
                        return [4 /*yield*/, this.updateEnv({
                                APP_ID: id.toString(),
                                PRIVATE_KEY: "\"" + pem + "\"",
                                WEBHOOK_SECRET: webhook_secret
                            })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, response.data.html_url];
                }
            });
        });
    };
    ManifestCreation.prototype.updateEnv = function (env) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, update_dotenv_1.default(env)];
            });
        });
    };
    Object.defineProperty(ManifestCreation.prototype, "createAppUrl", {
        get: function () {
            var githubHost = process.env.GHE_HOST || "github.com";
            return (process.env.GHE_PROTOCOL || 'https') + "://" + githubHost + "/settings/apps/new";
        },
        enumerable: true,
        configurable: true
    });
    return ManifestCreation;
}());
exports.ManifestCreation = ManifestCreation;
//# sourceMappingURL=manifest-creation.js.map