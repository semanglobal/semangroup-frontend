export interface DecryptedResponse {
    iv: string;
    content: string;
    tag?: string;
}