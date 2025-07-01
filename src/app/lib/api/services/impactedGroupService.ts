import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface EGroupABSUPDTO {
    id?: number;
    absupAwareness: number;
    absupBuyin: number;
    absupSkill: number;
    absupUse: number;
    absupProficiency: number;
}

export interface EGroupAnagraphicDataDTO {
    id?: number;
    entityName: string;
    roleDefinition: string;
    definitionOfAdoption: string;
    uniqueGroupConsiderations: string;
    hasEmail: boolean;
    membersColocated: boolean;
    virtualPreference: number;
    whatsInItForMe: string;
    individuals?: number[];
}

export interface EGroupResistanceAssessmentDTO {
    id?: number;
    anticipatedResistanceLevel: number;
    anticipatedResistanceDriver: string;
    resistanceManagementTactics: EResistanceManagementTacticDTO[];
}

export interface EResistanceManagementTacticDTO {
    id?: number;
    tacticDescription: string;
    tacticDescriptionRating: number;
}

export interface EChangeImpactAssessmentDTO {
    id?: number;
    process: number;
    systems: number;
    tools: number;
    jobRoles: number;
    criticalBehaviours: number;
    mindsetAttitudesBeliefs: number;
    reportingStructure: number;
    performanceReviews: number;
    compensation: number;
    location: number;
    retrenchments: number;
    clarityOfFutureState: number;
}

export interface EChangeImpactAssessmentDescriptionsDTO {
    id?: number;
    processDescription: string;
    processDescriptionRating: number;
    systemsDescription: string;
    systemsDescriptionRating: number;
    toolsDescription: string;
    toolsDescriptionRating: number;
    jobRolesDescription: string;
    jobRolesDescriptionRating: number;
    criticalBehavioursDescription: string;
    criticalBehavioursDescriptionRating: number;
    mindsetAttitudeBeliefsDescription: string;
    mindsetAttitudeBeliefsDescriptionRating: number;
    reportingStructureDescription: string;
    reportingStructureDescriptionRating: number;
    performanceReviewsDescription: string;
    performanceReviewsDescriptionRating: number;
    compensationDescription: string;
    compensationDescriptionRating: number;
    locationDescription: string;
    locationDescriptionRating: number;
    retrenchmentDescription: string;
    retrenchmentDescriptionRating: number;
}

export interface EImpactedGroupAdoptionAssessmentDTO {
    id?: number;
    adoption_assessment: string;
    adoption_threshold: number;
}

export interface TagDTO {
    id?: number;
    tagText: string;
    tagDescription: string;
}

