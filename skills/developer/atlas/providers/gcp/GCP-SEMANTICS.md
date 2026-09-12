# Native placement and service semantics

Load on every run. Google Cloud is not Azure with different icons. Establish project ownership, geographic scope, network attachment and trust separately. These rules guide review; the assembler checks only explicitly modeled fields and does not infer a deployment.

| Topic | Required distinction and evidence |
|---|---|
| Placement | A VPC is global; a subnet is regional. A zonal resource names its zone and region. A managed regional API is not automatically inside a VPC subnet. |
| Shared VPC | Service-project resources retain their owning project while using host-project networking. Shared network access does not transfer resource ownership or customer authorization. |
| Private access | Private Service Connect, private services access and Private Google Access solve different connectivity problems. Name the actual endpoint, DNS, route, firewall and selected service support. |
| Peering | VPC peering is not transitive. Do not draw implied transit across two peerings. DNS sharing and firewall rules need separate configuration. |
| Service perimeter | VPC Service Controls constrains supported API/data access; it is not a packet firewall or universal private endpoint. Verify service/feature support and ingress/egress exceptions. |
| Cloud Run | Direct VPC egress does not itself provide inbound private connectivity. Name ingress setting, load-balancer access, invocation identity and default URL restriction. Distinguish services, jobs and worker pools. |
| Messaging | Pub/Sub at-least-once delivery requires idempotent consumers. Exactly-once support depends on subscription mode and regional conditions; it does not guarantee one external business effect. Push must not be labeled exactly-once. |
| Identity | Customer SAML/OIDC sign-in, provider workforce federation and workload identity federation are separate paths. Verify token issuer, audience, expiry, customer mapping and least-privilege IAM. |
| Models and agents | Record product label, API identifier, feature version/lifecycle, runtime location, model endpoint, processing/storage location, CMEK and perimeter support separately. Parent-product availability does not prove a feature combination. |
| Recovery | Select a concrete database and replication variant. Regional HA is not regional disaster recovery. Recovery includes routes, keys, identities, policy, workflows, objects, indexes and security state. |

Use a compatibility record for consequential managed features: capability, selected variant, location, endpoint, security requirements, source URL/retrieval date, supported/unsupported/unverified verdict and consequence. Unsupported combinations must not become review-ready by appearing in an open-decisions table.

Primary sources: [VPC](https://docs.cloud.google.com/vpc/docs/vpc), [Shared VPC](https://docs.cloud.google.com/vpc/docs/shared-vpc), [private access](https://docs.cloud.google.com/vpc/docs/private-access-options), [peering](https://docs.cloud.google.com/vpc/docs/vpc-peering), [service perimeters](https://docs.cloud.google.com/vpc-service-controls/docs/overview), [Cloud Run Direct VPC](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc), [Pub/Sub exactly-once](https://docs.cloud.google.com/pubsub/docs/exactly-once-delivery), and [disaster recovery](https://docs.cloud.google.com/architecture/disaster-recovery). Recheck changing feature combinations during authoring.
