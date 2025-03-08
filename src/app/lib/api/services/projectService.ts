import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface SProjectDTO {
    id?: number;
    organizationId: number;
    projectName: string;
}

export interface CreateProjectRequestDTO {
    organizationId: number;
    projectName: string;
}

export class ProjectService {
    private static instance: ProjectService;
    private client: AxiosInstance;

    private constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        this.client = createAxiosClient(baseURL, process.env.NODE_ENV === 'development');
    }

    public static getInstance(): ProjectService {
        if (!ProjectService.instance) {
            ProjectService.instance = new ProjectService();
        }
        return ProjectService.instance;
    }

    /**
     * Get all projects
     */
    async getAllProjects(): Promise<SProjectDTO[]> {
        try {
            const response = await this.client.get<SProjectDTO[]>('/api/v1/structure/projects');
            return response.data;
        } catch (error) {
            console.log('Error fetching projects:', error);
            throw error;
        }
    }

    /**
     * Get projects by organization ID
     */
    async getProjectsByOrganization(organizationId: number): Promise<SProjectDTO[]> {
        try {
            const response = await this.client.get<SProjectDTO[]>(
                `/api/v1/structure/projects-by-organization?organizationId=${organizationId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching projects by organization:', error);
            throw error;
        }
    }

    /**
     * Get project by ID
     */
    async getProjectById(projectId: number): Promise<SProjectDTO> {
        try {
            const response = await this.client.get<SProjectDTO>(
                `/api/v1/structure/project/${projectId}`
            );
            return response.data;
        } catch (error) {
            console.log('Error fetching project:', error);
            throw error;
        }
    }

    /**
     * Create a new project
     */
    async createProject(project: CreateProjectRequestDTO): Promise<SProjectDTO> {
        try {
            const response = await this.client.post<SProjectDTO>(
                '/api/v1/structure/project',
                project
            );
            return response.data;
        } catch (error) {
            console.log('Error creating project:', error);
            throw error;
        }
    }

    /**
     * Update an existing project
     */
    async updateProject(project: SProjectDTO): Promise<SProjectDTO> {
        try {
            const response = await this.client.put<SProjectDTO>(
                '/api/v1/structure/project',
                project
            );
            return response.data;
        } catch (error) {
            console.log('Error updating project:', error);
            throw error;
        }
    }
}