# Strategy Report: A Learning Platform for Year 9 (England) with a Scalable SaaS Architecture

**Main conclusion:** the best bet is to build a spaced retrieval practice engine driven by a knowledge graph of the Key Stage 3 curriculum for England, with a learner model that measures retention and mastery per concept (not grades), an AI that guides without giving answers, and an adult, respectful UX. Everything should start as a modular monolith in Java/Spring with PostgreSQL and an event log, and only later be split into microservices. The timing is favourable: in spring 2027 the Government will publish a new national curriculum that is "digital and machine-readable", which makes a proprietary curriculum graph a strategic asset.

## TL;DR

- **Curriculum and context:** in England, Year 8 and Year 9 close Key Stage 3. There are 12 National Curriculum subjects, plus RE and RSHE as compulsory subjects outside it. The Francis review (November 2025) confirms a revised curriculum to be published in 2027 and first taught from September 2028, a statutory reading test in Year 8 and the end of the EBacc. Year 9 is when students choose their GCSE options, which makes it the highest-value moment for a diagnostic tool.
- **Assessment:** cognitive science clearly favours retrieval practice and distributed practice (Dunlosky et al., 2013: "high utility"). Retrieving instead of rereading raised one-week recall from 40% to 61% (Roediger and Karpicke, 2006). The metrics that matter are long-term retention, mastery per graph node, confidence calibration and transfer, not an average grade.
- **Product and architecture:** design for the teenager's status, autonomy and competence, with gamification based on challenge and real progress rather than manipulative streaks, while complying with the ICO Children's Code and the DfE AI standards (no final answers by default). Technically: a Java/Spring modular monolith, PostgreSQL as the source of truth (including for the curriculum graph at first), a learning event log with CQRS projections, FSRS for memory and Elo/BKT for mastery. An 8 to 12 week home MVP covering one or two subjects validates the concept before scaling.

---

## 1. Curriculum breakdown (Year 8 and Year 9, England)

### 1.1 Preliminary note: "UK" is not a single system

The United Kingdom has four distinct education systems: England (National Curriculum, Key Stages), Scotland (Curriculum for Excellence), Wales (Curriculum for Wales) and Northern Ireland's own system. This report focuses on England. If the product is sold across the UK, the curriculum graph must model each system as a separate "framework" connected to shared concepts. That design decision is best made from day one.

In England, Key Stage 3 covers Year 7, Year 8 and Year 9 (ages 11 to 14). There is no external national exam at the end of KS3: each school assesses, examines and reports progress in its own way. The official criterion is that by the end of the stage pupils are expected to "know, apply and understand the matters, skills and processes specified in the relevant programme of study".

Three legal nuances matter for the product:
- **Maintained schools:** are legally required to follow the National Curriculum.
- **Academies and free schools:** are currently not required to follow it, but the Government's response to the review states that academies "will be required to teach the refreshed national curriculum alongside maintained schools". The change is being legislated through the Children's Wellbeing and Schools Bill.
- **Home education:** has no obligation to follow the National Curriculum. This opens a market segment (home-educating families) that places high value on clear curricular structure.

### 1.2 Compulsory and recommended subjects at KS3

| Category | Subjects | Status |
|---|---|---|
| National Curriculum core | English, Mathematics, Science | Statutory |
| National Curriculum foundation | History, Geography, Languages (a modern or ancient foreign language), Design and Technology, Art and Design, Music, Physical Education, Computing, Citizenship | Statutory |
| Compulsory outside the National Curriculum | Religious Education (RE); Relationships, Sex and Health Education (RSHE) | Statutory, with a locally agreed syllabus or statutory guidance |
| Recommended or common | PSHE (beyond RSHE), Drama, financial education, careers guidance, additional languages, oracy | Not statutory as subjects, though widespread |

**RSHE is already in force in its new version:** the statutory guidance published by the DfE in July 2025 replaces the 2019 version and is compulsory from 1 September 2026. At secondary level it adds AI literacy, deepfakes, misogyny and "incel" influence, personal safety (including knife crime), financial exploitation as a safeguarding topic, and menstrual and gynaecological health. Several of these topics fit naturally with Computing and Citizenship in a digital product.

### 1.3 What changes with the Francis review (status as of September 2026)

The Curriculum and Assessment Review, chaired by Professor Becky Francis, published its final report "Building a world-class curriculum for all" on 5 November 2025, and the Government responded the same day. According to the DfE's official response:

