import { UnifiedView } from "../types";
import parseCurl from "parse-curl";

export function parseCurlContent(content: string): UnifiedView {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("curl"));

  const requests: UnifiedView["requests"] = [];

  lines.forEach((line, index) => {
    try {
      const parsed = parseCurl(line);

      requests.push({
        name: parsed.url || `cURL Request ${index + 1}`,
        method: parsed.method || "GET",
        url: parsed.url || "",
        headers: parsed.headers || {},
        body: parsed.body || "",
      });
    } catch (e) {
      console.warn(`Line ${index + 1} cURL parse failed:`, e);
    }
  });

  return {
    collectionName: "cURL Import",
    requests,
  };
}
