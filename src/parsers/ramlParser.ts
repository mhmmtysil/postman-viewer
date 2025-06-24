import { UnifiedView } from "../types";
import * as raml from "raml-1-parser";
import * as path from "path";

export async function parseRaml(filePath: string): Promise<UnifiedView> {
  const api = await raml.loadApi(filePath);
  const expand = api.expand(true).toJSON() as any;

  const collectionName = expand.title || "RAML API";
  const baseUri = expand.baseUri || "";

  const requests: UnifiedView["requests"] = [];

  const resources = expand.resources || [];
  for (const resource of resources) {
    const resourcePath = resource.relativeUri;

    for (const method of resource.methods || []) {
      const methodName = method.method.toUpperCase();
      const url = baseUri + resourcePath;

      const headers: Record<string, string> = {};
      if (method.headers) {
        for (const h of method.headers) {
          headers[h.name] = h.description || "";
        }
      }

      let body = "";
      const bodyObj = method.body?.find(
        (b: any) => b.name === "application/json"
      );
      if (bodyObj?.example) {
        body =
          typeof bodyObj.example === "string"
            ? bodyObj.example
            : JSON.stringify(bodyObj.example);
      }

      requests.push({
        name: method.description || `${methodName} ${resourcePath}`,
        method: methodName,
        url,
        headers,
        body,
      });
    }

    // recursive alt kaynaklar
    if (resource.resources) {
      for (const sub of resource.resources) {
        expandResource(sub, baseUri + resourcePath, requests);
      }
    }
  }

  return {
    collectionName,
    requests,
  };
}

function expandResource(
  resource: any,
  parentPath: string,
  requests: UnifiedView["requests"]
) {
  const resourcePath = parentPath + resource.relativeUri;

  for (const method of resource.methods || []) {
    const methodName = method.method.toUpperCase();

    const headers: Record<string, string> = {};
    if (method.headers) {
      for (const h of method.headers) {
        headers[h.name] = h.description || "";
      }
    }

    let body = "";
    const bodyObj = method.body?.find(
      (b: any) => b.name === "application/json"
    );
    if (bodyObj?.example) {
      body =
        typeof bodyObj.example === "string"
          ? bodyObj.example
          : JSON.stringify(bodyObj.example);
    }

    requests.push({
      name: method.description || `${methodName} ${resourcePath}`,
      method: methodName,
      url: resourcePath,
      headers,
      body,
    });
  }

  if (resource.resources) {
    for (const sub of resource.resources) {
      expandResource(sub, resourcePath, requests);
    }
  }
}
