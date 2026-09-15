"""Validate actual GLB structure and publish exact Python-computed model metrics."""
import hashlib
import json
import os
from pathlib import Path
import struct

path = Path("public/models/matsuyama_keep.glb")
raw = path.read_bytes()
magic, version, length = struct.unpack_from("<4sII", raw)
assert magic == b"glTF" and version == 2 and length == len(raw)
json_length, json_type = struct.unpack_from("<II", raw, 12)
assert json_type == 0x4E4F534A
data = json.loads(raw[20:20 + json_length])
# Only our audited procedural PNG maps may be embedded. Hash every actual image byte.
materials = json.loads(Path("public/data/material-manifest.json").read_text())
allowed = {m["sha256"] for m in materials if m["source"] == "ORIGINAL"}
bin_start = 28 + json_length
assert data.get("images"), "Portable PBR images missing"
for image in data["images"]:
    assert "uri" not in image and image["mimeType"] == "image/png"
    assert image.get("extras", {}).get("sourceId") == "ORIGINAL"
    view = data["bufferViews"][image["bufferView"]]
    start = bin_start + view.get("byteOffset", 0)
    payload = raw[start:start + view["byteLength"]]
    assert hashlib.sha256(payload).hexdigest() in allowed, "Unregistered texture pixels"
for material in data["materials"]:
    assert material.get("normalTexture"), "Missing portable normal map"
    assert material["pbrMetallicRoughness"].get("baseColorTexture")
    assert material["pbrMetallicRoughness"].get("metallicRoughnessTexture")
for buffer in data.get("buffers", []):
    assert "uri" not in buffer, "GLB must be self-contained"

names = [node.get("name", "") for node in data["nodes"]]
for part in ["Anagura", "Floor0", "Floor1", "Floor2", "Floor3", "VisitorStairs0", "VisitorStairs1", "VisitorStairs2", "Columns", "ExposedBeams", "HongawaraRoof", "TenshumaruStone"]:
    assert any(part in name for name in names), f"Missing required part: {part}"

root = next((node for node in data["nodes"] if node.get("name") == "MatsuyamaKeep_Interpretive_CC_BY_4"), None)
assert root is not None, "Missing reconstruction root node"
extras = root.get("extras", {})
assert extras.get("evidenceVersion"), "GLB missing evidence version"
assert extras.get("overallAccuracy") == "C", "Overall geometry must remain C"
b_scope = extras.get("bGradeScope", [])
expected_b = {"exposed-timber-morphology", "window-assembly-morphology", "top-floor-openings"}
assert set(b_scope) == expected_b, f"Unexpected B-grade scope: {b_scope}"
assert extras.get("bGradeMeaning") == "corroborated morphology/relationship only; not survey-grade coordinates"
source_ids = extras.get("sourceIds", [])
for required in ["CITY-KEEP", "WM-PD-INSIDE", "WM-PD-TOP", "WM-CCBY-COURTYARD-1", "WM-CCBY-ARMOUR-4", "DPLA-CCBY-WINDOW-1963"]:
    assert required in source_ids, f"Missing provenance source {required}"

triangles = 0
for mesh in data["meshes"]:
    for primitive in mesh["primitives"]:
        assert primitive.get("mode", 4) == 4
        accessor = primitive.get("indices", primitive["attributes"]["POSITION"])
        triangles += data["accessors"][accessor]["count"] // 3

report = {
    "file": str(path),
    "source_revision": os.environ.get("GITHUB_SHA", "local"),
    "sha256": hashlib.sha256(raw).hexdigest(),
    "bytes": len(raw),
    "mesh_count": len(data["meshes"]),
    "triangles": triangles,
    "image_count": len(data.get("images", [])),
    "image_origin": "audited ORIGINAL procedural synthesis",
    "self_contained": True,
    "licence": "CC-BY-4.0",
    "overall_accuracy": "C",
    "geometry_accuracy": "C",
    "evidence_version": extras["evidenceVersion"],
    "b_grade_scope": b_scope,
    "b_grade_is_morphology_only": True,
    "source_ids": source_ids,
    "physical_iOS_validation": "NOT VERIFIED",
    "release_pass": False,
}
Path("public/data/model-report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2))

# The production bundle must not expose the CI-only position mutation API.
for script in Path("dist/assets").glob("*.js"):
    assert "__walkTest" not in script.read_text(), f"Test API leaked into {script}"