- **Timeline:** the revised national curriculum will be published by spring 2027 and taught from September 2028, with a full rather than phased rollout. New GCSEs arrive in 2029 and 2030. A student currently in Year 9 will not study the new KS3 curriculum. Her younger siblings or the SaaS's future customers will.
- **Digital curriculum:** for the first time, the new curriculum will be "digital and machine-readable". For the product, this means content can be automatically mapped to the official framework, and content migration from 2014 to 2028 can be offered.
- **Year 8 assessment:** there will be a new statutory reading test (fluency and comprehension) in Year 8, with school-level results that will not be published. The Government did not accept the review's proposed diagnostic tests in maths and English in Year 8, but it "will expect all schools to assess progress in writing and maths in Year 8" using "high-quality products". This is a direct commercial opportunity.
- **EBacc:** is scrapped as an accountability measure, and Progress 8 will be reformed. This widens real freedom of choice in Year 9 GCSE options.
- **KS3 as a "bridge":** the review notes that many schools start preparing for GCSE in Year 9, which narrows the curriculum. The Government commits to making the new KS3 build effectively on KS2 "in every subject" and will launch a KS3 Alliance within the RISE programme.
- **Subject changes (intentions):** AI literacy, data use and technological bias in Computing; replacing the GCSE in Computer Science with a GCSE in Computing; financial education introduced first in maths (for example, calculating interest) and developed in Citizenship, with a focus on digital fraud and scams; a dedicated Drama section within the KS3 English programme; a combined oracy, reading and writing framework in secondary; a future entitlement to triple science; more climate content (greenhouse effect, emissions, deforestation); the Holocaust as a compulsory KS3 History topic; "food and nutrition" as its own strand within D&T; in Music, reading notation and the "three pillars" of technical, constructive and expressive.
- **Not confirmed:** RE joining the National Curriculum depends on the sector reaching consensus. Schools Week reports it as "accepted", but the official text is conditional. The statutory entitlement to triple science also has no date.

### 1.4 Core topics to be mastered by the end of Year 9 (2014 programmes of study, currently in force)

KS3 programmes describe what should be known by the end of the stage, not per year. The split between Year 8 and Year 9 varies between schools. The product should model the end-of-stage goal and let the sequence be configured.

**English**
- Wide and challenging reading of whole books: at least two Shakespeare plays, serious poetry and high-quality fiction and non-fiction from 1789 to the present.
- Analysis of language, structure and authorial techniques; critical reading comparing texts.
- Extended, accurate writing for a range of purposes and audiences (argument, narrative, formal texts); planning, drafting and revising.
- Applied grammar and vocabulary; accurate spelling and punctuation; linguistic terminology.
- Spoken language: debate, formal presentations, recitation and dramatic performance.

**Mathematics**
- Number: powers, roots, standard form, fractions, decimals and percentages, proportional reasoning, rounding and error bounds.
- Algebra: notation and manipulation, linear equations, inequalities, formulae, sequences and the nth term, graphs of linear and simple quadratic functions, gradient.
- Ratio, proportion and rates of change: direct and inverse proportion, speed, density, compound interest and percentage change.
- Geometry and measures: angles, polygons, constructions, area and volume, circles, Pythagoras, basic trigonometry in right-angled triangles, transformations and congruence.
- Probability and statistics: sample spaces, Venn diagrams, measures of central tendency and spread, charts, correlation.
- Cross-cutting: fluency, mathematical reasoning and solving non-routine problems.

**Science** (physics, chemistry and biology, plus "working scientifically")
- Biology: cells and organisation; skeletal, muscular, digestive and respiratory systems; nutrition; human and plant reproduction; photosynthesis and cellular respiration; relationships in ecosystems; inheritance, chromosomes, DNA and genes; variation and evolution.
- Chemistry: the particle model; atoms, elements and compounds; mixtures and separation; chemical reactions and equations; acids and alkalis; the periodic table; chemical energy; materials; Earth and atmosphere, including climate change.
- Physics: energy and energy costs; motion and forces; pressure; waves (sound and light); electricity and magnetism; matter; space physics.
- Working scientifically: variables, experimental design, accuracy, data analysis, graphs and conclusions.
- Product note: according to AQA's KS3 Science Syllabus, the programme of study lists 140 ideas across biology, chemistry and physics without distinguishing which are more or less important or the links between them. That is why AQA groups them into 10 "big ideas" (Forces, Electromagnets, Energy, Waves, Matter, Reactions, Earth, Organisms, Ecosystems, Genes). That kind of structure is exactly what a knowledge graph makes explicit.

**History**
- Development of Church, state and society in medieval Britain (1066 to 1509) and from 1509 to 1745.
- Ideas, political power, industry and empire (1745 to 1901).
- Challenges for Britain, Europe and the wider world from 1901 to the present, including the Holocaust (compulsory).
- A local study, a thematic study over time and at least one significant non-British society or issue.
- Disciplinary skills: cause and consequence, change and continuity, interpretation, use of sources and written argument.

**Geography**
- Locational knowledge: Africa, Asia (including Russia, China, India and the Middle East); polar regions and biomes.
- Physical geography: geological time, plate tectonics, rocks and soils, climate (including climate change), glaciation, hydrology and coasts.
- Human geography: population, urbanisation, economic development and interdependence, resources.
- Human-environment interaction; map, GIS, quantitative data and fieldwork skills.

