export interface PropertyCreateType {
    title: string;
    description: string;
    price: number;
    location: {
        address: string;
        city: string;
        state: string;
        country: string
    };
    propertyType: string;
    status: string;
    area: number;
    thumbnail: string;
    images: string[];
    amenities: string[];
    isFeatured: boolean;
}

export interface PropertyType {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: {
        address: string;
        city: string;
        state: string;
        country: string
    };
    propertyType: string;
    status: string;
    area: number;
    thumbnail: string;
    images: string[];
    amenities: string[];
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}