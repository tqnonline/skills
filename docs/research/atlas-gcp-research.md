# Atlas GCP: Research and development blueprint

**Date:** September 8, 2026

**Audience:** Enterprise architects, skill developers, and architecture reviewers

**Purpose:** Define the research, capabilities, artifact contracts, and tests needed to build a Google Cloud reference architecture skill comparable to Atlas Azure.

**Status:** Research and proposed implementation specification. This document does not implement Atlas GCP.

**Scope assumption:** Atlas GCP targets workloads deployed on Google Cloud, using current official Google Cloud iconography. The AWS references in the request are treated as wording carried over from the “Research Atlas AWS skill” task. AWS remains a research precedent and may appear as an explicitly identified external system or migration source. It must not be represented by GCP service icons.

## Contents

- [1. Recommended direction](#1-recommended-direction)
- [2. Repository and Atlas Azure baseline](#2-repository-and-atlas-azure-baseline)
- [3. The Google Cloud architecture journey](#3-the-google-cloud-architecture-journey)
- [4. Required skill capabilities](#4-required-skill-capabilities)
- [5. GCP knowledge and foundation coverage](#5-gcp-knowledge-and-foundation-coverage)
- [6. GCP semantics that diagrams must preserve](#6-gcp-semantics-that-diagrams-must-preserve)
- [7. From a simple agent to enterprise service software](#7-from-a-simple-agent-to-enterprise-service-software)
- [8. Architecture from requirements and repositories](#8-architecture-from-requirements-and-repositories)
- [9. Canonical model and output contracts](#9-canonical-model-and-output-contracts)
- [10. Official icons and SVG production](#10-official-icons-and-svg-production)
- [11. Implementation choices and packaging](#11-implementation-choices-and-packaging)
- [12. Validation journey and test specification](#12-validation-journey-and-test-specification)
- [13. Evaluation corpus and release gates](#13-evaluation-corpus-and-release-gates)
- [14. Development sequence and open decisions](#14-development-sequence-and-open-decisions)
- [15. Consolidated references for the implementation agent](#15-consolidated-references-for-the-implementation-agent)
- [16. Research limits, access notes, and verification](#16-research-limits-access-notes-and-verification)

## 1. Recommended direction

Build Atlas GCP as a user-invoked architecture authoring skill. It should convert a product requirements document (PRD), business requirement, solution architecture, source repository, or combination of these into a coherent architecture pack. The core deliverables should be a versioned architecture model, a detailed Markdown narrative, and editable Scalable Vector Graphics (SVG) diagrams with official Google Cloud icons.

The skill needs five cooperating functions:

1. Extract evidence and requirements without confusing implemented, intended, inferred, and proposed behavior.
2. Select GCP capabilities using current product documentation and explicit business constraints.
3. Maintain one canonical model for components, boundaries, interactions, decisions, and evidence.
4. Generate consistent SVG views, component tables, flow descriptions, and review artifacts from that model.
5. Validate the evidence, GCP semantics, diagram structure, visual result, and final review status separately.

Google already provides a [Cloud Architecture Center](https://docs.cloud.google.com/architecture/). Its supporting journey includes the Well-Architected Framework, deployment archetypes, landing-zone guidance, enterprise foundations, workload patterns, and Terraform blueprints. Atlas GCP should connect those resources into a repeatable workflow that can explain an architecture and its limitations.

The skill should offer broad discovery coverage and publish its tested depth. “Understands every GCP feature” is not a credible permanent guarantee. Product names, launch stages, regions, networking options, quotas, and model capabilities change. A capable skill recognizes an unfamiliar feature, retrieves authoritative evidence, records uncertainty, and declines unsupported combinations.

Three findings materially affect implementation:

- **The current Azure baseline is stronger than the AWS report's baseline.** It now includes independent review and a cumulative evaluation harness. These should inform GCP from the start.
- **GCP requires its own topology rules.** For example, a GCP VPC is global and its subnets are regional. Copying Azure or AWS boundary nesting produces incorrect diagrams. [VPC networks](https://docs.cloud.google.com/vpc/docs/vpc)
- **The official GCP assets expose a compatibility gap.** The inspected packages contain 45 SVG files. Atlas Azure's existing embedded-SVG validator accepts 29 and rejects 16 because they contain `style` elements. A tested asset-validation change is required before claiming current GCP icon support. See section 10 for measured results.

Unless a section explicitly reports an observed repository behavior or cites a vendor fact, its capability IDs, schemas, tests, policies, and delivery phases are proposed Atlas design requirements.

## 2. Repository and Atlas Azure baseline

### 2.1 Repository state and predecessor research

The primary skills checkout was fast-forwarded from `84d92b5` to the fetched `origin/dev` revision `113fce0e5ee1814259dd2a50c77d793db2d9a87e`. The research worktree starts at that same revision on `openai/atlas-gcp-research`. Existing untracked AWS research was preserved.

The “Research Atlas AWS skill” task and its September 7 document were consulted. That task also requested a consolidated reference register and explicit notes about inaccessible sources. Sections 15 and 16 carry that requirement forward. Its document is a local research precedent, not proof that Atlas AWS has been implemented.

The AWS report used Atlas Azure's initial `e68d563` revision. The current `113fce0` baseline adds review doctrine, deployment realism, cumulative revision checks, larger icons, and a five-stage evaluation controller. Atlas GCP should be designed against the newer source.

### 2.2 Baseline sources

These links are pinned to the inspected revision. They remain useful if local folders move.

| Source | What it establishes |
| --- | --- |
| [Atlas Azure entry point](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/SKILL.md) | A user-invoked workflow from investigation through model, narrative, assets, SVG, assembled pack, inspection, and independent judgment. |
| [Analysis method](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/METHOD.md) | Repository evidence, observed/proposed/unknown states, deployment realism, and cumulative consistency. |
| [Output contract](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/OUTPUT.md) | Model, narrative, SVG, HTML/PDF, review receipt, verification status, and detached hashes. |
| [Diagram doctrine](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/DIAGRAMS.md) | Page geometry, stable flows, icon sizing, truthful abstraction, and visual acceptance. |
| [Independent review](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/REVIEW.md) | Architecture-pack and skill-patch modes; four audience perspectives; hash-bound evidence and verdict rules. |
| [Assembler](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/scripts/assemble.py) | Actual structural validation and HTML/PDF assembly behavior. It consumes previously authored SVGs. |
| [Staged evaluation](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/test/eval/atlas-azure/README.md) | Frozen cumulative scenarios, independently supplied judgments, integrity checks, and bounded evaluation claims. |

### 2.3 Reuse decisions

| Existing behavior | Atlas GCP recommendation | Reason or limitation |
| --- | --- | --- |
| User invocation and progressive disclosure | Preserve | Architecture production should have explicit scope and inputs. |
| Evidence states, stable component and flow IDs | Preserve and extend | Add evidence kind, environment, revision, and timestamp. |
| Platform and workload views | Preserve | Permit an explicit inherited-platform contract for small workloads. |
| Eight Azure landing-zone design areas | Replace with a versioned GCP foundation profile | Azure subscriptions and resource groups are not GCP projects and folders. |
| Original icon bytes and hashes | Preserve with GCP-aware validation | Current GCP embedded CSS is rejected by the Azure checker. |
| A4/A3 output and large icons | Use as initial Atlas profiles | These are house presentation choices, not Google's official paper-size requirements. |
| HTML/PDF review pack | Offer an explicit full-pack profile | The requested SVG/Markdown profile must remain usable without a PDF runtime. |
| Independent review and cumulative evaluation | Preserve with explicit profile support | A benchmark receipt and an ordinary delivery receipt have different purposes. |
| Azure-specific assembler | Adapt through tested provider contracts | It is not a repository extractor, GCP semantic validator, or automatic layout engine. |

### 2.4 Do not overstate what the existing tests prove

The current assembler checks required fields, nonempty evidence strings, declared node/flow IDs, numbered labels, marker references, embedded icon digests, and specific page profiles. It does not prove that a source supports a claim, an arrow visibly touches the intended node, or an architecture can be deployed.

The new doctrine requires 96-unit icon boxes by default and a 64-unit minimum at its standard physical scale. The original passing structural test fixture still uses 32-unit icons. Icon size is therefore a documented review rule, not an existing deterministic enforcement guarantee. [SVG fixture and structural tests](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/test/scripts/atlas-azure.test.mjs)

The staged controller does not call a model or generate architectures. Its freeze step does not require every ordinary pack artifact, including the ordinary `quality-review.json` and final detached manifest. A GCP implementation needs an explicit final-status validator and a tested adapter between benchmark and ordinary review records. A valid receipt alone cannot prove that a reviewer inspected the files. [Evaluation controller](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/test/eval/atlas-azure/run.mjs)

## 3. The Google Cloud architecture journey

Microsoft's comparison point is broader than a diagram gallery. Its Architecture Center connects architecture fundamentals, patterns, technology choices, landing zones, reference examples, and service guidance. Atlas GCP should reproduce that decision journey using Google's sources. [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/)

| Journey stage | Official GCP source | Expected Atlas output |
| --- | --- | --- |
| Understand the workload | [Cloud Architecture Center](https://docs.cloud.google.com/architecture/) | Scope, candidate architecture families, applicability, and exclusions. |
| Establish quality criteria | [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework) | Requirements and trade-offs across all six pillars. |
| Choose geographic shape | [Deployment archetypes](https://docs.cloud.google.com/architecture/deployment-archetypes) | Reasoned choice among zonal, regional, multi-regional, global, hybrid, and multicloud arrangements. |
| Understand the existing platform | [Landing-zone design](https://docs.cloud.google.com/architecture/landing-zones) | Existing foundation, inherited controls, missing decisions, and workload obligations. |
| Assess enterprise foundations | [Enterprise foundations blueprint](https://docs.cloud.google.com/architecture/blueprints/security-foundations) | Adopted controls, accountable owners, deviations, and implementation references. |
| Select workload components | [Agent component selection](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components) and relevant service documentation | Options, selected variants, limitations, and evidence. |
| Adapt a reference pattern | [Single-agent example](https://docs.cloud.google.com/architecture/single-agent-ai-system-adk-cloud-run) or a relevant domain architecture | Traceable adaptation, with differences from the source made explicit. |
| Connect design to code | [Terraform blueprints](https://docs.cloud.google.com/docs/terraform/blueprints/terraform-blueprints) | Node-to-resource or module mapping and implementation gaps. |
| Verify feasibility | [Locations](https://cloud.google.com/about/locations), [quotas](https://docs.cloud.google.com/docs/quotas/overview), and feature-specific guides | Feature/edition/location compatibility and capacity assumptions. |
| Plan operations and recovery | [Infrastructure reliability guide](https://docs.cloud.google.com/architecture/infra-reliability-guide) and [disaster recovery](https://docs.cloud.google.com/architecture/disaster-recovery) | Failure scenarios, service objectives, recovery dependencies, and test plans. |
| Produce the visual | [Official icon library](https://cloud.google.com/icons) | Versioned icon resolution and readable, faithful SVG views. |
| Maintain the architecture | [Release notes](https://docs.cloud.google.com/release-notes) and source changes | Semantic revisions, stale-fact alerts, and targeted revalidation. |

Google's six Well-Architected pillars are operational excellence; security, privacy, and compliance; reliability; cost optimization; performance optimization; and sustainability. Cross-pillar perspectives adapt them to a technology or domain. Include sustainability explicitly rather than copying Azure's five-pillar checklist. [Framework pillars](https://docs.cloud.google.com/architecture/framework)

Every reference pack should explain the problem, intended audience, applicability, architecture, workflow, service responsibilities, foundation dependencies, security, reliability, performance, operations, cost drivers, sustainability considerations, alternatives, implementation sequence, validation, and open decisions. The diagram is a view of this explanation.

## 4. Required skill capabilities

Use stable capability IDs in implementation stories, fixtures, and release evidence. Each acceptance criterion below is observable.

| ID | Capability | Acceptance criterion |
| --- | --- | --- |
| CAP-01 | Intake and scope | Records input revisions, audience, architecture purpose, environments, exclusions, and output profile. |
| CAP-02 | Requirements decomposition | Every material requirement maps to a design element, decision, test, or explicit gap. |
| CAP-03 | Repository discovery | Produces a bounded evidence inventory with file ranges, revision, inspected scope, and omitted areas. |
| CAP-04 | Mixed-input reconciliation | Preserves conflicts between PRD, code, infrastructure, diagrams, and owner statements. |
| CAP-05 | Domain modeling | Identifies business responsibilities and authoritative state before choosing cloud services. |
| CAP-06 | Service selection | Records the decision, realistic alternatives, and trade-off for material choices. |
| CAP-07 | Current GCP research | Consequential feature, location, lifecycle, and connectivity claims have dated primary evidence. |
| CAP-08 | Platform coverage | Assesses every foundation area, including inherited controls and accountable owners. |
| CAP-09 | GCP topology | Separates hierarchy, geography, network attachment, tenancy, and trust relationships. |
| CAP-10 | Interaction contracts | Critical flows identify protocol, direction, data class, identity, tenant context, failure behavior, and side effects. |
| CAP-11 | Data lifecycle | Covers ingestion, consistency, retention, access revocation, deletion, export, backup, and restoration. |
| CAP-12 | Agent architecture | Separates models, planning, execution, tools, sessions, memory, approvals, hosting, and evaluations. |
| CAP-13 | Enterprise SaaS | Defines tenant lifecycle, isolation model, entitlements, operations, economics, and application responsibilities. |
| CAP-14 | Failure and recovery | Traces normal, denied/degraded, uncertain-result, and recovery journeys with durable state ownership. |
| CAP-15 | Security explanation | Connects enforcement mechanisms to identities, resources, boundaries, exceptions, and validation evidence. |
| CAP-16 | Operations and capacity | Names owners, telemetry, service objectives, capacity assumptions, deployment order, and rollback. |
| CAP-17 | Cost and sustainability | Identifies usage drivers, dated estimate inputs, trade-offs, and uncertainty without invented totals. |
| CAP-18 | Canonical architecture model | One validated representation drives views, catalogs, flows, traceability, and deltas. |
| CAP-19 | Official asset resolution | Every GCP icon has a source package, member, digest, mapping decision, and current/legacy classification. |
| CAP-20 | Editable SVG | Shapes, connectors, and labels remain vectors/text; official icons remain faithful vector assets. |
| CAP-21 | Consistent views | Surviving IDs retain their meaning across overview, platform, deployment, runtime, data, and recovery views. |
| CAP-22 | Visual acceptance | Intended-size inspection finds no unresolved clipping, misleading routes, missing icons, or unreadable essential labels. |
| CAP-23 | Revision support | Generates a semantic diff, preserves unresolved findings, retires IDs explicitly, and invalidates affected checks. |
| CAP-24 | Portability | Core authoring works from local files without mandatory cloud credentials or a commercial drawing subscription. |
| CAP-25 | Honest readiness | Derives final status from applicable checks and independent judgment; skipped checks cannot silently pass. |
| CAP-26 | Review-pack export | Each selected export profile produces real, inspected files with matching content and hashes. |
| CAP-27 | Knowledge maintenance | Catalog changes carry sources, dates, ownership, coverage states, and regression evidence. |
| CAP-28 | Controlled evaluation | Reproducible fixtures test simple, complex, repository-derived, and cumulative-change cases. |

Ask a small number of grouped intake questions when answers materially affect the design. Prioritize business outcomes and service objectives; tenant and data constraints; and existing platform/integration commitments. Continue independent work while marking provisional decisions. A missing regional requirement should not become an invented regional commitment.

## 5. GCP knowledge and foundation coverage

### 5.1 Four catalogs, with different responsibilities

Maintain separate discovery, capability, pattern, and icon catalogs. Discovery tells the skill where to research. Capability records describe a feature and its constraints. Patterns combine capabilities to solve a bounded problem. Icon records map product labels to official artwork. None substitutes for the others.

The following breadth map is a proposed research index. Service names are discovery seeds, not a claim that every listed configuration has been verified. Start with the [Google Cloud product catalog](https://cloud.google.com/products), then use exact feature documentation.

| Knowledge area | Discovery seeds | Questions to resolve |
| --- | --- | --- |
| Compute and containers | Cloud Run, GKE, Compute Engine, Batch, accelerated compute | Execution model, state, concurrency, startup, capacity, network behavior, and operating burden. |
| APIs and integration | Apigee, API Gateway, Application Integration, Integration Connectors | Contract, identity, policy enforcement, backend actions, throttling, and error semantics. |
| Events and orchestration | Pub/Sub, Eventarc, Cloud Tasks, Workflows, Cloud Scheduler | Push/pull, fan-out, ordering, scheduling, replay, delivery guarantees, and durable orchestration. |
| Network and edge | VPC, Shared VPC, Cloud Load Balancing, Cloud DNS, Cloud NAT, Private Service Connect, Cloud VPN, Interconnect, Network Connectivity Center | Resource scope, attachment, routing, name resolution, ingress/egress, and hybrid dependencies. |
| Operational data | Cloud SQL, AlloyDB, Spanner, Firestore, Bigtable, Memorystore | Transactions, consistency, partitioning, tenancy, indexes, recovery, and cost. |
| Storage | Cloud Storage, Hyperdisk, Filestore, backup products | Object/block/file access, location variant, retention, lifecycle, restoration, and ownership. |
| Analytics and data movement | BigQuery, Dataflow, Dataproc, Datastream, BigLake, catalog services | Ingestion, lineage, transformation, freshness, residency, access, and schema changes. |
| Models and agents | Current Agent Platform documentation, Gemini models, ADK, model and retrieval services | Model/provider choice, runtime contract, tools, memory, evaluations, launch stage, and endpoint scope. |
| Applied AI and customer experience | Document AI, Speech, translation, vision, Gemini Enterprise for CX | Supported input/output, confidence, human handoff, and native versus custom domain behavior. |
| Identity and data protection | IAM, workforce/workload federation, Identity Platform, Secret Manager, Cloud KMS, VPC Service Controls | Caller type, effective authorization, key/secret references, supported data boundaries, and exceptions. |
| Governance and operations | Resource Manager, organization policy, Asset Inventory, Logging, Monitoring, Trace, security operations | Inventory coverage, policies, telemetry, retention, incident responsibilities, and change evidence. |
| Software delivery | Terraform, Infrastructure Manager, Cloud Build, Artifact Registry, Cloud Deploy, existing CI | Provenance, configuration, environment promotion, deployment ordering, and rollback. |
| SaaS and business software | Tenancy patterns, application integration, CX products, external business systems | Tenant lifecycle, entitlements, authoritative records, billing, migrations, and product gaps. |
| Hybrid, edge, and field operations | Google Distributed Cloud, external device platforms, Maps Platform | Disconnection, synchronization, device trust, location services, and external-system boundaries. |
| Specialist and emerging domains | Industry, media, geospatial, research computing, new launches | Trigger focused research and specialist review; publish unsupported areas. |

### 5.2 Required capability-record fields

A record should carry stable identity; current display name and aliases; product, feature, and resource distinctions; API/resource identifiers; deployment variants; lifecycle; supported locations; customer eligibility; network/identity constraints; quotas and pricing units; source URLs and anchors; source update and retrieval dates; confidence; known contradictions; related pattern IDs; and tests that exercise the record.

Use coverage states such as `indexed`, `source-verified`, `pattern-tested`, and `unsupported`. Track stale evidence separately. A failed retrieval must not update `lastVerified`. Unavailable evidence should yield a bounded draft limitation, not a guessed feature fact.

Proposed maintenance policy: recheck selected volatile facts during each architecture run; refresh discovery indexes monthly and after relevant announcements; recheck the icon landing page before delivery; invalidate affected rules when source or package hashes change. These are Atlas operating choices, not vendor commitments. Google's aggregate [release notes](https://docs.cloud.google.com/release-notes) cover a limited recent window, so older changes need product-specific history.

### 5.3 GCP foundation profile

Google's landing-zone guide identifies identity provisioning, resource hierarchy, network, and security controls as core elements, with additional operating concerns. The following ten-area checklist is a proposed Atlas coverage profile, not an official Google list. [Landing-zone design](https://docs.cloud.google.com/architecture/landing-zones)

| Area | Required assessment |
| --- | --- |
| Organization and projects | Organization/folder/project responsibilities, environment separation, provisioning, billing association, and ownership. |
| Identity and access | Workforce, customer, service, and agent identities; federation; effective permissions; emergency access. |
| Locations and tenancy | Permitted storage and processing locations, failure domains, tenant isolation, and dedicated/shared resources. |
| Network and connectivity | Global/regional scope, Shared VPC, addressing, DNS, routing, private access, ingress/egress, and hybrid links. |
| Security and data protection | Classification, secrets, key ownership, perimeter applicability, vulnerability handling, and exceptions. |
| Governance and evidence | Organization policies, inventory, labels/tags, control evidence, retention, and exception owners. |
| Operations and observability | Service objectives, structured telemetry, runbooks, support, patching, incident response, and restoration of security state. |
| Delivery and change | Infrastructure definitions, artifacts, promotion, approvals already required by the project, rollout, rollback, and drift. |
| Finance and capacity | Usage assumptions, quotas, fixed limits, budgets, allocation, tenant cost, and sustainability trade-offs. |
| Backup and continuity | Recovery objectives, backup ownership, dependencies, restore tests, failover, and failback. |

Every area needs applicability, current/proposed/unknown state, evidence, mechanism, accountable owner, workload obligation, and verification method. An inherited capability needs a referenced platform contract. “Handled by the platform” without ownership and scope is insufficient.

## 6. GCP semantics that diagrams must preserve

An architecture graph needs several typed relationships. Organizational ownership, deployment geography, network membership, application grouping, and trust do not form one universal nesting tree.

| Rule | Required modeling and validation behavior | Primary evidence |
| --- | --- | --- |
| GCP-01: Resource hierarchy | Model organization, optional folders, projects, and service resources. Do not invent an organization for a project-root input. Keep parentage separate from location. | [Resource hierarchy](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy) |
| GCP-02: Network scope | Represent a VPC as global and subnets as regional. A subnet may serve instances in different zones of its region. | [VPC networks](https://docs.cloud.google.com/vpc/docs/vpc) |
| GCP-03: Shared VPC | Keep host-project network ownership separate from service-project resource ownership and subnet use. | [Shared VPC](https://docs.cloud.google.com/vpc/docs/shared-vpc) |
| GCP-04: Private access | Distinguish Private Service Connect, private services access, Private Google Access, and peering. Verify product support, endpoint type, direction, DNS, and route. | [Private access options](https://docs.cloud.google.com/vpc/docs/private-access-options) |
| GCP-05: Peering | Reject assumed transit through two peerings. Firewall and DNS requirements remain separate. | [VPC Network Peering](https://docs.cloud.google.com/vpc/docs/vpc-peering) |
| GCP-06: Service perimeter | Model VPC Service Controls separately from VPCs and IAM. Check supported services and ingress/egress exceptions. Do not treat it as general internet-egress control. | [VPC Service Controls](https://docs.cloud.google.com/vpc-service-controls/docs/overview) |
| GCP-07: Serverless networking | Do not infer direct ingress from Direct VPC egress. Current Cloud Run services/jobs differ from worker pools, which have a distinct direct-ingress capability. | [Cloud Run Direct VPC](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc) |
| GCP-08: Delivery semantics | Pub/Sub exactly-once delivery is scoped to pull subscriptions and regional conditions. It does not remove the need to handle duplicate business commands or publish-side duplicates. | [Exactly-once delivery](https://docs.cloud.google.com/pubsub/docs/exactly-once-delivery) |
| GCP-09: Availability and scale | Validate feature, edition, location, endpoint, and quota type. Product availability in a region is insufficient evidence for every feature. | [Locations](https://cloud.google.com/about/locations), [Cloud Quotas](https://docs.cloud.google.com/docs/quotas/overview) |
| GCP-10: Recovery | Record control-plane dependencies and pre-provisioned capacity. A global frontend can still be a shared configuration failure. | [Disaster recovery](https://docs.cloud.google.com/architecture/disaster-recovery), [management and monitoring](https://docs.cloud.google.com/architecture/infra-reliability-guide/manage-and-monitor) |

Each rule should return `supported`, `contradicted`, `unknown`, or `not-applicable`, with source and reason. An overview document supports a rule family; implementation still needs resource-variant exceptions. Unknown settings cannot become a pass merely because the diagram has a matching icon.

Critical flows need more than a line. Record the source workload, destination API/resource, calling identity, authorization mechanism, network route, name resolution, data class, timeout, retry, idempotency key, and result semantics. Record a synchronous dependency's reason where the repository prefers asynchronous integration.

For recovery, distinguish recovery time objective (RTO: maximum acceptable restoration delay) from recovery point objective (RPO: acceptable data loss). Preserve objectives per business operation. A backup icon does not establish either target. [Reliability requirements](https://docs.cloud.google.com/architecture/infra-reliability-guide/requirements)

## 7. From a simple agent to enterprise service software

### 7.1 Current naming is part of the architecture problem

Google's current documentation uses Gemini Enterprise Agent Platform and Agent Runtime. Its April 22, 2026 release entry maps earlier Agent Engine terminology to Agent Runtime. The runtime resource API still uses `ReasoningEngine` for compatibility. Store current display names separately from API identifiers and observed repository aliases. Do not rewrite valid code identifiers because a product label changed. [Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes), [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime)

The platform organizes capabilities around building, scaling, governing, and optimizing agents. This provides discovery structure; it does not make every feature equally mature or available in every location. [Agent Platform overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview)

### 7.2 Proportional architecture patterns

| Pattern | Proposed architecture reasoning | Required diagram detail |
| --- | --- | --- |
| Deterministic task | Compare a normal service/workflow with an agent. Use explicit code for predictable rules. | Trigger, state owner, decision logic, external action, and failure path. |
| Bounded single agent | Compare Cloud Run, Agent Runtime, and GKE against workload and operating requirements. | Caller, agent loop, model endpoint, typed tools, session state, telemetry, and denied path. |
| Retrieval-augmented agent | Retrieval-augmented generation (RAG) supplies retrieved source material to the model. Enforce source authorization before retrieval and generation. | Ingestion, transformation, indexing, retrieval, access filtering, grounding, freshness, deletion, and generation. |
| Multi-agent workflow | Separate local helpers from independently deployed agents. Use remote coordination only for a stated boundary. | Parent/child execution, state ownership, network boundaries, cancellation, budgets, and arbitration. |
| Durable business action | Keep the command and its outcome in durable business state. The model may propose an action; the domain service controls it. | Approval, command ID, validation, execution, retry, uncertain outcome, reconciliation, and compensation. |
| Enterprise SaaS | Separate shared tenant administration from customer application behavior. | Tenant lifecycle, isolated data paths, entitlements, shared services, regional deployment, and operations. |

Google's [single-agent Cloud Run reference](https://docs.cloud.google.com/architecture/single-agent-ai-system-adk-cloud-run) is a useful starting pattern, not a mandatory stack. Its [component selection guide](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components) supports separating models, tools, memory, and runtimes. ADK's [A2A introduction](https://adk.dev/a2a/intro/) distinguishes local subagents from independently deployed remote agents.

Model Context Protocol (MCP) describes a tool/resource integration interface. Agent2Agent (A2A) describes interaction between agents. Neither protocol proves authorization, tenant isolation, reliability, or business correctness. Each remote boundary still needs a contract, identity, lifecycle, observability, and failure model.

### 7.3 Compatibility facts that must become negative tests

These are documentary findings as of the research date. Recheck the selected feature before use.

| Finding | Required Atlas response |
| --- | --- |
| The current agent locations matrix excludes Memory Bank in Jakarta, Melbourne, and Toronto. Global Sessions/Memory Bank and multi-regional Runtime have stated CMEK restrictions. | Reject the incompatible feature/location/endpoint/key combination or mark a supported alternative for review. Customer-managed encryption keys (CMEK) are a feature-level choice. [Agent locations](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/agent-locations) |
| Memory Bank regional storage does not guarantee regional model processing when a suitable regional model endpoint is unavailable. | Model storage and processing geography separately. Preserve the potential global processing path. [Memory Bank](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank) |
| The Runtime access guide states that VPC Service Controls is unsupported with Agent Gateway. | Do not advertise the combined boundary as supported merely because each product exists. [Runtime access constraints](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/manage-agent-access) |
| RAG Engine's current overview supports VPC-SC and CMEK but says data residency controls are unsupported. | Treat strict residency requirements as a design gap; investigate alternatives rather than approve the pattern by default. [RAG Engine overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-overview) |
| ADK action confirmation currently excludes `DatabaseSessionService` and `VertexAiSessionService`. | Verify the exact ADK version/session backend. Specify a durable approval mechanism where the requested combination is unsupported. [ADK confirmations](https://adk.dev/tools-custom/confirmation/) |

Approval controls must bind the approver, tenant, requested action, parameters, expiry, and relevant state version. A repeated callback must not execute the action again. An approval box on a diagram is insufficient evidence that these controls exist.

### 7.4 Enterprise customer and field service

Use Dynamics 365 Customer Service and Field Service as a benchmark for business scope. Do not treat a set of GCP services as established feature parity. The proposed domain decomposition below is a starting point for a capability gap analysis.

| Bounded context | Authoritative responsibilities | Agent contribution |
| --- | --- | --- |
| Customer and case management | Customer links, case state, ownership, service-level deadlines, communication history | Summarize, classify, recommend routing, draft responses, and propose updates. |
| Knowledge | Approved articles, provenance, access rules, versions, expiration | Retrieve evidence, identify gaps, and draft changes for review. |
| Entitlements and policy | Contracts, service coverage, warranty rules, approval limits | Explain applicable rules and request allowed decisions. |
| Work orders | Requested work, lifecycle, tasks, completion evidence, dependencies | Propose work, collect context, and coordinate authorized transitions. |
| Scheduling and dispatch | Availability, qualifications, travel, parts, capacity, exceptions | Compare schedules, explain conflicts, and propose reassignment. |
| Technician operations | Offline task data, evidence capture, synchronization, device/session controls | Assist with troubleshooting and structured completion notes. |
| Assets and inventory | Equipment identity, history, stock, reservations, consumption | Diagnose symptoms and propose reservations or replenishment. |
| Commercial transactions | Quotes, approvals, refunds, invoicing, ledger reconciliation | Prepare actions while deterministic services enforce financial invariants. |
| Tenant administration | Onboarding, identity configuration, entitlements, metering, export, offboarding | Assist operators without bypassing tenant control boundaries. |

Google's current [Gemini Enterprise for CX portfolio](https://docs.cloud.google.com/gemini-enterprise-cx) provides customer interaction and assistance capabilities. [Application Integration with ADK](https://docs.cloud.google.com/application-integration/docs/application-integration-adk) provides an integration path. These are components to evaluate, not evidence of a complete customer/field service application.

The [Dynamics 365 connector](https://docs.cloud.google.com/integration-connectors/docs/connectors/dynamics365/configure) can support integration research. Check exact supported objects/actions, schema freshness, backend permissions, editions, throughput, and error handling. Connector availability does not prove that an end-to-end workflow preserves business rules.

The [Route Optimization API](https://developers.google.com/maps/documentation/route-optimization/overview) is a Google Maps Platform capability for assigning tasks and optimizing routes against constraints. Show Maps as its own integration boundary. It does not own work-order state, inventory, offline synchronization, or the full technician workflow.

### 7.5 Three enterprise journeys to require

**Customer request to resolution:** Authenticate the caller and establish trusted tenant context. Retrieve authorized case and knowledge data. Let the agent propose an action. Apply entitlement and policy checks. Persist an approval if required. Execute through the domain API. Record the outcome. Notify the customer through an authorized channel. A timeout after the backend commits enters reconciliation; it must not trigger an unconditional repeat refund or work-order creation.

**Work order to field completion:** Validate asset, warranty, parts, skills, and appointment constraints. Optimize a proposed route. Dispatch through the work-order service. Synchronize a bounded offline work package. Record technician evidence. Resolve concurrent edits on reconnect. Commit completion and inventory changes through authoritative services. Preserve impossible schedules and conflicting evidence as explicit exceptions.

**Incident to recovery:** Identify affected tenants and dependencies. Fence stale workers and preserve command/approval versions. Restore business state and the security state that governs access. Replay events with deduplication. Reconcile external actions before re-enabling automation. Verify authorized reads, denied reads, and duplicate action behavior before admitting traffic.

### 7.6 Commercial SaaS is a separate design problem

Google's [multi-tenant agentic AI architecture](https://docs.cloud.google.com/architecture/multi-tenant-agentic-ai-system) uses business units as tenants. It is useful for isolation and shared-tool reasoning, but commercial SaaS also needs signup, billing, customer identity, entitlements, upgrades, data export, and offboarding.

Compare pooled, dedicated, and hybrid tenancy for compute, data, retrieval, memory, keys, and operating responsibility. A tenant-per-project pattern is an option, not a universal default. Google's [Spanner tenancy patterns](https://docs.cloud.google.com/spanner/docs/implement-multi-tenancy) illustrate different isolation and management trade-offs; their existence is not a reason to choose Spanner for every workload.

Test tenant context through requests, background jobs, tool calls, retrieval, caches, sessions, memory, files, telemetry, and backups. Never trust a tenant ID produced by a model or supplied in an unverified tool argument. Authentication and tenant isolation are separate acceptance criteria.

### 7.7 Agent operations and economics

A useful operating view shows correlation IDs, traces, redaction, retention, owner access, alerts, model/tool budgets, evaluation datasets, and rollback of prompts, policies, tools, and models. [ADK evaluation](https://adk.dev/evaluate/) and [Agent Platform evaluation metrics](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/manage-metrics) are sources for behavior evaluation, not SVG validation.

Online evaluation can require traces that include prompts, responses, instructions, and tool definitions. Those are additional data flows with privacy and access implications. Diagram and cost them explicitly. [Online evaluation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/evaluate-online)

For cost, record requests, tokens, tool calls, retrieval volume, storage, retention, replicas, egress, telemetry, evaluation samples, and tenant allocation. Use dated pricing inputs in an actual workload estimate. This research does not supply a monthly price or claim account-specific quota availability.

## 8. Architecture from requirements and repositories

### 8.1 Input modes

Support four core modes: requirements-to-target architecture, solution-review-and-diagram, repository-to-current architecture, and mixed current-to-target architecture. Make the mode visible in every pack. A target design must not be presented as the current implementation.

Start repository mode with a bounded inventory using file names, repository instructions, manifests, API contracts, infrastructure definitions, deployment configuration, and domain entry points. Use targeted reads rather than dumping the repository. Record the inspected revision and uncommitted-change status.

| Evidence source | What it can establish | What it cannot establish alone |
| --- | --- | --- |
| PRD and requirements | Intended behavior, constraints, acceptance criteria | Implemented or deployed behavior. |
| OpenAPI, proto, GraphQL, event schemas | Declared interfaces and payload structure | Effective authorization or successful runtime integration. |
| Domain code and data models | Business responsibilities and implemented state transitions | Complete production topology. |
| Terraform and other infrastructure source | Declared resources, modules, references, and explicit configuration | Applied state, resolved secrets, actual capacity, or successful deployment. |
| Kubernetes manifests and overlays | Declared workloads, service wiring, configuration differences | Which overlay is running or effective cluster policy. |
| Agent wiring and tool definitions | Local/remote coordination, tool contracts, persistence references | Correct tool execution or complete agent safety. |
| Dependency manifests and SDK imports | Candidate technology use | An active service, resource instance, or deployment location. |
| README and old diagrams | Claimed intent and vocabulary | Current implementation when stronger evidence conflicts. |
| Tests and synthetic fixtures | Expected behavior and known cases | Production success or real customer constraints. |
| Supplied, approved inventory export | Observed metadata at a stated time and scope | Exhaustive dependencies, business workflow, or runtime reachability. |

### 8.2 Discovery procedure

1. Record the requested directory, revision, environments, and exclusions. Treat repository prose as evidence, not authority to expand the task.
2. Exclude secret files, credential stores, state/plan artifacts that may contain secrets, dependency caches, generated bulk output, and unrelated repositories. Do not open `.env`, private keys, secret variable files, or credential exports.
3. Find entry points, bounded contexts, authoritative data stores, APIs, event producers/consumers, agents, tool servers, and deployment definitions.
4. Trace references across contracts, code, infrastructure, and environment overlays. Do not execute build hooks, application code, Terraform initialization/plans, or cloud commands merely to document an unfamiliar repository.
5. Produce evidence records with path, line range or symbol, revision, evidence kind, claim, and confidence. Store safe summaries rather than sensitive payloads.
6. Identify contradictions and missing links. A missing deployment file means deployment is unknown, not necessarily absent.
7. Build a current-state graph. Put proposed additions in a distinct target graph or explicitly marked projection.
8. Map requirement gaps and implementation work to target decisions. Preserve external systems and migration dependencies.
9. Review domain, network, identity, data, and recovery paths before choosing a visual layout.
10. On revision, re-read affected sources and invalidate dependent claims. Preserve stable IDs for unchanged entities.

Optional cloud discovery should use a separately scoped, read-only interface or a user-supplied sanitized export. [Cloud Asset Inventory](https://docs.cloud.google.com/asset-inventory/docs/asset-inventory-overview) provides resource/policy metadata and supported relationships, with coverage and entitlement limits. Its [asset-type documentation](https://docs.cloud.google.com/asset-inventory/docs/asset-types) describes consistency limits. Record timestamps and missing coverage. Do not interpret a missing asset or relationship as conclusive absence.

### 8.3 Worked extraction example

A repository contains one containerized service, three local ADK subagents, a Pub/Sub subscriber, an OpenAPI case-management contract, and Terraform for a regional Cloud SQL instance. Its README still describes an earlier database.

The expected output is one code-level application containing three logical agents, an evidenced subscriber implementation, a declared database, and a conflict against the README. Application deployment and subscription existence remain unknown unless separate declarations or approved inventory establish them. It must not invent three independently deployed agent services. It should show whether the code reads case state directly or through the declared API. If the deployment environment or database availability configuration is unresolved, the placement table should say so.

A PRD proposing a second region creates target components and recovery decisions. It does not retroactively turn the current single-region configuration into a deployed multi-region architecture.

## 9. Canonical model and output contracts

### 9.1 Model before diagram

Define a versioned schema before implementation. The model is the shared representation from which all views and tables are derived. Keep evidence and architecture semantics separate from layout coordinates so that a visual repair cannot silently alter the design.

| Entity | Required fields or relationships |
| --- | --- |
| Run metadata | Schema version, provider profile/version, source revision, input hashes, mode, environment, output profile, assumptions. |
| Requirement | Stable ID, source, wording/summary, priority, acceptance criterion, design mappings, verification mappings, unresolved status. |
| Evidence | Stable ID, source kind, path/URL, revision/version, locator, observed time, supported claim, confidence, restrictions. |
| Component | Stable ID, domain responsibility, provider, current label, API/resource type, lifecycle, state, evidence and requirement IDs. |
| Placement | Organizational owner, environment, region/zone/global scope, network attachments, managed-service endpoints, tenant scope. |
| Flow | Stable ID, endpoints, purpose, protocol, synchrony, data class, identity, tenant binding, side effect, retry, idempotency, timeout, recovery. |
| Data asset | Authority, schema, consistency, classification, retention, deletion, access rules, replica/backup locations, recovery owner. |
| Control | Mechanism, enforcement point, owner, source, applicability, exceptions, test or review evidence. |
| Decision | Requirement, selected option, alternatives, trade-off, consequences, owner, status, evidence. |
| View | Audience, question answered, current/target state, component/flow projection, omissions, aggregation map, page profile. |
| Icon | Provider, product/category mapping, asset family, source, package/member hashes, original member path, retrieval date, terms reference. |
| Finding | Stable ID, severity, affected requirement/artifact, issue, consequence, evidence, closure state, prior finding link. |
| Verification | Check ID/version, applicable scope, input hashes, result, evidence, runner/reviewer identity if exposed, limitations. |

Use independent `state` and `evidenceKind` fields. A component can be `observed` with `repository-declaration` evidence while its actual deployment remains `unverified`. A rendered green box must not conceal that distinction.

Illustrative JSON fragment, not the complete schema or an existing Atlas Azure-compatible file:

```json
{
  "schemaVersion": "atlas-gcp/1.0-proposed",
  "mode": "current-to-target",
  "components": [
    {
      "id": "case-api",
      "responsibility": "Validate and persist case changes",
      "provider": "gcp",
      "service": "Cloud Run",
      "state": "observed",
      "evidenceKind": "repository-declaration",
      "deploymentVerification": "unverified",
      "evidenceIds": ["E-001"],
      "requirementIds": ["REQ-001"]
    }
  ],
  "evidence": [
    {
      "id": "E-001",
      "kind": "repository-declaration",
      "path": "infra/application.tf",
      "locator": "resource symbol identified during intake",
      "revision": "replace-with-inspected-revision",
      "claim": "The repository declares the case API service"
    }
  ],
  "openDecisions": ["Resolve target region and recovery configuration"]
}
```

Unknown schema versions should fail clearly. Migrations need fixtures that preserve meaning and surviving IDs. Require every reference to resolve and every visible flow endpoint to appear in its view. Allow filtered views to retain nonconsecutive flow numbers.

### 9.2 Required views

Deliver an overview and a platform/deployment view. They may be compact for a small workload. Add specialist views when they answer a distinct question.

| View | Review question |
| --- | --- |
| Business/system context | Who uses the system, what does it own, and which external systems remain authoritative? |
| Integrated overview | How does the main customer journey cross the solution and platform? |
| Platform and deployment | Which project, region, network, endpoint, and control owns or supports each material component? |
| Runtime and agent flow | How do planning, inference, tools, approvals, state, and failure handling interact? |
| Data and trust | Where does sensitive/tenant data move, persist, replicate, expire, and become accessible? |
| Operations and delivery | How are changes built, promoted, observed, rolled back, and supported? |
| Recovery | What fails, what survives, what must be restored, and what gates traffic admission? |
| Current-to-target transition | What is retained, introduced, retired, migrated, or unresolved? |

An overview must retain material dependencies, including direct application-to-state access. Map aggregate journey arrows to canonical flow IDs. Disclose intentional omissions. Do not imply that all state access passes through an agent simply because the direct API path is omitted.

### 9.3 Artifact profiles

**Core profile:** `architecture.json`, `reference-architecture.md`, declared SVG views, `sources.json`, `icon-provenance.json`, `verification.json`, `quality-review.json`, and a final `SHA256SUMS` manifest. Include a semantic change report for revisions. The model and Markdown provide structured and readable access to the same architecture.

**Full review-pack profile:** Add a self-contained HTML document, searchable PDF, explicit palette/theme record, actual export metadata, and visual review evidence. Full Atlas Azure parity requires this profile. Do not make a PDF mandatory for the user's requested SVG-only use unless they select the full pack.

The narrative should contain purpose, scope, assumptions, component/placement tables, numbered flows, six-pillar review, platform coverage, data lifecycle, normal/denied/recovery journeys, alternatives, implementation sequence, validation, and open findings. Generate overlapping tables from the model.

### 9.4 Readiness and immutable review

Keep artifact completeness, design readiness, owner approval, and runtime validation as separate fields. Use `incomplete`, `needs-decision`, and `review-ready` for design delivery. A disclosed internal contradiction remains a defect; it does not become acceptable through disclosure alone.

Finalization should follow this order:

1. Generate and inspect artifacts; freeze the reviewed version.
2. Hash the actual model, narrative, views, and selected exports.
3. Obtain an independent judgment bound to those hashes.
4. Derive final verification status without modifying the frozen reviewed files.
5. Generate a detached manifest that covers the pack and receipts, excluding the manifest itself.

Any change to a reviewed artifact invalidates its affected judgment. Preserve earlier findings and evidence. An independent pass means the design met the review contract; it does not authorize a deployment or prove operational behavior.

## 10. Official icons and SVG production

### 10.1 Current Google icon system

Google's official library provides core product icons, category icons, a product-to-icon guide, and a separately labeled legacy archive. The guide inspected here is marked **Updated: May 2026**. It distinguishes unique core artwork from shared category artwork and says legacy console icons should not be used as of 2026. Several services therefore legitimately share one official category symbol. Product labels must identify them. [Icon library](https://cloud.google.com/icons), [product icon guide](https://services.google.com/fh/files/misc/google-cloud-product-icons.pdf)

Keep three identities separate: current product name, observed API/repository alias, and actual asset member name. The downloaded core package contains a member named `Vertex AI`, while current agent documentation uses newer platform terms. A file name is not authoritative lifecycle evidence.

Do not infer current service support from the icon guide. For example, it still lists Deployment Manager, while current service documentation says standard support ended April 1, 2026 and describes later extension and shutdown milestones. The page contains some overlapping legacy wording; use the explicit milestone sections and verify customer eligibility before any migration recommendation. An icon's presence is not evidence of support. [Deployment Manager deprecation](https://docs.cloud.google.com/deployment-manager/docs/deprecations)

### 10.2 Measured archive survey

Both current ZIP files were downloaded from links on the official icon page on September 8, 2026. SVG counts exclude directory entries and archive metadata. These are asset counts, not counts of supported GCP services.

| Package | Download size | SVG files | Accepted by Azure embedded validator | Rejected |
| --- | --- | --- | --- | --- |
| [Core product icons](https://services.google.com/fh/files/misc/core-products-icons.zip) | 318,678 bytes | 19 | 6 | 13 containing `style` elements. |
| [Category icons](https://services.google.com/fh/files/misc/category-icons.zip) | 795,968 bytes | 26 | 23 | 3 containing `style` elements. |
| Total | 1,114,646 bytes | 45 | 29 | 16 |

Observed SHA-256 values:

```text
core-products-icons.zip
6531a10f58bc599c24d9a455d81dd757c1a03c3c43da9cddf639b859c1c1eece

category-icons.zip
e5bc3abd3527dc2500e9bff7f15870783e2c764129c49b7cd4c1b4e105345002
```

All 45 inspected SVGs have `viewBox="0 0 512 512"` and no explicit root width/height. The 16 rejected files use three distinct embedded stylesheet patterns, consisting of class selectors and `fill` declarations. Core rejections include Cloud Run, GKE, Cloud Storage, BigQuery, Compute Engine, and Cloud SQL. This is a meaningful launch blocker for an unchanged Azure renderer path.

The experiment called the current Azure `safe_svg` function with `embedded=True` on each original SVG. Acceptance means compatibility with that checker, not universal safety, product correctness, or visual fidelity. No modified icon package was created.

### 10.3 Asset policy and resolution

The icon landing page explicitly presents the assets for diagrams and technical documentation. No standalone license/terms file was found in the two inspected archives. Google's general developer documentation license excludes trademarks and other brand features. Preserve publisher provenance and establish applicable terms before bundling or redistributing a complete pack; do not relicense it under the skills repository's Apache license. [Google site policies](https://developers.google.com/terms/site-policies)

The linked guide carries a proprietary/confidential footer despite its public placement on the icon page. Link to that source and record the discrepancy. The research does not establish unrestricted redistribution of the guide or the full archives.

Recommended resolution procedure:

1. Read the official landing page and current mapping guide.
2. Select the documented core icon, or the documented category icon plus an exact service label.
3. Record unresolved mappings rather than invent a new official-looking icon.
4. Download/cache the official package or accept a supplied archive with visible age and origin.
5. Inspect archive entries before extraction. Reject traversal, absolute paths, symlinks, executables, excessive expansion, and duplicate/conflicting member names.
6. Select only needed SVG members. Preserve original bytes and hashes.
7. Validate each selected SVG using a bounded inert profile.
8. Embed the original asset and record its mapping, source, archive digest, member digest, and retrieval date.

A generic custom-service box is appropriate for domain code. Label it as custom software. It must not resemble a newly invented Google product. External vendors use their own verified assets or neutral labeled boxes.

### 10.4 SVG compatibility decision

**Decision:** Prefer original SVG bytes embedded as `data:image/svg+xml;base64` with preserved aspect ratio. Extend validation through a narrowly defined embedded-CSS profile after a tested prototype.

**Alternatives:** Convert a validated CSS subset into presentation attributes; use a different current official variant; or deliver a named draft limitation. Rasterizing official icons conflicts with the desired vector deliverable. Falling back silently to legacy icons conflicts with the current guide.

**Trade-off:** Original-byte embedding preserves provenance and keeps icon internals isolated. Supporting CSS requires a real parser or tightly bounded grammar, resource limits, and adversarial tests. A derived asset simplifies some viewers but changes the hash; it needs a transformation record and proof of visual equivalence. Do not describe a transformed file as the original.

The proposed safe subset should reject script, event handlers, external URLs, imports, font loading, animation, foreign HTML, entities, unresolved fragments, recursive payloads, and excessive resource use. For the observed files, permit only the required class selectors and inert fill values inside embedded assets. Reject unknown syntax rather than broadly allowing all `style` content. W3C distinguishes standalone SVG behavior from image embedding modes; viewer behavior must not replace validation. [SVG processing modes](https://www.w3.org/TR/SVG2/conform.html)

### 10.5 Composition and visual grammar

Use the following initial house profile, subject to a GCP rendering prototype:

| Property | Proposed default |
| --- | --- |
| A4 landscape | 297 × 210 mm; `viewBox="0 0 1122 794"`. |
| A3 landscape | 420 × 297 mm; `viewBox="0 0 1587 1122"`. |
| Safe inset and grid | 48 units; 8-unit grid. |
| Icon box | 96 × 96 units by default; 64 × 64 minimum at the declared physical scale. |
| Body labels | Start at 16 units; essential labels at least 14 units. |
| Connectors | Reserved routing lanes; approximately 2-unit strokes, adjusted for final scale. |
| Color and background | Neutral light surface; original icon colors; color plus line pattern/text for meaning. |

Measure effective size after parent transforms and page scaling. Inspect transparent padding without cropping artwork. Split a crowded diagram rather than shrinking the text. Keep official icons separate from responsibility labels and connector ports.

Represent runtime, control, and telemetry flows with distinct line patterns and a legend. Put arrowheads at destinations and stable numbered badges near the relevant segment. Keep labels away from bends and crossings. Draw organizational, geographic, network, tenant, and trust boundaries with distinct labels so their meanings are explicit.

Include SVG `title` and `desc`, live text, and a complete textual equivalent of material relationships. Aim for 4.5:1 contrast for ordinary text and 3:1 for essential diagram lines as house acceptance targets. Do not recolor official artwork to satisfy a theme. Accessible labels and neutral backing should carry the meaning. [W3C complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/)

### 10.6 Production pipeline

The proposed pipeline is: validate evidence and model; choose views; resolve assets; measure labels; lay out typed boundaries and nodes; route connectors; add machine annotations; validate XML and geometry; render; inspect; repair; freeze; independently review; finalize.

Store geometry separately from the architecture model. Use stable ordering and explicit layout constraints so harmless JSON reordering does not rearrange every diagram. Automatic layout is a starting point; dense enterprise views require controlled routing and decomposition.

The SVG should remain editable at the architecture level: text, cards, connectors, groups, and positions. Official icon paths may remain inside embedded SVG images. Do not promise full native editing of icon internals in every editor without an interoperability test.

## 11. Implementation choices and packaging

### 11.1 Build versus adapt

| Choice | Decision | Alternatives and trade-off |
| --- | --- | --- |
| Architecture representation | Define a provider-aware canonical contract first. | Direct prompt-to-SVG is quicker to demonstrate but makes cross-view validation and revision difficult. |
| Shared Atlas code | Prototype GCP locally, then extract only tested provider-neutral contracts and functions. | A large shared engine creates migration and installation risk; long-term duplication creates drift. Keep provider rules outside the common renderer. |
| SVG assembly | Reuse Azure's asset/provenance and annotation concepts after compatibility tests. | Copying its exact schema preserves hardcoded Azure foundation assumptions and current enforcement gaps. |
| Automatic layout | Evaluate an adapter over a maintained layout tool or a constrained layout implementation. | Any candidate must prove boundary semantics, readable routing, and repeatable output. Do not select solely by a simple demo. |
| General diagram libraries | Treat as optional layout/export candidates. | [Diagrams supports SVG output](https://diagrams.mingrammer.com/docs/guides/diagram), but format support alone does not establish current GCP artwork, self-contained vectors, or semantic correctness. |
| Rendering | Prototype a pinned static renderer and browser inspection with fixed fonts. | [resvg](https://github.com/linebender/resvg) targets static SVG. It still needs tests against this asset/profile combination. Browser screenshot baselines depend on environment. [Playwright guidance](https://playwright.dev/docs/test-snapshots) |
| Google design tooling | Assess App Design Center as an optional input/export integration. | [Application Design Center](https://docs.cloud.google.com/application-design-center/docs/overview) supports component/template workflows and Terraform-based components. It is not evidence of a complete local PRD-to-SVG research workflow. |
| Cloud inventory | Keep optional and separately scoped. | Asset Inventory adds observed metadata but brings access, entitlement, consistency, and scope limits. Core repository analysis should not depend on it. |

Do not install or benchmark several diagram libraries before defining the acceptance fixtures. The important prototype questions are current icon compatibility, safe CSS handling, text measurement, compound-boundary layout, semantic identity preservation, and offline export fidelity.

### 11.2 Suggested module boundaries

Use modules named for responsibilities: `evidence`, `requirements`, `architecture`, `gcp-capabilities`, `gcp-placement`, `icon-catalog`, `diagram-layout`, `diagram-rendering`, `verification`, and `review-pack`. Avoid making cloud behavior an implicit prompt-only dependency.

Tools should have typed inputs/outputs and deterministic failure records. Keep policy and source catalogs versioned. Emit structured, content-minimized logs at acquisition, extraction, rendering, and verification boundaries. Each run needs a correlation ID. Network retrieval needs bounded retries and cache behavior; it must not overwrite a successful source record with an empty failed fetch.

New implementation code must follow current repository language rules. For Python, this means Python 3.12+, typed signatures, boundary validation, and appropriate lint/type/test checks. Reusing the older assembler's idea does not require copying its older coding conventions.

### 11.3 Skill packaging

Start implementation in `drafts/atlas-gcp/`. Proposed promoted location: `skills/branding/atlas-gcp/`, consistent with Atlas Azure's artifact role. Keep a single user-invoked entry point, matching directory/frontmatter name, no model IDs, and a `SKILL.md` of at most 120 lines.

Suggested sibling documents: `METHOD.md`, `GCP-FOUNDATIONS.md`, `GCP-SEMANTICS.md`, `AGENTS-AND-SAAS.md`, `OUTPUT.md`, `DIAGRAMS.md`, `SOURCES.md`, `REVIEW.md`, and `EVALUATION.md`. Load each on a named signal. Large capability/pattern catalogs may use the repository's optional reference subtree.

Branding must remain independently installable with core. Do not require developer or PM group files through hidden relative paths. A shared engine needs a packaging contract that works after installation, not only inside the monorepo. [Repository invariants](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/CLAUDE.md)

Promotion requires README and plugin-manifest entries, generated sidecars, the required site/wiki documentation, validated links, and installation tests. Generate `agents/openai.yaml` with the repository script. Significant implementation choices should become architecture decision records in the repository's established ADR location when implementation is authorized.

## 12. Validation journey and test specification

### 12.1 Four different kinds of evidence

Keep deterministic skill tests, checks on one generated pack, independent design/visual review, and authorized workload runtime tests separate. A green parser is not a design review. A design review is not a load test. An agent behavior evaluation is not an SVG geometry check.

The following gates form the proposed journey:

| Gate | Trigger and checks | Required evidence | Failure behavior |
| --- | --- | --- | --- |
| G0: Scope | Before discovery: inputs, target, mode, exclusions, output profile | Intake record and input hashes | Ask for a blocking constraint or proceed with visible assumptions. |
| G1: Evidence | After extraction: source resolution, revision, conflicts, excluded files | Evidence inventory and requirement map | Keep unsupported claims unknown; reject secret access. |
| G2: Feasibility | Before layout: service variants, location, topology, identity, data, failure paths | Decision ledger and semantic findings | Do not turn contradicted designs into review-ready output. |
| G3: Graph | Before rendering: schema, references, projections, stable IDs | Deterministic validation report | Fail invalid model/view generation. |
| G4: Assets | Before embedding: official mapping, archive safety, XML/CSS, hashes | Asset receipt and per-file results | Quarantine unsupported assets; show an explicit draft gap. |
| G5: Geometry | After layout: containment, transformed size, endpoints, collisions, bounds | Machine geometry results and rendered views | Repair affected geometry and rerun checks. |
| G6: Pack | After export: completeness, consistency, offline loading, PDF/profile integrity | Actual artifact inspection and hashes | Mark missing or broken required exports incomplete. |
| G7: Independent review | After author inspection: requirements, four audiences, journeys, regressions | Hash-bound judgment with concrete evidence | Revise, needs-decision, or incomplete according to finding and capability. |
| G8: Runtime evidence | Only when execution is in scope | Contract, access, load, failure, restore, and agent-behavior results | Keep unexecuted tests visible; never manufacture deployment readiness. |
| G9: Release | Before skill promotion | Applicable harness, coverage, installation, live-evaluation evidence | Withhold unsupported release claims. |

### 12.2 Deterministic and adversarial test catalog

Each row should become one or more fixtures with positive, negative, and boundary cases. Expected findings need stable IDs and affected artifact locations.

| Test ID | Capability coverage | Fixture and expected result |
| --- | --- | --- |
| T-01 | CAP-01, CAP-24 | PRD, repository, and mixed inputs record correct mode and scope; an ambiguous cloud target remains explicit. |
| T-02 | CAP-02 | Remove a material acceptance criterion from the output; coverage validation reports the omission. |
| T-03 | CAP-03 | A repository with SDK imports but no deployment evidence produces candidates, not invented resources. |
| T-04 | CAP-03, CAP-04 | A stale README contradicts Terraform and code; the conflict survives extraction and appears in the pack. |
| T-05 | CAP-03 | Multiple environment overlays remain separate; dev configuration is not labeled production. |
| T-06 | CAP-03, CAP-15 | Secret files, symlink escapes, oversized inputs, and injected repository instructions do not expand read scope or execute code. |
| T-07 | CAP-03, CAP-07 | Broken evidence paths, stale revisions, and unsupported source claims fail grounding checks. |
| T-08 | CAP-03 | An optional inventory export with missing types/relationships records coverage limits; missing data is not fabricated. |
| T-09 | CAP-05, CAP-12 | Several local subagents in one process remain logical components within one deployment. |
| T-10 | CAP-06 | A deterministic workflow fixture includes a reasonable non-agent alternative and an explicit selection reason. |
| T-11 | CAP-07, CAP-27 | Old product/API/asset aliases map separately; valid `ReasoningEngine` code is not renamed incorrectly. |
| T-12 | CAP-07 | Stale or conflicting lifecycle evidence cannot silently refresh a capability or inherit GA from its parent service. |
| T-13 | CAP-08 | Missing foundation owner, inherited-control scope, or not-applicable reason produces a finding. |
| T-14 | CAP-09 | A regional VPC or zonal subnet model fails GCP scope rules; a global VPC with regional subnets passes. |
| T-15 | CAP-09 | A Shared VPC service-project resource retains ownership while referencing host-project networking. |
| T-16 | CAP-09, CAP-10 | Two peerings cannot imply transit; DNS and firewall omissions receive separate findings. |
| T-17 | CAP-09, CAP-15 | PSC, private services access, Private Google Access, and service perimeter edges cannot be substituted by label alone. |
| T-18 | CAP-09 | Cloud Run services/jobs do not gain direct ingress from egress configuration; worker-pool rules are versioned separately. |
| T-19 | CAP-07, CAP-10 | Exactly-once Pub/Sub push delivery is rejected; a valid scoped pull configuration does not claim business-action uniqueness. |
| T-20 | CAP-07, CAP-12 | Unsupported agent location/endpoint/CMEK combinations produce the specific compatibility finding. |
| T-21 | CAP-11, CAP-15 | Regional memory storage with possible global processing cannot pass an all-regional processing requirement. |
| T-22 | CAP-12, CAP-15 | Agent Gateway plus an unsupported VPC-SC claim, or RAG Engine with unqualified residency claims, fails source-backed review. |
| T-23 | CAP-12, CAP-14 | Unsupported ADK confirmation/session combinations cannot claim durable approval support. |
| T-24 | CAP-12, CAP-16 | Selected Agent Runtime container contract checks identify incompatible bind address, port, or required endpoints. |
| T-25 | CAP-13 | Internal business-unit tenants and commercial customers produce different lifecycle/control-plane requirements. |
| T-26 | CAP-13, CAP-15 | Missing tenant context on a tool, retrieval, cache, log, memory, or background-job boundary produces an isolation gap. |
| T-27 | CAP-14 | Recovery that depends on unavailable control-plane operations or fails to restore access policy receives a concrete finding. |
| T-28 | CAP-16, CAP-17 | Missing quotas, load distribution, evaluation volume, or price date remains an estimate gap; no fabricated cost total. |
| T-29 | CAP-18 | Unknown schema version, duplicate IDs, dangling references, and illegal ownership types fail validation. |
| T-30 | CAP-18, CAP-21 | A visible flow without both endpoints, duplicate flow label, or inconsistent view projection fails. |
| T-31 | CAP-19 | All 45 inspected official SVGs are classified; the 16 style-bearing files exercise the proposed CSS path. |
| T-32 | CAP-19 | A wrong icon/category mapping or unverified asset origin fails despite a well-formed digest. |
| T-33 | CAP-19 | ZIP traversal, symlinks, duplicate members, decompression bombs, and disallowed file types are rejected before extraction. |
| T-34 | CAP-19, CAP-20 | Scripts, event handlers, external references, imports, fonts, malformed XML, and recursive payloads are rejected. |
| T-35 | CAP-19, CAP-20 | Inert class/fill CSS is supported only within the approved grammar; escaped URLs and unknown syntax fail closed. |
| T-36 | CAP-20 | Changed bytes, aspect distortion, reflection, rotation, clipping, or hidden artwork is detected or explicitly reviewed. |
| T-37 | CAP-20, CAP-22 | A 96-unit icon scaled below 64 effective units fails; one scaled to 86.4 units passes the minimum-size check. Transparent-padding cases receive visual inspection. |
| T-38 | CAP-22 | Long names, multilingual labels, multi-digit badges, and dense groups do not clip or collide at the intended size. |
| T-39 | CAP-22 | Correct endpoint annotations with visibly wrong arrow geometry fail the geometry/review gate. |
| T-40 | CAP-22 | Invisible arrowheads, lines crossing unrelated nodes, ambiguous intersections, and unlabeled boundaries produce findings. |
| T-41 | CAP-21 | An overview that omits a direct authoritative-state path records truthful aggregation or fails the review. |
| T-42 | CAP-22, CAP-26 | SVG title/description, long text equivalents, line-pattern legend, and essential contrast meet the declared profile. |
| T-43 | CAP-23 | Reordering model input preserves semantic output; removing a node retires its ID and invalidates affected flows. |
| T-44 | CAP-23 | A new region or tenant model cannot silently lose earlier requirements, tiers, controls, or unresolved findings. |
| T-45 | CAP-24, CAP-26 | Core output works without cloud credentials or PDF tools; full-profile failure is reported when required tooling is absent. |
| T-46 | CAP-26 | Offline load of all selected outputs makes no unexpected network requests, including narrative fonts/styles. |
| T-47 | CAP-26 | PDF parsing, page dimensions, fonts, text search, links, table continuations, and vector treatment match the selected profile. |
| T-48 | CAP-25 | A claimed pass with missing inspection, unmet requirements, low scores, or major findings is rejected. |
| T-49 | CAP-25 | Mutating a frozen artifact invalidates review; detached manifests avoid circular hashes and preserve earlier evidence. |
| T-50 | CAP-28 | Future benchmark stages stay outside the author's workspace; negative judgments remain frozen and do not become passes. |
| T-51 | CAP-25, CAP-28 | Ordinary and benchmark receipt schemas have a tested adapter; a skill-patch pass cannot approve an architecture pack. |
| T-52 | CAP-24, CAP-27 | Draft/promoted packaging, generated files, group independence, and installed paths pass repository contracts. |

### 12.3 Runtime tests the future architecture should specify

The following tests belong to an authorized workload test environment. The diagram skill can generate their plans and check supplied results. Static analysis alone cannot execute or pass them.

| Runtime test | Expected evidence |
| --- | --- |
| Forged tenant or resource ID | Trusted context rejects cross-tenant tool, retrieval, memory, export, and background-job access. |
| Duplicate or uncertain action | Duplicate commands and timeout-after-commit produce one business effect or explicit reconciliation. |
| Approval restart and replay | Approval survives restart, expires correctly, rejects stale parameters, and cannot be replayed. |
| Retrieval revocation | Deleted, unauthorized, stale, or adversarial sources are excluded or visibly handled within defined freshness bounds. |
| Memory poisoning and deletion | Malicious memory content cannot grant authority; expired/deleted content is not reused. |
| Offline field synchronization | Concurrent edits, delayed evidence, duplicate completion, and missing inventory resolve according to explicit policy. |
| Integration failure | Throttling, schema drift, backend unavailability, and duplicate callbacks preserve business invariants. |
| Model/tool behavior | Repeated-run evaluation measures task success, tool selection, denied actions, grounding, budgets, and escalation. |
| Capacity and noisy neighbors | Peak distributions, queue growth, tenant contention, connection pools, and model quotas meet stated targets. |
| Restore and failover | Business state, access controls, tenant policy, pending commands, and keys recover together; RTO/RPO are measured. |
| Telemetry handling | Redaction, access, retention, tenant attribution, and correlation work without exposing sensitive content. |

### 12.4 Independent review rules

Retain Azure's four audience perspectives: junior developer, CTO, enterprise architect, and security architect. Each assesses clarity, management of necessary complexity, and understandability on an anchored 1–5 scale. One context applying four perspectives is one independent review, not four experts.

Proposed pass rule: every score is at least 3, every applicable required check is met, no critical/major finding remains, and required artifacts were actually inspected. Use `revise` when evidence is sufficient to identify defects; use `blocked` when required review capability/evidence is unavailable. A separate final-status validator must enforce the rule.

Review actual artifacts and relevant requirements, not the author's claims of success. For a full pack, inspect every PDF page and SVG, with dense regions at readable scale. Trace normal, denied/degraded, and recovery journeys. Compare revisions for lost requirements. Findings require source/artifact locations, consequences, and an evidence-backed closure record.

## 13. Evaluation corpus and release gates

### 13.1 Representative corpus

The cumulative SaaS scenario should complement a broader corpus. A single successful large diagram cannot establish repository extraction or broad GCP support.

| Fixture | Scenario | Main acceptance focus |
| --- | --- | --- |
| F-01 | Small stateless API | Proportional architecture and clear inherited platform. |
| F-02 | Single tool-using agent | Runtime/model/tool/session separation and denied path. |
| F-03 | Private knowledge assistant | RAG authorization, freshness, residency, and evidence. |
| F-04 | Local and remote multi-agent repository | Process boundaries, deployment units, A2A/MCP contracts. |
| F-05 | Customer-service SaaS | Case authority, tenant lifecycle, approvals, and business effects. |
| F-06 | Field-service SaaS | Scheduling constraints, Maps boundary, inventory, offline synchronization. |
| F-07 | Existing Shared VPC platform | Project ownership, network attachment, inherited controls. |
| F-08 | Hybrid business-system integration | External authority, schema/throughput limits, failure reconciliation. |
| F-09 | Multi-region transactional service | Replication variants, failure dependencies, RTO/RPO, and admission gates. |
| F-10 | Code-only monorepo with weak deployment evidence | Honest uncertainty and bounded inference. |
| F-11 | Conflicting PRD/IaC/README inputs | Evidence reconciliation and current-to-target separation. |
| F-12 | Stale services, unsupported features, unavailable sources | Lifecycle/source handling and refusal to invent support. |
| F-13 | Dense and multilingual diagram | Large icons, labels, geometric routing, accessibility, export. |
| F-14 | Revision with removed/renamed services | Stable IDs, semantic deltas, cumulative findings, invalidated receipts. |

### 13.2 Five-stage cumulative enterprise benchmark

Adapt the new Azure harness's evaluation method, while replacing its Azure-specific assumptions with explicit synthetic GCP constraints.

1. **Assisted customer service:** Establish cases, knowledge, trusted tenant context, human decisions, and named service objectives.
2. **Durable agent actions:** Add authorized writes across business systems, timeout-after-commit, deduplication, and reconciliation.
3. **Offline field service:** Add technician work, constrained scheduling, intermittent connectivity, and hybrid integration.
4. **Equipment events:** Add bursts, late events, replay, asset correlation, and automation limits.
5. **Regional fleet operations:** Add a defined customer fleet, region-specific commitments, restoration, deployment ordering, and control-plane dependencies.

Each stage reveals cumulative requirements and prior frozen outputs. Freeze artifacts before judgment. Keep future stages physically unavailable to the author. Use independent contexts for review and preserve negative judgments. A repair run is a separately versioned experiment. Never overwrite the baseline; preserve repaired artifacts and new judgments separately.

The Azure controller can inform pinning, freeze, mutation detection, and receipt validation. Its fixtures, artifact list, provider constants, and review schemas need adaptation. If PDF is selected, require a real page count for full-page coverage rather than silently weakening that check when a parser is missing.

### 13.3 Quality measures

Report numerators, denominators, and exclusions for each measure:

- Requirement coverage: material requirements met, partial, unmet, and unresolved.
- Grounding: supported architecture claims divided by reviewed claims, with sampled versus complete review disclosed.
- Extraction quality: precision and recall against human-reviewed repository fixtures, including uncertainty calibration.
- Semantic mutation detection: seeded invalid relationships caught and valid cases incorrectly rejected.
- Artifact integrity: required outputs and view projections that match the model and exact reviewed hashes.
- Visual defects: critical/major defects per view at intended scale, plus unresolved minor findings.
- Reviewer quality: persona score distributions, disagreements, concrete findings, and closure evidence.
- Revision stability: unchanged IDs retained and earlier requirements preserved.
- Operational efficiency: latency, tokens, source calls, rendering time, and cost where exposed.

Require complete applicable artifact/requirement coverage and zero unresolved critical/major defects for accepted release examples. Calibrate less absolute measures against an initial reviewed corpus. Do not invent a reliability percentage from one demonstration.

For a stronger evaluation, predeclare repeated runs and a no-skill or prior-version baseline. Use equivalent inputs and compare results before exposing judge feedback to the author. Keep exploratory results separate from evidence of improvement. Synthetic harness tests prove controller behavior, not live model quality.

## 14. Development sequence and open decisions

| Phase | Work | Exit evidence |
| --- | --- | --- |
| 0: Contracts and evidence | Define scope, provider profile, schema, source records, readiness rules, and initial corpus. | Reviewable contracts and positive/negative fixtures. |
| 1: GCP asset prototype | Ingest current packages, validate inert CSS, embed vectors, measure fonts/icons, and render dense samples. | All 45 surveyed assets classified; supported assets inspected in chosen viewers; adversarial tests pass. |
| 2: Grounded extraction | Add PRD, plan, repository, and mixed modes with current/target separation. | F-01, F-04, F-10, and F-11 demonstrate evidence accuracy and bounded uncertainty. |
| 3: GCP reasoning | Implement foundation coverage, topology, feature compatibility, service decisions, and failure contracts. | GCP semantic rules and contradiction fixtures produce expected findings. |
| 4: Agent and SaaS depth | Add durable actions, tenant lifecycle, RAG/memory governance, customer and field service. | F-02 through F-06 and F-08 have complete architecture and runtime-test plans. |
| 5: Review and revision | Add full-pack export, independent review, final-status enforcement, and cumulative changes. | Actual artifacts inspected; frozen receipts and revised dependencies behave correctly. |
| 6: Promotion and maintenance | Finish installation, public documentation, coverage reporting, catalog update process, and evaluation. | Applicable repository gates pass; release claims match demonstrated scope. |

A minimum credible SVG/Markdown release needs phases 0–4 and the core independent review/status checks from phase 5. An enterprise-capable claim requires the enterprise scenarios; it cannot be justified by a simple agent diagram alone. Full HTML/PDF parity can be an explicit later profile.

| Open decision | Recommended starting position | Evidence needed before commitment |
| --- | --- | --- |
| Shared engine or provider-local implementation | Prototype the GCP contract first, then extract a narrow shared core. | Coupling analysis, installed-path tests, and Azure regressions. |
| Embedded CSS or derived attributes | Preserve original bytes through a strictly validated inert CSS path. | Full asset fixture results, adversarial cases, renderer compatibility, and rights assessment. |
| Initial pattern depth | Broad index; deeply tested application, agent, SaaS, and repository patterns. | Published coverage matrix and benchmark evidence. |
| Exact layout engine | Select after compound-boundary and dense-label prototypes. | Repeatable geometry, readability, performance, and dependency cost. |
| Full output parity | Core SVG/Markdown first; explicit HTML/PDF profile. | User workflow needs and actual export QA. |
| Asset distribution | Fetch/cache or accept user-supplied official packages. | Applicable distribution terms; avoid bundling unreviewed third-party rights. |
| Optional inventory | Separate read-only adapter or sanitized export input. | Scope contract, entitlement handling, minimization, and evidence semantics. |
| Business application replacement | Maintain a capability gap register with system-of-record decisions. | Actual PRD, domain review, integration evidence, and migration acceptance. |
| Industry/regulatory depth | Load specialist evidence only when required. | Applicable jurisdiction and accountable domain review. |
| Maintenance ownership | Assign ownership of capabilities, assets, rules, and benchmark fixtures. | Refresh policy, stale-source tests, and release responsibility. |

Do not estimate a delivery date before measuring the asset, layout, and extraction prototypes. These contain the largest unresolved implementation risks.

## 15. Consolidated references for the implementation agent

All external references below were consulted on **September 8, 2026**. “Living documentation” means a publication/update date was not captured; it does not mean the page was published on the access date. Dates are documentary metadata, not guarantees that every example remains current. Recheck selected features during implementation. Pin moving code repositories before adopting code.

### 15.1 Existing Atlas implementation and research

Use the pinned baseline links in section 2 first. Also consult these supporting files:

| Reference | Publisher/version | Implementation use |
| --- | --- | --- |
| [Atlas Azure sources](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/SOURCES.md) | Skills repository; `113fce0` | Provenance discipline; replace Microsoft-specific sources and permissions. |
| [Atlas Azure landing zones](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/skills/branding/atlas-azure/LANDING-ZONES.md) | Skills repository; `113fce0` | Coverage structure; replace the Azure taxonomy. |
| [Assembler tests](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/test/scripts/atlas-azure.test.mjs) | Skills repository; `113fce0` | Existing 29-case structural baseline and its limits. |
| [Evaluation controller tests](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/test/scripts/atlas-azure-eval.test.mjs) | Skills repository; `113fce0` | Existing 16-case controller baseline, receipt mutations, and frozen-state behavior. |
| [Evaluation scenarios](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/test/eval/atlas-azure/cases.json) | Skills repository; `113fce0` | Five-stage enterprise progression; replace provider assumptions. |
| [Repository invariants](https://github.com/rahulnakmol/skills/blob/113fce0e5ee1814259dd2a50c77d793db2d9a87e/CLAUDE.md) | Skills repository; `113fce0` | Draft/promotion, group independence, invocation, generated files, and testing. |
| [Atlas AWS research](/Users/rahulnakmol/Developer/GitHub/skills/docs/research/atlas-aws-research.md) | Local research; September 7, 2026 | Earlier capability/test blueprint and access-note format. This linked file existed in the primary checkout but was untracked; supply it separately when handing off outside this machine. |

### 15.2 Architecture discovery and foundations

| Reference | Publisher/date | Use |
| --- | --- | --- |
| [Cloud Architecture Center](https://docs.cloud.google.com/architecture/) | Google Cloud; living documentation | Primary architecture discovery and workload navigation. |
| [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework) | Google Cloud; January 28, 2026 | Six-pillar assessment and domain perspectives. |
| [Deployment archetypes](https://docs.cloud.google.com/architecture/deployment-archetypes) | Google Cloud; November 20, 2024 | Geographic and hybrid topology choices. |
| [Landing-zone design](https://docs.cloud.google.com/architecture/landing-zones) | Google Cloud; January 2, 2026 | Core foundations and modular growth. |
| [Enterprise foundations blueprint](https://docs.cloud.google.com/architecture/blueprints/security-foundations) | Google Cloud; May 15, 2025 | Opinionated foundation controls and Terraform implementation references. |
| [Terraform blueprints and modules](https://docs.cloud.google.com/docs/terraform/blueprints/terraform-blueprints) | Google Cloud; September 3, 2026 | Reusable deployment patterns and policy context. |
| [Infrastructure reliability guide](https://docs.cloud.google.com/architecture/infra-reliability-guide) | Google Cloud; November 20, 2024 | Infrastructure scope, capacity, operations, and reliability. |
| [Reliability requirements](https://docs.cloud.google.com/architecture/infra-reliability-guide/requirements) | Google Cloud; November 20, 2024 | Workload-specific objectives and trade-offs. |
| [Disaster recovery for infrastructure outages](https://docs.cloud.google.com/architecture/disaster-recovery) | Google Cloud; living documentation | Recovery strategies and control-plane dependencies. |
| [Manage and monitor infrastructure](https://docs.cloud.google.com/architecture/infra-reliability-guide/manage-and-monitor) | Google Cloud; November 20, 2024 | Global configuration risk, monitoring, and progressive change. |
| [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/) | Microsoft; living documentation | Comparison for the complete architecture-authoring journey. |

### 15.3 GCP semantics, lifecycle, and repository evidence

| Reference | Publisher/date | Use |
| --- | --- | --- |
| [Resource hierarchy](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy) | Google Cloud; August 26, 2026 | Parentage, project ownership, and policy inheritance. |
| [VPC networks](https://docs.cloud.google.com/vpc/docs/vpc) | Google Cloud; living documentation | Global VPC, regional subnet, and example topology. |
| [Shared VPC](https://docs.cloud.google.com/vpc/docs/shared-vpc) | Google Cloud; September 3, 2026 | Host/service-project relationships. |
| [Private access options](https://docs.cloud.google.com/vpc/docs/private-access-options) | Google Cloud; August 26, 2026 | PSC, private services access, Private Google Access, and peering distinctions. |
| [VPC Network Peering](https://docs.cloud.google.com/vpc/docs/vpc-peering) | Google Cloud; August 26, 2026 | Non-transitivity, firewall, and DNS constraints. |
| [VPC Service Controls](https://docs.cloud.google.com/vpc-service-controls/docs/overview) | Google Cloud; living documentation | Perimeter meaning and applicability limits. |
| [Direct VPC with Cloud Run](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc) | Google Cloud; living documentation | Egress, service/job/worker-pool differences, capacity and ingress caveats. |
| [Pub/Sub exactly-once delivery](https://docs.cloud.google.com/pubsub/docs/exactly-once-delivery) | Google Cloud; living documentation | Subscription type, regional scope, acknowledgment, and duplicate limits. |
| [Pub/Sub subscriptions](https://docs.cloud.google.com/pubsub/docs/subscription-overview) | Google Cloud; August 26, 2026 | Default delivery behavior and idempotent consumption. |
| [Cloud locations](https://cloud.google.com/about/locations) | Google Cloud; availability table July 9, 2026 | Product-level regional discovery; follow through to feature guides. |
| [Cloud Quotas](https://docs.cloud.google.com/docs/quotas/overview) | Google Cloud; living documentation | Allocation, rate, concurrency, and fixed-limit distinctions. |
| [Product catalog and launch stages](https://cloud.google.com/products) | Google Cloud; living documentation | Broad discovery and lifecycle definitions. |
| [Release notes](https://docs.cloud.google.com/release-notes) | Google Cloud; entries through September 7, 2026 inspected | Change discovery; use product history for older entries. |
| [Deployment Manager deprecation](https://docs.cloud.google.com/deployment-manager/docs/deprecations) | Google Cloud; living documentation | Support, existing/new customer eligibility, and shutdown milestones. |
| [Cloud Asset Inventory overview](https://docs.cloud.google.com/asset-inventory/docs/asset-inventory-overview) | Google Cloud; living documentation | Optional observed metadata, entitlement, and scope. |
| [Supported asset types](https://docs.cloud.google.com/asset-inventory/docs/asset-types) | Google Cloud; living documentation | Inventory method coverage and consistency limits. |

### 15.4 Agents, retrieval, and compatibility

| Reference | Publisher/date | Use |
| --- | --- | --- |
| [Agent Platform overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview) | Google Cloud; September 3, 2026 | Current platform structure and discovery. |
| [Agent Platform release notes](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) | Google Cloud; September 4, 2026 | Renames and feature-specific launch stages. |
| [Choose agent architecture components](https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components) | Google Cloud; reviewed April 21, 2026 | Component selection and boundaries; security needs additional sources. |
| [Single-agent ADK/Cloud Run system](https://docs.cloud.google.com/architecture/single-agent-ai-system-adk-cloud-run) | Google Cloud; reviewed December 9, 2025 | Small-agent reference pattern and adaptation. |
| [Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime) | Google Cloud; September 3, 2026 | Runtime variants and retained `ReasoningEngine` API identity. |
| [Runtime contract](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/runtime-contract) | Google Cloud; living documentation | Container bind/port and integration contracts. |
| [Agent locations](https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/agent-locations) | Google Cloud; September 3, 2026 | Feature/location/endpoint/CMEK matrix. |
| [Runtime access constraints](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/manage-agent-access) | Google Cloud; September 3, 2026 | Key-location, metadata, and Agent Gateway/VPC-SC limitations. |
| [Memory Bank](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank) | Google Cloud; September 3, 2026 | Memory governance, identity scope, storage and processing geography. |
| [RAG Engine overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-overview) | Google Cloud; living documentation | Retrieval stages, region eligibility, and unsupported residency controls. |
| [RAG Engine quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-quickstart) | Google Cloud; September 3, 2026 | Additional implementation and control limitations. |
| [ADK A2A introduction](https://adk.dev/a2a/intro/) | Google ADK maintainers; living documentation | Local versus independently deployed agents. |
| [ADK action confirmations](https://adk.dev/tools-custom/confirmation/) | Google ADK maintainers; living documentation | Experimental confirmation and session-backend limitations. |
| [ADK safety guidance](https://adk.dev/safety/) | Google ADK maintainers; living documentation | Deterministic tool controls and trusted execution context. |
| [ADK evaluation](https://adk.dev/evaluate/) | Google ADK maintainers; living documentation | Test sessions, evaluation sets, trajectories, and response evaluation. |
| [Evaluation metrics](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/manage-metrics) | Google Cloud; September 3, 2026 | Predefined, model-judged, and code-based behavior metrics. |
| [Online evaluation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/evaluate-online) | Google Cloud; September 3, 2026 | Required telemetry, evaluation flows, permissions, and costs. |

### 15.5 Enterprise SaaS and business integration

| Reference | Publisher/date | Use |
| --- | --- | --- |
| [Multi-tenant agentic AI system](https://docs.cloud.google.com/architecture/multi-tenant-agentic-ai-system) | Google Cloud; reviewed June 18, 2026 | Internal business-unit isolation, shared routing, and tools. |
| [Spanner multi-tenancy](https://docs.cloud.google.com/spanner/docs/implement-multi-tenancy) | Google Cloud; August 26, 2026 | Data-isolation choices and lifecycle trade-offs; not a default service recommendation. |
| [Gemini Enterprise for CX](https://docs.cloud.google.com/gemini-enterprise-cx) | Google Cloud; September 3, 2026 | Current customer experience capabilities and product boundaries. |
| [Application Integration and ADK](https://docs.cloud.google.com/application-integration/docs/application-integration-adk) | Google Cloud; September 3, 2026 | Integration workflows and agent tools. |
| [Dynamics 365 connector](https://docs.cloud.google.com/integration-connectors/docs/connectors/dynamics365/configure) | Google Cloud; September 3, 2026 | Supported operations, schema refresh, and throughput research. |
| [Route Optimization overview](https://developers.google.com/maps/documentation/route-optimization/overview) | Google Maps Platform; September 1, 2026 | Route/task optimization; separate Maps and business-system responsibilities. |

### 15.6 Assets, rendering, accessibility, and adjacent tools

| Reference | Publisher/date | Use |
| --- | --- | --- |
| [Official Google Cloud icons](https://cloud.google.com/icons) | Google Cloud; living page | Current acquisition entry point. |
| [Product icon guide](https://services.google.com/fh/files/misc/google-cloud-product-icons.pdf) | Google Cloud; May 2026 | Current core/category mapping and legacy guidance; see terms uncertainty. |
| [Core product ZIP](https://services.google.com/fh/files/misc/core-products-icons.zip) | Google Cloud; no package date supplied | Reproduce the 19-SVG survey using the recorded digest. |
| [Category ZIP](https://services.google.com/fh/files/misc/category-icons.zip) | Google Cloud; no package date supplied | Reproduce the 26-SVG survey using the recorded digest. |
| [Legacy icon ZIP](https://services.google.com/fh/files/misc/google-cloud-legacy-icons.zip) | Google Cloud; legacy | Historical input only; archive not downloaded or inspected in this research. |
| [Google site policies](https://developers.google.com/terms/site-policies) | Google; August 6, 2025 | Documentation-license exclusions for brand features. |
| [SVG processing modes](https://www.w3.org/TR/SVG2/conform.html) | W3C; living specification endpoint | Static/image/standalone processing distinctions and inert-profile design. |
| [Complex-image accessibility](https://www.w3.org/WAI/tutorials/images/complex/) | W3C WAI; April 8, 2026 | Short identification and full textual equivalent. |
| [Diagrams output guide](https://diagrams.mingrammer.com/docs/guides/diagram) | Diagrams maintainers; August 16, 2026 | Candidate SVG/Graphviz adapter; inspect actual assets before adoption. |
| [resvg](https://github.com/linebender/resvg) | Linebender; moving repository | Static renderer candidate; pin a release and test fonts/assets. |
| [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots) | Playwright maintainers; living documentation | Controlled screenshot baselines and environment limits. |
| [Application Design Center](https://docs.cloud.google.com/application-design-center/docs/overview) | Google Cloud; living documentation | Optional component/template/Terraform interoperability. |

## 16. Research limits, access notes, and verification

### 16.1 Method and stopping point

Research combined the named AWS task, its local Markdown report, the current Atlas Azure implementation/tests, official Google documentation, official icon archives, and W3C/tool-maintainer documentation. Independent lanes examined platform semantics, agent/SaaS capabilities, and the Azure baseline. The coordinating review investigated SVG compatibility and rechecked high-impact networking, naming, memory, retrieval, and access constraints.

Discovery established the source families. Follow-up focused on changing product names, feature-specific compatibility, icon policy versus package contents, actual validator behavior, and unsupported claims. The resulting gap assessment was:

| Claim family | Resolution | Remaining limit |
| --- | --- | --- |
| Architecture journey and foundation coverage | Primary support found. | Individual workload decisions still require specific service evidence. |
| GCP topology | Primary support found and core rules cross-checked. | Not an exhaustive formal model of every resource variant. |
| Current agents and SaaS | Primary support found; important incompatibilities retained. | No deployment, commercial SaaS certification, or Dynamics feature-parity study. |
| Official icons | Guide and current archives inspected; original files tested against Azure validation. | Asset mappings and guide/package names do not fully align; redistribution rights remain bounded. |
| SVG implementation | A reproducible current-asset compatibility gap was measured. | No CSS-support change, renderer benchmark, or all-icon visual certification was performed. |
| Atlas reuse and tests | Current code and doctrine inspected; focused and full baseline tests executed. | Human review requirements exceed deterministic enforcement. |

Research stopped when each material capability family had primary support or an explicit limitation and further broad discovery was unlikely to change the design. The report specifies the next targeted evidence needed for unresolved implementation choices.

### 16.2 Conflicting or misleading evidence to preserve

- Current product labels, icon-guide labels, API names, and ZIP member names can differ. Preserve aliases and explicit mapping decisions.
- The public icon guide's footer and lack of archive terms do not establish broad redistribution rights.
- Deployment Manager's deprecation page contains overlapping old/new wording. Avoid compressing several support/eligibility/shutdown milestones into a single unsupported “removed” date.
- Product-specific feature pages govern selected combinations. An architecture example or general platform page cannot establish every regional or security capability.
- A reference for internal business-unit agents does not define the whole commercial SaaS lifecycle.
- The Azure assembler and evaluation controller enforce narrower contracts than the full prose workflow. Preserve the distinction in implementation and release claims.

### 16.3 Web access results

The web reader could read the icon landing page and PDF. Its attempts to open ZIP links returned **400 Unsupported content-type: application/zip**. This is a reader format limitation, not evidence of a Google login requirement or server access denial.

| Attempted source | Observed result | Resolution |
| --- | --- | --- |
| [Core product ZIP](https://services.google.com/fh/files/misc/core-products-icons.zip) | Web reader rejected ZIP content type. | Downloaded from the same public official URL with the local runtime; contents and digest inspected. |
| [Category ZIP](https://services.google.com/fh/files/misc/category-icons.zip) | Web reader rejected ZIP content type. | Downloaded from the same public official URL with the local runtime; contents and digest inspected. |
| [Legacy ZIP](https://services.google.com/fh/files/misc/google-cloud-legacy-icons.zip) | Web reader rejected ZIP content type. | Not downloaded because current-asset research did not require it. Legacy contents remain unverified. |
| [Older Vertex RAG overview URL](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/rag-engine/rag-overview) | Redirected to current Agent Platform documentation. | Read the current destination and retain the old URL as an alias, not a failure. |

Some discovery guesses in the research lanes did not resolve. They were replaced by official links and do not support report claims. No material conclusion depends on an unreadable page. This does not imply that every linked product, account, region, or future page will be accessible to every implementation environment.

For future failures, record exact URL, time, response, affected claim, alternative, and remaining gap. Discover the correct route through official navigation. Retry a plausible transient error once. Do not turn a snippet into silent evidence for an inaccessible consequential claim.

### 16.4 Checks actually performed

| Check | Observed result | Limit |
| --- | --- | --- |
| Repository update | Primary `dev` fast-forwarded to `113fce0e5ee1814259dd2a50c77d793db2d9a87e`; research worktree created from it. | This is the remote state fetched at research start. |
| Named AWS task and report | Both consulted, including the request for reference/access notes. | AWS report predates the latest Azure quality changes. |
| Atlas focused tests | 45 passed, 0 failed across assembler and evaluation-controller tests. | Structural and controller fixtures; no live model or cloud evaluation. |
| Repository validator | `node scripts/validate.mjs` passed. | Repository structural policy checks. |
| Full repository baseline harness | 1,162 tests: 1,160 passed, 2 failed. | Both failures are in existing exhibit browser/PDF tests; no tracked source was changed before this run. |
| GCP archive compatibility | 45 original SVGs tested; 29 accepted, 16 rejected for `style`. | Existing checker compatibility only. |
| Markdown artifact verification | 65 headings, 31 tables, one JSON fragment, all 28 capability IDs, 52 test IDs, and 14 fixture IDs checked; no broken local links or contents anchors. Six rendered samples inspected without observed layout defects. | Visual review sampled opening, capability, asset, test, reference, and closing sections; it was not an every-line visual inspection. |
| Reference link verification | 77 unique HTTPS links: 60 web responses succeeded, 14 pinned repository files verified locally, and 3 official archive links classified. | Two current archives were downloaded and inspected; the legacy archive was not. HTTP success does not establish semantic correctness. |

The first exhibit failure expected an unavailable browser but discovered the installed Chrome runtime. The second expected a PDF with zero raster images; the produced five-page PDF contained two. These baseline failures were recorded without changing unrelated code. They must not be reported as Atlas GCP test failures or as a fully green repository harness.

No GCP account was inspected, no cloud resource was created, no secret file was read, and no workload recovery or tenant-isolation test was executed. The requested deliverable is this research specification. The implementation agent should begin with phase 0 and the current-asset prototype, using the consolidated references and measured baseline limits above.
