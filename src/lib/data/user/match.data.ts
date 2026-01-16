import { getServerConfig } from '../base';
import { ProfileResponse } from '@/types/profile/response';

/**
 * SERVER SLIDE ONLY: Fetch potential matches for the current user
 */
export async function getServerMatchFeed(): Promise<ProfileResponse[]> {
    try {

        
        const { token, apiUrl } = await getServerConfig();

        const response = await fetch(`${apiUrl}/match/feed`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `accessToken=${token}`,
            },
            cache: 'no-store',
        });
        
        if(response.status === 401 || response.status === 403) {
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            return [];
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching match feed on server:", error);
        return [];
    }
}
