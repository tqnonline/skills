# Google Cloud foundations

A foundation is the governed environment a workload inherits. Load this file on every run. The eight coverage IDs below are this skill's assessment taxonomy, not a claim that Google publishes an identical eight-part standard. Assess each even when the input is application-only. Unknown means unverified, not absent.

| Coverage ID | Required assessment |
|---|---|
| `organization-billing` | Cloud Identity or Google Workspace organization, billing account association, financial owner, budgets, allocation and project onboarding. Billing accounts are not resource parents or network boundaries. |
| `identity-access` | Separate provider workforce, customer SSO and service accounts. Explain IAM inheritance, workload identity federation, least privilege, short-lived credentials, emergency access and audit. Customer app roles are not project IAM roles. |
| `resource-organization` | Organization → folders → projects → resources. Separate production/nonproduction and shared management/customer projects. State project lifecycle, quotas, labels and owners. |
| `network-connectivity` | Global VPC ownership, regional subnets, Shared VPC host/service projects when selected, ingress, private service access, DNS, routes, firewall, egress and hybrid attachment. Explain overlapping customer address isolation. |
| `security` | Threat model, data classes, key custody, secrets, posture findings, vulnerability scanning, incident access and escalation. Explain inherited versus workload-configured controls. |
| `management` | Customer-local content logs versus central allowlisted health metadata, retention, alerting, backup/restore, patching and support ownership. Central logging is not permission to collect prompts. |
| `governance` | Organization Policy constraints and actual enforcement scopes, IAM deny where relevant, location policy, exception expiry, legal holds and evidence of enforcement. A policy document alone enforces nothing. |
| `platform-automation` | Repeatable project creation and handoff, service enablement, per-customer deployment identity, infrastructure state protection, versioned modules, rings, rollback, drift and decommissioning. |

For each record supply state, finding, decision with rationale, owner, verification and evidence. Use a reasoned not-applicable decision rather than omitting an area. Provide a handoff table of platform responsibility, workload responsibility and acceptance test for each inherited capability.

The platform view must explain ownership and hierarchy; it is not a duplicated workload drawing. Containment is not runtime traffic. Require a network view for private/hybrid designs and a recovery view when regional dependencies would otherwise be hidden. Keep managed services outside subnet containers unless the selected resource actually resides there.

Primary sources: [landing zones](https://docs.cloud.google.com/architecture/landing-zones), [enterprise foundations](https://docs.cloud.google.com/architecture/blueprints/security-foundations), [resource hierarchy](https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy), and [Well-Architected Framework](https://docs.cloud.google.com/architecture/framework). Consult selected current pages for each delivery; evaluate security, reliability, performance, cost, operations and sustainability proportionately rather than copying a blueprint wholesale.