export interface EImpactedGroupDTO {
    id?: number;
    projectId: number;
    anagraphicDataDTO: EGroupAnagraphicDataDTO;
    groupProjectABSUPDTO: EGroupABSUPDTO;
    groupSprintABSUPDTO?: EGroupABSUPDTO;
    tagDTOs?: TagDTO[];
    adoptionAssessments?: EImpactedGroupAdoptionAssessmentDTO[];
    resistanceAssessment?: EGroupResistanceAssessmentDTO;
    changeImpactAssessment?: EChangeImpactAssessmentDTO;
    echangeImpactAssessmentDescriptionsDTO?: EChangeImpactAssessmentDescriptionsDTO;
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

export interface UpdateIGChangeImpactAssessmentRequestDTO {
    impactGroupId: number;
    process: number;
    systems: number;
    tools: number;
    jobRoles: number;
    criticalBehaviours: number;
    mindsetAttitudesBeliefs: number;
    reportingStructure: number;
    performanceReviews: number;
    compensation: number;
    location: number;
    restructuringOrRetrenchments: number;
    clarityOfFutureState: number;
}

export interface UpdateIGChangeImpactAssessmentDescriptionsRequestDTO {
    impactGroupId: number;
    processDescription: string;
    processDescriptionRating: number;
    systemsDescription: string;
    systemsDescriptionRating: number;
    toolsDescription: string;
    toolsDescriptionRating: number;
    jobRolesDescription: string;
    jobRolesDescriptionRating: number;
    criticalBehavioursDescription: string;
    criticalBehavioursDescriptionRating: number;
    mindsetAttitudeBeliefsDescription: string;
    mindsetAttitudeBeliefsDescriptionRating: number;
    reportingStructureDescription: string;
    reportingStructureDescriptionRating: number;
    performanceReviewsDescription: string;
    performanceReviewsDescriptionRating: number;
    compensationDescription: string;
    compensationDescriptionRating: number;
    locationDescription: string;
    locationDescriptionRating: number;
    retrenchmentDescription: string;
    retrenchmentDescriptionRating: number;
}

export interface UpdateResistanceAssessmentRequestDTO {
    entityId: number;
    anticipatedResistanceLevel: number;
    anticipatedResistanceDriver: string;
    resistanceManagementTacticsToAdd?: number[];
    resistanceManagementTacticsToRemove?: number[];
}

export interface UpdateIGAdoptionAssessmentUpdateRequestDTO {
    impactGroupId: number;
    adoptionAssessmentId: number;
    adoptionAssessment: string;
    adoptionThreshold: number;
}

export interface UpdateIGAdoptionAssessmentAddRequestDTO {
    impactGroupId: number;
    adoptionAssessment: string;
    adoptionThreshold: number;
}

export interface UpdateIGAdoptionAssessmentDeleteRequestDTO {
    impactGroupId: number;
    adoptionAssessmentId: number;
}

export interface UpdateIGTagsRequestDTO {
    impactGroupId: number;
    tagsToAdd?: number[];
    tagsToRemove?: number[];
}

export interface UpdateIGManageEntitiesRequestDTO {
    impactGroupId: number;
    sponsorEntitiesToAdd?: number[];
    sponsorEntitiesToRemove?: number[];
    momEntitiesToAdd?: number[];
    momEntitiesToRemove?: number[];
    mopEntitiesToAdd?: number[];
    mopEntitiesToRemove?: number[];
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
            console.log('Error fetching impacted groups:', error);
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
            console.log('Error fetching impacted group:', error);
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
            console.log('Error creating impacted group:', error);
            throw error;
        }
    }

    /**
     * Update impacted group anagraphic data
     */
    async updateAnagraphicData(data: UpdateAnagraphicDataRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/anagraphic-data',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating anagraphic data:', error);
            throw error;
        }
    }

    /**
     * Update ABSUP ratings for an impacted group
     */
    async updateABSUP(data: UpdateABSUPRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/project-absup',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating ABSUP ratings:', error);
            throw error;
        }
    }

    /**
     * Update change impact assessment
     */
    async updateChangeImpactAssessment(data: UpdateIGChangeImpactAssessmentRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/change-impact-assessment',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating change impact assessment:', error);
            throw error;
        }
    }

    /**
     * Update change impact assessment descriptions
     */
    async updateChangeImpactAssessmentDescriptions(data: UpdateIGChangeImpactAssessmentDescriptionsRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/change-impact-assessment-descriptions',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating change impact assessment descriptions:', error);
            throw error;
        }
    }

    /**
     * Update resistance assessment
     */
    async updateResistanceAssessment(data: UpdateResistanceAssessmentRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/resistance-assessment',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating resistance assessment:', error);
            throw error;
        }
    }

    /**
     * Add new adoption assessment
     */
    async addAdoptionAssessment(data: UpdateIGAdoptionAssessmentAddRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.post<EImpactedGroupDTO>(
                '/api/v1/people/ig/adoption-assessment',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error adding adoption assessment:', error);
            throw error;
        }
    }

    /**
     * Update existing adoption assessment
     */
    async updateAdoptionAssessment(data: UpdateIGAdoptionAssessmentUpdateRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/adoption-assessment',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating adoption assessment:', error);
            throw error;
        }
    }

    /**
     * Delete adoption assessment
     */
    async deleteAdoptionAssessment(data: UpdateIGAdoptionAssessmentDeleteRequestDTO): Promise<void> {
        try {
            await this.client.delete('/api/v1/people/ig/adoption-assessment', { data });
        } catch (error) {
            console.log('Error deleting adoption assessment:', error);
            throw error;
        }
    }

    /**
     * Update tags
     */
    async updateTags(data: UpdateIGTagsRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/tags',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating tags:', error);
            throw error;
        }
    }

    /**
     * Update impacted group entities (sponsors, managers, etc.)
     */
    async updateEntities(data: UpdateIGManageEntitiesRequestDTO): Promise<EImpactedGroupDTO> {
        try {
            const response = await this.client.put<EImpactedGroupDTO>(
                '/api/v1/people/ig/management-entities',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating impacted group entities:', error);
            throw error;
        }
    }

    /**
     * Calculate the overall change impact strength percentage
     * This is a frontend calculation based on impact assessment values
     */
    calculateChangeImpactStrength(impactAssessment: EChangeImpactAssessmentDTO | undefined): number {
        if (!impactAssessment) return 0;

        const values = [
            impactAssessment.process,
            impactAssessment.systems,
            impactAssessment.tools,
            impactAssessment.jobRoles,
            impactAssessment.criticalBehaviours,
            impactAssessment.mindsetAttitudesBeliefs,
            impactAssessment.reportingStructure,
            impactAssessment.performanceReviews,
            impactAssessment.compensation,
            impactAssessment.location,
            impactAssessment.retrenchments,
            impactAssessment.clarityOfFutureState
        ];

        const sum = values.reduce((total, value) => total + value, 0);
        const max = values.length * 5; // Maximum possible value (5 points per category)
        return Math.round((sum / max) * 100);
    }
}

export default ImpactedGroupService;