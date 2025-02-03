import {AxiosInstance} from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface EImpactedGroupDTO {
    id?: number;
    projectId: number;
    anagraphicDataDTO: {
        entityName: string;
        roleDefinition: string;
        definitionOfAdoption: string;
        uniqueGroupConsiderations: string;
        hasEmail: boolean;
        membersColocated: boolean;
        virtualPreference: number;
        whatsInItForMe: string;
        individuals?: number[];
    };
    groupProjectABSUPDTO: {
        absupAwareness: number;
        absupBuyin: number;
        absupSkill: number;
        absupUse: number;
        absupProficiency: number;
    };
    sponsors?: number[];
    managersOfManagers?: number[];
    managersOfPeople?: number[];
}

export interface CreateCommonEntityRequestDTO {
    projectId: number;
    entityName: string;
    roleDefinition?: string;
    definitionOfAdoption?: string;
    uniqueGroupConsiderations?: string;
    hasEmail?: boolean;
    membersColocated?: boolean;
    virtualPreference?: number;
    whatsInItForMe?: string;
    individualIds?: number[];
}

export class ImpactedGroupService {
    private static instance: ImpactedGroupService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): ImpactedGroupService {
        if (!ImpactedGroupService.instance) {
            ImpactedGroupService.instance = new ImpactedGroupService();
        }
        return ImpactedGroupService.instance;
    }

    /**
     * Get all impacted groups for a project
     */
    async getImpactedGroupsByProject(projectId: number): Promise<EImpactedGroupDTO[]> {
        try {
            const response = await this.client.get<EImpactedGroupDTO[]>(
                `/api/v1/people/igs-by-project?project-id=${projectId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching impacted groups:', error);
            throw error;
        }
    }

    /**
     * Get impacted group by ID
     */
    async getImpactedGroupById(id: number): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.get<EImpactedGroupDTO>(
                `/api/v1/people/ig/${id}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching impacted group:', error);
            throw error;
        }
    }

    /**
     * Create a new impacted group
     */
    async createImpactedGroup(group: CreateCommonEntityRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.post<EImpactedGroupDTO>(
                '/api/v1/people/ig',
                group
            );
            return response.data;
        } catch (error) {
            console.error('Error creating impacted group:', error);
            throw error;
        }
    }

    /**
     * Update ABSUP ratings for an impacted group
     */
    async updateABSUP(groupId: number, ratings: {
        absupAwareness: number;
        absupBuyin: number;
        absupSkill: number;
        absupUse: number;
        absupProficiency: number;
    }): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/project-absup',
                {
                    entityId: groupId,
                    ...ratings
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating ABSUP ratings:', error);
            throw error;
        }
    }
}