import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

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

export interface ContentGenerationRequestDTO {
    id?: number;
    associatedActionPlanEntitySlotDTO: ActionPlanEntitySlotDTO;
    submittedRequest: string;
    generatedResult: string;
}

export interface GenerateContentForActionPlanRequestDTO {
    associatedActionPlanEntitySlotDTO: number;
}

class ActionService {
    private static instance: ActionService;
    private client: AxiosInstance;

    private constructor() {
        this.client = createAxiosClient();
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
            const response = await this.client.get(`/api/v1/action/actions-for-organization?organization-id=${organizationId}`);
            return response.data;
        } catch (error) {
            console.log('Error fetching actions for organization:', error);
            throw error;
        }
    }

    /**
     * Get a specific action by ID
     */
    async getActionById(actionId: number): Promise<ActionSummaryDTO> {
        try {
            const response = await this.client.get(`/api/v1/action/${actionId}`);
            return response.data;
        } catch (error) {
            console.log('Error fetching action:', error);
            throw error;
        }
    }

    /**
     * Get a specific action plan by ID
     */
    async getActionPlanById(actionPlanId: number): Promise<ActionPlanDTO> {
        try {
            const response = await this.client.get(`/api/v1/action-plan/ap/${actionPlanId}`);
            return response.data;
        } catch (error) {
            console.log('Error fetching action plan:', error);
            throw error;
        }
    }

    async getActionPlanByProjectId(projectId: number): Promise<ActionPlanDTO | null> {
        try {
            const response = await this.client.get(`/api/v1/action-plan/ap-by-project?project-id=${projectId}`);
            return response.data;
        } catch (error: unknown) {
            console.log('Error fetching action plan:', error);

            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' &&
                'status' in error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    }



    /**
     * Create a new action plan for a project
     */
    async createActionPlan(data: CreateActionPlanRequestDTO): Promise<ActionPlanDTO> {
        try {
            const response = await this.client.post('/api/v1/action-plan/ap', data);
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
            const response = await this.client.put('/api/v1/action-plan/ap', data);
            return response.data;
        } catch (error) {
            console.log('Error updating action plan:', error);
            throw error;
        }
    }

    /**
     * Get a specific action plan entity slot by ID
     */
    async getActionPlanSlotById(slotId: number): Promise<ActionPlanEntitySlotDTO> {
        try {
            const response = await this.client.get(`/api/v1/action-plan/ap/entity-slot/${slotId}`);
            return response.data;
        } catch (error) {
            console.log('Error fetching action plan entity slot:', error);
            throw error;
        }
    }

    /**
     * Update an action plan entity slot
     */
    async updateActionPlanEntitySlot(data: ActionPlanEntitySlotDTO): Promise<ActionPlanEntitySlotDTO> {
        try {
            const response = await this.client.put('/api/v1/action-plan/ap/update-action-plan-entity-slot', data);
            return response.data;
        } catch (error) {
            console.log('Error updating action plan entity slot:', error);
            throw error;
        }
    }

    /**
     * Get alternative action options for a slot
     */
    async getActionOptionsForSlot(slotId: number): Promise<ActionOptionsForActionPlanEntitySlotDTO> {
        try {
            const response = await this.client.get(`/api/v1/action-plan/ap/entity-slot-action-options/${slotId}`);
            return response.data;
        } catch (error) {
            console.log('Error fetching action options for slot:', error);
            throw error;
        }
    }

    /**
     * Generate content for an action plan item
     */
    async generateContentForActionPlanItem(slotId: number): Promise<ContentGenerationRequestDTO[]> {
        try {
            const data: GenerateContentForActionPlanRequestDTO = {
                associatedActionPlanEntitySlotDTO: slotId
            };
            const response = await this.client.post('/api/v1/content/generate-content-for-action-plan-item', data);
            return response.data;
        } catch (error) {
            console.log('Error generating content for action plan item:', error);
            throw error;
        }
    }

    /**
     * Get all action plans for a project (helper method, not a direct API endpoint)
     * This would normally be implemented with a dedicated API endpoint, but since that
     * doesn't exist, we'll use the local storage to track action plan IDs per project
     */
    async getActionPlansForProject(projectId: number): Promise<ActionPlanDTO[]> {
        try {
            // Get action plan ID from local storage
            const actionPlanId = localStorage.getItem(`project_${projectId}_actionPlanId`);
            if (actionPlanId) {
                const actionPlan = await this.getActionPlanById(parseInt(actionPlanId));
                return [actionPlan];
            }
            return [];
        } catch (error) {
            console.log('Error fetching action plans for project:', error);
            throw error;
        }
    }

    /**
     * Map role codes to readable names
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
            'MULTIPLE': 'Multiple Stakeholders',
            'AUTHOR': 'Author',
            'NA': 'Not Applicable'
        };

        return roleMap[roleCode] || roleCode;
    }

    /**
     * Get status information with color and readable name
     */
    getStatusInfo(slotState: string): { color: string; label: string } {
        const statusMap: Record<string, { color: string; label: string }> = {
            'VACANT': { color: '#f44336', label: 'Vacant' },
            'MOOTED': { color: '#ff9800', label: 'Mooted' },
            'ACCEPTED': { color: '#2196f3', label: 'Accepted' },
            'CONTENT_GENERATED': { color: '#4caf50', label: 'Content Generated' },
            'COMPLETED': { color: '#4caf50', label: 'Completed' },
            'DELETED': { color: '#9e9e9e', label: 'Deleted' }
        };

        return statusMap[slotState] || { color: '#9e9e9e', label: slotState };
    }

    /**
     * Get ABSUP category information with color and readable name
     */
    getAbsupCategoryInfo(category: string): { color: string; label: string } {
        const categoryMap: Record<string, { color: string; label: string }> = {
            'AWARENESS': { color: '#2196f3', label: 'Awareness' },
            'BUYIN': { color: '#4caf50', label: 'Buy-In' },
            'SKILL': { color: '#ff9800', label: 'Skill' },
            'USE': { color: '#f44336', label: 'Use' },
            'PROFICIENCY': { color: '#9c27b0', label: 'Proficiency' }
        };

        return categoryMap[category] || { color: '#9e9e9e', label: category };
    }
}

export default ActionService;