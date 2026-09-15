"""Extract the exact castle LOD2 building from the documented CityGML mesh.
Usage: python scripts/extract-plateau.py /path/50326611_bldg_6697_op.gml
No LOD0 heights, textures or inferred indoor geometry are imported.
"""
import sys,xml.etree.ElementTree as ET,math,json,hashlib
from pathlib import Path
SOURCE_ID='bldg_adf19f2c-f291-4b52-b75f-f883ce5c8e3e'
NS={'b':'http://www.opengis.net/citygml/building/2.0','g':'http://www.opengis.net/gml'}
source=Path(sys.argv[1]); target=None
for _,e in ET.iterparse(source,events=['end']):
    if e.tag.endswith('}Building'):
        if e.get('{http://www.opengis.net/gml}id')==SOURCE_ID:target=e;break
        e.clear()
assert target is not None,'Castle building ID not present'
surfaces=[];all_points=[]
for boundary in target.findall('b:boundedBy',NS):
    for surface in boundary:
        kind=surface.tag.rsplit('}',1)[-1]
        for polygon in surface.findall('.//b:lod2MultiSurface//g:Polygon',NS):
            rings=[]
            for tag in ['exterior','interior']:
                for ring in polygon.findall('g:'+tag+'/g:LinearRing/g:posList',NS):
                    a=list(map(float,ring.text.split()));pts=list(zip(a[::3],a[1::3],a[2::3]));rings.append(pts);all_points.extend(pts)
            if rings:surfaces.append({'kind':kind,'id':polygon.get('{'+NS['g']+'}id'),'rings':rings})
assert surfaces and min(p[2] for p in all_points)>100
# Local engineering display coordinates: E, elevation, -N. Not a new cadastral survey.
lat0=33.8455;lon0=132.76572;h0=min(p[2] for p in all_points)
a=6378137.;e2=6.69438002290e-3;phi=math.radians(lat0)
meridian=a*(1-e2)/(1-e2*math.sin(phi)**2)**1.5
parallel=a*math.cos(phi)/(1-e2*math.sin(phi)**2)**.5
for s in surfaces:s['rings']=[[[round(math.radians(lon-lon0)*parallel,5),round(h-h0,5),round(-math.radians(lat-lat0)*meridian,5)] for lat,lon,h in ring] for ring in s['rings']]
xyz=[p for s in surfaces for ring in s['rings'] for p in ring]
result={'sourceId':'PLATEAU-2020','buildingId':SOURCE_ID,'mesh':'50326611_bldg_6697_op.gml','sourceCrs':'EPSG:6697 (JGD2011 geographic 3D; latitude longitude elevation)','sourceMeshSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'origin':{'latitude':lat0,'longitude':lon0,'elevation':h0},'transform':'local E/up/-N tangent approximation, metres; no fitted scaling','license':'CC BY 4.0 (PLATEAU site policy permits CC BY use)','surfaceCount':len(surfaces),'bounds':{'min':[min(p[i] for p in xyz) for i in range(3)],'max':[max(p[i] for p in xyz) for i in range(3)]},'surfaces':surfaces}
out=Path('public/data/plateau-castle-lod2.json');out.write_text(json.dumps(result,separators=(',',':'))+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='surfaces'},indent=2))
