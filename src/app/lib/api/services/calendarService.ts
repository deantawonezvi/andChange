// src/app/lib/api/services/calendarService.ts

import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface CalendarSummaryResponseDTO {
    calendarSummary: {
        [key: string]: ImpactedGroupActionSummaryDTO[];
    };
}

export interface ImpactedGroupActionSummaryDTO {
    impactedGroupDTO: {
        id: number;
        projectId: number;
        anagraphicDataDTO: {
            entityName: string;
        };
    };
    actionSummaryDTO: {
        id: number;
        organizationId: number;
        actionCore: {
            actionName: string;
            externalActionIdentifier: string;
        };
    };
}

export class CalendarService {
    private static instance: CalendarService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): CalendarService {
        if (!CalendarService.instance) {
            CalendarService.instance = new CalendarService();
        }
        return CalendarService.instance;
    }

    async getCalendarSummary(projectId: number, params: {
        startDate?: string;
        endDate?: string;
        impactedGroupIds?: number[];
    }): Promise<CalendarSummaryResponseDTO> {
        try {
            const queryParams = new URLSearchParams();

            queryParams.append('project-id', projectId.toString());

            if (params.startDate) {
                queryParams.append('start-date', params.startDate);
            }
            if (params.endDate) {
                queryParams.append('end-date', params.endDate);
            }

            if (params.impactedGroupIds?.length) {
                params.impactedGroupIds.forEach(id => {
                    queryParams.append('impacted-group-ids', id.toString());
                });
            }

            const response = await this.client.get<CalendarSummaryResponseDTO>(
                `/api/v1/portfolio/calendar?${queryParams.toString()}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching calendar summary:', error);
            throw error;
        }
    }
}

export default CalendarService;