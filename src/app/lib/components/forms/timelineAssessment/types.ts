import { FormField } from "@/app/lib/api/formTypes";

export const timelineFields: FormField[] = [
    {
        fieldName: 'entryPointOfCM',
        label: 'Entry point of Change Management',
        tooltip: 'When will/did Change Management start to be practised in this project',
        type: 'date',
        required: true,
        order: 1
    },
    {
        fieldName: 'timeframeAdequacyForChange',
        label: 'Adequacy of the timeframe for change',
        tooltip: 'How adequate is the timeframe for implementing this change',
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'There is lots of time' },
            { value: 3, label: 'Timeframe is tight but trade-offs possible' },
            { value: 5, label: 'Timeframe is tight and little option to trade-off' }
        ],
        required: true,
        order: 2
    },
    {
        fieldName: 'kickoff',
        label: 'Kick-Off',
        tooltip: 'The official start of the project, aligning objectives, stakeholders, and timelines.',
        type: 'date',
        required: true,
        order: 3
    },
    {
        fieldName: 'designDefined',
        label: 'Design',
        tooltip: 'Planning the solution and architecture, engaging prototype users, and preparing leaders for their roles in change.',
        type: 'date',
        required: true,
        order: 4
    },
    {
        fieldName: 'develop',
        label: 'Develop',
        tooltip: 'Building project deliverables, communicating progress, and ensuring leaders socialize the change.',
        type: 'date',
        required: true,
        order: 5
    },
    {
        fieldName: 'test',
        label: 'Testing',
        tooltip: 'Examining project deliverables, involving users in testing, and building confidence in the new system.',
        type: 'date',
        required: true,
        order: 6
    },
    {
        fieldName: 'deploy',
        label: 'Go-Live / Deploy',
        tooltip: 'Releasing the project into the live environment, ensuring user support and a smooth transition.',
        type: 'date',
        required: true,
        order: 7
    },
    {
        fieldName: 'outcomes',
        label: 'Outcomes',
        tooltip: 'Evaluating project success by measuring adoption rates and user satisfaction.',
        type: 'date',
        required: true,
        order: 8
    },
    {
        fieldName: 'releases',
        label: 'Release Start',
        tooltip: 'When the first release is planned to start',
        type: 'date',
        required: true,
        order: 9
    },
    {
        fieldName: 'isProjectAgile',
        label: 'Is this an Agile Project with predefined sprint intervals?',
        tooltip: 'Select Yes if this is an Agile project with defined sprint intervals',
        type: 'boolean',
        required: true,
        order: 10
    }
];