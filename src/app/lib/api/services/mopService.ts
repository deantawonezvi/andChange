import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface EManagerOfPeopleDTO {
    id?: number;
    projectId: number;
    anagraphicDataDTO: {
        id?: number;
        entityName: string;
        roleDefinition?: string;
        definitionOfAdoption?: string;
        uniqueGroupConsiderations?: string;
        hasEmail?: boolean;
        membersColocated?: boolean;
        virtualPreference?: number;
        whatsInItForMe?: string;
        individuals?: number[];
    };
    groupProjectABSUPDTO: {
        id?: number;
        absupAwareness: number;
        absupBuyin: number;
        absupSkill: number;
        absupUse: number;
        absupProficiency: number;
    };
    groupSprintABSUPDTO?: {
        id?: number;
        absupAwareness: number;
        absupBuyin: number;
        absupSkill: number;
        absupUse: number;
        absupProficiency: number;
    };
    groupUnityAssessmentDTO?: {
        id?: number;
        supportLevel: number;
        influenceLevel: number;
        availabilityLevel: number;
        primary: boolean;
    };
    resistanceAssessment?: {
        id?: number;
        anticipatedResistanceLevel: number;
        anticipatedResistanceDriver: string;
        resistanceManagementTactics: Array<{
            id?: number;
            tacticDescription: string;
            tacticDescriptionRating: number;
        }>;
    };
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

export interface UpdateAnagraphicDataRequestDTO {
    entityId: number;
    entityName: string;
    roleDefinition?: string;
    definitionOfAdoption?: string;
    definitionOfAdoptionRating?: number;
    uniqueGroupConsiderations?: string;
    uniqueGroupConsiderationsRating?: number;
    hasEmail?: boolean;
    membersColocated?: boolean;
    virtualPreference?: number;
    whatsInItForMe?: string;
    individualsToAdd?: number[];
    individualsToRemove?: number[];
}

export interface UpdateABSUPRequestDTO {
    entityId: number;
    absupAwareness: number;
    absupBuyin: number;
    absupSkill: number;
    absupUse: number;
    absupProficiency: number;
}

export interface UpdateUnityAssessmentRequestDTO {
    entityId: number;
    supportLevel: number;
    influenceLevel: number;
    availabilityLevel: number;
    isPrimary: boolean;
}

export class MOPService {
    private static instance: MOPService;
    private client: AxiosInstance;

    private constructor() {
        this.client = createAxiosClient();
    }

    public static getInstance(): MOPService {
        if (!MOPService.instance) {
            MOPService.instance = new MOPService();
        }
        return MOPService.instance;
    }

    async getMOPById(id: number): Promise<EManagerOfPeopleDTO> {
        const response = await this.client.get<EManagerOfPeopleDTO>(`/api/v1/people/mop/${id}`);
        return response.data;
    }

    async createMOP(mop: CreateCommonEntityRequestDTO): Promise<EManagerOfPeopleDTO> {
        const response = await this.client.post<EManagerOfPeopleDTO>('/api/v1/people/mop/', mop);
        return response.data;
    }

    async updateAnagraphicData(data: UpdateAnagraphicDataRequestDTO): Promise<EManagerOfPeopleDTO> {
        const response = await this.client.put<EManagerOfPeopleDTO>('/api/v1/people/mop/anagraphic-data', data);
        return response.data;
    }

    async updateProjectABSUP(data: UpdateABSUPRequestDTO): Promise<EManagerOfPeopleDTO> {
        const response = await this.client.put<EManagerOfPeopleDTO>('/api/v1/people/mop/project-absup', data);
        return response.data;
    }

    async updateSprintABSUP(data: UpdateABSUPRequestDTO): Promise<EManagerOfPeopleDTO> {
        const response = await this.client.put<EManagerOfPeopleDTO>('/api/v1/people/mop/sprint-absup', data);
        return response.data;
    }

    async updateUnityAssessment(data: UpdateUnityAssessmentRequestDTO): Promise<EManagerOfPeopleDTO> {
        const response = await this.client.put<EManagerOfPeopleDTO>('/api/v1/people/mop/unity-assessment', data);
        return response.data;
    }

    getFullName(mop: EManagerOfPeopleDTO): string {
        return mop.anagraphicDataDTO?.entityName || 'Unknown MOP';
    }
}

export default MOPService;