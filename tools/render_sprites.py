"""Blender starter for the MAINSTREET sprite lane (Stephen's). Dev only. UNTESTED here:
this Codespace has no Blender; the shape follows create-a-critter/blender/critter_lib.py,
which does run. Open the master scene and run:

  blender --background tools/mainstreet_master.blend --python tools/render_sprites.py -- \
      --glb masters/shop-bake.glb --slot shop-bake --states open,busy,quiet,special,closed --out renders/

The master scene supplies the camera, the three lights, the Freestyle settings and a
material named "Cardstock". This script imports one GLB, applies the material override,
and renders one PNG per state by toggling collections named after the states inside the
imported model (base is always visible). Cut to WebP afterwards with cwebp (see ART-BRIEF).
"""
import argparse, os, sys
import bpy

def args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--glb", required=True)
    p.add_argument("--slot", required=True, help="file stem, e.g. shop-bake or keeper-bram")
    p.add_argument("--states", default="open", help="comma list; 'open' or 'neutral' means base only")
    p.add_argument("--out", default="renders")
    p.add_argument("--size", type=int, default=1024)
    p.add_argument("--camera", default="Cam_Shop", help="Cam_Shop or Cam_Character in the master scene")
    return p.parse_args(argv)

def import_glb(path):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.collections.new("Imported")
    bpy.context.scene.collection.children.link(root)
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        root.objects.link(o)
    return root, new

def normalize(objs, target=2.0):
    import mathutils
    lo = mathutils.Vector((1e9, 1e9, 1e9)); hi = -lo
    for o in objs:
        if o.type != "MESH": continue
        for v in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(v)
            lo = mathutils.Vector(map(min, lo, w)); hi = mathutils.Vector(map(max, hi, w))
    size = max(hi - lo); s = target / size if size else 1.0
    center = (lo + hi) / 2
    for o in objs:
        if o.parent: continue
        o.location = (o.location - center) * s + mathutils.Vector((0, 0, (hi.z - lo.z) * s / 2))
        o.scale = o.scale * s

def set_state(root, state):
    # Children collections of the import named base/busy/quiet/special/closed toggle visibility.
    for c in root.children:
        c.hide_render = not (c.name.lower() == "base" or c.name.lower() == state)

def main():
    a = args()
    scene = bpy.context.scene
    root, objs = import_glb(a.glb)
    normalize(objs)
    mat = bpy.data.materials.get("Cardstock")
    if mat is None:
        print("WARNING: no material named Cardstock in the master scene; rendering with imported materials")
    else:
        scene.view_layers[0].material_override = mat
    cam = bpy.data.objects.get(a.camera)
    if cam: scene.camera = cam
    scene.render.film_transparent = True
    scene.render.resolution_x = scene.render.resolution_y = a.size
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    os.makedirs(a.out, exist_ok=True)
    for state in [s.strip() for s in a.states.split(",") if s.strip()]:
        set_state(root, "base" if state in ("open", "neutral") else state)
        scene.render.filepath = os.path.join(a.out, f"{a.slot}-{state}.png")
        bpy.ops.render.render(write_still=True)
        print("wrote", scene.render.filepath)

if __name__ == "__main__":
    main()
