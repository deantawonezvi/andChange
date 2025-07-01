import { FormField } from "@/app/lib/api/formTypes";

export interface CommunicationToneFormData {

    formalityCasualityLevel: number;

    enthusiasmLevel: number;

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
        orientation: 'horizontal',
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
        orientation: 'horizontal',
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
        orientation: 'horizontal',
        required: true,
        order: 3
    }
];


export const communicationToneDescriptions = {
    formality: [
        "This level is characterized by a strict adherence to formal rules of language. Communications are structured, use full titles and last names, and avoid contractions and slang. The language is precise and may include technical or legal jargon. Highly formal communication is typical in diplomatic correspondence, legal documents, and traditional business settings.",
        "Formal communication still adheres to standard conventions of grammar and syntax but is less rigid than highly formal communication. It uses polite language and may still include titles but can be slightly more relaxed in terms of sentence structure. This tone is common in professional business communications, official letters, and emails to unfamiliar recipients.",
        "This level bridges formal and casual communication. It is relaxed yet respectful and might mix more conversational language with formalities. Moderately formal communication often uses first names, some contractions, and more direct language. It’s appropriate for internal company communications, professional but friendly emails, and presentations..",
        "Casual communication is informal and uses colloquial language. It often includes slang, contractions, and idiomatic expressions. The tone is friendly and personal, suitable for communications among colleagues who know each other well, in less formal company cultures, or in personal correspondence.",
        "Highly casual communication is very informal and can include jargon, text speak, and even profanity when deemed acceptable among the participants. It resembles conversation among close friends and is marked by a significant departure from formal language conventions. This level of communication is usually inappropriate in professional settings but can be seen in personal texts, chats among close peers, or in creative contexts that value authenticity and personality."
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