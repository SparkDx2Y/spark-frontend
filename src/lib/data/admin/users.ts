import 'server-only';
import { cookies } from 'next/headers';
import { GetAllUsersResponse } from '@/types/admin/userList/response';

/**
 * SERVER-SIDE ONLY: Fetch users with authentication
 * This function runs ONLY on the server 
 * Returns Promise with users and pagination data
 */
export async function getServerUsers(params: { search?: string; page?: number; limit?: number; }): Promise<GetAllUsersResponse> {

    // Get cookies from the server request
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        throw new Error('Unauthorized: No access token found');
    }

    // API URL 
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

    // Build query string
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `${apiUrl}/admin/users${queryString ? `?${queryString}` : ''}`;

    // Fetch data on the server with authentication
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `accessToken=${accessToken}`,
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
        throw new Error(error.message || 'Failed to fetch users');
    }

    return response.json();
}
