export interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    receiver: string;
    content: string;
    createdAt: string;
}