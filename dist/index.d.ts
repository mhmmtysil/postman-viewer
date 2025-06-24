interface PostmanView {
    collectionName: string;
    requests: PostmanRequest[];
}
interface PostmanRequest {
    name: string;
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
}

declare function parsePostmanJson(json: any): PostmanView;

export { PostmanRequest, PostmanView, parsePostmanJson };
