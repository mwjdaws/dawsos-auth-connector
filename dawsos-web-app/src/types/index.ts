
// filepath: /dawsos-web-app/dawsos-web-app/src/types/index.ts
export interface KnowledgeSource {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    externalSourceUrl?: string;
    externalSourceCheckedAt?: string;
    externalContentHash?: string;
    needsExternalReview?: boolean;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    data: T;
    error: string | null;
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
