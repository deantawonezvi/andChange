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
            { value: 2, label: 'Hierarchy awareness with perceived access to leaders' },
            { value: 3, label: 'Somewhat formal relationships with leaders' },
            { value: 4, label: 'Careful management of hierarchy barriers' },
            { value: 5, label: 'Low leader access - hierarchy defines access' }
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
            { value: 2, label: 'Individualistic over collective most of the time' },
            { value: 3, label: 'Both individual and group priorities have influence ' },
            { value: 4, label: 'Team or group above individual' },
            { value: 5, label: 'Team/group orientation high' }
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
            { value: 2, label: 'Metrics occasionally referenced to direct effort' },
            { value: 3, label: 'Priority metrics are associated with relationships' },
            { value: 4, label: 'Metrics drive behaviour where relationships moderate focus' },
            { value: 5, label: 'Only the numbers count' }
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
            { value: 2, label: 'People are expected to be team-oriented and supportive of others' },
            { value: 3, label: 'Areas with diverse levels of assertiveness' },
            { value: 4, label: 'Mainly assertive values promoted' },
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
            { value: 1, label: 'High  focus on stability' },
            { value: 2, label: 'Some innovation, mostly focused on stability' },
            { value: 3, label: 'Mix of stable and innovative areas' },
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
            { value: 4, label: 'Some consultation/inclusivity' },
            { value: 5, label: 'High consultation/inclusivity' }
        ],
        required: true,
        orientation: 'vertical',
        order: 8
    }
];


