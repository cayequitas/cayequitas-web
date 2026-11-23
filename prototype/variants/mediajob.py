"""Media-designer application variant of the site (build with --mediajob).

Same site, commercial voice: a "Brand work" view with short cases first in the nav,
a media-designer bio and home line, brands in the ribbon, and commercial projects
in the featured card. Facts come from Carlos's CV; nothing here is invented.
"""
import json

TITLE = 'Carlos Serrano · Motion, 3D and AI design'
DESC = ('Carlos Serrano: motion, 3D and AI media designer in Berlin. Brand visuals for H&M, BMW, CUPRA, '
        'ZEISS, Volvo and Samsung; Red Dot, Lovie and The Drum awards.')
RIBBON = ['H&M', 'BMW', 'CUPRA', 'ZEISS', 'Vaillant', 'Volvo', 'Samsung', 'Red Bull', 'Nike', 'Adidas',
          'Vogue Business', 'Epic Games', 'Red Dot', 'Lovie', 'The Drum']

# client, year, title, role, what was made, reach / result, project page slug (or None)
CASES = [
    dict(client='ZEISS · Vaillant', year='2026', title='AI-driven commercial production',
         role='AI production lead · with YYYYYYY.STUDIO',
         made='Led the AI-driven production of commercial content for two brands, from concept exploration to delivered assets.',
         result='Same studio: senior art director on an international feature film with AI-generated scenes (release 2027).',
         slug=None),
    dict(client='H&M', year='2022', title='First virtual showroom',
         role='Environment concept and technical integration · with H&Mbeyond and DEPT',
         made='Concept, environment and technology for H&M’s first virtual showroom, plus a cloth-simulation workflow later reused for Macy’s and BMW.',
         result='Red Dot, Lovie and The Drum Awards (Best Metaverse UX).',
         slug='h-m-virtual-showroom'),
    dict(client='CUPRA', year='2024', title='Brand space at Parookaville',
         role='Visual artist · with MONOMANGO',
         made='60 audio-reactive 3D scenes, a motion-capture avatar and a TouchDesigner–Unreal previz pipeline for the brand’s stage.',
         result='200,000+ festival attendees.',
         slug='wackyschak-stage'),
    dict(client='BMW', year='2021–2024', title='Configurator and launch visuals',
         role='Unreal artist · with MONOMANGO and JOURNEE',
         made='A photorealistic Unreal Engine car configurator for BMW Park, Munich; fluid and particle effects for BMW Joytopia at IAA Mobility and CES.',
         result='150,000+ visits on Joytopia’s launch day.',
         slug=None),
    dict(client='Samsung · Red Bull · Nike · Adidas', year='2015–2020', title='Motion and 360° brand content',
         role='Co-founder and motion designer · +PLAY',
         made='Motion graphics, 360° video, mapping and installations for Samsung, Red Bull, Uber, Motorola, Nike and Adidas.',
         result='4M+ views on Samsung content.',
         slug=None),
    dict(client='Vogue Business · Epic Games', year='2023', title='A Metaverse Atelier',
         role='Environment and interaction design · JOURNEE',
         made='Modelled the environments and built the interactions for a digital-fashion atelier.',
         result='2,200+ visitors.',
         slug='vogue-business-metaverse-atelier'),
    dict(client='Volvo', year='2024', title='My Emotions · World of Volvo opening',
         role='Computer vision · with Håkan Lidbo and Jaime Reyes',
         made='A camera system (OAK-D, ZED) that reads visitors’ emotions and drives a real-time 3D alter ego.',
         result='Shown at the opening of World of Volvo, Gothenburg.',
         slug='my-emotions'),
    dict(client='Danny Ocean', year='2025', title='Arena tour visuals',
         role='Unreal artist · with Henrique Ghersi Studio',
         made='Real-time Unreal Engine worlds and live camera treatments for a Latin American arena tour.',
         result='Toured arenas across Latin America.',
         slug='danny-ocean-2025-tour'),
]

FEAT = ['wackyschak-stage', 'h-m-virtual-showroom', 'danny-ocean-2025-tour', 'vogue-business-metaverse-atelier', 'my-emotions']

