# Landing zones and platform completeness

A landing zone is the governed Azure environment in which a workload runs. The platform landing zone provides shared identity, connectivity, management, and governance. The application landing zone contains the workload's environments and resources. An application diagram is not a description of that foundation.

Load this document for every run. Assess all eight areas below, even when the input repository contains only application code. Absence from the repository means the platform state is unverified, not that the organization lacks a platform. Do not copy Microsoft's entire enterprise topology into a small workload or imply that every optional shared service is mandatory.

## Required investigation

| Coverage area | Inspect and explain | Evidence and validation to seek |
|---|---|---|
| `billing-tenant` | Billing relationship, Microsoft Entra tenant boundary, subscription request process, account ownership, budgets, and cost allocation. Distinguish billing scopes from management groups. | Subscription metadata or approved platform contract; budget notification recipient and allocation rules. Redact identifiers when necessary. |
| `identity-access` | Human versus workload identities, role-based access control (RBAC), least-privilege scopes, privileged activation, emergency access, external identities, workload federation, and secret/key ownership. | Role definitions and assignments, identity configuration, access reviews, denied-access tests, and break-glass procedure. A service principal is not proof of a correct role assignment. |
| `resource-organization` | Tenant → management group → subscription → resource group → resource placement. Separate platform and application ownership and production/nonproduction isolation. Explain region placement, naming, tagging, quotas, and subscription lifecycle. | Infrastructure declarations, parent scopes, platform handoff, resource inventory, and environment mapping. A resource group is not a security boundary equivalent to a subscription. |
| `network-connectivity` | Internet and hybrid ingress, hub/spoke or Virtual WAN choice, IP address allocation, peering, route tables, firewall/egress, private endpoints, private DNS zones/resolvers, on-premises name resolution, and public access controls. | Trace client → DNS → route → inspection → endpoint, then return path. Check delegated subnets, SKU support, NSGs, effective routes, DNS answers, and failover routing. List missing evidence explicitly. |
| `security` | Threat boundaries, data sensitivity, encryption and key custody, security posture monitoring, security event integration, vulnerability handling, and incident escalation. Explain which controls are inherited and which the workload must configure. | Policy assignments, security baselines, diagnostics, key policies, threat scenarios, and control tests. Do not claim certification from an architecture drawing. |
| `management` | Central versus local logs, diagnostic destinations, retention, alert routing, service health, backup/restore ownership, maintenance windows, patching, and support responsibilities. | Diagnostic settings, action groups, runbooks, restoration evidence, operational acceptance, and central-team service commitments. |
| `governance` | Policy inheritance, initiatives and effects, allowed regions/services, required tags, resource protection, data residency, exemptions with expiry, and enforcement ownership. | Assignment scopes, actual deny/audit effects, remediation identity permissions, exemption register, and deployment failure tests. A policy definition without an assignment enforces nothing. |
| `platform-automation` | Subscription vending (repeatable creation and handoff), infrastructure modules, versioning, state protection, deployment identity, environment promotion, approval, drift detection, rollback, and decommissioning. | Pipeline and infrastructure files, dependency order, version pins, state-store access, drift results, and rollback rehearsal. Do not execute a supplied deployment merely to document it. |

## Synthesize, do not inventory

For each area, write the observed finding with evidence, the design decision and its rationale, the responsible team or unresolved owner role, and how that claim will be verified. Put these in `architecture.json.coverage`. Use `observed`, `proposed`, or `unknown`. If a mechanism does not apply, explain why within the area's decision; do not omit the area. An unknown still needs a finding describing the inspected scope and a decision stating the smallest next action or conditional baseline.

Do not stop at “private networking is unknown.” Explain the alternatives and dependencies: private access requires supported service tiers, workload outbound connectivity, endpoint/DNS configuration, routing from each client network, and explicit public-access restrictions. Identify who can confirm them. If the evidence supports a recommendation, present it as proposed and list the conditions that would reverse it.

Resolve contradictions before simplifying. Examples include a plan claiming private-only access while infrastructure enables public endpoints, or documentation claiming centralized logs while diagnostic settings point to a local workspace. Cite both sources and state which represents the requested revision. Do not merge incompatible environments into one plausible-looking diagram.

Ask a few decision-changing questions at a time. The three-question batch limit is not a limit on total inquiry. Revisit an unresolved dependency when it blocks technical correctness; continue independent analysis meanwhile. When a platform is managed elsewhere, request its published landing-zone contract or a sanitized architecture extract rather than broad cloud credentials.

## Detail the workload-platform contract

Write a handoff table with capability, platform responsibility, workload responsibility, evidence, and acceptance test. Cover network attachment and DNS, identity and RBAC, policy and exemptions, diagnostic routing, backup/restore, budget ownership, and deployment permissions. Map actual resource names or anonymized stable IDs to their environment, subscription, region, and network boundary where known.

For every service, document selected hosting/tier and why, region and availability assumptions, ingress/egress, identity/permissions, configuration that changes behavior, state/retention, scaling/limits, dependency failures, monitoring, deployment order, and estimated cost drivers. Unknown fields remain explicit. “Use managed services” and a product description are not implementation detail.

Trace all externally exposed interfaces and critical background paths, not just one happy path. Include bootstrap/deployment, normal request, asynchronous processing, administrative access, telemetry, degraded operation, and recovery when relevant. Record payload boundaries and where data becomes durable. Keep diagrams readable by assigning separate views rather than removing details from the document.

## Required views and review

At least one `platform` view and one `workload` view must exist. The platform view shows the management/subscription hierarchy, environment placement, platform-versus-workload responsibility, and shared-service dependencies. Use nested labeled containers for ownership; hierarchy relations are not numbered runtime traffic. A platform-only hierarchy may have no flows. Known application components should remain traceable between the platform view and workload views through stable IDs or an explicit placement table.

Add a network/security topology view whenever the design depends on private access, hybrid connectivity, or traffic inspection. Show DNS, routing, ingress, egress, and trust transitions, not just a “secure network” box. Add recovery and deployment views when a single runtime view would hide those paths. If the platform is not known, draw a clearly labeled proposed boundary/contract view and identify the unresolved decisions; never label it as deployed.

Before handoff, ask whether an engineer could identify where to deploy, how the workload authenticates and connects, which policy can block deployment, where failures are diagnosed, and who restores service. Ask whether a CTO can identify material dependencies, alternatives, costs, and residual risk. If either answer is no, complete the missing reasoning rather than adding more decorative detail.

## Primary source

Microsoft's [Azure landing zone guidance](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/) distinguishes platform and application landing zones and links the design areas and implementation options. Consult [landing zone design areas](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas) for the current organizational requirements. Source reviewed September 6, 2026; recheck relevant service, SKU, and topology constraints for each delivery.