export const culturalFactorsDescriptions = {
    emotionalExpressiveness: [
        "Individuals at this level rarely show their emotions openly. They tend to keep feelings to themselves and may appear stoic or impassive. This can sometimes make them seem distant or detached in social settings.",
        "People with reserved expressiveness are slightly more open than non-expressive individuals but still tend to be quite controlled in how much they reveal their emotions. They may express feelings in a more subdued manner, only becoming more expressive in very comfortable or private settings.",
        "At this level, individuals comfortably express their emotions in ways that are noticeable but not overly dramatic. They strike a balance, showing feelings through facial expressions, gestures, and verbal cues without overwhelming others or oversharing.",
        "Openly expressive individuals are very comfortable sharing their emotions and do so freely in most situations. Their emotional expression is clear and unmistakable, including expressive body language, facial expressions, and vocal inflections that communicate how they feel to others.",
        "Those who are highly expressive show their emotions intensely and vividly. They do not hold back in expressing joy, sadness, excitement, or anger, and their emotional expressions can be very powerful and engaging. This level of expressiveness can be very impactful but might also be overwhelming for more reserved individuals."
    ],
    uncertaintyAvoidance: [
        "Change is viewed as less important, resulting in people often taking on too much change, and therefore more likely to take passive approach to change",
        "Change is viewed as less important, people are aware that there is a limit to how much change can be taken on but there is no effort spent on understanding the phenomenon of change saturation resulting in too much change, and therefore only occassionally concern themselves with change",
        "Insufficient time is allowed for people to change that can lead to change fatigue. This could manifest as \"freezing\" in the face of change. They respond positvely to good change management practices ",
        "People will challenge change if they are not aware of why they need to change or what the impact will be for them if they do not change. They are aware of the risk of unmanaged change but will be willing to change if suitably supported during the process. They respond well to adequate responses to questions",
        "Questioning change at every turn, over-analysing change, hesitancy to move with any risk, more communication needed, needs full responses to questions"
    ],
    powerDistance: [
        "Buy-in to change is usually slower where relationships are relaxed. Commands from leaders are much less powerful, with more weight assigned to hearsay and lower credibility to official communications",
        "Attention paid to leader communication but with a perception that discussion without negative consequences is permitted. Heresay is still influential. Leaders need to assert their wishes to be listened",
        "Action plans for groups need more customisation. As leader influence is still relatively low this may give rise to raise resistance. Buy-in needs more leader effort. Alignment across the organisation is not very challenging",
        "Leader influence is high. Leader effort is needed but should be quite effective. Alignment across the organisation can be challenging. A combination of formal and informal communication will be helpful",
        "The perceived lower relevance of affected people leads to resistance in the same affected people. Alignment across groups and the organisation is more difficult to achieve. With relatively low access to leadership, this hampers communication"
    ],
    individualismVsCollectivism: [
        "Teamwork is typically low, independence valued, the personal side of the 'what's in it for me\" (WIIFM) is important, personal privileges are important",
        "WIIFM is still important, but people are will ing to become aware of the greater good and seek some alignment between the two",
        "The group and personal WIIFM are important, teamwork at departmental level is a focus, both long and short-term benefits count",
        "The group's goals are more important than the personal ones but there is still a concern that individual beenfits are addressed. Feedback will include persona and group perspectives",
        "More focus on consensus than individual, group accountable rather than individual, group input counts, creativity constrained by group think, the collective voice is important"
    ],
    performanceViaMetricsVsRelationships: [
        "Low instances of performance metrics, indifferent to adoption, permafrost effect on communications. People perform to please leaders frstly, then the organisation",
        "People pay attention to performance metrics but not to the exclusion of leader's whims. Few opportunities for feedback, adoption metrics not welcomed, unclear ownership of change and therefore assistance",
        "People pay attention to perfromance metrics and strive to meet them provided they support the leader's notion of performnce. Feedback is allowed, adoption metrics are accepted as a necessary part of the organisation, change ownership I recognised and coaching is accepted",
        "Attention is paid to metrics and their achievement affects behaviour. People will take their achievement and the affect it has on elationships into account. Dissonanace in this space could lead to resistance to change",
        "Change feels like a waste unless they address the metrics, training has less relative impact, uncertainty drives resistance"
    ],
    assertiveness: [
        "Individuals are encouraged to be modest, cooperative, and non-confrontational. Communication tends to be more indirect, with an emphasis on harmony and avoiding conflict. There is a focus on relationships, empathy, and nurturing others. Resistance management is avoided, impacted group feedback is unreliable. communications may lack authenticity",
        "Team working is important. Team communication is important but feedback is still likely to be at a personal level. Resistance may be covert unless there are high levels of trust. Recognition is appreciated both at group and individual level. Being polite is important.",
        "Assertive individuals express opinions clearly and confidently, non-assertive individuals communicate more indirectly, often prioritizing harmony and avoiding conflict. Assertive individuals address conflicts head-on, seeking to resolve issues quickly and directly. Non-assertive individuals avoid confrontation, using mediation and compromise. Assertive team members more competitive, striving for individual recognition and success. Non-assertive team members focus on collaboration, supporting each other and working towards collective goals. Assertive more directive and goal-oriented, while non-assertive leaders focus on building.  Assertive individuals provide direct, constructive feedback. Non-assertive individuals might be more cautious, giving feedback in a way that minimizes potential conflict and emphasizes positive reinforcement relationships and fostering a supportive team environment. Emphasis on person-to-person communications, need for anonymity in feedback, more channels of resistance management needed",
        "Individuals are more direct, but tempered with considerations of politeness. Communication is fairly straightforward, with some expression of opinions. There is a focus on achievement, success, and taking initiative. People are expected to be self-reliant and independent but it's also OK to ask for help .Resistance management is treated directly but personally, impacted group feedback is fairly forthright. Communications is clear but may not be so forceful.",
        "Individuals are encouraged to be direct, confrontational, and competitive. Communication is often clear and straightforward, with an emphasis on expressing one's opinions and standing up for oneself. There is a focus on achievement, success, and taking initiative. People are expected to be self-reliant and independent.Resistance management is treated directly, impacted group feedback is reliable and forthright. communications is clear and concise"
    ],
    stabilityVsInnovation: [
        "Emphasis on maintaining established processes and procedures. Focus on consistency, reliability, and predictability. Decision-making tends to be cautious and risk-averse. Strong adherence to organizational hierarchy and structure. Predictability valued, trust the structures, don’t break the rules, support each other, value conservatism",
        "Established processes and procedures are important. Value is placed on consistency, rbut innovation is accepted provided it's contextualised. Adherence to organizational hierarchy and structure is important. Predictability valued, trust the structures, support each other, but rules can be bent a bit.",
        "Innovation is ok provided it's structured, some risk is ok, formal programs recognise innovation, trust is valued, get customer's views",
        "Creativity, experimentation, and new ideas accepted. Flexibility, adaptability, and responsiveness to change is accepted. Careful risk-taking is allowed. Open communication. New ideas accepted, its ok to fail once provided you have consulted the power structure, collaboration valued, learning is valued, leadership flexible to accept new ways, aware of diversity and inclusion",
        "Encouragement of creativity, experimentation, and new ideas. Focus on flexibility, adaptability, and responsiveness to change. Decision-making tends to be bold and risk-taking. Flat organizational structures that promote collaboration and open communication. New ideas valued, its ok to fail once, collaboration valued, showing learning is valued, leadership flexible to accept new ways, diversity and inclusion important"
    ],
    consultativeDecisionMaking: [
        "Decision making concentrated in leaders, people feel collaboration is less important, innovation is resisted, morale may be easy to reduce",
        "Some decision making delegated to middle and lower levels. Collaboration is allowed, innovation is allowed. People feel more empowerd to adapt",
        "Moderate collaboration, some transparency, patchy engagement, balanced decision-making, conflicts inconsistently addressed",
        "Decisions allow for a collaborative process, Two-way flow of communications exists, people feel empowered to contribute, continuous improvement recognised, some sense of community is emerging",
        "Decisions are driven through collaboration, good two-way flow of communications, people feel empowered to contribute, continuous improvement fostered, strong sense of community"
    ]
};