**Languages (usually French, Spanish or German)**
- Listening and reading comprehension of authentic sources.
- Spontaneous speaking and pronunciation.
- Writing of varying length using varied grammatical structures: verb tenses, agreement, pronouns.
- Translation and high-frequency vocabulary.

**Computing**
- Algorithms (including sorting and searching), abstraction and decomposition.
- At least two programming languages, one of them text-based.
- Boolean logic and binary representation.
- Hardware, software and networks.
- Creating digital artefacts.
- Online safety, privacy and digital identity.

**Design and Technology**
- Iterative design for real users; materials and their properties; mechanical, electrical and electronic systems; CAD/CAM.
- Cooking and nutrition: diet, cooking techniques, seasonality.

**Art and Design:** drawing, painting and sculpture techniques; history of art and architecture; critical analysis of works.

**Music:** performing, improvising and composing; staff notation; history and genres; analytical listening.

**Physical Education:** competitive games, sports, athletics, dance, outdoor and adventurous activities; analysing one's own performance.

**Citizenship**
- The UK parliamentary political system; justice and the legal system; rights and freedoms; the role of active citizens.
- The functions and uses of money: budgeting, risk, credit and debt.

---

## 2. Assessment methodologies

### 2.1 How English schools traditionally assess

Since national "levels" were removed in 2014, each school designs its own system. The dominant practices are:

- **End-of-unit tests and half-termly assessments:** often converted into percentages or "working at / towards / beyond".
- **9 to 1 "flight paths":** a predicted GCSE grade is projected from KS2 data and the school tracks whether the pupil is "on track". It is criticised for applying a 16-year-old exam scale to 13-year-olds.
- **Commercial standardised tests:** CAT4 (cognitive abilities), NGRT (reading), PTE and PTM (progress in English and maths) from GL Assessment.
- **End-of-year exams and "mocks":** in Year 9, often in GCSE format.
- **Teacher assessment:** practical work in Science, D&T, Art, Music and PE; performance and portfolios.
- **Digital homework:** platforms such as Sparx Maths, Seneca or Educake.

By subject: English assesses extended writing with rubrics, and inter-marker reliability is low. Maths and Science rely on closed questions and multi-step problems. History and Geography use developed responses with "explain" and "how far do you agree" frameworks. The arts and PE are assessed through performance and portfolio. Languages assess the four skills.

### 2.2 What cognitive science says

**The empirical basis:**
- **Dunlosky et al. (2013)** reviewed 10 techniques. Only two were rated "high utility": practice testing (self-testing) and distributed practice. Elaborative interrogation, self-explanation and interleaved practice were rated "moderate" utility. Rereading, highlighting and summarising, the techniques students use most, were rated low utility.
- **Roediger and Karpicke (2006):** after five minutes, rereading outperformed testing. After a week the order reversed: the one-study, three-test group (STTT) recalled 61% versus 40% for the four-study group (SSSS). Product lesson: immediate performance and durable learning can move in opposite directions. An app that optimises for the feeling of immediate mastery may be making learning worse.
- **Metacognition:** according to the EEF Teaching and Learning Toolkit, metacognition and self-regulation have an average impact of +8 months of additional progress (the 2021 guidance said +7), at low cost and with extensive evidence. Impact is greatest when applied to challenging tasks within the normal curriculum.
- **Other pillars:** cognitive load theory and worked examples, dual coding and Rosenshine's principles of instruction (daily review, small steps, high success rate, guided then independent practice).

**Best practice by discipline:**

| Discipline | Recommended assessment method | Digital implementation |
|---|---|---|
| Maths | Spaced retrieval of procedures, interleaved practice across problem types, worked examples with fading, diagnostic multiple-choice questions whose distractors encode misconceptions | Item bank tagged by concept and by error; adaptivity via Elo or IRT; hinge questions |
| Science | Diagnostic multiple choice (misconceptions), explaining phenomena, analysing experimental data | Distractors mapped to known misconceptions; "predict and explain" items |
| English (reading) | Inference questions on unseen texts; vocabulary in context | Levelled comprehension; fluency tracking |
| English (writing) | Comparative judgement instead of rubrics | Pairs of texts judged holistically; Bradley-Terry or Thurstone |
| History and Geography | Retrieval of substantive knowledge plus short argumentative writing; source tasks | Chronology and causation quizzes; short paragraphs assessed with comparative judgement or supervised AI |
| Languages | Spaced retrieval of vocabulary and grammar; oral production | FSRS cards; dictation and speech recognition |

**Comparative judgement** deserves special attention for writing. No More Marking reports that its AI agrees with human judges on 82 to 83% of decisions. In a project with around 70,000 texts from Years 7 to 9 across 177 UK schools, humans made 133,983 comparative decisions. In a languages case study at Sandringham School, the department achieved a reliability metric of 0.89. Caveat: these figures largely come from the vendor itself, and comparative judgement does not by itself produce individual feedback.

