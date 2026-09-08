# AWS sources and official asset provenance

Use primary AWS documentation for consequential service facts. Record URL, page title, retrieval date, applicable Region/partition, feature or variant, and the exact claim supported. Living pages can change. Recheck AgentCore feature availability, processing geography and lifecycle on every relevant generation.

Core discovery sources include the AWS Architecture Center, Well-Architected Framework and applicable lenses, AWS Security Reference Architecture, landing-zone guidance, service endpoints and quotas, Organizations SCP documentation, VPC subnet and endpoint documentation, recovery guidance, and dated pricing inputs. Use feature-level AgentCore Region and cross-Region inference pages rather than an undifferentiated service name.

Official AWS architecture assets come from https://aws.amazon.com/architecture/icons/ and its official `d1.awsstatic.com` downloads. Read the current usage guidance. Record asset landing URL, download URL, release/package name, retrieval date, archive SHA-256, member path, member SHA-256 and rights URL. Preserve original SVG bytes, colors, proportions and internal whitespace. Product names remain adjacent. Icons identify AWS services, not the author's product, and must not imply AWS endorsement.

Do not vendor the full library. Accept a user-supplied archive or fetch the selected current archive. Before extraction, reject absolute paths, traversal, symlinks, excessive expansion and unexpected executable files. Extract only selected SVGs. Reject scripts, event handlers, DTD/entities, external references, unsupported elements, broken fragments, and duplicate IDs. Quarantine a failing official variant or select another official variant. Never weaken safety to admit it.

Keep original bytes for hashing and embed them as base64 SVG images. A copied, traced, recolored, cropped, rotated or distorted icon is not the official byte-preserving asset. Official source provenance establishes origin, not architectural correctness, licensing beyond the published use guidance, or AWS approval.
