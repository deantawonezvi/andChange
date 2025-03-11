import { FormField } from "@/app/lib/api/formTypes";

export interface CulturalFactorsFormData {
    // Emotional Expressiveness dimension
    emotionalExpressivenessLevel: number;

    // Uncertainty Avoidance dimension
    uncertaintyAvoidanceLevel: number;

    // Power Distance dimension
    powerDistanceLevel: number;

    // Individualism vs Collectivism dimension
    individualismVsCollectivismLevel: number;

    // Performance via Metrics vs Relationships dimension
    performanceViaMetricsVsRelationshipsLevel: number;

    // Assertiveness dimension
    assertivenessLevel: number;

    // Stability vs Innovation dimension
    stabilityVsInnovationLevel: number;

    // Consultative Decision Making & Inclusivity dimension
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
            { value: 2, label: 'Reserved Expression' },
            { value: 3, label: 'Moderate Expression' },
            { value: 4, label: 'Open Expressiveness' },
            { value: 5, label: 'Highly Expressive' }
        ],
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
            { value: 4, label: 'Moderate concern about change' },
            { value: 5, label: 'Avoids change, overanalyzes and hesitant with risks' }
        ],
        required: true,
        order: 2
    },
    {
        fieldName: 'powerDistanceLevel',
        label: 'Power Distance',
        tooltip: 'The extent to which hierarchical relationships are emphasized and accepted',
        type: 'radio',
        options: [
            { value: 1, label: 'Relaxed relationships with leaders, slow buy-in to change' },
            { value: 2, label: 'Hierarchy awareness, leaders must assert wishes to be heard' },
            { value: 3, label: 'Formal but open relationships with leaders, buy-in requires effort' },
            { value: 4, label: 'Leader influence high, formal and informal communication mix' },
            { value: 5, label: 'Low access to leaders, hierarchy defines access, resistance high' }
        ],
        required: true,
        order: 3
    },
    {
        fieldName: 'individualismVsCollectivismLevel',
        label: 'Individualism vs Collectivism',
        tooltip: 'The balance between individual achievement and group harmony',
        type: 'radio',
        options: [
            { value: 1, label: 'Individualistic' },
            { value: 2, label: 'Individualistic over group' },
            { value: 3, label: 'Balanced focus on individual and group priorities' },
            { value: 4, label: 'Team/group above individual' },
            { value: 5, label: 'Strong group orientation' }
        ],
        required: true,
        order: 4
    },
    {
        fieldName: 'performanceViaMetricsVsRelationshipsLevel',
        label: 'Performance via Metrics vs Relationships',
        tooltip: 'Whether performance is judged via objective metrics or relationship quality',
        type: 'radio',
        options: [
            { value: 1, label: 'Relationships drive performance, low instances of metrics' },
            { value: 2, label: 'Occasional use of metrics but relationships still valued' },
            { value: 3, label: 'Priority metrics tied to relationships, feedback valued' },
            { value: 4, label: 'Metrics drive behavior, but relationships still moderate' },
            { value: 5, label: 'Metrics dominate, training seen as less impactful' }
        ],
        required: true,
        order: 5
    },
    {
        fieldName: 'assertivenessLevel',
        label: 'Assertiveness',
        tooltip: 'How directly people communicate and assert themselves in the organization',
        type: 'radio',
        options: [
            { value: 1, label: 'Low Assertiveness' },
            { value: 2, label: 'Team-oriented' },
            { value: 3, label: 'Mixed assertiveness, some direct, some indirect communicators' },
            { value: 4, label: 'Mainly assertive but polite' },
            { value: 5, label: 'Highly assertive, competitive, direct' }
        ],
        required: true,
        order: 6
    },
    {
        fieldName: 'stabilityVsInnovationLevel',
        label: 'Stability vs Innovation',
        tooltip: 'The organization\'s preference for predictability versus creativity and risk-taking',
        type: 'radio',
        options: [
            { value: 1, label: 'High focus on stability, predictability valued, rules followed strictly' },
            { value: 2, label: 'Some innovation, mostly focused on stability' },
            { value: 3, label: 'Stability with some innovation allowed' },
            { value: 4, label: 'Innovation in selected areas, controlled risk' },
            { value: 5, label: 'High innovation, disruption accepted' }
        ],
        required: true,
        order: 7
    },
    {
        fieldName: 'consultativeDecisionMakingLevel',
        label: 'Consultative Decision Making & Inclusivity',
        tooltip: 'How widely input is sought and how inclusive the decision-making process is',
        type: 'radio',
        options: [
            { value: 1, label: 'Little consultation/inclusivity, leaders make most decisions' },
            { value: 2, label: 'Some delegation of decision-making, more collaboration' },
            { value: 3, label: 'Some consultation, balanced decision-making' },
            { value: 4, label: 'More inclusivity and two-way flow, people feel empowered to contribute' },
            { value: 5, label: 'High consultation, inclusivity, and empowerment' }
        ],
        required: true,
        order: 8
    }
];

