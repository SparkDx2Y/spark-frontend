export const ADMIN_ENDPOINTS = {
    GET_ALL_USERS: '/admin/users',
    UPDATE_USER_BLOCK_STATUS: '/admin/users/:userId/block-status',

    // Interests & Categories
    GET_CATEGORIES: '/admin/categories',
    CREATE_CATEGORY: '/admin/categories',
    UPDATE_CATEGORY: '/admin/categories/:id',
    SET_CATEGORY_ACTIVE: '/admin/categories/:id/active',

    GET_INTERESTS: '/admin/interests',
    CREATE_INTEREST: '/admin/interests',
    UPDATE_INTEREST: '/admin/interests/:id',
    SET_INTEREST_ACTIVE: '/admin/interests/:id/active',

    // Reports
    GET_REPORTS: '/admin/reports',
    UPDATE_REPORT_STATUS: '/admin/reports/:reportId/status',
} as const;

