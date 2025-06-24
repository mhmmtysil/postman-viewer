import { UnifiedView } from "../types";
import drafter from "drafter.js";

export function parseApiBlueprint(content: string): Promise<UnifiedView> {
  return new Promise((resolve, reject) => {
    drafter.parse(content, {}, (err: any, result: any) => {
      if (err) return reject(err);

      const collectionName =
        result?.content?.[0]?.meta?.title || "API Blueprint";
      const requests: UnifiedView["requests"] = [];

      for (const element of result.content || []) {
        if (element.element === "category") {
          for (const sub of element.content || []) {
            if (sub.element === "resource") {
              const uriTemplate = sub.attributes?.href || "";

              for (const action of sub.content || []) {
                if (action.element === "transition") {
                  const name = action.title || `${uriTemplate}`;
                  const method = action.attributes?.method || "GET";
                  const url = uriTemplate;

                  const firstRequest = action.content?.find(
                    (x: any) => x.element === "httpTransaction"
                  );

                  const reqPart = firstRequest?.content?.find(
                    (x: any) => x.element === "httpRequest"
                  );
                  const resPart = firstRequest?.content?.find(
                    (x: any) => x.element === "httpResponse"
                  );

                  const headers: Record<string, string> = {};
                  if (reqPart?.headers) {
                    for (const h of reqPart.headers) {
                      headers[h.name] = h.value;
                    }
                  }

                  const body = reqPart?.content || "";

                  requests.push({
                    name,
                    method: method.toUpperCase(),
                    url,
                    headers,
                    body,
                  });
                }
              }
            }
          }
        }
      }

      resolve({ collectionName, requests });
    });
  });
}
