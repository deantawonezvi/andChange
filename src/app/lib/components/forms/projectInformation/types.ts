import { FormField } from "@/app/lib/api/formTypes";

export const projectInfoFields: FormField[] = [
    {
        fieldName: 'changeProjectName',
        ratingFieldName: 'changeProjectNameRating',
        label: 'Project Name',
        tooltip: "Let's give your change a name. Choose a name that generally identifies this change to most stakeholders",
        required: true,
        order: 1
    },
/*    {
        fieldName: 'projectCharter',
        label: 'Project Charter or Business Case',
        tooltip: "If there is a a project charter or similar documentation, upload it here and the system will attempt to answer some of the questions for you?",
        type: 'text',
        order: 0
    },*/
    {
        fieldName: 'changeProjectObjectives',
        ratingFieldName: 'changeProjectObjectivesRating',
        label: 'Project Objectives',
        tooltip: "Capture here the stated objectives of the PROJECT. Preferably use those already listed in the project charter. Only add to this list when the objective is generally accepted",
        multiline: true,
        required: true,
        order: 2
    },
    {
        fieldName: 'projectAlignmentToOrgValues',
        ratingFieldName: 'projectAlignmentToOrgValuesRating',
        label: 'Project Alignment to Organizational Values',
        tooltip: "How does the project fit in with the organisational values?",
        multiline: true,
        required: false,
        order: 3
    },
    {
        fieldName: 'projectAlignmentToOrgStrategy',
        ratingFieldName: 'projectAlignmentToOrgStrategyRating',
        label: 'Project Alignment to Strategy',
        tooltip: "How does the project align with the organisation's strategy?",
        multiline: true,
        required: false,
        order: 4
    },
    {
        fieldName: 'whyValueStatement',
        ratingFieldName: 'whyValueStatementRating',
        label: 'Why should we change?',
        tooltip: "Why is this project being run? (this could be a subset of Reasons for the Change)",
        multiline: true,
        required: true,
        order: 5
    },
    {
        fieldName: 'whyNowValueStatement',
        ratingFieldName: 'whyNowValueStatementRating',
        label: 'Why change now?',
        tooltip: "Why is this project being run at the time it is scheduled to run? What drove the decision to run the project at that time",
        multiline: true,
        required: true,
        order: 6
    },
    {
        fieldName: 'ifNotValueStatement',
        ratingFieldName: 'ifNotValueStatementRating',
        label: 'What happens if we don\'t change?',
        tooltip: "What are the impacts/implications if we do not make the change when it is planned to happen? What are the risks to the impacted people, the organisation and our stakeholders of an incomplete or absent change?",
        multiline: true,
        required: true,
        order: 7
    },
    {
        fieldName: 'sufficiencyOfBudget',
        label: 'Sufficiency of Budget',
        tooltip: "Is the current budget sufficient to see the project from start to end, including sustainment activity",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Not aligned to people needs' },
            { value: 3, label: 'Somewhat aligned to people needs' },
            { value: 5, label: 'Highly aligned to people needs' }
        ],
        required: true,
        order: 8
    },
    {
        fieldName: 'timingAndFlow',
        label: 'Timing and Flow',
        tooltip: "How well does the timing of the availability of the budget and its flow align with when we should/shall help people adopt and use the change?",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Not aligned to people needs' },
            { value: 3, label: 'Somewhat aligned to people needs' },
            { value: 5, label: 'Highly aligned to people needs' }
        ],
        required: true,
        order: 9
    },
    {
        fieldName: 'scopeOfChange',
        label: 'Scope of Change',
        tooltip: "How far does this change extend in the organisation from a people structure perspective; from a team through to the whole organisation",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Team' },
            { value: 3, label: 'Division or Department' },
            { value: 5, label: 'Entire Organisation' }
        ],
        required: true,
        order: 10
    },
    {
        fieldName: 'amountOfOverallChange',
        label: 'Impact of the Change',
        tooltip: "This rating indicates how this change is perceived in the organisation; is it a small, incremental change through to a transformation of the fundamental operation of the organisation",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Small incremental change' },
            { value: 3, label: 'Significant change' },
            { value: 5, label: 'Fundamental transformation' }
        ],
        required: true,
        order: 11
    },
    {
        fieldName: 'isProjectPerceivedAsStrategic',
        label: 'Is this project perceived as strategic?',
        tooltip: "Is this project perceived as strategic?",
        type: 'boolean',
        required: true,
        order: 12
    },
    {
        fieldName: 'changeCompetencyOfKeyRolesDeveloped',
        label: 'Change competency developed for key roles',
        tooltip: "Does the project's scope include the possibility of developing change management skills in critical leadership roles?",
        type: 'boolean',
        required: true,
        order: 13
    },
    {
        fieldName: 'degreeOfConfidentialityRequired',
        label: 'Level of Confidentiality Required',
        tooltip: "How open can the organisation be about the details of the change; completely transparent through to confidential and only disclosed at the last moment and to those who have a strict need-to-know basis",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Not confidential' },
            { value: 3, label: 'Some content is confidential' },
            { value: 5, label: 'Highly confidential' }
        ],
        required: true,
        order: 14
    },
    {
        fieldName: 'degreeOfExternalStakeholderImpact',
        label: 'External Stakeholder Impact',
        tooltip: "To what degree are stakeholders impacted by the project external to the organisation?",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'No external stakeholders affected' },
            { value: 3, label: 'Some powerful external stakeholders affected' },
            { value: 5, label: 'Powerful external stakeholders affected' }
        ],
        required: true,
        order: 15
    },
    {
        fieldName: 'perceivedNeedToChangeAmongImpacted',
        label: 'Perceived Need for Change',
        tooltip: "What is the perceived need for change among impacted individuals or groups?",
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'Keep things as they are' },
            { value: 3, label: 'Neutral to change' },
            { value: 5, label: 'Want things to change' }
        ],
        required: true,
        order: 16
    },
    {
        fieldName: 'prepareApproachBudget',
        label: 'Prepare Approach Budget',
        tooltip: "What is the budget required to fund the getting the organisation ready to start making the change? Note this does not cover the entire period of the change, only the intial period when we prepare the organisation for the change.",
        type: 'text',
        required: false,
        order: 17
    },
    {
        fieldName: 'manageChangeBudget',
        label: 'Manage Change Budget',
        tooltip: "What is the budget required to fund making the change. Note this does not cover the entire period of the change, only the intial period when we prepare the organisation for the change.",
        type: 'text',
        required: false,
        order: 18
    },
    {
        fieldName: 'sustainOutcomesBudget',
        label: 'Sustain Outcomes Budget',
        tooltip: "What is the budget required to fund sustaining the people after the change has been adopted. Note this does not cover the entire period of the change, only the intial period when we prepare the organisation for the change.",
        type: 'text',
        required: false,
        order: 19
    },
    {
        fieldName: 'sourceOfBudget',
        label: 'Source of Budget',
        tooltip: "From where is the budget coming? Insert the cost centre/funding sponsor details are known.",
        required: false,
        order: 20
    }
];