**Adaptive models:**
- **Elo:** the Elo system adapted for education (Pelánek, 2016, *Computers & Education* 98) treats each attempt as a "match" between student and item and updates ability and difficulty simultaneously. It is cheap and works without prior calibration. A 2026 study in the *British Journal of Mathematical and Statistical Psychology* shows that when items are selected adaptively and difficulties are updated at the same time, score variance grows artificially and does not converge. The authors propose two parallel score chains. It is a technical trap worth knowing before building.
- **IRT:** better for calibrated summative assessments.
- **BKT (Bayesian Knowledge Tracing):** models the probability of mastery per skill with parameters for learning, guessing and slipping.
- **FSRS:** for memory of specific facts (see section 5).

### 2.3 Progress metrics beyond the grade

I propose a "learning dashboard" of six metrics, in order of importance:

1. **Mastery per concept (mastery map):** probability of mastery (BKT or Elo) for each node of the curriculum graph, visualised as a map that "lights up". This is the central metric.
2. **Long-term retention:** success rate on delayed retrievals, more than 7 and more than 30 days after last study, and average memory "stability" according to FSRS (days until recall probability drops to 90%). This is where learning is distinguished from performance.
3. **Metacognitive calibration:** before each answer, the student states her confidence (sure, think so, guessing). The gap between confidence and accuracy is measured, for example with the Brier score. High-confidence errors are the most valuable to correct; Dunlosky et al. note that practice testing is especially effective at correcting them.
4. **Transfer:** success on "far" items that apply a concept in a new context or another subject, for example proportionality in physics or geography.
5. **Healthy study habits:** spaced sessions versus cramming, interleaved practice, use of help (hints before giving up), total weekly time. Not "time in app" as a success metric.
6. **Cognitive offloading to AI:** ratio of hints requested to independent attempts; effort before asking for help. The DfE now explicitly asks AI products to report on this.

---

## 3. The sophisticated angle: what you probably haven't considered

### 3.1 Measurable cross-cutting skills at ages 13 and 14

| Area | Why it matters at this age | How to measure it digitally (with care) |
|---|---|---|
| Metacognition and self-regulation | The lever with the strongest EEF evidence (+8 months); adolescence is when it consolidates | Confidence calibration; session planning (set a goal, review); predicted versus actual performance |
| Critical thinking and media literacy | RSHE 2025 requires AI and deepfake literacy; the Government wants media literacy in English and Citizenship | "Evaluate this source" or "spot the bias" tasks; contrasting two claims; scoring the justification, not just the answer |
| Financial literacy | Arriving in the maths and Citizenship curriculum; financial exploitation is now treated as a safeguarding topic | Budget simulations, compound interest, scam detection |
| Oracy | A combined oracy, reading and writing framework is being prepared for secondary | 60-second recorded explanations ("explain it to a classmate"), assessed with comparative judgement |
| Executive functions | The prefrontal cortex is still maturing; planning and working memory are more limiting than ability | Infer cognitive load from response time, drop-offs and errors after long sessions; offer breaks |
| Adaptability and resilience to failure | Academic identity ("I'm bad at maths") becomes fixed during KS3 | Behaviour after an error: retry, ask for a hint or quit? Track the trend, never label |
| Sleep and wellbeing | Teenagers have a physiological delay in circadian rhythm; night-time use harms sleep and memory consolidation | No night-time notifications by default; automatic "rest mode"; remind them that sleep consolidates memory |

### 3.2 Neurodivergence: design for it from the start

- **ADHD:** short sessions (5 to 12 minutes) with a clear end; immediate feedback; minimal interface distractions; visible goals; no punitive "streaks".
- **Dyslexia:** adjustable fonts and spacing, read-aloud of questions (TTS), spoken answers as an alternative, no penalty for spelling in non-language subjects.
- **Autism:** predictability (the same structure every session), literal language, control over sensory stimulation (animations can be switched off), warnings before changes.

**The key ethical principle:** the platform may detect patterns consistent with difficulties, but it must not diagnose or label. The ICO Children's Code prohibits using children's data in ways detrimental to their wellbeing, and requires profiling to be off by default unless there is a compelling reason in the child's best interests. Inferring health or neurodivergence traits could also be treated as special category data under UK GDPR. Recommendation: offer accessibility settings the user chooses herself ("focus mode", "read aloud"), with no hidden inferences, and give parents descriptive, non-clinical observations.

### 3.3 Interconnected learning between STEM and the humanities

The knowledge graph enables something schools, organised by department, rarely do: "applies in" edges between subjects. Concrete examples for Year 9:

1. **Proportionality and rates of change (Maths) → speed and density (Physics) → population density (Geography) → inflation and wages in the Industrial Revolution (History).**
2. **Statistics (Maths) → analysing climate data (Geography and Science) → evaluating media claims (Citizenship and English).** A question like "is this chart misleading?" works on all three at once.
3. **Evolution and inheritance (Biology) → Darwin and the Victorian debate (History) → ethics of genetics (RE and Citizenship).**
4. **Algorithms and bias (Computing) → AI and deepfake literacy (RSHE) → persuasive rhetoric (English).**
5. **Energy and fossil fuels (Physics and Chemistry) → Industrial Revolution and empire (History) → climate change and development (Geography).**
6. **Compound interest (Maths) → credit, debt and scams (Citizenship and RSHE).**

