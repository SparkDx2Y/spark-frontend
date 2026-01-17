import 'server-only';
import { cookies } from 'next/headers';

/**
 *  server-side configuration for all API calls.
 *  eth use chayunathe token and api url  build chaythe oradathe store chaythe return chaynnnu
 * @param required - If true (default), it will throw an error if the user is not authenticated.
 *                   If false, it will just return the token as undefined (for public pages).
 */

export async function getServerConfig(required = true) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

    if (required && !token) {
        throw new Error('Unauthorized: No access token found');
    }

    return { token, apiUrl };
}
