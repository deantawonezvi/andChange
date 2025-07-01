import { FormField } from "@/app/lib/api/formTypes";

export interface ImpactedGroupFormData {

    entityName: string;
    roleDefinition: string;
    definitionOfAdoption: string;
    uniqueGroupConsiderations: string;
    hasEmail: boolean;
    membersColocated: boolean;
    virtualPreference: number;
    whatsInItForMe: string;
    individualsIds: number[];

    organizationalGrouping: string;
    numberOfIndividuals: number;
    preferredInteraction: number;
    readyDate?: Date;

    absupAwareness: number;
    absupBuyin: number;
    absupSkill: number;
    absupUse: number;
    absupProficiency: number;

    process: number;
    processDescription: string;
    systems: number;
    systemsDescription: string;
    tools: number;
    toolsDescription: string;
    jobRoles: number;
    jobRolesDescription: string;
    criticalBehaviours: number;
    criticalBehavioursDescription: string;
    mindsetAttitudesBeliefs: number;
    mindsetAttitudeBeliefsDescription: string;
    reportingStructure: number;
    reportingStructureDescription: string;
    performanceReviews: number;
    performanceReviewsDescription: string;
    compensation: number;
    compensationDescription: string;
    location: number;
    locationDescription: string;
    retrenchments: number;
    retrenchmentDescription: string;
    clarityOfFutureState: number;

    anticipatedResistanceLevel: number;
    anticipatedResistanceDriver: string;
    resistanceManagementTactics: {
        id?: number;
        tacticDescription: string;
        tacticDescriptionRating: number;
    }[];

    adoptionAssessments: {
        id?: number;
        adoption_assessment: string;
        adoption_threshold: number;
    }[];

    tags: number[];

    sponsors: number[];
    managersOfManagers: number[];
    managersOfPeople: number[];
}

export interface ResistanceDriverOption {
    value: string;
    label: string;
}


export interface LeaderDetails {
    name: string;
    title: string;
    availability: number;
    supportLevel: number;
    influence: number;
    leadershipAwareness: number;
    changeCommitment: number;
    formalSkills: number;
    visibleParticipation: number;
    proficiency: number;
}

export const resistanceDriverOptions: ResistanceDriverOption[] = [
    { value: 'AWARENESS', label: 'Awareness' },
    { value: 'BUYIN', label: 'Buy-in' },
    { value: 'SKILL', label: 'Skill' },
    { value: 'USE', label: 'Use' },
    { value: 'PROFICIENCY', label: 'Proficiency' }
];