// Detailed descriptions for each cultural factor level
export const culturalFactorsDescriptions = {
    emotionalExpressiveness: [
        "Non-Expressive: Emotions are rarely shown. The organization maintains a stoic, business-like atmosphere at all times.",
        "Reserved Expression: Emotions are controlled and only expressed in private settings or with trusted colleagues.",
        "Moderate Expression: There is a balanced approach to showing emotions. Appropriate expression is acceptable but not excessive.",
        "Open Expressiveness: Emotions are freely expressed and body language is animated. People communicate enthusiastically.",
        "Highly Expressive: Very animated communication with strong emotional displays. Passion and emotional connection are highly valued."
    ],
    uncertaintyAvoidance: [
        "Low concern about change. The organization embraces ambiguity and is comfortable with risks and unknowns.",
        "Cursory attention to change. Some planning for change but generally comfortable with uncertainty.",
        "Some concern about change that can lead to change fatigue. The organization prefers some structure but can adapt.",
        "Moderate concern about change. The organization prefers planning and structure to reduce ambiguity.",
        "Avoids change, overanalyzes and is hesitant with risks. The organization strongly prefers rules, structure and predictability."
    ],
    powerDistance: [
        "Relaxed relationships with leaders, slow buy-in to change. Commands have less power and authority is often questioned.",
        "Hierarchy awareness exists, but leaders must assert wishes to be heard. Authority is somewhat respected.",
        "Formal but open relationships with leaders, buy-in requires effort. Moderate respect for authority and hierarchy.",
        "Leader influence high, formal and informal communication mix. Decisions from above are generally followed.",
        "Low access to leaders, hierarchy defines access, resistance high. Strong deference to authority and formal hierarchy."
    ],
    individualismVsCollectivism: [
        "Individualistic. Personal achievement and independence are highly valued over group harmony.",
        "Individualistic over group. Personal achievements are celebrated but some team focus exists.",
        "Balanced focus on individual and group priorities. Both personal success and team cohesion are valued.",
        "Team/group above individual. The organization prioritizes team success over individual accomplishments.",
        "Strong group orientation. Harmony and collective achievement are paramount, with individuals expected to sacrifice for the group."
    ],
    performanceViaMetricsVsRelationships: [
        "Relationships drive performance. Low instances of metrics, focus on pleasing leaders first.",
        "Occasional use of metrics but relationships still valued. Performance is judged through a mix of data and personal connections.",
        "Priority metrics tied to relationships, feedback valued. Balanced approach to performance measurement.",
        "Metrics drive behavior, but relationships still moderate. Data-focused with some consideration for relationship factors.",
        "Metrics dominate, training seen as less impactful. Highly data-driven culture where numbers are the primary measure of success."
    ],
    assertiveness: [
        "Low Assertiveness. Indirect communication and conflict avoidance are the norm.",
        "Team-oriented approach with moderate directness. People express opinions but not forcefully.",
        "Mixed assertiveness. Some direct, some indirect communicators. Variable approaches to conflict resolution.",
        "Mainly assertive but polite. Direct communication is valued but delivered tactfully.",
        "Highly assertive, competitive, direct. Forthright communication and strong opinions are expected and valued."
    ],
    stabilityVsInnovation: [
        "High focus on stability. Predictability valued, rules followed strictly. Innovation is resisted.",
        "Some innovation, mostly focused on stability. Incremental improvements within established frameworks.",
        "Stability with some innovation allowed. Balanced approach that values reliability but permits new ideas.",
        "Innovation in selected areas, controlled risk. Organization encourages creativity within defined parameters.",
        "High innovation, disruption accepted. The organization embraces change, experimentation and breakthrough thinking."
    ],
    consultativeDecisionMaking: [
        "Little consultation/inclusivity. Leaders make most decisions, morale is easy to reduce, innovation is resisted.",
        "Some delegation of decision-making. More collaboration and growing empowerment.",
        "Some consultation, balanced decision-making. Moderate transparency with inconsistent conflict resolution.",
        "More inclusivity and two-way flow. People feel empowered to contribute to decisions that affect them.",
        "High consultation, inclusivity, and empowerment. Strong community feeling with broad participation in decisions."
    ]
};