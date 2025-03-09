export const leadershipFields = [
    {
        fieldName: 'sponsorshipConsensusOnDefinitionOfSuccessRating',
        label: 'The sponsorship coalition is unified around a shared definition of success',
        tooltip: 'To what extent do sponsors of this change agree on a shared definition of how success will appear',
        required: true,
        type: 'slider',
        min: 1,
        max: 3,
        marks: [
            { value: 1, label: 'Incomplete' },
            { value: 2, label: 'Acceptable' },
            { value: 3, label: 'Complete' }
        ],
        order: 1,
        multiline: false,
    },
    {
        fieldName: 'sponsorHasAuthorityRating',
        label: 'The change is backed by a primary sponsor with requisite authority over people, processes, etc.',
        tooltip: 'Can you name a primary sponsor? If none or ambiguous, mark as incomplete.',
        required: true,
        type: 'slider',
        min: 1,
        max: 3,
        marks: [
            { value: 1, label: 'Incomplete' },
            { value: 2, label: 'Acceptable' },
            { value: 3, label: 'Complete' }
        ],
        order: 2
    },
    {
        fieldName: 'sponsorIsResolvingIssuesRating',
        label: 'The primary sponsor addresses issues & makes decisions on schedule, scope, and resources',
        tooltip: 'Is the primary sponsor active in receiving reports & making decisions for the project team?',
        required: true,
        type: 'slider',
        min: 1,
        max: 3,
        marks: [
            { value: 1, label: 'Incomplete' },
            { value: 2, label: 'Acceptable' },
            { value: 3, label: 'Complete' }
        ],
        order: 3
    },
    {
        fieldName: 'strengthOfSponsorCoalitionAssessedRating',
        label: 'The evaluation of the sponsor coalition\'s strength is finalized',
        tooltip: 'Do we know who supports, is neutral, or opposes the change?',
        required: true,
        type: 'select',
        min: 1,
        max: 3,
        options: [
            { value: 1, label: 'Incomplete' },
            { value: 2, label: 'Acceptable' },
            { value: 3, label: 'Complete' }
        ],
        order: 4
    },
    {
        fieldName: 'changeStrategyWithSponsorshipCommitmentRating',
        label: 'The change management strategy is supported by the necessary sponsorship commitment',
        tooltip: 'Sponsor commitment means direct communication, involvement, and alignment among sponsors.',
        required: true,
        type: 'select',
        min: 1,
        max: 3,
        options: [
            { value: 1, label: 'Incomplete' },
            { value: 2, label: 'Acceptable' },
            { value: 3, label: 'Complete' }
        ],
        order: 5
    }
];
