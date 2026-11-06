import json, sys, os
base = os.path.dirname(os.path.abspath(__file__))
imgs = json.load(open(os.path.join(base, 'data', 'imgdata.json')))
IMG = {k: {'img': v['img']} for k, v in imgs.items()}

LIME = '#D1FB46'
P = [
 dict(slug='danny-ocean-2025-tour', title='Danny Ocean — Babylon Club Arena Tour', year='2025', lane='stage', voice='com', accent=LIME,
      client='Danny Ocean · Henrique Ghersi Studio', role='Unreal artist · world development and live camera treatments', roleShort='Unreal artist', line='Video design and live camera treatments for a Latin American arena tour',
      venue='Arena tour', tools='Unreal Engine, Notch',
      text=['Real-time worlds built in Unreal Engine for different songs of the tour, with live camera treatments for the IMAG screens.'],
      credits=['Creative Director: Luigi Santella','Lighting Director & Designer: Rafael Imitola','Video Direction & Design: Henrique Ghersi','Unreal Artists: Carlos Serrano, Rob Heppell, Ross Marshall, Karim Fatatry, Henrique Ghersi','Notch Programming & Video Coordinator: Kyle Reseigh']),
 dict(slug='h-m-virtual-showroom', title='H&M Virtual Showroom', year='', lane='worlds', voice='com', accent=LIME,
      client='H&M', role='Senior Unreal artist · world design', roleShort='', line='Innovation metaverse design story · Red Dot, Lovie, The Drum', venue='', tools='Unreal Engine', text=['Innovation metaverse design story.']),
 dict(slug='on-the-other-earth', title='On the Other Earth', year='', lane='immersive', voice='com', accent=LIME,
      client='Studio Wayne McGregor', role='Role to confirm', roleShort='', line='Post-cinematic choreographic installation produced by Studio Wayne McGregor',
      venue='', tools='',
      text=['The world’s first post-cinematic choreographic installation. Visitors step into the heart of the dance, in close contact with the hyperreal dancers of Company Wayne McGregor and the Hong Kong Ballet, in a physicalised sound environment designed by Invisible Mountain.']),
 dict(slug='hyperverbena', title='Hyperverbena', year='', lane='stage', voice='cay', accent=LIME,
      client='Verraco & Lechuga Zafiro', role='Live visuals for an audiovisual show', roleShort='Live visuals', line='Live audiovisual show with Verraco and Lechuga Zafiro',
      venue='', tools='TouchDesigner',
      text=['A direct dive into the raw and surreal dimensions of sudaka identity. Sound and image become weapon and witness: fire with religion, violence with mysticism, animals with humans.']),
 dict(slug='vogue-business-metaverse-atelier', title='Vogue Business Metaverse Atelier', year='', lane='worlds', voice='com', accent=LIME,
      client='Vogue Business · Epic Games', role='Senior Unreal artist · world design', roleShort='', line='Designing digital fashion with Epic Games', venue='', tools='Unreal Engine', text=['Designing digital fashion with Epic Games.']),
 dict(slug='spectral-lures', title='Spectral Lures', year='', lane='stage', voice='cay', accent=LIME,
      client='Own work (Carlos.exe)', role='Concept, sound and real-time visuals', roleShort='Concept, sound, visuals', line='An audiovisual live performance by Carlos.exe',
      venue='', tools='TouchDesigner, Ableton Live',
      text=['An experimental audiovisual performance that drifts across the borders of illusion and perception. Spectral tones, fractured pulses and synthetic textures, with images that seduce the senses before dissolving into instability.']),
 dict(slug='nftism', title='NFTism', year='2021', lane='worlds', voice='com', accent=LIME,
      client='Nagel Draxler', role='Senior Unreal artist · virtual gallery design', roleShort='', line='Virtual gallery for Nagel Draxler at Art Basel Miami Beach 2021', venue='Art Basel Miami Beach', tools='Unreal Engine',
      text=['A virtual gallery exploring social interaction with art in the metaverse, for Nagel Draxler at Art Basel Miami Beach 2021.']),
 dict(slug='wackyschak-stage', title='CUPRA Wacky Shack — Parookaville 2024', year='2024', lane='stage', voice='com', accent=LIME,
      client='CUPRA · with MONOMANGO', role='Visual artist · TouchDesigner–Unreal previz, mocap avatars', roleShort='Visual artist', line='Real-time stage show and immersive stage design for an immersive clubbing experience',
      venue='Parookaville, Weeze, DE', tools='TouchDesigner, Unreal Engine, motion capture',
      text=['TouchDesigner and Unreal Engine previz workflow, facial and body motion capture integrated into custom avatars driving the stage content.'],
      credits=['Creative Lead: Lois Kainhuber','Project Lead: David Leroy','Art Director: Nino Matthey','Visual Artists: Itaru Yasuda, Carlos Serrano','Event Technology: DEKOR Event']),
 dict(slug='meta-festival', title='Meta Festival', year='', lane='worlds', voice='com', accent=LIME,
      client='Client TBC', role='Senior Unreal artist · festival world design', roleShort='', line='The first 24-hour metaverse festival', venue='', tools='Unreal Engine', text=['The first 24-hour metaverse festival.']),
 dict(slug='penumbra', title='Penumbra', year='', lane='immersive', voice='cay', accent=LIME,
      client='With Carlos P. Villamizar', role='Real-time fulldome, co-author', roleShort='Co-author', line='A real-time fulldome experience: the outside world seen from inside a machine',
      venue='', tools='TouchDesigner, photogrammetry',
      text=['PENUMBRA asks how the outside world can be seen from inside a machine: the synthesis of souls of spaces, living-off landscapes and the camera of the future.']),
 dict(slug='my-emotions', title='My Emotions', year='', lane='immersive', voice='com', accent=LIME,
      client='Museum client TBC', role='Real-time experience design', roleShort='', line='Interactive museum experience that reads visitors’ emotions',
      venue='', tools='Unreal Engine, computer vision',
      text=['A real-time experience that reads the visitor’s emotions and lets them interact with an alter ego translated into 3D characters.']),
 dict(slug='we-power-joy-together', title='We Power Joy Together', year='', lane='systems', voice='com', accent=LIME,
      client='Brand TBC · with MONOMANGO', role='Unreal artist · car configurator', roleShort='Unreal artist', line='Brand activation and real-time car configurator',
      venue='', tools='Unreal Engine',
      text=['A brand space with a real-time car configurator, developed with MONOMANGO and AMU Architekten.'],
      credits=['Creative Director: Lois Kainhuber','Technical Project Lead: David Leroy / MONOMANGO','Architecture & Interior Design: Andreas Müller / AMU Architekten','Unreal Artists: Nino Matthey, Carlos Serrano / MONOMANGO','UI & UX Design: Alan Alves / MONOMANGO']),
 dict(slug='memor-ia-s', title='Memor[ia]s', year='', lane='immersive', voice='cay', accent=LIME,
      client='Own work', role='Concept and real-time installation', roleShort='', line='What does a dream mean to a computational device no longer controlled by a human?',
      venue='', tools='TouchDesigner, 3D scanning',
      text=['An immersive audiovisual installation on the relationships between dreams and reality, nature and simulation, intelligence and artificial intelligence: a trip into the depths of a machine’s dream.']),
 dict(slug='framgented-thoughts', title='Fragmented Thoughts', year='', lane='stage', voice='cay', accent=LIME,
      client='Own work', role='Live A/V, real-time', roleShort='', line='Live A/V show played in real time with TouchDesigner and Ableton Live',
      venue='', tools='TouchDesigner, Ableton Live', text=['A live A/V show performed in real time.']),
 dict(slug='social-capsule', title='Social Capsule', year='', lane='systems', voice='com', accent=LIME,
      client='Theresa Riewer', role='Technical production · real-time point clouds', roleShort='Technical production', line='The feel-good living of tomorrow, with an AI and an AR roommate',
      venue='', tools='Real-time point clouds',
      text=['A futuristic mobile home where an in-house AI and an augmented-reality roommate turn the personal comfort zone into a meeting place.']),
 dict(slug='transmissive-resemblance', title='Transmissive Resemblance', year='', lane='stage', voice='cay', accent=LIME,
      client='The nent + cayequitas', role='Co-author, immersive A/V', roleShort='', line='Immersive AV show', venue='', tools='', text=['Immersive AV show by The nent and cayequitas.']),
 dict(slug='puntos-en-la-nube', title='Puntos en la nube', year='', lane='immersive', voice='cay', accent=LIME,
      client='Own work', role='Photogrammetry and VR', roleShort='', line='Point clouds, photogrammetry and VR', venue='', tools='Photogrammetry, VR', text=['Point clouds, photogrammetry and VR.']),
 dict(slug='otro-lago-en-el-cielo', title='Otro lago en el cielo', year='', lane='systems', voice='cay', accent=LIME,
      client='Colombian Drone Mafia + Gibrana Cervantes', role='Real-time visuals for a music video', roleShort='', line='Music video for Colombian Drone Mafia and Gibrana Cervantes', venue='', tools='Real-time', text=['Music video.']),
 dict(slug='reminiscent-delusions', title='A Boreal Dream', year='', lane='stage', voice='cay', accent=LIME,
      client='Own work', role='Live visuals', roleShort='', line='A trip into the beauty of the Aurora Borealis', venue='', tools='',
      text=['The aurora as a beacon for a future where technology and nature coexist.']),
 dict(slug='inner-code-alchemy', title='Inner Code Alchemy', year='', lane='systems', voice='com', accent=LIME,
      client='Client TBC', role='Game experience', roleShort='', line='African calendar game experience', venue='', tools='', text=['A game experience built around an African calendar.']),
]
SHOWS = [
 dict(up=True, title='Your next show', venue='Added from the workspace · syncs to your calendar'),
 dict(year='2025', title='Danny Ocean — Babylon Club Arena Tour', venue='Arena tour, Latin America', slug='danny-ocean-2025-tour'),
 dict(year='2024', title='CUPRA Wacky Shack', venue='Parookaville, Weeze, Germany', slug='wackyschak-stage'),
 dict(year='2021', title='NFTism', venue='Nagel Draxler at Art Basel Miami Beach, USA', slug='nftism'),
 dict(year='TBC', title='On the Other Earth', venue='Studio Wayne McGregor · venues TBC', slug='on-the-other-earth'),
 dict(year='TBC', title='Spectral Lures', venue='Venues TBC', slug='spectral-lures'),
 dict(year='TBC', title='Hyperverbena', venue='Venues TBC', slug='hyperverbena'),
 dict(year='TBC', title='Penumbra', venue='Fulldome · venues TBC', slug='penumbra'),
 dict(year='TBC', title='Festival stage work', venue='Berlin Atonal · Roskilde · Primavera Sound · years TBC'),
 dict(year='TBC', title='Fulldome', venue='Zeiss-Großplanetarium, Berlin · year TBC'),
]
LAB = [
 dict(slug='memor-ia-s', title='MEMOR[IA]S', tools='TD · 3D SCAN', tint='#5A5A5A'),
 dict(slug='on-the-other-earth', title='ON THE OTHER EARTH', tools='VOLUMETRIC · POINT CLOUD', tint='#5A5A5A'),
 dict(slug='penumbra', title='PENUMBRA', tools='TD · FULLDOME', tint='#5A5A5A'),
 dict(slug='otro-lago-en-el-cielo', title='OTRO LAGO EN EL CIELO', tools='REAL-TIME', tint='#5A5A5A'),
 dict(slug='reminiscent-delusions', title='A BOREAL DREAM', tools='GENERATIVE', tint='#5A5A5A'),
]
html = open(os.path.join(base, 'template.html')).read()
brand = json.load(open(os.path.join(base, 'data', 'logos.json')))
# Brand fonts (Heuvel Grotesk, Hogisogi) as base64 data URIs
fp = os.path.join(base, 'data', 'fonts.json')
brand['fonts'] = json.load(open(fp))['fonts'] if os.path.exists(fp) else {}
ff = ''
for k, src in brand['fonts'].items():
    fam, w = k.split('-')
    name = 'Heuvel Grotesk' if fam == 'heuvel' else 'Hogisogi'
    ff += '@font-face{font-family:"%s";src:url(%s) format("opentype");font-weight:%s;font-display:swap}\n' % (name, src, w)
