import bpy, math
from mathutils import Vector
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
bpy.ops.wm.open_mainfile(filepath=str(ROOT / 'public/assets/logo.blend'))
scene=bpy.context.scene
for obj in list(bpy.data.objects):
    if obj.type in {'LIGHT','CAMERA'}: bpy.data.objects.remove(obj,do_unlink=True)
mat=bpy.data.materials.new('Navy satin ceramic'); mat.diffuse_color=(0.008,0.043,0.105,1); mat.use_nodes=True
bs=mat.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(0.008,0.043,0.105,1); bs.inputs['Metallic'].default_value=.32; bs.inputs['Roughness'].default_value=.24
for obj in list(bpy.data.objects):
    if obj.type=='MESH':
        obj.data.materials.clear(); obj.data.materials.append(mat)
        bevel=obj.modifiers.new('Soft studio edges','BEVEL'); bevel.width=.035; bevel.segments=4
        obj.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
bpy.ops.mesh.primitive_plane_add(size=200, location=(0,0,-.84)); floor=bpy.context.object; floor.name='White studio backdrop'
white=bpy.data.materials.new('White'); white.use_nodes=True; white.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(1,1,1,1); white.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.7; floor.data.materials.append(white)
def aim(obj,point): obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(.95,-1.9,9)); camera=bpy.context.object; aim(camera,(0,-.15,0)); camera.data.type='ORTHO'; camera.data.ortho_scale=5.5; scene.camera=camera
for name,loc,power,size in [('Key',(-3,4,6),650,5),('Rim',(4,1,4),850,3),('Fill',(-1,-4,3),180,4)]:
    bpy.ops.object.light_add(type='AREA',location=loc); light=bpy.context.object; light.name=name; light.data.energy=power; light.data.shape='DISK'; light.data.size=size; aim(light,(0,0,0))
scene.world.color=(.65,.65,.65)
scene.render.engine='CYCLES'; scene.cycles.samples=64; scene.cycles.use_denoising=True
scene.render.resolution_x=900; scene.render.resolution_y=900; scene.render.resolution_percentage=100
scene.view_settings.view_transform='Standard'; scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGB'
scene.render.filepath=str(ROOT/'design/og/logo-render.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'design/og/coordination-studio.blend'))
bpy.ops.render.render(write_still=True)
