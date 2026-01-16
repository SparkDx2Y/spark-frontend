import {  getServerConfig } from '../base';
import { GetAllCategoriesResponse, GetAllInterestsResponse } from '@/types/admin/interest';

/**
 * SERVER-SIDE ONLY: Fetch Categories and Interests
 */
export async function getInterestsData() {
    const { token, apiUrl } = await getServerConfig();
    // Fetch both Categories and Interests in parallel
    const [categoriesRes, interestsRes] = await Promise.all([
        fetch(`${apiUrl}/admin/categories`, {
            headers: { 'Cookie': `accessToken=${token}` },
            cache: 'no-store'
        }),
        fetch(`${apiUrl}/admin/interests`, {
            headers: { 'Cookie': `accessToken=${token}` },
            cache: 'no-store'
        })
    ]);

    if (!categoriesRes.ok || !interestsRes.ok) {
        throw new Error('Failed to fetch interests data');
    }

    const categories: GetAllCategoriesResponse = await categoriesRes.json();
    const interests: GetAllInterestsResponse = await interestsRes.json();

    return {
        categories: categories.data,
        interests: interests.data || []
    };
}