Product mechanic: weekly "bridge missions" in which a challenge requires nodes from two subjects. Success on these is the transfer metric from section 2.3.

---

## 4. Designing the "killer product" and UX for teenagers

### 4.1 The psychology that should guide design

- **Self-determination theory (SDT):** sustained motivation depends on three needs: autonomy, competence and relatedness. In adolescence, motivation and the satisfaction of these needs tend to decline, which makes designing for them deliberately a competitive advantage.
- **Status and respect:** work by David Yeager and colleagues shows that, compared with children, adolescents are more sensitive to feeling respected and having their status and autonomy recognised. If they perceive adults trying to manipulate them, they often resist. Design conclusion: the product must not feel "school-like" or "childish", nor preach. It should treat the user as a competent person who makes decisions.
- **Gamification, what the evidence says:** the meta-analysis by Sailer and Homner (2020, *Educational Psychology Review*) found significant but small effects on cognitive (g = 0.49), motivational (g = 0.36) and behavioural (g = 0.25) outcomes. Only the cognitive effect was stable in the most rigorous studies. Including game fiction and social interaction moderated the behavioural effects. Translation: points and badges alone add little. Challenge, meaningful goals, narrative and a well-designed social component add more.
- **Extrinsic rewards:** can erode intrinsic motivation for tasks that are already interesting. Use them to start habits (onboarding, first weeks) and shift the focus towards visible competence (the mastery map) as soon as possible.

### 4.2 Lessons from existing products

- **Sparx Maths:** an independent analysis by RAND Europe and the University of Cambridge, commissioned by Sparx, studied 3,956 Year 7 and Year 8 pupils in 14 schools. According to the report by Elena Rosa Speciani, Andreas Culora and Sonia Ilie (RAND Europe and University of Cambridge, February 2021, with 2019 data), one hour per week of active work over a school year was associated with nearly 30% of a predicted GCSE grade (nearly 20% with simple platform use). However, there was no evidence that mere access to the platform was associated with outcomes, and the tool did not by itself close socioeconomic gaps. Lesson: the value lies in achieving active, high-quality use, not in having the app. Sparx also checks written work ("bookwork checks") to prevent mindless use.
- **Duolingo:** a master of habit retention (streaks, leagues), but also an example of the risk of optimising engagement over learning. Copy the interface polish, not the pressure.
- **Seneca, Quizlet and Anki:** demonstrate demand for spaced retrieval among British teenagers. Anki has integrated FSRS since version 23.10.
- **Khanmigo:** a Socratic AI tutor that guides without giving answers, aligned with what the DfE now requires.
- **Oak National Academy:** offers free curriculum and lessons aligned with the National Curriculum and will help produce materials for the new curriculum. A possible source of openly licensed content (check its licence terms) and a free competitor to differentiate from.

### 4.3 Concrete UX principles

**Frictionless onboarding**
- First question answered in under 60 seconds; no long forms.
- An initial diagnostic "disguised" as a challenge (10 adaptive questions) that seeds the mastery map.
- Account created by a parent (consent), with the teenager owning her own space.

**"Non-school" aesthetics and language**
- Dark mode by default or by choice; modern typography; subtle micro-animations that can be switched off.
- A peer-to-peer tone, direct and lightly humorous, never condescending; no childish mascots.
- Identity customisation: visual themes, abstract avatar, unlockable "titles" for real achievements ("Source Detective", "Fractions Master").

**TikTok- and Discord-inspired format, with judgement**
- A vertical "feed" of micro-challenges (swipe for the next question) that uses the familiar gesture but has a natural end: "Session complete: 12 of 12". No infinite scroll.
- "Did you know...?" cards that connect subjects (bridge missions).
- Discord-style "servers" or "channels" per subject, but in the MVP with no open chat between strangers.

**Intrinsic motivation first**
- The knowledge map as the protagonist: watching the graph light up is the competence reward.
- Autonomy: choose subject, difficulty and "mission of the day" from 2 or 3 options the algorithm considers useful.
- Meaningful progress: "You've retained 84 more concepts for over 30 days" is worth more than "1,250 XP".

**Safe social proof**
- Comparison with one's past self ("you a month ago") before comparison with others.
- If there is a social component: small groups of invited friends, cooperative challenges (group goals) before public individual leaderboards, and pseudonyms.

**Ethical streaks and reminders**
- "Flexible" streaks (rest days included, no punishment); a single configurable daily reminder; automatic silence at night.

### 4.4 Regulatory compliance as a product advantage

