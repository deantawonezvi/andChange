import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface EIndividualDTO {
    id?: number;
    organizationId: number;
    firstName: string;
    lastName: string;
}

export interface CreateIndividualRequestDTO {
    organizationId: number;
    firstName: string;
    lastName: string;
}

export class IndividualService {
    private static instance: IndividualService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): IndividualService {
        if (!IndividualService.instance) {
            IndividualService.instance = new IndividualService();
        }
        return IndividualService.instance;
    }

    /**
     * Get all individuals for an organization
     * @param organizationId The ID of the organization
     * @returns Promise with array of EIndividualDTO
     */
    async getIndividualsByOrganization(organizationId: number): Promise<EIndividualDTO[]> {
        const response = await this.client.get(`/api/v1/people/individuals`, {
            params: {
                'organization-id': organizationId
            }
        });
        return response.data;
    }

    /**
     * Get an individual by ID
     * @param id The ID of the individual
     * @returns Promise with EIndividualDTO
     */
    async getIndividualById(id: number): Promise<EIndividualDTO> {
        const response = await this.client.get(`/api/v1/people/individual/${id}`);
        return response.data;
    }

    /**
     * Create a new individual for an organization
     * @param data The individual data
     * @returns Promise with created EIndividualDTO
     */
    async createIndividual(data: CreateIndividualRequestDTO): Promise<EIndividualDTO> {
        const response = await this.client.post('/api/v1/people/individual', data);
        return response.data;
    }

    /**
     * Update an existing individual
     * @param data The individual data with ID
     * @returns Promise with updated EIndividualDTO
     */
    async updateIndividual(data: EIndividualDTO): Promise<EIndividualDTO> {
        const response = await this.client.put('/api/v1/people/individual', data);
        return response.data;
    }

    /**
     * Helper method to get full name of individual
     * @param individual The individual object
     * @returns String with full name
     */
    getFullName(individual: EIndividualDTO): string {
        return `${individual.firstName} ${individual.lastName}`;
    }
}

export default IndividualService;