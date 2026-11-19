---
name: reference-blender-fast-3d-pipeline
description: "LOAD before any Blender / GLB / product 3D model job: where Blender lives, reusable script helpers, render+export pipeline, and the time sinks that made the Andoria generator take far too long"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7ad4f5a8-37bb-41e5-9144-71844e2a1e27
  modified: 2026-09-19T22:30:15.525Z
---

Built from the Andoria ADG-100 generator job (see [[project-andoria-generator-model]]). It worked but took very long; these notes make the next model fast.

**Tools already on the machine (don't re-download):**
- Blender 4.2.9 portable: `C:\Users\DELL\tools\blender-4.2.9\blender.exe`. The Store "Blender 3.6" Start-menu entry is a dead stub, nothing installed there.
- Reusable helpers: `Documents/andoria-website/assets/models/andoria_generator/build_scripts/` — `p1_core.py` (materials, `mk_box/mk_cyl/mk_torus/mk_tube/between`, `Face` local-frame class with boolean-cut `panel()`, bolt master), `p6_render.py` (studio, camera views, render loop), `export_glb.py`, `build_viewer.js` (embeds GLB in a standalone three.js viewer html), `inspect_glb.js`, `open_light.py`.
- Playwright is at `C:\Users\DELL\node_modules\playwright` (use absolute require path from scratchpad).

**Time sinks and fixes:**
1. **Blender download/extract ate ~30 min** (Expand-Archive on 5000 files is very slow; launching before it finishes gives exit -1073741515 = missing DLLs). Now persisted, so skip. If it is ever gone: wait until `*.dll` exist in the folder, not just blender.exe.
2. **Output-token limit hit writing one giant script.** Write modular parts (~150-250 lines each: core, chassis, enclosure, internals, brand, render) and a tiny `build.py` that `exec`s them. Never one 1000-line Write.
3. **Cycles on this CPU is ~2 min for a 12-sample 960px frame.** Use EEVEE (`BLENDER_EEVEE_NEXT`): ~3 min one-time shader compile, then ~15 s per view. Render ALL views in ONE process, never one process per view. Preview with a single view at 960px first.
4. **Running blender.exe from Git Bash prints nothing** — launch from PowerShell (`Start-Process ... -RedirectStandardOutput log`) and poll the log for `BUILD_DONE`.
5. **Rendering the whole thing 4 times** because defects were found one image at a time. Instead: render preview, look at ALL key views (3/4 front, 3/4 rear, open interior, top, one close-up) in a single batch, list every defect, fix them together, then do one final render.

**Modeling gotchas hit (avoid up front):**
- Face-frame convention that worked: local +X = viewer's right, -Y = outward, +Y = inward, Z up; frames rot 0 / 180 / +90 / -90 for front / rear / right / left. Text rotation (90deg,0,0) reads correctly from outside.
- A solid interior "shell" box hides the engine — use thin liner panels (back/ends/top/floor) and leave the door side open.
- Open-door showcase camera must be on the hinge-free side, or the door blocks the view.
- Reference images from AI often contradict each other on layout — pick one layout, state the inference, don't spend time reconciling.

**GLB export gotchas:**
- Procedural nodes don't export: unlink Roughness/Normal and set explicit values; bake `Coat Weight` to 0.
- Very dark paints read as black in plain viewers — lift base colors for the GLB (dark green `0E5240`, chassis `1C1D1F`). glTF base colors are linear.
- Convert FONT/CURVE objects to mesh before export; select only the model collection (exclude floor/lights/camera). `export_apply=True` bakes bevels. 539 objects -> 3.1 MB GLB, no Draco needed.
- Viewer: three r128 treats hex colors as linear, so floor hex must be very dark (`0x020504`); GLTFLoader/OrbitControls from jsdelivr `three@0.128.0/examples/js/...`. Verify with a Playwright screenshot and `inspect_glb.js` (lists material colors/roughness).

**Blender GUI lag on 500+ objects:** disable modifiers' `show_viewport` and use Solid shading (`open_light.py`); renders keep the modifiers.

**Fast recipe for the next model (target: under ~25 min):** confirm reference -> reuse `p1_core.py` helpers -> write only the new model-specific parts -> one EEVEE preview batch -> fix all defects -> final render + `export_glb.py` + `build_viewer.js` -> Playwright screenshot check -> open for the user. Keep the user's standing rules: no Higgsfield, dark (not mint) green for Andoria.
