var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  parsePostmanJson: () => parsePostmanJson
});
module.exports = __toCommonJS(src_exports);

// src/analyzer.ts
function parsePostmanJson(json) {
  var _a;
  const collectionName = ((_a = json == null ? void 0 : json.info) == null ? void 0 : _a.name) || "Unnamed Collection";
  const requests = [];
  function extractItems(items) {
    var _a2, _b;
    for (const item of items) {
      if (item.item) {
        extractItems(item.item);
      } else if (item.request) {
        const request = item.request;
        requests.push({
          name: item.name || "Unnamed",
          method: request.method || "GET",
          url: ((_a2 = request.url) == null ? void 0 : _a2.raw) || request.url || "",
          headers: Array.isArray(request.header) ? Object.fromEntries(
            request.header.map((h) => [h.key, h.value])
          ) : {},
          body: typeof ((_b = request.body) == null ? void 0 : _b.raw) === "string" ? request.body.raw : JSON.stringify(request.body || {})
        });
      }
    }
  }
  if (Array.isArray(json.item)) {
    extractItems(json.item);
  }
  return {
    collectionName,
    requests
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parsePostmanJson
});
