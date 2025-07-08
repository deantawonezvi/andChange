import { AxiosInstance } from 'axios';
import createAxiosClient from '@/app/lib/api/client';

export interface ContentGenerationRequestDTO {
    id?: number;
    associatedActionPlanEntitySlotDTO: any;
    submittedRequest: string;
    generatedResult: string;
}

export interface GenerateContentForActionPlanRequestDTO {
    associatedActionPlanEntitySlotDTO: number;
}

export class ContentGenerationService {
    private static instance: ContentGenerationService;
    private client: AxiosInstance;

    private constructor() {
        this.client = createAxiosClient();
    }

    public static getInstance(): ContentGenerationService {
        if (!ContentGenerationService.instance) {
            ContentGenerationService.instance = new ContentGenerationService();
        }
        return ContentGenerationService.instance;
    }

    /**
     * Generate prompt content for multiple action plan items
     * @param slotIds Array of action plan slot IDs
     * @returns Promise<ContentGenerationRequestDTO[][]>
     */
    async generatePromptForActionPlanItems(slotIds: number[]): Promise<ContentGenerationRequestDTO[][]> {
        const response = await this.client.post<ContentGenerationRequestDTO[][]>(
            '/api/v1/content/generate-prompt-for-action-plan-items',
            slotIds
        );
        return response.data;
    }

    /**
     * Generate prompt content for a single action plan item
     * @param data Generate content request data
     * @returns Promise<ContentGenerationRequestDTO[]>
     */
    async generatePromptForActionPlanItem(data: GenerateContentForActionPlanRequestDTO): Promise<ContentGenerationRequestDTO[]> {
        const response = await this.client.post<ContentGenerationRequestDTO[]>(
            '/api/v1/content/generate-prompt-for-action-plan-item',
            data
        );
        return response.data;
    }

    /**
     * Generate AI content for multiple action plan items
     * @param slotIds Array of action plan slot IDs
     * @returns Promise<ContentGenerationRequestDTO[][]>
     */
    async generateAIContentForActionPlanItems(slotIds: number[]): Promise<ContentGenerationRequestDTO[][]> {
        const response = await this.client.post<ContentGenerationRequestDTO[][]>(
            '/api/v1/content/generate-ai-content-for-action-plan-items',
            slotIds
        );
        return response.data;
    }

    /**
     * Get existing prompt content for multiple action plan items
     * @param slotIds Array of action plan slot IDs
     * @returns Promise<ContentGenerationRequestDTO[][]>
     */
    async getPromptsForActionPlanItems(slotIds: number[]): Promise<ContentGenerationRequestDTO[][]> {
        const response = await this.client.post<ContentGenerationRequestDTO[][]>(
            '/api/v1/content/get-prompts-for-action-plan-items',
            slotIds
        );
        return response.data;
    }

    /**
     * Get existing AI content for multiple action plan items
     * @param slotIds Array of action plan slot IDs
     * @returns Promise<ContentGenerationRequestDTO[][]>
     */
    async getAIContentForActionPlanItems(slotIds: number[]): Promise<ContentGenerationRequestDTO[][]> {
        const response = await this.client.post<ContentGenerationRequestDTO[][]>(
            '/api/v1/content/get-ai-content-for-action-plan-items',
            slotIds
        );
        return response.data;
    }

    /**
     * Reroll (regenerate) content for a single action plan item
     * This combines prompt generation and AI content generation
     * @param slotId Action plan slot ID
     * @returns Promise<ContentGenerationRequestDTO[]>
     */
    async rerollContentForActionPlanItem(slotId: number): Promise<ContentGenerationRequestDTO[]> {
        try {

            await this.generatePromptForActionPlanItems([slotId]);

            const result = await this.generateAIContentForActionPlanItems([slotId]);

            return result[0] || [];
        } catch (error) {
            console.error('Error rerolling content for action plan item:', error);
            throw error;
        }
    }

    /**
     * Reroll content for multiple action plan items
     * @param slotIds Array of action plan slot IDs
     * @returns Promise<ContentGenerationRequestDTO[][]>
     */
    async rerollContentForActionPlanItems(slotIds: number[]): Promise<ContentGenerationRequestDTO[][]> {
        try {

            await this.generatePromptForActionPlanItems(slotIds);

            return await this.generateAIContentForActionPlanItems(slotIds);
        } catch (error) {
            console.error('Error rerolling content for action plan items:', error);
            throw error;
        }
    }
}

export default ContentGenerationService;