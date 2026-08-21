# Nucleon · Smart Manufacturing — Personal Site

Pure frontend personal site. Dark (navy + sky blue / green) theme. Entry point is index.html; can be deployed as-is to GitHub Pages.

## Directory Structure

- index.html — 首页（简介 → 作品 → 动态 → 关于我 → 社交，顶部含全站搜索栏；工具箱区块已移除，入口在导航和首屏按钮）
- css/style.css — Global design system (color palette, header/footer, buttons, cards, etc.; reused when adding new pages)
- css/home.css — Home-specific styles (hero, skill orbit, tool grid, etc.)
- js/main.js — Global interactions (mobile menu, language placeholder, back-to-top, scroll appearance, toast)
- js/home.js — 首页逻辑：顶部全站搜索 + 技能轨道
- js/tools-data.js — EE toolbox catalog data
- EE_Toolbox/ — EE development toolbox (38 calculators, has its own index)
- icon/ — Icons (LOGO, avatar, social platforms, etc.)

## Extension Guide

### Add a tool
Append one entry each to the TOOLS array in EE_Toolbox/index.html and to js/tools-data.js (name / file / category / icon / description / tags); both the home page and the toolbox will render it automatically.

### Add a project / update
In index.html, the #projects section is one .card.proj card per project; the #news section is one li per entry in the timeline.

### Add a new page (e.g. docs.html, qsl.html)
Copy the header/footer structure from index.html, reference css/style.css, and add the link to the nav. Page-specific styles go in a new css/xxx.css; do not pollute the global styles.

### Multilingual (CN/EN)
The language menu in the top right is currently a placeholder (toast notification). When needed in the future, add data-i18n attributes to elements that need translation, and provide a dictionary in js/i18n.js.

### Replace icons
Place new icons directly in icon/ and change the src in index.html. If icons are missing, you can temporarily substitute with emoji (the project cards currently use emoji).
