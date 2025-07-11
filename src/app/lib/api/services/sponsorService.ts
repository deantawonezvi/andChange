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

// Interface for the impacted groups response from API
interface EImpactedGroupDTO {
    id: number;
    projectId: number;
    anagraphicDataDTO: {
        id: number;
        entityName: string;
        roleDefinition: string;
        definitionOfAdoption: string;
        uniqueGroupConsiderations: string;
        hasEmail: boolean;
        membersColocated: boolean;
        virtualPreference: number;
        whatsInItForMe: string;
        individuals: number[];
    };
    groupProjectABSUPDTO: {
        id: number;
        absupAwareness: number;
        absupBuyin: number;
        absupSkill: number;
        absupUse: number;
        absupProficiency: number;
    };
    groupSprintABSUPDTO: {
        id: number;
        absupAwareness: number;
        absupBuyin: number;
        absupSkill: number;
        absupUse: number;
        absupProficiency: number;
    };
    tagDTOs: Array<{
        id: number;
        tagText: string;
        tagDescription: string;
        impactedGroups: string[];
    }>;
    adoptionAssessments: Array<{
        id: number;
        adoption_assessment: string;
        adoption_threshold: number;
    }>;
    resistanceAssessment: {
        id: number;
        anticipatedResistanceLevel: number;
        anticipatedResistanceDriver: string;
        resistanceManagementTactics: Array<{
            id: number;
            tacticDescription: string;
            tacticDescriptionRating: number;
        }>;
    };
    changeImpactAssessment: {
        id: number;
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
    };
    sponsors: number[];
    managersOfManagers: number[];
    managersOfPeople: number[];
    echangeImpactAssessmentDescriptionsDTO: {
        id: number;
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
    };
}

export class SponsorService {
    private client: AxiosInstance;
    private static instance: SponsorService;

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
        const response = await this.client.get(`/api/v1/people/sponsor/${id}`);
        return response.data;
    }

    async createSponsor(sponsor: CreateCommonEntityRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.post('/api/v1/people/sponsor', sponsor);
        return response.data;
    }

    async updateAnagraphicData(data: UpdateAnagraphicDataRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put('/api/v1/people/sponsor/anagraphic-data', data);
        return response.data;
    }

    async updateProjectABSUP(data: UpdateABSUPRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put('/api/v1/people/sponsor/project-absup', data);
        return response.data;
    }

    async updateSprintABSUP(data: UpdateABSUPRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put('/api/v1/people/sponsor/sprint-absup', data);
        return response.data;
    }

    async updateUnityAssessment(data: UpdateUnityAssessmentRequestDTO): Promise<ESponsorDTO> {
        const response = await this.client.put('/api/v1/people/sponsor/unity-assessment', data);
        return response.data;
    }

    /**
     * Get all sponsors for an organization
     * First fetches all impacted groups, extracts sponsor IDs, then fetches sponsor details
     */
    async getSponsorsByOrganization(organizationId: number): Promise<ESponsorDTO[]> {
        try {
            // Step 1: Get all impacted groups for the organization
            const impactedGroupsResponse = await this.client.get<EImpactedGroupDTO[]>(
                `/api/v1/people/igs-by-organization?organization-id=${organizationId}`
            );

            const impactedGroups = impactedGroupsResponse.data;

            // Step 2: Extract all unique sponsor IDs from impacted groups
            const sponsorIds = new Set<number>();

            impactedGroups.forEach(group => {
                if (group.sponsors && Array.isArray(group.sponsors)) {
                    group.sponsors.forEach(sponsorId => {
                        if (sponsorId) {
                            sponsorIds.add(sponsorId);
                        }
                    });
                }
            });

            // Step 3: Fetch detailed sponsor information for each sponsor ID
            const sponsorPromises = Array.from(sponsorIds).map(sponsorId =>
                this.getSponsorById(sponsorId)
            );

            // Wait for all sponsor details to be fetched
            return await Promise.all(sponsorPromises);

        } catch (error) {
            console.error('Error fetching sponsors by organization:', error);
            throw new Error('Failed to fetch sponsors for organization');
        }
    }

    /**
     * Get sponsors for a specific project within an organization
     */
    async getSponsorsByProject(projectId: number, organizationId: number): Promise<ESponsorDTO[]> {
        try {
            // Get all sponsors for the organization
            const allSponsors = await this.getSponsorsByOrganization(organizationId);

            // Filter sponsors that belong to the specific project
            return allSponsors.filter(sponsor =>
                sponsor.projectId === projectId
            );

        } catch (error) {
            console.error('Error fetching sponsors by project:', error);
            throw new Error('Failed to fetch sponsors for project');
        }
    }

    /**
     * Get sponsors that are not assigned to a specific impacted group
     * Useful for the "select existing sponsor" functionality
     */
    async getUnassignedSponsors(projectId: number, organizationId: number, excludeImpactedGroupId: number): Promise<ESponsorDTO[]> {
        try {
            // Get all impacted groups for the organization
            const impactedGroupsResponse = await this.client.get<EImpactedGroupDTO[]>(
                `/api/v1/people/igs-by-organization?organization-id=${organizationId}`
            );

            const impactedGroups = impactedGroupsResponse.data;

            // Find the specific impacted group to exclude
            const targetGroup = impactedGroups.find(group => group.id === excludeImpactedGroupId);
            const assignedSponsorIds = new Set(targetGroup?.sponsors || []);

            // Get all sponsors for the project
            const allProjectSponsors = await this.getSponsorsByProject(projectId, organizationId);

            // Filter out sponsors that are already assigned to the current impacted group
            const unassignedSponsors = allProjectSponsors.filter(sponsor =>
                !assignedSponsorIds.has(sponsor.id!)
            );

            return unassignedSponsors;

        } catch (error) {
            console.error('Error fetching unassigned sponsors:', error);
            throw new Error('Failed to fetch unassigned sponsors');
        }
    }

    getFullName(sponsor: ESponsorDTO): string {
        return sponsor.anagraphicDataDTO.entityName;
    }

    getSponsorTitle(sponsor: ESponsorDTO): string {
        return sponsor.sponsorTitle || sponsor.anagraphicDataDTO.roleDefinition || 'Sponsor';
    }

    /**
     * Calculate the average ABSUP score for a sponsor
     */
    getABSUPAverage(sponsor: ESponsorDTO): number {
        if (!sponsor.groupProjectABSUPDTO) return 0;

        const { absupAwareness, absupBuyin, absupSkill, absupUse, absupProficiency } = sponsor.groupProjectABSUPDTO;
        return (absupAwareness + absupBuyin + absupSkill + absupUse + absupProficiency) / 5;
    }

    /**
     * Get a display-friendly influence level
     */
    getInfluenceLevel(sponsor: ESponsorDTO): string {
        const level = sponsor.groupUnityAssessmentDTO?.influenceLevel || 1;
        if (level <= 2) return 'High';
        if (level <= 3) return 'Medium';
        return 'Low';
    }

    /**
     * Check if sponsor is primary
     */
    isPrimarySponsor(sponsor: ESponsorDTO): boolean {
        return sponsor.groupUnityAssessmentDTO?.primary || false;
    }
}

export default SponsorService;