CSS = '''
/* media-designer variant: brand work cases */
.cases{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--rule);border-left:1px solid var(--rule);margin-bottom:64px}
.case{display:grid;grid-template-rows:auto auto 1fr;border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);min-width:0;color:inherit;text-decoration:none;background:none;text-align:left;font:inherit;padding:0}
a.case{cursor:pointer}
.case .cimg{position:relative;aspect-ratio:16/9;overflow:hidden;border-bottom:1px solid var(--rule);background:var(--black)}
.case .cimg img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.1);transition:filter .4s}
a.case:hover .cimg img{filter:none}
.case .cimg.type{display:flex;align-items:flex-end;padding:18px;background:var(--black);color:var(--lime)}
.case .cimg.type b{font-weight:900;text-transform:uppercase;font-size:clamp(28px,3.6vw,56px);line-height:.85;letter-spacing:-.04em}
.case .chead{display:flex;justify-content:space-between;gap:12px;padding:14px 18px 0}
.case h3{margin:6px 18px 14px;font-weight:900;text-transform:uppercase;font-size:clamp(22px,2.2vw,34px);line-height:.9;letter-spacing:-.03em}
.case dl{margin:0;display:grid;grid-template-columns:1fr;border-top:1px solid var(--rule)}
.case dl div{padding:10px 18px;border-bottom:1px solid var(--rule)}
.case dl div:last-child{border-bottom:0}
.case dt{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--sub);margin-bottom:4px}
.case dd{margin:0;font-size:15px;line-height:1.35}
.case dd.res{display:inline;background:var(--lime);color:var(--black);padding:0 .2em}
.case .open{padding:12px 18px;font-family:var(--mono);font-size:12px;text-transform:uppercase;border-top:1px solid var(--rule)}
a.case:hover .open{background:var(--lime);color:var(--black)}
@media(max-width:820px){.cases{grid-template-columns:1fr}}
'''


def _esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def _case_html(c):
    if c['slug']:
        img = '<div class="cimg"><img loading="lazy" alt="" data-slug="%s"></div>' % c['slug']
        tag, attrs, tail = 'a', ' href="#p-%s"' % c['slug'], '<span class="open">Open project →</span>'
    else:
        img = '<div class="cimg type"><b>%s</b></div>' % _esc(c['client'])
        tag, attrs, tail = 'div', '', ''
    return ('<%s class="case"%s>%s<div><div class="chead mono"><span>%s</span><span class="dim">%s</span></div>'
            '<h3>%s</h3></div><dl><div><dt>Role</dt><dd>%s</dd></div><div><dt>What I made</dt><dd>%s</dd></div>'
            '<div><dt>Result</dt><dd class="res">%s</dd></div></dl>%s</%s>') % (
        tag, attrs, img, _esc(c['client']), c['year'], _esc(c['title']), _esc(c['role']), _esc(c['made']),
        _esc(c['result']), tail, tag)


SECTION = '''<section class="view wrap" id="work" aria-label="Brand work">
  <div class="pagehead"><h2>Brand work<sup>%02d</sup></h2><div class="sub"><p>Motion, 3D and AI-driven visuals for brands, from brief to delivered asset. Role, output and result for each.</p></div></div>
  <div class="cases">%s</div>
</section>
''' % (len(CASES), ''.join(_case_html(c) for c in CASES))

BIO_OLD_START = '<p>Carlos Serrano is a Colombian media artist'
BIO_OLD_END = 'TouchDesigner talks and workshops.</p>'
BIO_NEW = ('<p>Carlos Serrano is a motion, 3D and AI media designer based in Berlin. For more than ten years he has turned briefs into '
           'visuals for H&amp;M, BMW, CUPRA, ZEISS, Volvo, Samsung and Red Bull, from social and 360° content to brand spaces seen by 200,000+ people.</p>'
           '<p>He currently leads AI-driven production on commercial work for ZEISS and Vaillant and is senior art director on a feature film with '
           'AI-generated scenes. His H&amp;M virtual showroom won Red Dot, Lovie and The Drum awards.</p>'
           '<p>He works fast across motion, real-time 3D (Unreal Engine, TouchDesigner) and generative AI, and builds his own pipelines when the '
           'tools fall short. He co-founded the studio <a class="ext" href="https://www.muchomasplay.com/" target="_blank" rel="noopener">+PLAY ↗</a> '
           'in 2015 and has taught visual programming at M.A. level.</p>')


