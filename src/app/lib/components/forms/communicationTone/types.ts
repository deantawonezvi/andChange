import { FormField } from "@/app/lib/api/formTypes";

export interface CommunicationToneFormData {
    // Formality vs Casualty dimension
    formalityCasualityLevel: number;

    // Enthusiasm dimension
    enthusiasmLevel: number;

    // Emotional Expressiveness dimension
    emotionalExpressivenessLevel: number;
}

export const communicationToneFields: FormField[] = [
    {
        fieldName: 'formalityCasualityLevel',
        label: 'Formal vs. Casual',
        tooltip: 'The level of formality in organizational communications',
        type: 'radio',
        options: [
            { value: 1, label: 'Highly Formal' },
            { value: 2, label: 'Formal' },
            { value: 3, label: 'Moderately Formal' },
            { value: 4, label: 'Casual' },
            { value: 5, label: 'Highly Casual' }
        ],
        orientation: 'vertical',
        required: true,
        order: 1
    },
    {
        fieldName: 'enthusiasmLevel',
        label: 'Level of Enthusiasm',
        tooltip: 'The degree of energy and excitement expressed in communications',
        type: 'radio',
        options: [
            { value: 1, label: 'Minimal Enthusiasm' },
            { value: 2, label: 'Cautious Enthusiasm' },
            { value: 3, label: 'Moderate Enthusiasm' },
            { value: 4, label: 'High Enthusiasm' },
            { value: 5, label: 'Extreme Enthusiasm' }
        ],
        orientation: 'vertical',
        required: true,
        order: 2
    },
    {
        fieldName: 'emotionalExpressivenessLevel',
        label: 'Emotional Expressiveness',
        tooltip: 'The degree to which emotions are expressed in communications',
        type: 'radio',
        options: [
            { value: 1, label: 'Non-Expressive' },
            { value: 2, label: 'Reserved Expression' },
            { value: 3, label: 'Moderate Expression' },
            { value: 4, label: 'Open Expressiveness' },
            { value: 5, label: 'Highly Expressive' }
        ],
        orientation: 'vertical',
        required: true,
        order: 3
    }
];

// Additional field data for detailed descriptions that can be used in tooltips or help text
export const communicationToneDescriptions = {
    formality: [
        "Strict adherence to formal rules, structured, uses full titles and last names, avoids contractions and slang.",
        "Adheres to standard conventions, polite language, may include titles, slightly more relaxed.",
        "Bridges formal and casual, relaxed yet respectful, uses first names, contractions, and more direct language.",
        "Informal, uses colloquial language, slang, contractions, and idiomatic expressions. Friendly and personal.",
        "Very informal, can include jargon, text speak, and even profanity when acceptable. Resembles conversation among close friends."
    ],
    enthusiasm: [
        "Very little interest or excitement, purely functional, lacking in energy.",
        "Slightly more engaged, but still holding back. Careful and measured, showing controlled interest.",
        "Visibly engaged and positive, balanced enthusiasm. Ideal for professional settings.",
        "Very energetic and passionate, uses dynamic expressions and engaging delivery techniques.",
        "Borders on zealotry, intensely energetic, may dominate conversations. Can be compelling but potentially overbearing."
    ],
    emotionalExpressiveness: [
        "Rarely shows emotions, appears stoic. Distant or detached.",
        "Controlled emotions, only expressive in private settings.",
        "Expressive but not overly dramatic. Comfortable showing emotions.",
        "Freely expresses emotions, body language, and tone.",
        "Does not hold back emotions, vivid and powerful expressions."
    ]
};

export interface ModelToneFactorsDTO {
    modelId: number;
    formalVsCasual: number;
    levelOfEnthusiasm: number;
    emotionalExpressiveness: number;
}