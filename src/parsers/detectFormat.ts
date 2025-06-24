export type FormatType =
  | "postman"
  | "openapi"
  | "har"
  | "insomnia"
  | "raml"
  | "apib"
  | "curl"
  | "unknown";

/**
 * Determines the format based on input content.
 * @param input JSON object or text
 * @returns FormatType
 */
export function detectFormat(input: string | object): FormatType {
  // If input is a string (e.g., RAML, cURL, or Markdown)
  if (typeof input === "string") {
    const trimmed = input.trim();

    if (trimmed.startsWith("#%RAML")) return "raml";
    if (trimmed.startsWith("FORMAT: 1A") || trimmed.includes("# Group"))
      return "apib";
    if (trimmed.startsWith("curl ")) return "curl";

    // Looks like JSON but we're not sure
    try {
      input = JSON.parse(trimmed);
    } catch (e) {
      return "unknown";
    }
  }

  // From here on, input is now an object (JSON) type

  const json = input as any;

  if (json.info?.schema?.includes("postman")) return "postman";
  if (json?.openapi || json?.swagger) return "openapi";
  if (json?.log?.entries) return "har";
  if (json?.__export_format && Array.isArray(json.resources)) return "insomnia";

  return "unknown";
}
