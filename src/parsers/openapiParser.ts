import { UnifiedView } from "../types";

export function parseOpenApiJson(json: any): UnifiedView {
  const paths = json.paths || {};
  const collectionName = json.info?.title || "Unnamed OpenAPI";
  const requests: UnifiedView["requests"] = [];

  Object.entries(paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, details]: [string, any]) => {
      requests.push({
        name: details.summary || `${method.toUpperCase()} ${path}`,
        method: method.toUpperCase(),
        url: path,
        headers: {},
        body: JSON.stringify(
          details.requestBody?.content?.["application/json"]?.example ||
            details.requestBody?.content?.["application/json"]?.schema ||
            {}
        ),
      });
    });
  });

  return {
    collectionName,
    requests,
  };
}
