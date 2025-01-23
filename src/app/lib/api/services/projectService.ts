import { ApiClient } from '@/app/lib/api/client';

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
    private apiClient: ApiClient;

    private constructor() {
        this.apiClient = ApiClient.getInstance();
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
            return await this.apiClient.get<SProjectDTO[]>('/api/v1/structure/projects');
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    /**
     * Get projects by organization ID
     */
    async getProjectsByOrganization(organizationId: number): Promise<SProjectDTO[]> {
        try {
            return await this.apiClient.get<SProjectDTO[]>(
                `/api/v1/structure/projects-by-organization?organizationId=${organizationId}`
            );
        } catch (error) {
            console.error('Error fetching projects by organization:', error);
            throw error;
        }
    }

    /**
     * Get project by ID
     */
    async getProjectById(projectId: number): Promise<SProjectDTO> {
        try {
            return await this.apiClient.get<SProjectDTO>(
                `/api/v1/structure/project/${projectId}`
            );
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    }

    /**
     * Create a new project
     */
    async createProject(project: CreateProjectRequestDTO): Promise<SProjectDTO> {
        try {
            return await this.apiClient.post<SProjectDTO, CreateProjectRequestDTO>(
                '/api/v1/structure/project',
                project
            );
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    /**
     * Update an existing project
     */
    async updateProject(project: SProjectDTO): Promise<SProjectDTO> {
        try {
            return await this.apiClient.put<SProjectDTO, SProjectDTO>(
                '/api/v1/structure/project',
                project
            );
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }
}