import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';
import { ModelToneFactorsDTO } from "@/app/lib/components/forms/communicationTone/types";
import { ModelCulturalFactorsDTO } from '../../components/forms/culturalFactors/types';

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

export interface ModelGovernanceDTO {
    modelId: number;
    advantagesToLeverage: string;
    advantagesToLeverageRating: number;
    implicationsToMitigate: string;
    implicationsToMitigateRating: number;
    sponsorAccessEvaluation: number;
}

export interface ModelECMAssessmentDTO {
    modelId: number;
    isProjectPerceivedAsStrategic: boolean;
    changeCompetencyOfKeyRolesDeveloped: boolean;
    establishedCMO: boolean;
}

export interface ModelOrganizationalReadinessDTO {
    modelId: number;
    perceivedNeedToChangeAmongImpacted: number;
    managementOfPastChanges: number;
    changeSaturation: number;
    organizationSharedVisionAndStrategicDirection: number;
    availabilityOfResourcesAndFunding: number;
    organizationCultureToChange: number;
    organizationalReinforcementOfChange: number;
    leadershipMindset: number;
    leadershipStyleAndPowerDistribution: number;
    seniorLeadershipChangeCompetency: number;
    peopleManagerChangeCompetency: number;
    impactedEmployeeChangeCompetency: number;
    changeManagementMaturity: number;
    projectManagementMaturity: number;
}

export interface ModelVariablesDTO {
    id: number;
    projectId: number;
    anagraphicData: ModelAnagraphicDataDTO;
    timelineAssessment: ModelTimelineAssessmentDTO;
    governance: ModelGovernanceDTO;
    ecmAssessment: ModelECMAssessmentDTO;
    organizationalReadiness: ModelOrganizationalReadinessDTO;
    budget: ModelBudgetDTO;
    valueStatement: ModelValueStatementDTO;
    changeCharacteristics: ModelChangeCharacteristicsDTO;
    pctSponsorship: ModelPCTSponsorshipDTO;
    pctChangeManagement: ModelPCTChangeManagementDTO;
    pctSuccess: ModelPCTSuccessDTO;
    toneFactorsDTO: ModelToneFactorsDTO;
    culturalFactorsDTO: ModelCulturalFactorsDTO;


}

export interface ModelBudgetDTO {
    modelId: number;
    prepareApproachBudget: number;
    manageChangeBudget: number;
    sustainOutcomesBudget: number;
    sourceOfBudget: string;
    sufficiencyOfBudget: number;
    timingAndFlow: number;
    totalProjectBudget: number;
}

export interface ModelValueStatementDTO {
    modelId: number;
    whyValueStatement: string;
    whyValueStatementRating: number;
    whyNowValueStatement: string;
    whyNowValueStatementRating: number;
    ifNotValueStatement: string;
    ifNotValueStatementRating: number;
}

export interface ModelChangeCharacteristicsDTO {
    modelId: number;
    scopeOfChange: number;
    entryPointOfCM: string;
    amountOfOverallChange: number;
    degreeOfConfidentialityRequired: number;
    timeframeAdequacyForChange: number;
    degreeOfExternalStakeholderImpact: number;
}

export interface ModelPCTSponsorshipDTO {
    modelId: number;
    sponsorHasAuthority: number;
    sponsorCanJustifyChange?: number;
    organizationHasDefinedVisionAndStrategy?: number;
    changeIsAlignedWithOrganization?: number;
    prioritiesSetAndCommunicated?: number;
    sponsorIsResolvingIssues: number;
    sponsorIsParticipatingThroughoutLifecycle?: number;
    sponsorIsEncouragingLeadersToParticipate?: number;
    sponsorBuildingAwarenessOfNeedDirectly?: number;
    sponsorIsReinforcingChange?: number;
}

export interface ModelPCTChangeManagementDTO {
    modelId: number;
    assessedImpactOfChange?: number;
    assessedChangeRisk?: number;
    changeHasAdoptionAndUsageObjectives?: number;
    strengthOfSponsorCoalitionAssessed: number;
    changeStrategyWithSponsorshipCommitment: number;
    resourcesIdentifiedAndAcquired?: number;
    resistanceMitigationAndAdoptionPlansUnderway?: number;
    effectivenessMonitoredAndAdaptionOccurring?: number;
    organizationReadyToOwnAndSustainChange?: number;
}

