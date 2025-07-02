import { FormField } from "@/app/lib/api/formTypes";

export interface CulturalFactorsFormData {

    emotionalExpressivenessLevel: number;

    uncertaintyAvoidanceLevel: number;

    powerDistanceLevel: number;

    individualismVsCollectivismLevel: number;

    performanceViaMetricsVsRelationshipsLevel: number;

    assertivenessLevel: number;

    stabilityVsInnovationLevel: number;

    consultativeDecisionMakingLevel: number;
}

export interface ModelCulturalFactorsDTO {
    modelId: number;
    uncertaintyAvoidance: number;
    powerDistance: number;
    individualismVsCollectivism: number;
    performanceViaMetricsVsRelationships: number;
    assertiveness: number;
    stabilityVsInnovation: number;
    consultativeDecisionMakingAndInclusivity: number;
    emotionalExpressiveness: number;
}

export const culturalFactorsFields: FormField[] = [
    {
        fieldName: 'emotionalExpressivenessLevel',
        label: 'Emotional Expressiveness',
        tooltip: 'The degree to which emotions are expressed openly in the organization',
        type: 'radio',
        options: [
            { value: 1, label: 'Non-Expressive' },
            { value: 2, label: 'Reserved Expressiveness' },
            { value: 3, label: 'Moderate Expressiveness' },
            { value: 4, label: 'Open Expressiveness' },
            { value: 5, label: 'Highly Expressive' }
        ],
        orientation: 'vertical',
        required: true,
        order: 1
    },
    {
        fieldName: 'uncertaintyAvoidanceLevel',
        label: 'Uncertainty Avoidance',
        tooltip: 'How the organization deals with ambiguity and uncertainty',
        type: 'radio',
        options: [
            { value: 1, label: 'Low concern of change' },
            { value: 2, label: 'Cursory attention to change' },
            { value: 3, label: 'Some concern about change' },
            { value: 4, label: 'Moderately concerned about change' },
            { value: 5, label: 'Avoids change where possible' }
        ],
        orientation: 'vertical',
        required: true,
        order: 2
    },
    {
        fieldName: 'powerDistanceLevel',
        label: 'Power Distance',
        tooltip: 'The extent to which hierarchical relationships are emphasized and accepted',
        type: 'radio',
        options: [
            { value: 1, label: 'Relaxed relationships with leaders' },
            { value: 2, label: 'Awareness of hierarchy, perceived access to leaders' },
            { value: 3, label: 'Somewhat formal relationships with leaders' },
            { value: 4, label: 'Careful management of hierarchy barriers' },
            { value: 5, label: 'Low leader access, hierarchy defines access' }
        ],
        required: true,
        orientation: 'vertical',
        order: 3
    },
    {
        fieldName: 'individualismVsCollectivismLevel',
        label: 'Individualism vs Collectivism',
        tooltip: 'The balance between individual achievement and group harmony',
        type: 'radio',
        options: [
            { value: 1, label: 'Individualistic' },
            { value: 2, label: 'Individualistic over collective' },
            { value: 3, label: 'Balance of individual & group priorities' },
            { value: 4, label: 'Group over individual' },
            { value: 5, label: 'High team/group orientation' }
        ],
        required: true,
        orientation: 'vertical',
        order: 4
    },
    {
        fieldName: 'performanceViaMetricsVsRelationshipsLevel',
        label: 'Performance via Metrics vs Relationships',
        tooltip: 'Whether performance is judged via objective metrics or relationship quality',
        type: 'radio',
        options: [
            { value: 1, label: 'Relationships drive performance' },
            { value: 2, label: 'Metrics occasionally referenced' },
            { value: 3, label: 'Priority metrics tied to relationships' },
            { value: 4, label: 'Metrics-driven behavior, relationships moderate impact' },
            { value: 5, label: 'Metrics are the only focus' }
        ],
        required: true,
        orientation: 'vertical',
        order: 5
    },
    {
        fieldName: 'assertivenessLevel',
        label: 'Assertiveness',
        tooltip: 'How directly people communicate and assert themselves in the organization',
        type: 'radio',
        options: [
            { value: 1, label: 'Low Assertiveness' },
            { value: 2, label: 'Modest, cooperative, and polite' },
            { value: 3, label: 'Mixed levels of assertiveness' },
            { value: 4, label: 'Mainly assertive values' },
            { value: 5, label: 'High assertiveness' }
        ],
        required: true,
        orientation: 'vertical',
        order: 6
    },
    {
        fieldName: 'stabilityVsInnovationLevel',
        label: 'Stability vs Innovation',
        tooltip: 'The organization\'s preference for predictability versus creativity and risk-taking',
        type: 'radio',
        options: [
            { value: 1, label: 'High stability focus' },
            { value: 2, label: 'Some innovation, mostly stable' },
            { value: 3, label: 'Balance of stability & innovation' },
            { value: 4, label: 'Innovation in selected areas' },
            { value: 5, label: 'High innovation, disruption accepted' }
        ],
        required: true,
        orientation: 'vertical',
        order: 7
    },
    {
        fieldName: 'consultativeDecisionMakingLevel',
        label: 'Decision Making & Inclusivity',
        tooltip: 'How widely input is sought and how inclusive the decision-making process is',
        type: 'radio',
        options: [
            { value: 1, label: 'Little consultation/inclusivity' },
            { value: 2, label: 'Powers reserved in many cases' },
            { value: 3, label: 'Consultation in certain cases' },
            { value: 4, label: 'Some consultation & inclusivity' },
            { value: 5, label: 'High consultation & inclusivity' }
        ],
        required: true,
        orientation: 'vertical',
        order: 8
    }
];


