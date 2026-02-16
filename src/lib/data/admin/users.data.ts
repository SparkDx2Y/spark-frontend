import { getServerConfig } from '../base';
import { GetAllUsersResponse } from '@/types/admin/userList/response';

/**
 * SERVER-SIDE ONLY: Fetch users with authentication
 */
export async function getServerUsers(params: { search?: string; page?: number; limit?: number; }): Promise<GetAllUsersResponse['data']> {
    const { token, apiUrl } = await getServerConfig();

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
            'Cookie': `accessToken=${token}`,
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to fetch users' }));
        throw new Error(error.message || 'Failed to fetch users');
    }

    const data = await response.json();
    return data.data;
}