export interface ModelPCTSuccessDTO {
    modelId: number;
    processInputsDefined?: number;
    processBenefitsDefined?: number;
    projectObjectivesDefined?: number;
    adoptionAndUsageObjectivesDefined?: number;
    metricsOfBenefitsAndObjectivesDefined?: number;
    benefitsAndObjectivesPrioritized?: number;
    benefitAndObjectiveOwnershipDesignated?: number;
    benefitAndObjectivePeopleDependencyEvaluated?: number;
    definitionOfSuccessDefined?: number;
    sponsorshipConsensusOnDefinitionOfSuccess: number;
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

    async updateGovernance(data: ModelGovernanceDTO): Promise<ModelGovernanceDTO> {
        try {
            const response = await this.client.put<ModelGovernanceDTO>(
                '/api/v1/model/governance',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating governance:', error);
            throw error;
        }
    }

    async updateECMAssessment(data: ModelECMAssessmentDTO): Promise<ModelECMAssessmentDTO> {
        try {
            const response = await this.client.put<ModelECMAssessmentDTO>(
                '/api/v1/model/ecm-assessment',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating ECM assessment:', error);
            throw error;
        }
    }

    async updateOrganizationalReadiness(data: ModelOrganizationalReadinessDTO): Promise<ModelOrganizationalReadinessDTO> {
        try {
            const response = await this.client.put<ModelOrganizationalReadinessDTO>(
                '/api/v1/model/organizational-readiness',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating organizational readiness:', error);
            throw error;
        }
    }

    async updateBudget(data: ModelBudgetDTO): Promise<ModelBudgetDTO> {
        try {
            const response = await this.client.put<ModelBudgetDTO>(
                '/api/v1/model/budget',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating budget:', error);
            throw error;
        }
    }

    async updateValueStatement(data: ModelValueStatementDTO): Promise<ModelValueStatementDTO> {
        try {
            const response = await this.client.put<ModelValueStatementDTO>(
                '/api/v1/model/value-statements',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating value statement:', error);
            throw error;
        }
    }

    async updateChangeCharacteristics(data: ModelChangeCharacteristicsDTO): Promise<ModelChangeCharacteristicsDTO> {
        try {
            const response = await this.client.put<ModelChangeCharacteristicsDTO>(
                '/api/v1/model/change-characteristics',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating change characteristics:', error);
            throw error;
        }
    }

    async updatePCTSponsorship(data: ModelPCTSponsorshipDTO): Promise<ModelPCTSponsorshipDTO> {
        try {
            const response = await this.client.put<ModelPCTSponsorshipDTO>(
                '/api/v1/model/pct-sponsorship',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating PCT Sponsorship:', error);
            throw error;
        }
    }

    async updatePCTChangeManagement(data: ModelPCTChangeManagementDTO): Promise<ModelPCTChangeManagementDTO> {
        try {
            const response = await this.client.put<ModelPCTChangeManagementDTO>(
                '/api/v1/model/pct-change-management',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating PCT Change Management:', error);
            throw error;
        }
    }

    async updatePCTSuccess(data: ModelPCTSuccessDTO): Promise<ModelPCTSuccessDTO> {
        try {
            const response = await this.client.put<ModelPCTSuccessDTO>(
                '/api/v1/model/pct-success',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating PCT Success:', error);
            throw error;
        }
    }

    /**
     * Update the tone factors for a project
     */
    async updateToneFactors(data: ModelToneFactorsDTO): Promise<ModelToneFactorsDTO> {
        try {
            const response = await this.client.put<ModelToneFactorsDTO>(
                '/api/v1/model/tone-factors',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating tone factors:', error);
            throw error;
        }
    }

    /**
     * Update the cultural factors for a project
     */
    async updateCulturalFactors(data: ModelCulturalFactorsDTO): Promise<ModelCulturalFactorsDTO> {
        try {
            const response = await this.client.put<ModelCulturalFactorsDTO>(
                '/api/v1/model/cultural-factors',
                data
            );
            return response.data;
        } catch (error) {
            console.log('Error updating cultural factors:', error);
            throw error;
        }
    }

}