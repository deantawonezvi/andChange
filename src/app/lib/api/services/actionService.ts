// src/app/lib/api/services/actionService.ts
import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

// Define interfaces based on the API schema
export interface ActionCoreDTO {
    id?: number;
    externalActionIdentifier: string;
    actionName: string;
    actionTarget: 'ABSUP' | 'HEALTH' | 'HYGIENE';
    actionOrgPlanType: string;
    whoReceiver: string;
    whoSender: string;
    whoExecutor: string;
    shareable: boolean;
    sprint: boolean;
    actionPhase: 'P' | 'M' | 'S';
    actionMedium: 'N' | 'P' | 'D' | 'B';
    actionCooldownInDays: number;
    actionVerb?: any;
    actionWhat?: any;
    actionSource?: any;
    stagingIncludeBeginning: boolean;
    stagingIncludeMiddle: boolean;
    stagingIncludeEnd: boolean;
}

export interface ActionSummaryDTO {
    id?: number;
    organizationId?: number;
    actionCore: ActionCoreDTO;
    actionContentDTOList?: any[];
}

export interface ActionPlanSlotSummaryDTO {
    id?: number;
    slotDate: string;
    actionId?: number;
    aoID: string;
    slotState: 'VACANT' | 'MOOTED' | 'ACCEPTED' | 'CONTENT_GENERATED' | 'COMPLETED' | 'DELETED';
}

export interface ActionPlanDTO {
    id?: number;
    projectId: number;
    actionPlanState: string;
    impactGroupActionPlanSlotManifest?: Record<string, Record<string, ActionPlanSlotSummaryDTO[]>>;
    mopActionPlanSlotManifest?: Record<string, Record<string, ActionPlanSlotSummaryDTO[]>>;
    sponsorActionPlanSlotManifest?: Record<string, Record<string, ActionPlanSlotSummaryDTO[]>>;
    pctHealthActionPlanSlotManifest?: Record<string, ActionPlanSlotSummaryDTO[]>;
    hygieneActions?: ActionPlanSlotSummaryDTO[];
}

export interface ActionPlanEntitySlotDTO {
    id?: number;
    slotDate: string;
    associatedSponsorId?: number;
    associatedMOPId?: number;
    associatedImpactedGroupId?: number;
    actionId?: number;
    aoID: string;
    whoReceiver: string;
    whoSender: string;
    slotState: 'VACANT' | 'MOOTED' | 'ACCEPTED' | 'CONTENT_GENERATED' | 'COMPLETED' | 'DELETED';
    absuptargeted: 'AWARENESS' | 'BUYIN' | 'SKILL' | 'USE' | 'PROFICIENCY';
}

export interface CreateActionPlanRequestDTO {
    projectId: number;
    additiveProcess: boolean;
    entityABSUPSpecification?: Record<string, string[]>;
    entityABSUPDateRangeSpecifications?: Record<string, Record<string, DateRangeTupleDTO>>;
    selectiveEntityABSUPDateRangeSpecifications?: Record<string, Record<string, Record<string, DateRangeTupleDTO>>>;
}

export interface DateRangeTupleDTO {
    startDate: string;
    endDate: string;
}

export interface ActionOptionsForActionPlanEntitySlotDTO {
    actionPlanEntitySlotId: number;
    actionOptionsList: ActionSummaryDTO[];
}