- **ICO Children's Code (Age Appropriate Design Code):** 15 standards. The most relevant: best interests of the child; "high privacy" settings by default; data minimisation; profiling off by default unless there is a compelling reason in the child's interests; geolocation off; transparent, age-appropriate information; no nudge techniques to get children to give more data or weaken their privacy; accessible tools to exercise their rights. Adaptive personalisation is a form of profiling, so its justification in the child's interests (it is the core educational function) must be documented in the DPIA.
- **UK GDPR and Data Protection Act 2018:** a DPIA is required before launch. In the UK, the age of digital consent for information society services is 13, which requires checking the lawful basis if relying on consent.
- **Online Safety Act 2023:** Ofcom's children's protection codes apply from 25 July 2025 to user-to-user and search services likely to be accessed by children. Services had to complete their children's access assessment by 16 April 2025 and their risk assessment by 24 July 2025. If the product lets users share content with each other (chat, forums, posts), it falls within scope of the Act. Strategic consequence: in the MVP and the first commercial version, avoid open messaging between users. Social features should be closed and structured (challenges, predefined reactions).
- **DfE generative AI standards:** published in January 2025 as "product safety expectations" and updated on 19 January 2026 as standards. They add sections on cognitive development, emotional and social development, mental health and manipulation. The DfE "expects products not to provide final answers, full solutions or complete worked examples by default", and to report to teachers on cognitive offloading, emotional engagement and duration of use. Although aimed at products used in schools, they are the de facto standard for selling to UK schools.

---

## 5. Web app architecture and development strategy

### 5.1 Key strategic decision: modular monolith first

Your background (Java, Erlang/OTP, microservices) invites starting with microservices. My recommendation is not to do so in version 1.0. With one user, and later with hundreds, operational complexity (deployments, tracing, eventual consistency) would consume the time you need for the truly hard problem: content and the learner model. Design a modular monolith with strict domain boundaries (Spring Modulith modules or packages enforced with ArchUnit) and internal communication via domain events. That way, extracting services will be mechanical when volume justifies it.

### 5.2 Target architecture (SaaS at scale)

```
[Web/PWA] → [CDN + WAF] → [API Gateway / BFF (Spring Cloud Gateway)]
  → Identity & Consent | Curriculum & Knowledge Graph | Practice/Assessment Engine | Learner Model | Content & AI Gateway
  → [Event backbone: Kafka / Redpanda]
  → Analytics & Projections (CQRS) | Scheduler / Review Queue | Notifications | Realtime Gateway (Elixir/Phoenix or Erlang/OTP)
```

**Services and responsibilities:**
- **Identity & Consent:** family and school accounts, roles (student, parent, teacher), consent, age and privacy settings. OIDC (Keycloak or a managed provider).
- **Curriculum & Knowledge Graph:** nodes (concepts), edges (prerequisite, "applies in", misconception), mapping to frameworks (NC 2014, NC 2028, AQA, Edexcel and OCR GCSE specifications, Scottish and Welsh curricula). Almost read-only and highly cacheable.
- **Practice / Assessment Engine:** builds sessions, serves items, marks (deterministic, AI or comparative judgement) and emits `AttemptRecorded` events.
- **Learner Model Service:** consumes attempts and maintains state per student and item (FSRS: stability, difficulty, retrievability) and per student and concept (mastery via Elo or BKT). This is the most write-heavy service.
- **Scheduler / Review Queue:** computes the daily queue (items whose retrievability falls below target, plus new nodes whose prerequisites are mastered).
- **Analytics & Projections (CQRS):** read views for dashboards, decoupled from the write model.
- **Notifications:** with wellbeing rules built in (quiet hours, daily maximum).
- **Realtime Gateway:** this is where Erlang/OTP or Elixir/Phoenix shines. Live cooperative challenges, presence and millions of lightweight WebSocket connections with supervision and fault tolerance. Java with virtual threads (Loom) is enough for REST; the BEAM is superior for massive persistent connections.

**Patterns for high concurrency:**
- **Event sourcing of learning:** every attempt is an immutable event (`student_id, item_id, concept_ids, correct, confidence, latency_ms, hints_used, timestamp`). It is the source of truth for learning: it allows any model to be recomputed (for example, re-optimising FSRS parameters or switching from BKT to another model) over the full history. It is a huge competitive advantage.
- **Partitioning by `student_id`** in Kafka: guarantees per-student ordering and lets learner model consumers scale horizontally without locking.
- **Idempotency:** an idempotency key per attempt, because on mobile and school networks retries are the norm.
- **Caching:** curriculum graph and item banks in Redis or a local cache (Caffeine); the daily queue is precomputed overnight or at session end.
- **Predictable peaks:** homework time from 16:00 to 21:00 and exam weeks. Autoscaling based on Kafka consumer lag (KEDA) is preferable to CPU-based scaling.
- **REST API:** resources such as `/students/{id}/sessions`, `/sessions/{id}/attempts` (idempotent POST), `/students/{id}/mastery?framework=nc2014`, `/concepts/{id}/prerequisites`. OpenAPI contracts, header-based versioning and cursor pagination.
- **Multi-tenancy:** `tenant_id` (family or school) on every table with Row-Level Security in PostgreSQL. UK data residency (London region).

