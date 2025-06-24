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
export {
  parsePostmanJson
};