export class ActionService {
    private static instance: ActionService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): ActionService {
        if (!ActionService.instance) {
            ActionService.instance = new ActionService();
        }
        return ActionService.instance;
    }

    /**
     * Get all actions for an organization
     */
    async getActionsForOrganization(organizationId: number): Promise<ActionSummaryDTO[]> {
        try {
            const response = await this.client.get<ActionSummaryDTO[]>(
                `/api/v1/action/actions-for-organization?organization-id=${organizationId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching actions for organization:', error);
            throw error;
        }
    }

    /**
     * Get action by ID
     */
    async getActionById(actionId: number): Promise<ActionSummaryDTO> {
        try {
            const response = await this.client.get<ActionSummaryDTO>(
                `/api/v1/action/${actionId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching action:', error);
            throw error;
        }
    }

    /**
     * Get action plan by ID
     */
    async getActionPlanById(actionPlanId: number): Promise<ActionPlanDTO> {
        try {
            const response = await this.client.get<ActionPlanDTO>(
                `/api/v1/action-plan/ap/${actionPlanId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching action plan:', error);
            throw error;
        }
    }

    /**
     * Create a new action plan
     */
    async createActionPlan(data: CreateActionPlanRequestDTO): Promise<ActionPlanDTO> {
        try {
            const response = await this.client.post<ActionPlanDTO>(
                '/api/v1/action-plan/ap',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error creating action plan:', error);
            throw error;
        }
    }

    /**
     * Update an existing action plan
     */
    async updateActionPlan(data: CreateActionPlanRequestDTO): Promise<ActionPlanDTO> {
        try {
            const response = await this.client.put<ActionPlanDTO>(
                '/api/v1/action-plan/ap',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating action plan:', error);
            throw error;
        }
    }

    /**
     * Get action plan entity slot by ID
     */
    async getActionPlanSlotById(slotId: number): Promise<ActionPlanEntitySlotDTO> {
        try {
            const response = await this.client.get<ActionPlanEntitySlotDTO>(
                `/api/v1/action-plan/ap/entity-slot/${slotId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching action plan slot:', error);
            throw error;
        }
    }

    /**
     * Update action plan entity slot
     */
    async updateActionPlanEntitySlot(data: ActionPlanEntitySlotDTO): Promise<ActionPlanEntitySlotDTO> {
        try {
            const response = await this.client.put<ActionPlanEntitySlotDTO>(
                '/api/v1/action-plan/ap/update-action-plan-entity-slot',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating action plan entity slot:', error);
            throw error;
        }
    }

    /**
     * Get action options for a slot
     */
    async getActionOptionsForSlot(slotId: number): Promise<ActionOptionsForActionPlanEntitySlotDTO> {
        try {
            const response = await this.client.get<ActionOptionsForActionPlanEntitySlotDTO>(
                `/api/v1/action-plan/ap/entity-slot-action-options/${slotId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching action options for slot:', error);
            throw error;
        }
    }

    /**
     * Helper method to map role codes to readable names
     */
    getRoleReadableName(roleCode: string): string {
        const roleMap: Record<string, string> = {
            'E_IG': 'Impacted Group',
            'E_MOP': 'Manager of People',
            'E_MOM': 'Manager of Managers',
            'E_CM': 'Change Manager',
            'E_PM': 'Project Manager',
            'E_SP': 'Sponsor',
            'E_EXT': 'External',
            'MULTIPLE': 'Multiple',
            'AUTHOR': 'Author',
            'NA': 'Not Applicable'
        };

        return roleMap[roleCode] || roleCode;
    }

    /**
     * Helper method to get appropriate status label and color
     */
    getStatusInfo(slotState: string): { label: string; color: string } {
        switch (slotState) {
            case 'VACANT':
                return { label: 'Vacant', color: '#9e9e9e' }; // Gray
            case 'MOOTED':
                return { label: 'Proposed', color: '#2196f3' }; // Blue
            case 'ACCEPTED':
                return { label: 'Accepted', color: '#ff9800' }; // Orange
            case 'CONTENT_GENERATED':
                return { label: 'Content Ready', color: '#4caf50' }; // Green
            case 'COMPLETED':
                return { label: 'Completed', color: '#4caf50' }; // Green
            case 'DELETED':
                return { label: 'Deleted', color: '#f44336' }; // Red
            default:
                return { label: slotState, color: '#9e9e9e' }; // Gray
        }
    }
}

export default ActionService;