### 5.3 Database model: polyglot persistence, but gradual

| Data | Recommendation | Why |
|---|---|---|
| Users, consents, subscriptions, editorial content | **PostgreSQL (relational)** | Integrity, transactions, RLS for multi-tenancy |
| Curriculum graph (roughly 2,000 to 10,000 nodes per full framework) | **PostgreSQL with node and edge tables and recursive CTEs** at first; **Neo4j or Apache AGE** if complex traversal queries grow | The graph is small and nearly static: it does not justify a separate database at first. Neo4j adds value for multi-hop path recommendations and hot centrality analysis |
| Learning events (attempts) | **Event log (Kafka) plus a columnar store** (TimescaleDB, ClickHouse or Parquet on S3) | High volume, append-only, temporal analytical queries |
| Learner model state (FSRS per item, mastery per concept) | **PostgreSQL** (narrow tables indexed by student) and, at large scale, **Cassandra, ScyllaDB or DynamoDB** partitioned by `student_id` | Key-based access, frequent writes, per-student reads |
| Content search and item similarity | **pgvector** (embeddings) | Deduplicating AI-generated items and retrieving relevant content for the tutor (RAG) |

**My concrete recommendation:** PostgreSQL as the only database in version 1.0 (with TimescaleDB and pgvector as extensions), plus an append-only `learning_events` table acting as the event store. Kafka comes in when there is more than one independent consumer of the events. Neo4j comes in only if graph queries appear that PostgreSQL cannot handle with good performance.

### 5.4 Learner model algorithms

- **Memory (what to review and when): FSRS.** An open-source algorithm developed by Jarrett Ye since 2022. It models the difficulty, stability and retrievability of each card and lets you set a target retention (for example, 90%). According to the "ABC of FSRS" wiki from the open-spaced-repetition project, it requires 20 to 30% fewer reviews than SM-2 for the same retention; an update on 12 February 2026 clarifies that the figure comes from simulations, not a controlled trial. Its real, reproducible advantage is the accuracy of its recall prediction on a public benchmark of hundreds of millions of reviews. SM-2 (1987) is only acceptable as a trivial starting point.
- **Concept mastery: Elo (bootstrap) → BKT or multidimensional IRT (maturity).** Elo learns item difficulty without prior calibration, which is ideal for a new item bank. The non-convergence mitigations described in section 2.2 must be implemented. BKT gives an interpretable probability that the student "has mastered the concept". With data from thousands of users, more advanced knowledge tracing models can be evaluated, but not before.
- **Propagation through the graph:** mastering a node provides weak evidence about its prerequisites; failing a node with weak prerequisites triggers diagnosis backwards. This is what turns the map into a diagnostic tool rather than a simple counter.
- **Choosing the next activity:** aim for an expected success rate of roughly 70 to 85% (desirable difficulty), interleave subjects and problem types, and reserve around 20% of the session for new nodes.

### 5.5 Using LLMs: where to and where not to

**The key evidence:** Bastani et al. (PNAS, 2025, vol. 122, no. 26) gave access to GPT-4-based tutors to nearly a thousand maths students at a large Turkish high school during the autumn semester of the 2023/2024 school year. With the generic chat, practice performance improved by 48%, but when access was removed those students performed 17% worse than those who never had it. With a tutor with safeguards (hints instead of answers), practice improved by 127% and the negative effect was largely mitigated. This is the empirical argument for the "no answers by default" design the DfE now requires.

**Recommended uses:**
1. **Item generation** (questions, misconception-based distractors, variants) in the authoring pipeline, always with human review before publishing, automatic tagging to the graph and deduplication with embeddings.
2. **Socratic tutor:** graduated hints (level 1, recall the concept; level 2, first step; level 3, analogous example), a requirement to attempt before seeing a hint, and logging of cognitive offloading.
3. **Feedback on short writing:** as a second marker alongside rubrics or comparative judgement, never as the sole source of the grade.

**Technical safeguards:**
- A dedicated AI Gateway with versioned prompts, integrated input and output filtering (the DfE no longer accepts bolt-on filters as a solution), detection of sensitive topics with escalation to parents (self-harm, abuse) and activity logging.
- Do not send personally identifiable information to the LLM provider. Contracts with no training on data and with data residency.
- Continuous evaluation: a golden set of curriculum questions to detect hallucinations before switching models.
- The AI must not present itself as a "friend" or foster emotional dependency, an explicit area of the DfE's 2026 standards.

### 5.6 MVP (version 1.0) for home testing

**MVP goal:** demonstrate in 8 to 12 weeks, with one real user, that (a) she uses it voluntarily at least 4 days a week for 10 to 15 minutes, and (b) her 30-day delayed retention and her mastery across the graph improve measurably against her baseline.

