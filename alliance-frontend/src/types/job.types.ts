export interface Job {
    _id: string;
    title: string;
    location: string;
    salaryRange?: string;
    description?: string;
    tags?: string[];
    company: {
        _id: string;
        name: string;
        logoUrl?: string;
    };
    applicants: string[];
}