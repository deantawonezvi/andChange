import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface ModelAnagraphicDataDTO {
    modelId: number;
    projectCharter?: string;
    changeProjectName: string;
    changeProjectNameRating: number;
    organizationName: string;
    organizationNameRating: number;
    industry: string;
    industryRating: number;
    organizationValues: string;
    organizationValuesRating: number;
    definitionOfSuccess: string;
    definitionOfSuccessRating: number;
    organizationBenefits: string;
    organizationBenefitsRating: number;
    reasonsForChange: string;
    reasonsForChangeRating: number;
    changeProjectObjectives: string;
    changeProjectObjectivesRating: number;
    projectAlignmentToOrgValues: string;
    projectAlignmentToOrgValuesRating: number;
    projectAlignmentToOrgStrategy: string;
    projectAlignmentToOrgStrategyRating: number;
    isProjectAgile: boolean;
}

export interface ModelTimelineAssessmentDTO {
    modelId: number;
    kickoff: string;
    designDefined: string;
    develop: string;
    test: string;
    deploy: string;
    outcomes: string;
    releases: string;
    impactedGroupPeopleMilestones: string;
}

export interface ModelVariablesDTO {
    id: number;
    projectId: number;
    anagraphicData: ModelAnagraphicDataDTO;
    timelineAssessment: ModelTimelineAssessmentDTO;
    // Add other model variables as needed
}

export class ModelService {
    private static instance: ModelService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): ModelService {
        if (!ModelService.instance) {
            ModelService.instance = new ModelService();
        }
        return ModelService.instance;
    }

    async getModelVariables(modelId: number): Promise<ModelVariablesDTO> {
        try {
            const response = await this.client.get<ModelVariablesDTO>(
                `/api/v1/model/${modelId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching model variables:', error);
            throw error;
        }
    }

    async updateAnagraphicData(data: ModelAnagraphicDataDTO): Promise<ModelAnagraphicDataDTO> {
        try {
            const response = await this.client.put<ModelAnagraphicDataDTO>(
                '/api/v1/model/anagraphic-data',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating anagraphic data:', error);
            throw error;
        }
    }

    async updateTimelineAssessment(data: ModelTimelineAssessmentDTO): Promise<ModelTimelineAssessmentDTO> {
        try {
            const response = await this.client.put<ModelTimelineAssessmentDTO>(
                '/api/v1/model/timeline-assessment',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating timeline assessment:', error);
            throw error;
        }
    }
}