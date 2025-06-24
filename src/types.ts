export interface UnifiedRequest {
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface UnifiedView {
  collectionName: string;
  requests: UnifiedRequest[];
}

export type FormatType =
  | "postman"
  | "openapi"
  | "har"
  | "insomnia"
  | "raml"
  | "apib"
  | "curl"
  | "unknown";
