#!/usr/bin/env python3
"""Create responsive, non-AI device compositions from the project's own captures."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

source = Path('web/public/img/4k')
out = Path('web/public/img/mockups')
out.mkdir(parents=True, exist_ok=True)
palette = ['#a8d8d3','#d9bdff','#f6b189','#d8e7a5','#b4c7ed','#f5bfc2','#e4dfae','#b3d7e4','#eccbad','#bfc2f1','#e5c4dd','#f2d199','#bad8b2','#c6c3e6','#f0b7a7','#aac5d4','#cde1af','#f2bbcd','#cbb6a2','#e9d99c']
for index, path in enumerate(sorted(source.glob('*-3840.webp'))):
    slug = path.name.removesuffix('-3840.webp')
    W,H=3840,2400
    canvas=Image.new('RGB',(W,H),palette[index])
    d=ImageDraw.Draw(canvas)
    d.rectangle((0,1660,W,H), fill='#e9e1d5')
    d.polygon([(0,1660),(3840,1660),(3840,1720),(0,1810)],fill='#d1c5b6')
    # An intentionally graphic device mockup, with the entire genuine hero visible.
    shadow=Image.new('RGBA',(W,H)); sd=ImageDraw.Draw(shadow)
    sd.rounded_rectangle((420,285,3420,2010),radius=70,fill=(0,0,0,105))
    shadow=shadow.filter(ImageFilter.GaussianBlur(55)); canvas=Image.alpha_composite(canvas.convert('RGBA'),shadow)
    d=ImageDraw.Draw(canvas)
    x,y=440,220; sw,sh=2960,1850
    d.rounded_rectangle((x-25,y-25,x+sw+25,y+sh+25),radius=48,fill='#252626')
    d.rounded_rectangle((x,y,x+sw,y+sh),radius=18,fill='#090909')
    im=Image.open(path).convert('RGB').resize((sw,sh),Image.Resampling.LANCZOS)
    canvas.paste(im,(x,y))
    d=ImageDraw.Draw(canvas)
    d.ellipse((1908,197,1932,221),fill='#777')
    d.polygon([(360,2095),(3480,2095),(3600,2180),(240,2180)],fill='#b5b6b4')
    d.rounded_rectangle((240,2160,3600,2200),radius=18,fill='#777a7a')
    d.rounded_rectangle((1710,2098,2130,2125),radius=12,fill='#919393')
    for width in (640,1280,1920,3840):
        result=canvas.convert('RGB') if width==3840 else canvas.convert('RGB').resize((width,width*H//W),Image.Resampling.LANCZOS)
        result.save(out/f'{slug}-{width}.webp','WEBP',quality=88,method=5)
