# Story Generation Plan — PROMGENDEV-275

## Purpose and Scope
Create user stories and personas for the approved exporter test API requirements. Stories will describe API consumer goals and observable outcomes. They will not add implementation tasks, priorities, timelines, or requirements beyond the approved requirements document.

## Planning Questions
Please fill in each `[Answer]:` field. Use `X` for a different answer.

### Question 1 — Story Granularity and Splitting
Which story structure best fits this feature?

A) Feature-based: one story for testing a saved exporter and one for testing a temporary exporter.
B) User-journey based: one end-to-end story for requesting a test and interpreting its results, with saved and temporary modes as scenarios.
C) Persona-based: separate stories for the distinct API user roles, even when they use the same exporter mode.
X) Other (describe the split and the rule for deciding story boundaries)

[Answer]:B

### Question 2 — Personas
How should the API consumer personas be represented?

A) One persona: an authenticated Promgen API consumer who tests exporters they need to diagnose.
B) Two personas: a project/service-authorized consumer testing a saved exporter, and an authenticated consumer testing a temporary exporter.
X) Other (describe the personas and their goals)

[Answer]:A

### Question 3 — Acceptance Criteria Format
Which format should be used for story acceptance criteria?

A) Given / When / Then scenarios.
B) Numbered, observable acceptance checks.
X) Other (specify the format)

[Answer]:A

## Confirmed Story Approach
- **Story structure**: User-journey based, with one end-to-end story for requesting an exporter test and interpreting results. Saved and temporary exporters are scenarios in that story.
- **Persona model**: One authenticated Promgen API consumer. The persona can test saved exporters when they have the required project/service role, and can use temporary exporter ID `0` without a project/service object-level permission check.
- **Acceptance criteria**: Given / When / Then scenarios.
- **Story boundary**: Keep the story centered on the API consumer's goal of testing an exporter. Cover host selection, limits, authorization, scrape outcomes, and response semantics as scenarios, without splitting into implementation tasks.

## Story-Splitting Approaches Considered
- **User journey-based**: Groups work around requesting a test and reading outcomes. This emphasizes the caller flow but may combine saved and temporary rules in one large story.
- **Feature-based**: Separates saved and temporary exporter tests. This keeps their different configuration and authorization rules easy to review.
- **Persona-based**: Separates stories by API consumer role. This can make authorization needs visible but may duplicate the same endpoint behavior.
- **Domain-based**: Groups by exporter testing, host selection, or result reporting. This highlights rules but can split one caller goal across several stories.
- **Epic-based**: Uses a parent story with smaller child stories. This helps when many independent capabilities exist, but may add hierarchy for a narrowly scoped endpoint.
- **Hybrid**: Combines the caller journey with only those saved/temporary splits needed to keep acceptance criteria focused.

The final splitting method will follow the answer to Question 1. Stories will remain small, valuable, and independently reviewable where the API behavior allows it.

## Generation Checklist
- [x] Review the approved requirements and this plan's answered questions.
- [x] Confirm the persona set and story granularity from the user's answers.
- [x] Select the story-splitting approach and preserve one API consumer goal per story.
- [x] Draft `personas.md` with each persona's role, goals, and relevant access context.
- [x] Draft `stories.md` using the selected story structure and acceptance-criteria format.
- [x] Map stories to the approved requirements and include saved/temporary, host-limit, authorization, and result behaviors where applicable.
- [x] Review every story against INVEST: Independent, Negotiable, Valuable, Estimable, Small, and Testable.
- [x] Present the story and persona artifacts for user review and approval.

## Required Deliverables
- `aidd-docs/inception/user-stories/personas.md` — API consumer persona or personas.
- `aidd-docs/inception/user-stories/stories.md` — User stories with acceptance criteria and requirement traceability.
