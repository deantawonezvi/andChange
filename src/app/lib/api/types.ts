import { Control, FieldErrors } from "react-hook-form";
import { ModelAnagraphicDataDTO } from "./services/modelService";

export interface AuthConfig {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export interface BaseFormField {
    fieldName: keyof ModelAnagraphicDataDTO;
    ratingFieldName: keyof ModelAnagraphicDataDTO;
    label: string;
    tooltip: string;
    required?: boolean;
}

export interface TextFormField extends BaseFormField {
    type?: 'text';
    multiline?: boolean;
}

export interface SelectFormField extends BaseFormField {
    type: 'select';
    options: string[];
}

export type FormField = TextFormField | SelectFormField;

// Component Props Types
export interface QuestionWithTooltipProps {
    label: string;
    tooltip: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}

export interface AdequacyRatingProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
}

export interface QuestionWithRatingProps {
    label: string;
    tooltip: string;
    control: Control<ModelAnagraphicDataDTO>;
    fieldName: keyof ModelAnagraphicDataDTO;
    ratingFieldName: keyof ModelAnagraphicDataDTO;
    required?: boolean;
    multiline?: boolean;
    errors: FieldErrors<ModelAnagraphicDataDTO>;
    children?: React.ReactNode;
}

export const formFields: FormField[] = [
    {
        fieldName: 'organizationName',
        ratingFieldName: 'organizationNameRating',
        label: 'Organization Name',
        tooltip: 'Enter the full legal name of your organization',
        required: true,
    },
    {
        fieldName: 'industry',
        ratingFieldName: 'industryRating',
        label: 'Industry',
        tooltip: 'Select the primary industry sector of your organization',
        required: true,
        type: 'select',
        options: [
            'Technology',
            'Healthcare',
            'Finance',
            'Manufacturing',
            'Retail',
            'Education',
            'Government',
            'Non-profit',
            'FMCG',
            'Other'
        ]
    },
    {
        fieldName: 'organizationValues',
        ratingFieldName: 'organizationValuesRating',
        label: 'Organization Values',
        tooltip: 'List the core values that guide your organization',
        required: true,
        multiline: true,
    },
    {
        fieldName: 'definitionOfSuccess',
        ratingFieldName: 'definitionOfSuccessRating',
        label: 'Definition of Success',
        tooltip: 'Describe what success looks like for this organization',
        required: true,
        multiline: true,
    },
    {
        fieldName: 'organizationBenefits',
        ratingFieldName: 'organizationBenefitsRating',
        label: 'Organization Benefits',
        tooltip: 'Describe the benefits this change will bring to the organization',
        required: true,
        multiline: true,
    }
] as const;
