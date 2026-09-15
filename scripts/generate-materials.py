"""Original deterministic PBR maps. No photographs, AI images or third-party pixels.
Python standard library only; PNG encoding and all synthesis are reproducible.
"""
import math, struct, zlib, hashlib, json
from pathlib import Path
N=256
OUT=Path('public/textures'); OUT.mkdir(parents=True,exist_ok=True)
def noise(x,y,seed=0):
    n=(x*374761393+y*668265263+seed*1442695041)&0xffffffff
    n=((n^(n>>13))*1274126177)&0xffffffff
    return ((n^(n>>16))&65535)/65535

def smooth(x,y,scale,seed):
    x=x/scale; y=y/scale; ix=math.floor(x); iy=math.floor(y)
    u=x-ix; v=y-iy; u=u*u*(3-2*u); v=v*v*(3-2*v)
    # Periodic lattice, so all levels tile at N pixels.
    p=N//scale
    a=noise(ix%p,iy%p,seed); b=noise((ix+1)%p,iy%p,seed)
    c=noise(ix%p,(iy+1)%p,seed); d=noise((ix+1)%p,(iy+1)%p,seed)
    return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v

def png(path,pixels):
    def chunk(k,d):return struct.pack('>I',len(d))+k+d+struct.pack('>I',zlib.crc32(k+d)&0xffffffff)
    raw=b''.join(b'\0'+bytes(pixels[y*N*3:(y+1)*N*3]) for y in range(N))
    data=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',N,N,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,9))+chunk(b'IEND',b'')
    path.write_bytes(data);return hashlib.sha256(data).hexdigest()

def clamp(v):return max(0,min(255,round(v)))
manifest=[]
for kind in ['timber','plaster','stone','ceramic','earth','iron']:
    heights=[]; colors=[]; rough=[]
    for y in range(N):
        for x in range(N):
            n=noise(x,y,17); broad=smooth(x,y,64,3); mid=smooth(x,y,16,8); fine=smooth(x,y,4,12)
            if kind=='timber':
                # Fibres run along u; long grain, pores, periodic knot distortion.
                warp=2.8*math.sin(2*math.pi*x/N)+1.8*math.sin(4*math.pi*x/N)
                grain=math.sin(2*math.pi*(y*28/N+warp*.13))
                fibre=math.sin(2*math.pi*(y*101/N+warp*.23))
                dx=math.sin(math.pi*(x/N-.37));dy=math.sin(math.pi*(y/N-.64))
                knot=math.exp(-(dx*dx*12+dy*dy*180))
                rings=math.sin(80*math.sqrt(dx*dx*.07+dy*dy+0.0001))*knot
                h=.5+.11*grain+.045*fibre+.1*rings+.06*(fine-.5)
                tone=.78+.16*broad+.07*grain+.035*fibre-.14*knot+.04*rings
                rgb=[224*tone,207*tone,181*tone];r=.56+.2*mid
            elif kind=='plaster':
                h=.5+.05*(fine-.5)+.025*(n-.5)
                tone=.94+.04*mid+.025*(n-.5);rgb=[255*tone,252*tone,244*tone];r=.87+.09*n
            elif kind=='stone':
                h=.5+.20*(mid-.5)+.14*(fine-.5)+.08*(n-.5)
                vein=abs(math.sin(2*math.pi*x/N+4*broad+2*mid))
                tone=.67+.25*mid+.13*fine+.05*(n-.5)-.04*(vein<.045)
                rgb=[240*tone,236*tone,222*tone];r=.87+.12*fine
            elif kind=='ceramic':
                h=.5+.05*(fine-.5)+.012*(n-.5)
                tone=.83+.14*broad+.07*fine;rgb=[221*tone,229*tone,235*tone];r=.51+.22*mid
            elif kind=='earth':
                h=.5+.09*(fine-.5)+.1*(n-.5);tone=.78+.12*mid+.15*n
                rgb=[239*tone,222*tone,186*tone];r=.96
            else:
                h=.5+.04*(fine-.5)+.025*(n-.5);tone=.75+.18*mid+.08*n;rgb=[230*tone]*3;r=.6+.22*mid
            heights.append(h);colors.extend(map(clamp,rgb));rough.extend([255,clamp(r*255),0])
    normal=[]
    for y in range(N):
        for x in range(N):
            dx=(heights[y*N+(x+1)%N]-heights[y*N+(x-1)%N])*1.8
            dy=(heights[((y+1)%N)*N+x]-heights[((y-1)%N)*N+x])*1.8
            length=math.sqrt(dx*dx+dy*dy+1)
            normal.extend([clamp(127.5-dx/length*127.5),clamp(127.5-dy/length*127.5),clamp(127.5+127.5/length)])
    for suffix,pixels in [('color',colors),('normal',normal),('roughness',rough)]:
        path=OUT/f'{kind}-{suffix}.png';sha=png(path,pixels)
        manifest.append({'path':str(path),'sha256':sha,'width':N,'height':N,'source':'ORIGINAL','license':'CC BY 4.0','method':'deterministic mathematical synthesis; no source image pixels'})
Path('public/data/material-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Generated',len(manifest),'original PBR maps')
