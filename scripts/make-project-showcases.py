#!/usr/bin/env python3
"""Compose project showcases from the site's own 4K captures; no synthetic images."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

items=[('reliquary','Reliquary','#b49a75'),('abyssal','Abyssal','#61bec4'),('ember','Hammer & Ember','#c86a42'),('terrarium','Bell & Moss','#aabf92'),('koi','Still Water','#83a4a5'),('florae','Florae','#d8a9a5'),('velocity','Velocity Lab','#f3a94d'),('hangar','Hangar Nine','#9a9ea1'),('sucre','Maison Sucre','#e8bdd0'),('monolith','Monolith','#c1aa97'),('lowfreq','Low Frequency','#b98d82'),('gambit','Gambit','#a6c1af'),('atlas','Atlas','#96bfd6'),('lithos','Lithos','#c7ac9f'),('artemis','Artemis','#c7bfad'),('keeper','The Keeper','#7d97a8'),('koen','Kōen','#a3b898'),('nocturne','Nocturne','#b1a0bb'),('racer','Nightshift','#c35750'),('horologie','Horologie','#bdad96')]
out=Path('web/public/img/showcase'); out.mkdir(parents=True,exist_ok=True)
for i,(slug,name,color) in enumerate(items):
    # Thin colour-matched edge lets the real project itself dominate the image.
    canvas=Image.new('RGB',(3840,2400),color)
    capture=Image.open(f'web/public/img/4k/{slug}-3840.webp').convert('RGB')
    capture=capture.resize((3600,2250),Image.Resampling.LANCZOS)
    canvas.paste(capture,(120,75))
    for width in (640,1280,1920,3840):
        im=canvas if width==3840 else canvas.resize((width,width*5//8),Image.Resampling.LANCZOS)
        im.save(out/f'{slug}-{width}.webp','WEBP',quality=91,method=4)