def _sub(html, old, new, count=1):
    assert old in html, 'mediajob variant: anchor not found: %r' % old[:60]
    return html.replace(old, new, count)


def apply(html):
    html = _sub(html, '</style>', CSS + '</style>')
    # nav: Brand work first
    html = _sub(html, '<a href="#projects"><i>01</i>Projects</a><a href="#shows"><i>02</i>Shows</a><a href="#lab"><i>03</i>Lab</a><a href="#about"><i>04</i>About</a>',
                '<a href="#work"><i>01</i>Brand work</a><a href="#projects"><i>02</i>Projects</a><a href="#lab"><i>03</i>Lab</a><a href="#about"><i>04</i>About</a>')
    html = _sub(html, '<section class="view wrap" id="projects"', SECTION + '<section class="view wrap" id="projects"')
    html = _sub(html, 'const views = ["home","projects",', 'const views = ["home","work","projects",')
    html = _sub(html, '$("#voice").textContent = cay ? "Real-time artist" : "Media artist & technical director";',
                '$("#voice").textContent = "Motion · 3D · AI design";')
    html = _sub(html, '<span class="voice mono" id="voice">Real-time artist</span>', '<span class="voice mono" id="voice">Motion · 3D · AI design</span>')
    # home line
    html = _sub(html, '<p class="lede"><b>Carlos Serrano</b> scans the physical world with photogrammetry and volumetric video, and rebuilds it as living, reactive systems for stages, domes and spaces.</p>',
                '<p class="lede"><b>Carlos Serrano</b> designs motion, 3D and AI-driven visuals for brands like H&amp;M, BMW, CUPRA, ZEISS and Samsung. Award-winning work, from 4M+ views online to brand spaces for 200,000+ people. <a class="ext" href="#work">See brand work →</a></p>')
    html = _sub(html, '<span>Carlos Serrano<span class="lg"> · technical direction</span></span>', '<span>Carlos Serrano<span class="lg"> · motion &amp; 3D</span></span>')
    html = _sub(html, '<span>Cayé<span class="lg"> · real-time art</span></span>', '<span>AI<span class="lg"> · production</span></span>')
    # featured card: commercial projects
    html = _sub(html, 'const FEAT = ["on-the-other-earth","danny-ocean-2025-tour","penumbra","spectral-lures","hyperverbena","wackyschak-stage"]',
                'const FEAT = ' + json.dumps(FEAT))
    # case thumbnails come from the same image map as the project grid
    html = _sub(html, 'addEventListener("hashchange", go);',
                'addEventListener("hashchange", go);\ndocument.querySelectorAll("#work img[data-slug]").forEach(im=>{const d=IMG[im.dataset.slug];if(d)im.src=d.img});')
    # Lab framed as short-form output
    html = _sub(html, 'R&amp;D, captures, process<br>', 'Short-form R&amp;D: captures, simulations, process<br>')
    # About
    html = _sub(html, '<p>Media artist and technical director. Bogotá born, Berlin based.</p>', '<p>Motion, 3D and AI media designer. Bogotá born, Berlin based.</p>')
    i = html.index(BIO_OLD_START); j = html.index(BIO_OLD_END, i) + len(BIO_OLD_END)
    html = html[:i] + BIO_NEW + html[j:]
    html = _sub(html, '<li>Danny Ocean</li><li>H&amp;M</li><li>BMW</li><li>CUPRA</li><li>Volvo</li><li>ZEISS</li>',
                '<li>H&amp;M</li><li>BMW</li><li>CUPRA</li><li>ZEISS</li><li>Vaillant</li><li>Volvo</li><li>Samsung</li><li>Danny Ocean</li>')
    html = _sub(html, '<li>The Wall Street Journal</li><li>Samsung</li><li>Red Bull</li>',
                '<li>The Wall Street Journal</li><li>Red Bull</li><li>Nike</li><li>Adidas</li>')
    return html
