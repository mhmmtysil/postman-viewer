import { detectFormat } from "./parsers/detectFormat";
import { parsePostmanJson } from "./parsers/postmanParser";
import { parseOpenApiJson } from "./parsers/openapiParser";
import { parseHarJson } from "./parsers/harParser";
import { parseInsomniaJson } from "./parsers/insomniaParser";
import { parseRaml } from "./parsers/ramlParser";
import { parseApiBlueprint } from "./parsers/apibParser";
import { parseCurlContent } from "./parsers/curlParser";
import { FormatType, UnifiedView } from "./types";

export async function parseUnified(
  input: string | object
): Promise<UnifiedView> {
  let format: FormatType;
  let parsed: any = input;

  if (typeof input === "string") {
    format = detectFormat(input);

    if (["raml", "apib", "curl"].includes(format)) {
      switch (format) {
        case "raml":
          return await parseRaml(input);
        case "apib":
          return await parseApiBlueprint(input);
        case "curl":
          return parseCurlContent(input);
      }
    }

    try {
      parsed = JSON.parse(input);
    } catch (e) {
      throw new Error("Invalid JSON: JSON.parse failed.");
    }
  } else {
    format = detectFormat(parsed);
  }

  switch (format) {
    case "postman":
      return parsePostmanJson(parsed);
    case "openapi":
      return parseOpenApiJson(parsed);
    case "har":
      return parseHarJson(parsed);
    case "insomnia":
      return parseInsomniaJson(parsed);
    default:
      throw new Error("Unsupported or unrecognized format.");
  }
}

export * from "./types";
