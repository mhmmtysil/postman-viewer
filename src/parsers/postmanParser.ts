import { UnifiedView } from "../types";

export function parsePostmanJson(json: any): UnifiedView {
  const collectionName = json.info?.name || "Unnamed Postman Collection";
  const items = json.item || [];

  function extract(items: any[]): UnifiedView["requests"] {
    return items.flatMap((item: any) => {
      if (item.item) return extract(item.item);
      const req = item.request;
      return [
        {
          name: item.name,
          method: req?.method || "GET",
          url: req?.url?.raw || req?.url || "",
          headers: (req.header || []).reduce((acc: any, h: any) => {
            acc[h.key] = h.value;
            return acc;
          }, {}),
          body: req.body?.raw || "",
        },
      ];
    });
  }

  return {
    collectionName,
    requests: extract(items),
  };
}
