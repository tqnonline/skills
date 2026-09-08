#!/usr/bin/env python3
"""Validate a hash-bound independent Atlas GCP quality-review receipt."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, NoReturn


PERSONAS = {"junior-developer", "cto", "enterprise-architect", "security-architect"}
SCORES = {"clarity", "complexity", "understandability"}
GENERIC_CHECKS = {
    "placement", "directed-flows", "truthful-abstraction", "icon-readability",
    "cumulative-consistency",
}
REQUIRED_FILES = {
    "architecture.json", "reference-architecture.md", "narrative.html",
    "reference-architecture.html", "reference-architecture.pdf",
}


class SchemaError(Exception):
    """The receipt or its bound inputs violate the review contract."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SchemaError(message)


def obj(value: Any, label: str) -> dict[str, Any]:
    require(isinstance(value, dict), f"{label} must be an object")
    return value


def array(value: Any, label: str) -> list[Any]:
    require(isinstance(value, list), f"{label} must be an array")
    return value


def text(value: Any, label: str) -> str:
    require(isinstance(value, str) and bool(value.strip()), f"{label} must be a nonempty string")
    return value


def safe_file(root: Path, relative: Any, label: str) -> tuple[str, Path]:
    rel = text(relative, label)
    candidate = Path(rel)
    require(not candidate.is_absolute() and rel not in {".", ".."}, f"{label} must be relative")
    require(".." not in candidate.parts, f"{label} must not traverse outside the pack")
    path = root.joinpath(candidate)
    current = root
    for part in candidate.parts:
        current = current / part
        require(not current.is_symlink(), f"{label} must not contain a symlink")
    try:
        resolved = path.resolve(strict=True)
    except (OSError, RuntimeError) as exc:
        raise SchemaError(f"{label} does not exist: {rel}") from exc
    require(resolved.parent == root or root in resolved.parents, f"{label} escapes the pack root")
    require(resolved.is_file(), f"{label} must name a regular file")
    return candidate.as_posix(), resolved


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def pdf_page_count(path: Path) -> int:
    try:
        result = subprocess.run(
            ["pdfinfo", str(path)], capture_output=True, text=True, check=False, timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise SchemaError("pdfinfo is required to validate PDF page inspection") from exc
    require(result.returncode == 0, "pdfinfo could not parse reference-architecture.pdf")
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            try:
                pages = int(line.split(":", 1)[1].strip())
            except ValueError:
                break
            require(pages > 0, "pdfinfo must report a positive page count")
            return pages
    raise SchemaError("pdfinfo did not report a page count")


def validate(root_arg: str, review_arg: str) -> dict[str, Any]:
    root = Path(root_arg).resolve(strict=True)
    require(root.is_dir(), "--root must be a directory")
    review_rel, review_path = safe_file(root, review_arg, "--review") if not Path(review_arg).is_absolute() else ("", Path(review_arg))
    if Path(review_arg).is_absolute():
        require(not review_path.is_symlink(), "--review must not be a symlink")
        review_path = review_path.resolve(strict=True)
        require(review_path.parent == root or root in review_path.parents, "--review must be inside --root")
        require(review_path.is_file(), "--review must be a regular file")
        review_rel = review_path.relative_to(root).as_posix()
    try:
        receipt = obj(json.loads(review_path.read_text(encoding="utf-8")), "review")
        _, model_path = safe_file(root, "architecture.json", "model")
        model = obj(json.loads(model_path.read_text(encoding="utf-8")), "architecture.json")
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise SchemaError(f"could not read JSON input: {exc}") from exc

    mode = text(receipt.get("mode"), "mode")
    require(mode == "architecture-pack", "mode must be architecture-pack; skill-patch cannot produce architecture review-ready")
    text(receipt.get("scope"), "scope")
    require(receipt.get("independent") is True, "independent must be true")
    text(receipt.get("reviewer"), "reviewer")
    text(receipt.get("inputRevision"), "inputRevision")

    views = array(model.get("views"), "model.views")
    require(bool(views), "model.views must be nonempty")
    svgs = {text(obj(view, "model.views[]").get("svg"), "model.views[].svg") for view in views}
    for svg_path in root.rglob("*.svg"):
        require(not svg_path.is_symlink(), f"SVG artifact must not be a symlink: {svg_path.relative_to(root)}")
        if svg_path.is_file():
            svgs.add(svg_path.relative_to(root).as_posix())
    required = REQUIRED_FILES | svgs
    hashes = obj(receipt.get("artifactHashes"), "artifactHashes")
    require(review_rel not in hashes, "artifactHashes must not hash the review receipt itself")
    require(required <= set(hashes), f"artifactHashes missing required files: {sorted(required - set(hashes))}")
    for rel, expected in hashes.items():
        normalized, path = safe_file(root, rel, f"artifactHashes[{rel!r}]")
        require(normalized != review_rel, "artifactHashes must not hash the review receipt itself")
        require(isinstance(expected, str) and len(expected) == 64 and all(c in "0123456789abcdef" for c in expected), f"invalid SHA-256 for {rel}")
        require(sha256(path) == expected, f"hash mismatch for {rel}")

    inspected_paths: set[str] = set()
    pdf_pages = pdf_page_count(root / "reference-architecture.pdf")
    for index, raw in enumerate(array(receipt.get("inspected"), "inspected")):
        item = obj(raw, f"inspected[{index}]")
        rel, _ = safe_file(root, item.get("path"), f"inspected[{index}].path")
        require(rel not in inspected_paths, f"duplicate inspected path: {rel}")
        inspected_paths.add(rel)
        if rel == "reference-architecture.pdf":
            pages = array(item.get("pages"), "PDF inspected pages")
            require(all(type(page) is int for page in pages), "PDF inspected pages must be integers")
            require(pages == list(range(1, pdf_pages + 1)), "PDF inspected pages must list every page once in order")
        if rel in svgs:
            regions = array(item.get("regions"), f"SVG {rel} regions")
            require(bool(regions) and all(isinstance(region, str) and region.strip() for region in regions), f"SVG {rel} regions must be nonempty strings")
    require(required <= inspected_paths, f"inspected missing required files: {sorted(required - inspected_paths)}")

    personas = array(receipt.get("personas"), "personas")
    require(len(personas) == 4, "personas must contain exactly four objects")
    persona_ids: list[str] = []
    for index, raw in enumerate(personas):
        persona = obj(raw, f"personas[{index}]")
        persona_ids.append(text(persona.get("id"), f"personas[{index}].id"))
        scores = obj(persona.get("scores"), f"personas[{index}].scores")
        require(set(scores) == SCORES, f"personas[{index}].scores must contain exactly {sorted(SCORES)}")
        require(all(type(score) is int and 1 <= score <= 5 for score in scores.values()), "persona scores must be integers from 1 through 5")
        require(bool(array(persona.get("evidence"), f"personas[{index}].evidence")), "persona evidence must be nonempty")
        require(bool(array(persona.get("strengths"), f"personas[{index}].strengths")), "persona strengths must be nonempty")
        for strength in persona["strengths"]:
            text(strength, "persona strength")
        for evidence in persona["evidence"]:
            if isinstance(evidence, str):
                text(evidence, "persona evidence")
            else:
                item = obj(evidence, "persona evidence")
                require(item.get("path") in hashes, "persona evidence must name a hashed artifact")
                text(item.get("location"), "persona evidence location")
                text(item.get("observation"), "persona evidence observation")
    require(set(persona_ids) == PERSONAS and len(set(persona_ids)) == 4, "persona IDs must be the four required unique perspectives")

    findings = array(receipt.get("findings"), "findings")
    finding_ids: set[str] = set()
    for index, raw in enumerate(findings):
        finding = obj(raw, f"findings[{index}]")
        finding_id = text(finding.get("id"), f"findings[{index}].id")
        require(finding_id not in finding_ids, f"duplicate finding ID: {finding_id}")
        finding_ids.add(finding_id)
        require(finding.get("severity") in {"critical", "major", "minor"}, "finding severity is invalid")
        require(finding.get("origin") in {"overview", "source", "export", "skill"}, "finding origin is invalid")
        finding_path, _ = safe_file(root, finding.get("path"), f"findings[{index}].path")
        require(finding_path in hashes, "finding must name a hashed artifact")
        for field in ("location", "issue", "consequence", "recommendation"):
            text(finding.get(field), f"findings[{index}].{field}")

    requirements = array(model.get("requirements"), "model.requirements")
    requirement_ids = [text(obj(item, "model.requirements[]").get("id"), "model.requirements[].id") for item in requirements]
    require(len(requirement_ids) == len(set(requirement_ids)), "model requirement IDs must be unique")
    checks = array(receipt.get("requirementChecks"), "requirementChecks")
    check_ids: list[str] = []
    check_statuses: dict[str, str] = {}
    for index, raw in enumerate(checks):
        check = obj(raw, f"requirementChecks[{index}]")
        check_id = text(check.get("id"), f"requirementChecks[{index}].id")
        require(check.get("status") in {"met", "partial", "unmet"}, f"invalid requirement status for {check_id}")
        evidence = check.get("evidence")
        require((isinstance(evidence, str) and evidence.strip()) or (isinstance(evidence, list) and bool(evidence)), f"requirement {check_id} evidence must be nonempty")
        check_ids.append(check_id)
        check_statuses[check_id] = check["status"]
    expected_checks = set(requirement_ids) | GENERIC_CHECKS
    require(len(check_ids) == len(set(check_ids)), "requirement check IDs must be unique")
    require(set(check_ids) == expected_checks, f"requirement checks must exactly cover model requirements and generic checks; missing={sorted(expected_checks-set(check_ids))}, extra={sorted(set(check_ids)-expected_checks)}")

    verdict = receipt.get("verdict")
    require(verdict in {"pass", "revise", "blocked"}, "verdict must be pass, revise, or blocked")
    limitations = receipt.get("limitations")
    require(isinstance(limitations, list), "limitations must be an array")
    if verdict == "pass":
        require(all(score >= 3 for raw in personas for score in obj(raw, "persona")["scores"].values()), "pass is unsupported when a persona score is below 3")
        require(all(status == "met" for status in check_statuses.values()), "pass is unsupported unless every requirement check is met")
        require(not any(obj(item, "finding").get("severity") in {"major", "critical"} for item in findings), "pass is unsupported with major or critical findings")

    final_status = "review-ready" if verdict == "pass" else "needs-decision" if verdict == "revise" else "incomplete"
    output = dict(receipt)
    output["derived"] = {"passEligible": verdict == "pass", "finalStatus": final_status}
    if verdict == "pass":
        output["derived"]["provisional"] = True
        output["derived"]["notice"] = "Independent receipt passed. Author semantic and visual checks are still required before architecture review-ready."
    return output


def die(message: str) -> NoReturn:
    print(f"review schema error: {message}", file=sys.stderr)
    raise SystemExit(2)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    parser.add_argument("--review", required=True)
    args = parser.parse_args()
    try:
        result = validate(args.root, args.review)
    except (SchemaError, OSError) as exc:
        die(str(exc))
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
