import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface ESponsorDTO {
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
    sponsorTitle?: string;
    impactedGroupIds?: number[];
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

export class SponsorService {
    private static instance: SponsorService;
    private client: AxiosInstance;

    private constructor() {
        this.client = createAxiosClient();
    }

    public static getInstance(): SponsorService {
        if (!SponsorService.instance) {
            SponsorService.instance = new SponsorService();
        }
        return SponsorService.instance;
    }

    async getSponsorById(id: number): Promise<ESponsorDTO> {
        const response = await this.client.get<ESponsorDTO>(`/api/v1/people/sponsor/${id}`);
        return response.data;
    }

    async createSponsor(sponsor: CreateCommonEntityRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.post<ESponsorDTO>('/api/v1/people/sponsor/', sponsor);
        return response.data;
    }

    async updateAnagraphicData(data: UpdateAnagraphicDataRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put<ESponsorDTO>('/api/v1/people/sponsor/anagraphic-data', data);
        return response.data;
    }

    async updateProjectABSUP(data: UpdateABSUPRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put<ESponsorDTO>('/api/v1/people/sponsor/project-absup', data);
        return response.data;
    }

    async updateSprintABSUP(data: UpdateABSUPRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put<ESponsorDTO>('/api/v1/people/sponsor/sprint-absup', data);
        return response.data;
    }

    async updateUnityAssessment(data: UpdateUnityAssessmentRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put<ESponsorDTO>('/api/v1/people/sponsor/unity-assessment', data);
        return response.data;
    }

    getFullName(sponsor: ESponsorDTO): string {
        return sponsor.anagraphicDataDTO?.entityName || 'Unknown Sponsor';
    }

    getSponsorTitle(sponsor: ESponsorDTO): string {
        return sponsor.sponsorTitle || 'Sponsor';
    }
}

export default SponsorService;