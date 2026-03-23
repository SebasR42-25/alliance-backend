export interface Post {
    _id: string;
    content: string;
    imageUrl?: string;
    hashtags?: string[];
    author?: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    createdAt: string;
}