import { ProfileResponse } from '@/types/profile/response';
import { getServerConfig } from '../base';
import { PROFILE_ENDPOINTS } from '@/constants/api/profile';

/**
 * SERVER-SIDE ONLY: Fetch my profile
 * Moved to structured data layer.
 */
export async function getServerProfile(): Promise<ProfileResponse> {
    const { token, apiUrl } = await getServerConfig();

    const response = await fetch(`${apiUrl}${PROFILE_ENDPOINTS.GET_PROFILE}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `accessToken=${token}`,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return response.json();
}
