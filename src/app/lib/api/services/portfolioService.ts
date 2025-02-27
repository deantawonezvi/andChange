// src/app/lib/api/services/portfolioService.ts
import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface PeopleROIVsBudgetResponse {
    projectName: string;
    peopleSideROI: number;
    projectBudgetAmount: number;
    sufficiencyOfBudget: number;
}

export interface CMBudgetVsRiskResponse {
    projectName: string;
    percentOfBudgetForCM: number;
    riskValue: number;
    projectROI: number;
}

export class PortfolioService {
    private static instance: PortfolioService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): PortfolioService {
        if (!PortfolioService.instance) {
            PortfolioService.instance = new PortfolioService();
        }
        return PortfolioService.instance;
    }

    /**
     * Get people ROI vs budget data for portfolio visualization
     */
    async getPeopleROIvsBudget(): Promise<PeopleROIVsBudgetResponse[]> {
        try {
            const response = await this.client.get<PeopleROIVsBudgetResponse[]>(
                '/api/v1/portfolio/people-roi-vs-budget'
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching people ROI vs budget data:', error);
            throw error;
        }
    }

    /**
     * Get CM budget vs risk data for portfolio visualization
     */
    async getCMBudgetVsRisk(): Promise<CMBudgetVsRiskResponse[]> {
        try {
            const response = await this.client.get<CMBudgetVsRiskResponse[]>(
                '/api/v1/portfolio/cm-budget-vs-risk'
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching CM budget vs risk data:', error);
            throw error;
        }
    }
}