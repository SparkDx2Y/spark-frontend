export interface Category {
    id: string;
    name: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Interest {
    id: string;
    name: string;
    categoryId: string;
    category?: {
        id: string;
        name: string;
    };
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Response
export interface AdminResponse<T> {
    message: string;
    data: T;
}


// Response 
export type GetAllCategoriesResponse = AdminResponse<Category[]>;
export type GetAllInterestsResponse = AdminResponse<Interest[]>;
export type CreateCategoryResponse = AdminResponse<Category>;
export type CreateInterestResponse = AdminResponse<Interest>;
export type UpdateCategoryResponse = AdminResponse<Category>;
export type UpdateInterestResponse = AdminResponse<Interest>;
export type SetCategoryActiveResponse = AdminResponse<Category>;
export type SetInterestActiveResponse = AdminResponse<Interest>;


// Request 
export interface CreateCategoryRequest {
    name: string;
}

export interface CreateInterestRequest {
    name: string;
    categoryId: string;
}

export interface UpdateCategoryRequest {
    name: string;
}

export interface UpdateInterestRequest {
    name: string;
}

export interface SetActiveRequest {
    isActive: boolean;
}
