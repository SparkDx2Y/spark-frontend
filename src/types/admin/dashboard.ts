export interface ChartDataPoint {
    date: string;
    revenue: number;
    users: number;
    matches: number;
}

export interface DashboardStats {
    totalUsers: number;
    newUsers: number;
    premiumUsers: number;
    totalRevenue: number;
    revenueInRange: number;
    totalMatches: number;
    newMatches: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    chartData: ChartDataPoint[];
}

export interface DashboardStatsResponse {
    success: boolean;
    message: string;
    data: DashboardStats;
}
