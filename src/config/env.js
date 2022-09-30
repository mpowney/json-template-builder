exports.IS_NODE =
    typeof global !== "undefined" && {}.toString.call(global) === "[object global]";

exports.IS_PROD = window.location.hostname === "ocmanagamentclient.z8.web.core.windows.net" || window.location.hostname === "ownerscorp.management"; // process.env.NODE_ENV === "production";

// CDN or Local assets url
exports.PUBLIC_ASSETS_URL = exports.IS_PROD ? "/assets/" : "/assets/";
exports.API_BASE = exports.IS_PROD ? "https://oc-management.azurewebsites.net/api" : "http://localhost:7071/api";
exports.API_ID_URI = "api://738c6a32-8131-4d3c-a116-7bf4b0c7be11"
exports.DEV_HOST = "localhost";

exports.DEV_PORT = 7000;