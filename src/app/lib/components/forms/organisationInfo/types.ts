import { FormField } from "@/app/lib/api/formTypes";

export const organisationInfoFields: FormField[] = [
    {
        fieldName: 'organizationName',
        ratingFieldName: 'organizationNameRating',
        label: 'Organization Name',
        tooltip: "What's the name of the organisation where this change will happen. This is a unique identifier of the organisation to most this change's stakeholders",
        required: true,
        order: 1
    },
    {
        fieldName: 'industry',
        ratingFieldName: 'industryRating',
        label: 'Industry',
        tooltip: 'Choose the industry in which the organisation plays a part',
        required: false,
        type: 'select',
        order: 2,
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
        fieldName: 'definitionOfSuccess',
        ratingFieldName: 'definitionOfSuccessRating',
        label: 'Definition of Success',
        tooltip: "What does success of this change look like to key stakeholders/funders. Describe this as fully as you like, including success measures from the perspective of this project and how its success contributes to the success of the organisation in achieving its strategy or general business objectives",
        required: false,
        multiline: true,
        order: 3
    },
    {
        fieldName: 'organizationBenefits',
        ratingFieldName: 'organizationBenefitsRating',
        label: 'Organizational Benefits',
        tooltip: "What are the measurable benefits for achieving this change. Describe these as fully as you like, including quantifiabe and non quantifiable benefits from the perspective of this project and how its success contributes to the success of the organisation in achieving its strategy or general business objectives",
        required: false,
        multiline: true,
        order: 4
    },
    {
        fieldName: 'reasonsForChange',
        ratingFieldName: 'reasonsForChangeRating',
        label: 'Strategic Reasons for the Change',
        tooltip: "Why is the organisation undertaking this change? What you capture here is used to in both descriptions of the project and in understanding the portfolio of change. It's important to make this as clear as possbile as the \"why\" we need to change drives acceptance and adoption of the change",
        required: false,
        multiline: true,
        order: 5
    },
    {
        fieldName: 'organizationValues',
        ratingFieldName: 'organizationValuesRating',
        label: 'Organizational Values',
        tooltip: "An organisation's core beliefs and principles that guide its operations and interactions with employees, customers, and other stakeholders",
        required: false,
        multiline: true,
        order: 6
    },
    {
        fieldName: 'sponsorAccessEvaluation',
        label: 'Sponsor Access Evaluation',
        tooltip: "How accessible to the change management and leadership teams is/are the sponsor/s of the project",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Little/no access' },
            { value: 3, label: 'Some access but requires planning' },
            { value: 5, label: 'Free access anytime and willingness to support' }
        ],
        required: true,
        order: 7
    },
    {
        fieldName: 'hasEstablishedCMO',
        label: 'Is there an established CMO function',
        tooltip: "Is there an established Change Management Office function",
        type: 'boolean',
        required: true,
        order: 8
    },
    {
        fieldName: 'changeSaturation',
        label: 'Change Saturation',
        tooltip: "The extent to which people report being saturated with change",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Organisation is change saturated' },
            { value: 3, label: 'Organisation has limited capability to change' },
            { value: 5, label: 'Organisation has high capability to change' }
        ],
        required: true,
        order: 9
    },
    {
        fieldName: 'managementOfPastChanges',
        label: 'Management of Past Changes',
        tooltip: "The perception of the success rate of past changes",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Light level of success' },
            { value: 3, label: 'Mixed levels of success' },
            { value: 5, label: 'Low level of success' }
        ],
        required: true,
        order: 10
    },
    {
        fieldName: 'organizationSharedVisionAndStrategicDirection',
        label: 'Shared Vision and Strategic Direction',
        tooltip: "Shared vision and strategic direction for the organization",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Shared broadly and clear' },
            { value: 3, label: 'Some areas are clear and/or not fully shared' },
            { value: 5, label: 'Unclear and uncoordinated' }
        ],
        required: true,
        order: 11
    },
    {
        fieldName: 'availabilityOfResourcesAndFunding',
        label: 'Resources and Funding Availability',
        tooltip: "The availability of resources and funding for change management",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Insufficient resources to manage change' },
            { value: 3, label: 'Some changes properly resourced' },
            { value: 5, label: 'Sufficient resources to manage change' }
        ],
        required: true,
        order: 12
    },
    {
        fieldName: 'leadershipMindset',
        label: 'Leadership Mindset',
        tooltip: "The degree to which leaders focus on ROI metrics after projects are launched",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Organisation loses interest after go-live' },
            { value: 3, label: 'Sometimes ROI is a focus' },
            { value: 5, label: 'Organisation measures and follows up on results' }
        ],
        required: true,
        order: 15
    },
    {
        fieldName: 'impactedEmployeeChangeCompetency',
        label: 'Impacted Employee Change Competency',
        tooltip: "Employee change skillset",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: "Affected people don't have skills to adopt change" },
            { value: 3, label: 'Some affected people have good skills to adopt change' },
            { value: 5, label: 'Affected people have good skills to adopt change' }
        ],
        required: true,
        order: 16
    },
    {
        fieldName: 'changeManagementMaturity',
        label: 'Change Management Maturity',
        tooltip: "Level of change management maturity or its consistency of application",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Changes inconsistently and not fully managed' },
            { value: 3, label: 'Changes consistently managed on some changes' },
            { value: 5, label: 'Changes managed well across all changes and areas' }
        ],
        required: true,
        order: 17
    },
    {
        fieldName: 'projectManagementMaturity',
        label: 'Project Management Maturity',
        tooltip: "Level of project management maturity or its consistency of application",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Projects inconsistently and not fully managed' },
            { value: 3, label: 'Projects consistently managed on most projects' },
            { value: 5, label: 'Projects managed well across all changes and areas' }
        ],
        required: true,
        order: 18
    }
]