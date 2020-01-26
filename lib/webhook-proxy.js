"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhookProxy = function (opts) {
    try {
        throw new Error('smee-client not found');
    }
    catch (err) {
        opts.logger.warn('Run `npm install --save-dev smee-client` to proxy webhooks to localhost.');
        return;
    }
};
//# sourceMappingURL=webhook-proxy.js.map