html = html.replace('__FONTFACE__', ff).replace('__LOGOS__', json.dumps(brand['logos']))
PUBLIC = '--public' in sys.argv
if PUBLIC:
    # Review build for GitHub Pages: no prototype notes, placeholders or TBC markers.
    import re
    def clean_p(p):
        p = dict(p)
        if re.search(r'TBC|to confirm', p.get('role', ''), re.I): p['role'] = ''
        if re.search(r'TBC', p.get('client', '')): p['client'] = ''
        return p
    P2 = [clean_p(p) for p in P]
    S2 = []
    for s in SHOWS:
        if s.get('up'): continue
        s = dict(s)
        s['venue'] = re.sub(r'\s*·?\s*(venues?|years?) TBC', '', s['venue'], flags=re.I).strip(' ·')
        if s.get('year') == 'TBC': s['year'] = '—'
        S2.append(s)
    P, SHOWS = P2, S2
    html = re.sub(r'<p class="[^"]*\bpnote\b[^"]*"[^>]*>.*?</p>', '', html, flags=re.S)
    html = html.replace('__TITLE__', 'Carlos Serrano · Portfolio')
    html = html.replace('__RIBBON__', '<span class="mono">Website portfolio from Carlos Serrano</span><a class="mono ig" href="https://www.instagram.com/cayequitas/" target="_blank" rel="noopener">@cayequitas ↗</a>')
    html = html.replace('<main', '<script>document.documentElement.classList.add("public")</script><main', 1)
    html = html.replace('const P = ', 'const PUBLIC = true;\nconst P = ', 1)
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(base, 'site.html')
else:
    html = html.replace('__TITLE__', 'Cayé Site Prototype')
    html = html.replace('__RIBBON__', '<span class="mono">Prototype v0.9 · look and structure only</span><span class="mono">Heuvel Grotesk + Hogisogi · real logos</span>')
    html = html.replace('const P = ', 'const PUBLIC = false;\nconst P = ', 1)
    out = os.path.join(base, 'cayequitas-prototype.html')
html = html.replace('__IMGDATA__', json.dumps(IMG)).replace('__PROJECTS__', json.dumps(P, ensure_ascii=False)).replace('__SHOWS__', json.dumps(SHOWS, ensure_ascii=False)).replace('__LAB__', json.dumps(LAB, ensure_ascii=False))
import base64
html = html.replace('__PORTRAIT__', 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(base, 'data', 'portrait.jpg'), 'rb').read()).decode())
open(out, 'w').write(html)
print(len(html)//1024, 'KB')