**Include (essential):**
1. **Narrow scope:** one or two subjects where she has a real need. My recommendation is Maths (highly structured, automatic marking) plus Science or the GCSE subject she is choosing. A graph of 150 to 300 concepts with prerequisites, built by hand from the programme of study and her school's schemes of work.
2. **Item bank:** 5 to 10 items per concept (1,000 to 2,000 in total), generated with an LLM and reviewed by you. Distractors tagged by misconception.
3. **Adaptive initial diagnostic** (15 to 20 minutes, over two sessions).
4. **Daily 10-minute session:** FSRS queue plus new nodes, interleaved practice and a confidence rating on each answer.
5. **Visual mastery map** (the graph that "lights up") and a retention metric visible to her.
6. **Graduated hints without direct answers;** full explanation only after a failed attempt or several hints.
7. **Parent dashboard:** a descriptive weekly summary (concepts mastered, retained and to reinforce). No real-time session monitoring, to preserve her autonomy.
8. **Baseline UX:** installable PWA, dark mode, accessibility (TTS, adjustable font), a single configurable reminder and night-time silence.
9. **Full event logging** from day one: it is the asset that will feed future algorithms.
10. **Data export and deletion:** privacy by design practice.

**Exclude from version 1.0 (on purpose):** social features, chat with other users, leaderboards, microservices, Kafka, Neo4j, native app, payments, multi-framework (Scotland and Wales), teacher dashboard.

**Recommended stack for version 1.0:** Java 21 or 25 with Spring Boot and Spring Modulith; PostgreSQL 16 or later (with pgvector); Flyway; SvelteKit or Next.js frontend (PWA); FSRS via an existing implementation; deployment as a single container (Fly.io, Render or a VM in the London region); OpenTelemetry from the start.

**Home testing protocol:**
- Week 0: diagnostic and baseline.
- Weeks 1 to 8: free use; she chooses when.
- Measurements: voluntary use (active days per week), 7- and 30-day retention on items not seen recently, change in calibration, performance in her school assessments (external data) and a 10-minute fortnightly interview ("what bores you?", "what would you do differently?").
- Make her a co-designer: letting her name features, choose visual themes and vote on the backlog satisfies her need for autonomy and status and produces a better product for her segment.

**Path from version 1.0 to SaaS:**
- **Version 1.5:** 5 to 20 beta families, multi-tenancy, formal DPIA, family subscription.
- **Version 2.0:** all core KS3 subjects, alignment with GCSE specifications for Years 9 and 10 (value in the options year), cooperative challenges between friends (closed groups, no free text), comparative judgement for writing.
- **Version 3.0:** the school channel. It fits the DfE's expectation that schools assess writing and maths in Year 8 with "high-quality products", with a teacher dashboard, integration with school management systems and compliance with the DfE AI standards. This is where the Learner Model Service, the Practice Engine and the Realtime Gateway are split out, and Kafka comes in.
- **Version 3.5:** automatic mapping to the 2027 digital curriculum as soon as it is published; Scottish and Welsh frameworks.

---

## Key recommendations (executive summary)

1. **Build the curriculum graph as the core asset** and map it now to the 2014 National Curriculum, with the schema ready for the 2027 digital curriculum.
2. **Measure delayed retention and calibration, not grades.** This is your differentiation from school platforms and something no "flight path" offers.
3. **Spaced retrieval (FSRS) plus mastery per concept (Elo, then BKT)** as the engine; an LLM only as a safeguarded tutor and as a reviewed authoring tool.
4. **Design for teenage status and autonomy:** adult aesthetics, real choice, visible progress and zero manipulation. Children's Code compliance is also a selling point for parents and schools.
5. **Modular monolith, PostgreSQL and event log in version 1.0;** microservices, Kafka and the BEAM for real time once scale and the school channel exist.
6. **Avoid user-generated content** until you have moderation resources: it keeps you out of the most demanding scope of the Online Safety Act.

## Caveats

- **Commercial evidence:** the Sparx figures come from an independent but company-commissioned analysis, and they are correlational. Those from No More Marking and FSRS largely come from their own developers, and the 20 to 30% FSRS reduction is a simulation.
- **Gamification:** meta-analytic effects are small and heterogeneous. Some more recent meta-analyses report large effects, but with higher risk of bias. Do not expect gamification to replace good pedagogical design.
- **Moving policy:** the programmes of study for the new curriculum have not yet been published (expected in spring 2027). Several measures (RE in the National Curriculum, triple science entitlement, a new languages qualification) are intentions, not rules.
- **Sensitive data:** measuring executive functions, wellbeing or traits consistent with neurodivergence carries labelling and privacy risks. By default, do not infer; offer settings chosen by the user.
- **"n = 1" bias:** a single student validates usability and habit, not general effectiveness. More families and a comparative design are needed before making impact claims in marketing.
- **Legal review:** this report is not legal advice. Before commercial launch, a professional review of UK GDPR, the Children's Code and the applicability of the Online Safety Act is advisable.
