import { UnifiedView } from "../types";

export function parseInsomniaJson(json: any): UnifiedView {
  const requests = (json.resources || []).filter(
    (r: any) => r._type === "request"
  );

  return {
    collectionName: json.__export_name || "Insomnia Export",
    requests: requests.map((req: any) => ({
      name: req.name,
      method: req.method,
      url: req.url,
      headers: (req.headers || []).reduce((acc: any, h: any) => {
        acc[h.name] = h.value;
        return acc;
      }, {}),
      body: req.body?.text || "",
    })),
  };
}
