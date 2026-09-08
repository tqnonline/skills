# AWS landing zones and platform completeness

An AWS landing zone is a governed multi-account environment. Load this file for every run. Keep the schema 1 coverage IDs for Atlas parity; their AWS meanings follow.

| Coverage ID | AWS meaning and evidence to seek |
|---|---|
| `billing-tenant` | AWS Organizations payer and billing relationships, account ownership and vending, budgets, tags, allocation, and recipient. An account is not an Azure tenant analogue. |
| `identity-access` | IAM Identity Center workforce provider, permission sets, IAM roles and policies, workload roles, federation, emergency access, keys and reviews. Separately document tenant application SAML/OIDC SSO and tenant authorization. |
| `resource-organization` | Organization → root → OU → account hierarchy; platform/workload and production/nonproduction accounts; Region, VPC, naming, quotas, lifecycle, and ownership. OUs group accounts for governance, not network traffic. |
| `network-connectivity` | VPCs, subnets, Availability Zones, Transit Gateway, routes, security groups, network ACLs, ingress, egress, hybrid links, Route 53, resolvers, PrivateLink/interface endpoints and gateway endpoints. A regional managed service stays outside a subnet; its endpoint or attached interface may be in one. |
| `security` | Data sensitivity, threat boundaries, encryption and KMS custody, GuardDuty/Security Hub posture, event integration, vulnerability response, incidents, and inherited versus workload controls. A diagram does not certify compliance. |
| `management` | CloudTrail, CloudWatch and configuration evidence; centralized logs, retention, alerts, health, backup/restore, patching, runbooks, support and operating capacity. |
| `governance` | SCPs, tag policies, Region/service restrictions, Config rules, exemptions, data geography and owners. An SCP is a maximum-permissions guardrail, never a permission grant. Test effective IAM permissions separately. |
| `platform-automation` | Account vending, Control Tower/custom landing-zone lifecycle, infrastructure modules, state protection, deployment roles, approvals, drift, rollback, decommissioning and reconciliation. |

Each coverage row needs `area`, `state`, `finding`, `decision`, `owner`, `verification`, and nonempty `evidence`. Repeated generic text is not adequate. A platform managed elsewhere still needs its sanitized contract and accountable owner.

The platform view must show organization/OU/account placement, shared services, workload accounts and responsibility. The workload view must show runtime components and numbered flows. Add network, recovery, and deployment views when one view would conceal material behavior. Use a placement table with stable node ID, placement kind, account, Region, boundary and optional subnet.

For each service, state variant/tier, Region and feature availability, ingress and egress, role and resource policies, durability, retention, limits, failures, monitoring, deployment order, cost drivers and owner. Effective account quotas require authorized observation; documentation defaults are not account facts.

Trace DNS, route, endpoint, security-group and return paths. Distinguish service geography from data-plane processing geography. A VPC endpoint does not prove public access is disabled. Multi-Availability-Zone placement does not prove disaster recovery. Recovery needs objectives, dependency analysis, failover/failback, fencing, reconciliation and test evidence.
