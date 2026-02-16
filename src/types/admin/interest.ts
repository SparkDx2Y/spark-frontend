import { ApiResponse } from '@/types/api';

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
export type GetAllCategoriesResponse = ApiResponse<Category[]>;
export type GetAllInterestsResponse = ApiResponse<Interest[]>;
export type CreateCategoryResponse = ApiResponse<Category>;
export type CreateInterestResponse = ApiResponse<Interest>;
export type UpdateCategoryResponse = ApiResponse<Category>;
export type UpdateInterestResponse = ApiResponse<Interest>;
export type SetCategoryActiveResponse = ApiResponse<Category>;
export type SetInterestActiveResponse = ApiResponse<Interest>;


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
