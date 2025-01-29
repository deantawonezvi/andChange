import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface SOrganizationDTO {
    id?: number;
    organizationName: string;
    industry: string;
    language: string;
}

export interface CreateOrganizationRequestDTO {
    organizationName: string;
    industry: string;
    language: string;
    ownerUserId: string;
}

export class OrganizationService {
    private static instance: OrganizationService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): OrganizationService {
        if (!OrganizationService.instance) {
            OrganizationService.instance = new OrganizationService();
        }
        return OrganizationService.instance;
    }

    /**
     * Get all organizations
     */
    async getAllOrganizations(): Promise<SOrganizationDTO[]> {
        try {
            const response = await this.client.get<SOrganizationDTO[]>('/api/v1/structure/organizations');
            return response.data;
        } catch (error) {
            console.error('Error fetching organizations:', error);
            throw error;
        }
    }

    /**
     * Get all organizations accessible to the current user
     */
    async getAccessibleOrganizations(): Promise<SOrganizationDTO[]> {
        try {
            const response = await this.client.get<number[]>('/api/v1/auth/organizations');
            const orgIds = response.data;
            const organizationPromises = orgIds.map(id => this.getOrganizationById(id));
            return await Promise.all(organizationPromises);
        } catch (error) {
            console.error('Error fetching accessible organizations:', error);
            throw error;
        }
    }

    /**
     * Get organization by ID
     */
    async getOrganizationById(organizationId: number): Promise<SOrganizationDTO> {
        try {
            const response = await this.client.get<SOrganizationDTO>(
                `/api/v1/structure/organization/${organizationId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching organization:', error);
            throw error;
        }
    }

    /**
     * Create a new organization
     */
    async createOrganization(organization: CreateOrganizationRequestDTO): Promise<SOrganizationDTO> {
        try {
            const response = await this.client.post<SOrganizationDTO>(
                '/api/v1/structure/organization',
                organization
            );
            return response.data;
        } catch (error) {
            console.error('Error creating organization:', error);
            throw error;
        }
    }

    /**
     * Update an existing organization
     */
    async updateOrganization(organization: SOrganizationDTO): Promise<SOrganizationDTO> {
        try {
            const response = await this.client.put<SOrganizationDTO>(
                '/api/v1/structure/organization',
                organization
            );
            return response.data;
        } catch (error) {
            console.error('Error updating organization:', error);
            throw error;
        }
    }
}