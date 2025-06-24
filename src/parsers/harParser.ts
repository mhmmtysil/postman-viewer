import { UnifiedView } from "../types";

export function parseHarJson(json: any): UnifiedView {
  const entries = json.log?.entries || [];

  return {
    collectionName: "HAR Import",
    requests: entries.map((entry: any) => {
      const req = entry.request;
      return {
        name: req.url,
        method: req.method,
        url: req.url,
        headers: (req.headers || []).reduce((acc: any, h: any) => {
          acc[h.name] = h.value;
          return acc;
        }, {}),
        body: req.postData?.text || "",
      };
    }),
  };
}