export const culturalFactorsDescriptions = {
    emotionalExpressiveness: [
        "Non-Expressive: Individuals rarely show emotions. Stoic or distant.",
        "Reserved Expressiveness: Controlled emotions, expressed in comfortable settings.",
        "Moderate Expressiveness: Express emotions noticeably but not overwhelmingly.",
        "Open Expressiveness: Freely expressive, body language clear.",
        "Highly Expressive: Strong emotions, open expressions."
    ],
    uncertaintyAvoidance: [
        "Low concern of change: Passive approach to change.",
        "Cursory attention to change: Limited effort to manage change saturation.",
        "Some concern about change: Risk of change fatigue; good management helps.",
        "Moderately concerned about change: Change requires clear reasons; good support is needed.",
        "Avoids change where possible: Resistance to change, over-analysis, full explanations needed."
    ],
    powerDistance: [
        "Relaxed relationships with leaders: Buy-in is slow; hearsay influences decisions.",
        "Awareness of hierarchy, perceived access to leaders: Leader communication acknowledged but hearsay still matters.",
        "Somewhat formal relationships with leaders: Leaders need effort to gain buy-in.",
        "Careful management of hierarchy barriers: Leader influence is high, formal & informal comms help.",
        "Low leader access, hierarchy defines access: Resistance rises due to perceived irrelevance."
    ],
    individualismVsCollectivism: [
        "Individualistic: Independence is valued.",
        "Individualistic over collective: WIIFM still important but some group awareness.",
        "Balance of individual & group priorities: Both personal and group goals count.",
        "Group over individual: Group benefits take priority, but personal interests still considered.",
        "High team/group orientation: Group consensus over individual choice."
    ],
    performanceViaMetricsVsRelationships: [
        "Relationships drive performance: Performance to please leaders first.",
        "Metrics occasionally referenced: Metrics not fully adopted; leader preferences first.",
        "Priority metrics tied to relationships: Performance metrics matter but leaders' views still influential.",
        "Metrics-driven behavior, relationships moderate impact: Metrics strongly influence performance.",
        "Metrics are the only focus: Change is a waste unless it improves metrics."
    ],
    assertiveness: [
        "Low Assertiveness: Indirect communication, harmony-focused.",
        "Modest, cooperative, and polite: Feedback is cautious, indirect.",
        "Mixed levels of assertiveness: Some direct feedback; competition vs collaboration varies.",
        "Mainly assertive values: Direct but polite communication.",
        "High assertiveness: Direct, competitive, and confrontational communication."
    ],
    stabilityVsInnovation: [
        "High stability focus: Consistency and reliability valued.",
        "Some innovation, mostly stable: Innovation accepted if structured.",
        "Balance of stability & innovation: Trust & customer views valued.",
        "Innovation in selected areas: Flexibility & adaptability encouraged.",
        "High innovation, disruption accepted: Encourages experimentation & risk-taking."
    ],
    consultativeDecisionMaking: [
        "Little consultation/inclusivity: Decisions concentrated in leaders.",
        "Powers reserved in many cases: Some decision-making delegated.",
        "Consultation in certain cases: Moderate collaboration, mixed engagement.",
        "Some consultation & inclusivity: Collaborative decision-making emerging.",
        "High consultation & inclusivity: Strong collaboration, community focus."
    ]
};