export const impactedGroupFormFields: Record<string, FormField[]> = {
    basicInfo: [
        {
            fieldName: 'entityName',
            label: 'Name of the Impacted Group',
            tooltip: 'Names of individuals in the group',
            required: true,
            order: 1
        },
        {
            fieldName: 'roleDefinition',
            label: 'Role Definition e.g. sales representatives',
            tooltip: 'The functional role in the group',
            required: false,
            order: 2
        },
        {
            fieldName: 'definitionOfAdoption',
            label: 'Definition of Adoption',
            tooltip: 'How is adoption defined for this group',
            multiline: true,
            required: false,
            order: 3
        },
        {
            fieldName: 'uniqueGroupConsiderations',
            label: 'Specific Group Considerations',
            tooltip: 'Any specific notes that need to be kept in mind when considering this group?',
            multiline: true,
            required: false,
            order: 4
        },
        {
            fieldName: 'hasEmail',
            label: 'Does this group have access to Email?',
            tooltip: 'Is e-mail an effective and regular means of communication used by this group?',
            type: 'boolean',
            required: true,
            order: 5
        },
        {
            fieldName: 'membersColocated',
            label: 'Are members in the same location?',
            tooltip: 'This will affect if in-person events will be relevant for this group or if other means of communication are needed',
            type: 'boolean',
            required: true,
            order: 6
        },
        {
            fieldName: 'virtualPreference',
            label: 'Preference for virtual or in-person events',
            tooltip: 'To what degree does this group prefer virtual or in-person interactions and events?',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Virtual' },
                { value: 3, label: 'Neutral' },
                { value: 5, label: 'In-person' }
            ],
            required: true,
            order: 7
        },
        {
            fieldName: 'whatsInItForMe',
            label: 'The "What\'s in it for me?" statement for this group',
            tooltip: 'This is an important statement that will be included in many AI generated assets. Describe what are the reasons a group should change specifically. Articulate what would motivate them to engage what benefits they will perceive from the change.',
            multiline: true,
            required: true,
            order: 8
        },
        {
            fieldName: 'organizationalGrouping',
            label: 'Organisational Grouping',
            tooltip: 'A cluster of individuals needing to change in the same way',
            required: false,
            order: 9
        },
        {
            fieldName: 'preferredInteraction',
            label: 'Preference for virtual or in-person events',
            tooltip: 'To what degree does this group prefer virtual or in-person interactions and events?',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Virtual' },
                { value: 3, label: 'Neutral' },
                { value: 5, label: 'In-person' }
            ],
            required: false,
            order: 10
        },
        {
            fieldName: 'readyDate',
            label: 'Override for group adoption date',
            tooltip: 'If this group needs to adopt change earlier, specify the date',
            type: 'date',
            required: false,
            order: 11
        },
    ],
    absupFields: [
        {
            fieldName: 'absupAwareness',
            label: 'Awareness',
            tooltip: 'Current level of awareness about the change',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 1
        },
        {
            fieldName: 'absupBuyin',
            label: 'Buy-in',
            tooltip: 'Current level of buy-in for the change',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 2
        },
        {
            fieldName: 'absupSkill',
            label: 'Skill',
            tooltip: 'Current skill level for the change',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 3
        },
        {
            fieldName: 'absupUse',
            label: 'Usage',
            tooltip: 'Current usage level of the change',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 4
        },
        {
            fieldName: 'absupProficiency',
            label: 'Proficiency',
            tooltip: 'Current proficiency level with the change',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 5
        }
    ],
    adoptionAssessment: [
        {
            fieldName: 'adoptionAssessment',
            label: 'Adoption Measurable (%)',
            tooltip: 'This measures if users have begun engaging with the change. For example, in a system change it may be number of individual that have logged in more than 5 times.',
            required: false,
            order: 1,
            type: "number"
        },
        {
            fieldName: 'adoption_threshold',
            label: 'Adoption Threshold (%)',
            tooltip: 'The percentage threshold for successful adoption',
            required: false,
            order: 2,
            type: "number"

        },
        {
            fieldName: 'adoptionMeasurable',
            label: 'Usage Measurable (%)',
            tooltip: 'Measures initial engagement, e.g., number of users logging in more than 5 times',
            required: false,
            order: 3,
            type: "number"

        },
        {
            fieldName: 'usageMeasurable',
            label: 'Proficiency Measurable (%)',
            tooltip: 'Captures actual usage, e.g., number of logins per user per day',
            required: false,
            order: 4,
            type: "number"

        },
    ],
    changeImpactAssessment: [
        {
            fieldName: 'process',
            label: 'Process',
            tooltip: 'Impact on processes',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 1
        },
        {
            fieldName: 'processDescription',
            label: 'Process Description',
            tooltip: 'Description of impact on processes',
            multiline: true,
            required: false,
            order: 2
        },

        {
            fieldName: 'systems',
            label: 'Systems',
            tooltip: 'Impact on systems',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 3
        },
        {
            fieldName: 'systemsDescription',
            label: 'Systems Description',
            tooltip: 'Description of impact on systems',
            multiline: true,
            required: false,
            order: 4
        },
        {
            fieldName: 'tools',
            label: 'Tools',
            tooltip: 'Impact on tools',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 5
        },
        {
            fieldName: 'toolsDescription',
            label: 'Tools Description',
            tooltip: 'Description of impact on tools',
            multiline: true,
            required: false,
            order: 6
        },
        {
            fieldName: 'jobRoles',
            label: 'Job Roles',
            tooltip: 'Impact on job roles',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 7
        },
        {
            fieldName: 'jobRolesDescription',
            label: 'Job Roles Description',
            tooltip: 'Description of impact on job roles',
            multiline: true,
            required: false,
            order: 8
        },
        {
            fieldName: 'criticalBehaviours',
            label: 'Critical Behaviors',
            tooltip: 'Impact on critical behaviors',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 9
        },
        {
            fieldName: 'criticalBehavioursDescription',
            label: 'Critical Behaviors Description',
            tooltip: 'Description of impact on critical behaviors',
            multiline: true,
            required: false,
            order: 10
        },
        {
            fieldName: 'mindsetAttitudesBeliefs',
            label: 'Values/Mindset/Culture',
            tooltip: 'Impact on values, mindset, and culture',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 11
        },
        {
            fieldName: 'mindsetAttitudeBeliefsDescription',
            label: 'Values/Mindset/Culture Description',
            tooltip: 'Description of impact on values, mindset, and culture',
            multiline: true,
            required: false,
            order: 12
        },
        {
            fieldName: 'reportingStructure',
            label: 'Reporting Structures',
            tooltip: 'Impact on reporting structures',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 13
        },
        {
            fieldName: 'reportingStructureDescription',
            label: 'Reporting Structures Description',
            tooltip: 'Description of impact on reporting structures',
            multiline: true,
            required: false,
            order: 14
        },
        {
            fieldName: 'performanceReviews',
            label: 'Performance Reviews',
            tooltip: 'Impact on performance reviews',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 15
        },
        {
            fieldName: 'performanceReviewsDescription',
            label: 'Performance Reviews Description',
            tooltip: 'Description of impact on performance reviews',
            multiline: true,
            required: false,
            order: 16
        },
        {
            fieldName: 'compensation',
            label: 'Compensation',
            tooltip: 'Impact on compensation',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 17
        },
        {
            fieldName: 'compensationDescription',
            label: 'Compensation Description',
            tooltip: 'Description of impact on compensation',
            multiline: true,
            required: false,
            order: 18
        },
        {
            fieldName: 'location',
            label: 'Location',
            tooltip: 'Impact on location',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 19
        },
        {
            fieldName: 'locationDescription',
            label: 'Location Description',
            tooltip: 'Description of impact on location',
            multiline: true,
            required: false,
            order: 20
        },
        {
            fieldName: 'retrenchments',
            label: 'Retrenchments',
            tooltip: 'Impact on retrenchments',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 21
        },
        {
            fieldName: 'retrenchmentDescription',
            label: 'Retrenchment Description',
            tooltip: 'Description of impact on retrenchments',
            multiline: true,
            required: false,
            order: 22
        },
        {
            fieldName: 'clarityOfFutureState',
            label: 'Clarity of Future State',
            tooltip: 'Impact on clarity of future state',
            type: 'slider',
            min: 0,
            max: 5,
            marks: [
                { value: 0, label: 'None' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 23
        }

    ],
    resistanceAssessment: [
        {
            fieldName: 'anticipatedResistanceLevel',
            label: 'Anticipated Level of Resistance',
            tooltip: 'What is the anticipated level of resistance for this group?',
            type: 'slider',
            min: 1,
            max: 5,
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ],
            required: true,
            order: 1
        },
        {
            fieldName: 'anticipatedResistanceDriver',
            label: 'Strongest Driver of Resistance',
            tooltip: 'Which area is likely to be the strongest driver of resistance?',
            type: 'select',
            options: [
                'AWARENESS',
                'BUYIN',
                'SKILL',
                'USE',
                'PROFICIENCY'
            ],
            required: true,
            order: 2
        }
    ]
}