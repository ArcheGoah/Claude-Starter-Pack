# Skill Registry

**Total skills:** 108 (lokal) + 8 Custom Artist Agents + 161 OpenSpace Cloud
**Generated:** 2026-03-28
**Updated:** 2026-06-29 — Cleanup: removed 12 legacy multi-agent orchestration skills (external-framework-dependent)
**Previous:** 2026-05-21 — Cleanup: removed n8n-* (7), obsidian-* (3), solana-dev, make-discoball, ch-dsg-compliance-check

## TouchDesigner 2025 (1) — NEW 2026-05-15

**Kontext:** TD 2025.32820, Vulkan backend, GLSL 4.60. Built for AGENTIC:EI installation (20.05.2026) + all future TD projects. Covers full pipeline: WebSocket → Python → CHOP → GLSL feedback field. Includes AGENTIC:EI-specific patterns (two-timescale model, coherence bloom, recalibration events, diagnostic overlay).

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| touchdesigner | .claude/skills/touchdesigner/ | touchdesigner, TD, GLSL TOP, feedback loop, particle system, POP, WebSocket DAT, multi-screen, generative visuals, live installation, fluid shader, TouchDesigner, shader in TD | TD 2025.32820 (Vulkan/GLSL 4.60) playbook. GLSL TOP feedback loops, CHOP→uniform pipeline, WebSocket→Python→CHOP bridge, GPU particles (POP), multi-screen, Text TOP dye injection, performance |

## AI Video Editing / Anti-Adobe Stack (6) — NEW 2026-04-19

**Kontext:** Recherche ergab 35+ MCPs und Tools für "Premiere-Killer" Workflows. {User} behält Premiere für aktuelle Projekte, aber AI macht 80% der Arbeit. Stack: Transcript-first (ffmpeg 8.1 Whisper) → LLM Cut-Points → Premiere MCP / FCPXML / Direct Cut. MCPs: adobe-premiere (adb-mcp), after-effects (TheLlamainator).

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| premiere-mcp-bridge | .claude/skills/premiere-mcp-bridge/ | premiere, timeline, sequence, cut in premiere, render aus premiere, premiere marker, mach mir ein premiere projekt | Adobe Premiere Pro live via adb-mcp (Mike Chambers). create_sequence, import_media, add_marker, export_sequence. Requires Premiere Beta 25.3+ + adb-proxy-socket running |
| whisper-cut-ffmpeg | .claude/skills/whisper-cut-ffmpeg/ | transkribiere, untertitel, srt, whisper, transcript aus video, was wurde gesagt | ffmpeg 8.1 native Whisper-Filter (ersetzt WhisperX-Pipeline). SRT/JSON mit word-level timing. Auto-VAD + Deutsch-optimiert. Basis für transcript-cutter |
| transcript-cutter | .claude/skills/transcript-cutter/ | rough cut, beste 30 sekunden, entferne füllwörter, schneide highlight, kürze auf x minuten | Transcript-first Video-Cut. Claude liest transcript.json, emittiert cut_points.json, FFmpeg schneidet → MP4/FCPXML/Markers. a16z agentic editing pattern |
| ae-mcp-bridge | .claude/skills/ae-mcp-bridge/ | after effects, motion graphics, keyframes setzen, AE comp erstellen, audio to marker, waveform in AE | After Effects via TheLlamainator's after-effects-mcp (30+ Tools) + Bridge-Panel. Umgeht broken AE-2024 aerender. waveform_to_markers für Musik Beat-Sync |
| buttercut-roughcut | .claude/skills/buttercut-roughcut/ | buttercut library, rough cut aus allem, footage organisieren, interview library, doku rough cut | ButterCut (Ruby Gem) - Library-basierter Rough-Cut Generator für grosse Footage-Ordner (50+ Clips). Output xmeml v5 für Premiere-Import. WhisperX word-level |
| agentic-edit-critic | .claude/skills/agentic-edit-critic/ | iteriere den cut, kritisiere meinen edit, ist der schnitt gut, review meinen rough cut, verbessere das pacing | EditDuet-Pattern (SIGGRAPH 2025): Editor + Critic Sub-Agents iterieren auf cut_points.json max 3 Rounds. Nutzt parallel-research-agent Infrastructure |

### Combo-Workflows

| Szenario | Chain |
|----------|-------|
| Reel aus 20min Talk | `whisper-cut-ffmpeg` → `transcript-cutter` → `ffmpeg-batch` (9:16) → `instagram-caption-generator` |
| Premiere Rohschnitt | `whisper-cut-ffmpeg` → `transcript-cutter --format markers` → `premiere-mcp-bridge` (add markers + timeline) |
| Longform YouTube | `buttercut-roughcut` (library) → `premiere-mcp-bridge` (import xmeml) → `ae-mcp-bridge` (titles) |
| Music Video | `ae-mcp-bridge` (waveform_to_markers) → `video-remotion` (programmatic) → `ffmpeg-batch` (master) |
| Iteratives Review | `transcript-cutter` → `agentic-edit-critic` (max 3 rounds) → User approval |

## How to use

Claude Code auto-discovers skills from `.claude/skills/*/SKILL.md`.
Each skill directory MUST contain a `SKILL.md` file with YAML frontmatter including `name` and `description`.
The description field is what Claude uses for semantic matching -- make it specific and include trigger phrases.

## Categories

### Content & Blog (23)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| blog | .claude/skills/blog/ | blog strategy, blog, content brief, write blog, blog post | Full-lifecycle blog engine with 17 commands, 12 content templates, 5-category 100-point scoring, and 4 specialized agents. Optimized for ... |
| blog-analyze | .claude/skills/blog-analyze/ | blog analyze, check blog quality, blog score, blog review, audit blog, analyze blog | Audit and score blog posts on a 5-category 100-point scoring system covering content quality, SEO optimization, E-E-A-T signals, technica... |
| blog-audit | .claude/skills/blog-audit/ | blog audit, site audit, blog health, audit all posts, audit blog | Full-site blog health assessment scanning all blog files for quality scores, orphan pages, topic cannibalization, stale content, and AI c... |
| blog-brief | .claude/skills/blog-brief/ | write brief, outline blog, content brief, blog brief, plan blog post | Generate detailed content briefs for blog posts with target keywords, content outlines, competitive analysis, recommended statistics, ima... |
| blog-calendar | .claude/skills/blog-calendar/ | content calendar, blog plan, publishing schedule, blog calendar, editorial calendar | Generate editorial calendars for blogs with topic clusters, publishing schedules, content decay detection, freshness update plans, season... |
| blog-cannibalization | .claude/skills/blog-cannibalization/ | competing pages, blog cannibalization, cannibalize, cannibalization, keyword overlap, duplicate keywords | Detect keyword cannibalization across blog posts by extracting primary keywords from titles and headings, clustering semantically similar... |
| blog-chart | .claude/skills/blog-chart/ | svg chart, generate chart, data visualization, blog graph, blog chart | Generate dark-mode-compatible inline SVG data visualization charts for blog posts. Supports horizontal bar, grouped bar, donut, line, lol... |
| blog-factcheck | .claude/skills/blog-factcheck/ | validate claims, blog factcheck, check sources, verify statistics, fact check, factcheck | Verify statistics and claims in blog posts by fetching cited source URLs and checking if the claimed data actually appears on the page. E... |
| blog-geo | .claude/skills/blog-geo/ | citation audit, geo, blog geo, ai citation, ai optimization, aeo | AI citation optimization audit scoring blog posts for ChatGPT, Perplexity, and Google AI Overview citability. Evaluates passage-level cit... |
| blog-image | .claude/skills/blog-image/ | social card, generate blog image, blog illustration, blog image, generate hero image | AI image generation and editing for blog content powered by Gemini via MCP. Claude acts as Creative Director - interpreting intent, selec... |
| blog-outline | .claude/skills/blog-outline/ | content outline, blog outline, structure blog, outline, plan sections | SERP-informed outline generation with H2/H3 heading hierarchy, competitive content gap analysis, section-by-section word count targets, c... |
| blog-persona | .claude/skills/blog-persona/ | blog persona, persona, tone, writing style, brand voice, voice | Create and manage writing personas with NNGroup 4-dimension tone framework (Funny-Serious, Formal-Casual, Respectful-Irreverent, Enthusia... |
| blog-post-outline-creator | .claude/skills/blog-post-outline-creator/ | blog post outline creator | Create SEO-optimized blog post outlines with clear structure, heading hierarchy, and content flow. Use when users need blog outlines, con... |
| blog-repurpose | .claude/skills/blog-repurpose/ | blog repurpose, twitter thread, repurpose, share blog, social media | Repurpose blog posts for social media, email, YouTube, Reddit, and LinkedIn. Generates Twitter/X threads, LinkedIn articles, YouTube scri... |
| blog-rewrite | .claude/skills/blog-rewrite/ | blog rewrite, fix blog, update blog, rewrite blog, optimize blog, improve blog | Rewrite and optimize existing blog posts for Google rankings (December 2025 Core Update, E-E-A-T) and AI citations (GEO/AEO). Replaces fa... |
| blog-schema | .claude/skills/blog-schema/ | structured data, blog schema, schema markup, schema, json-ld | Generate complete JSON-LD schema markup for blog posts including BlogPosting, Person, Organization, BreadcrumbList, FAQPage, and ImageObj... |
| blog-seo-check | .claude/skills/blog-seo-check/ | seo validation, blog seo check, validate seo, blog seo, seo check, check seo | Post-writing SEO validation with pass/fail checklist covering title tag length and keyword placement, meta description quality, heading h... |
| blog-strategy | .claude/skills/blog-strategy/ | blog topics, blog strategy, blog positioning, content strategy, what should I blog about | Blog strategy development including topic cluster architecture with hub-and-spoke design, audience mapping, competitive landscape analysi... |
| blog-taxonomy | .claude/skills/blog-taxonomy/ | tag suggestions, categories, taxonomy, blog taxonomy, tags, sync tags | Extract, suggest, and sync tags and categories for blog posts across all major CMS platforms. Supports WordPress REST API, Shopify GraphQ... |
| blog-write | .claude/skills/blog-write/ | new blog post, create article, blog write, draft blog, write blog, write about | Write new blog articles from scratch optimized for Google rankings and AI citations. Generates full articles with template selection, ans... |
| content-strategy | .claude/skills/content-strategy/ | what should I write about,, topic clusters,, blog strategy,, content strategy,, content strategy, content ideas, | When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also use when the user... |
| copy-editing | .claude/skills/copy-editing/ | edit this copy,, proofread,, copy feedback,, review my copy,, copy editing, polish this, | When the user wants to edit, review, or improve existing marketing copy. Also use when the user mentions 'edit this copy,' 'review my cop... |
| copywriting | .claude/skills/copywriting/ | improve this copy,, headline help,, marketing copy,, copywriting, rewrite this page,, write copy for, | When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature... |

### SEO (16)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| ai-seo | .claude/skills/ai-seo/ | ai seo, AI SEO,, answer engine optimization,, LLMO,, GEO,, AEO, | When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Also use when the us... |
| meta-description-generator | .claude/skills/meta-description-generator/ | meta description generator | Generate SEO-optimized meta descriptions that improve click-through rates from search results while staying within character limits. Use ... |
| programmatic-seo | .claude/skills/programmatic-seo/ | location pages,, programmatic SEO,, programmatic seo, template pages,, directory pages,, pages at scale, | When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions "programmatic SEO," "te... |
| schema-markup | .claude/skills/schema-markup/ | structured data,, schema.org,, schema markup,, schema markup, JSON-LD,, rich snippets, | When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user mentions "schema mar... |
| seo-audit | .claude/skills/seo-audit/ | seo audit, SEO issues,, on-page SEO,, SEO audit,, technical SEO,, why am I not ranking, | When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit," "technical SEO,"... |
| seo-competitor-pages | .claude/skills/seo-competitor-pages/ | vs page, X vs Y, alternatives page, seo competitor pages, alternatives to X, comparison page | Generate SEO-optimized competitor comparison and alternatives pages. Covers "X vs Y" layouts, "alternatives to X" pages, feature matrices... |
| seo-content | .claude/skills/seo-content/ | readability check, seo content, content quality, E-E-A-T, content analysis, thin content | Content quality and E-E-A-T analysis with AI citation readiness assessment. Use when user says "content quality", "E-E-A-T", "content ana... |
| seo-geo | .claude/skills/seo-geo/ | LLM optimization, seo geo, AI search, GEO, SGE, AI Overviews | Optimize content for AI Overviews (formerly SGE), ChatGPT web search, Perplexity, and other AI-powered search experiences. Generative Eng... |
| seo-images | .claude/skills/seo-images/ | image optimization, image SEO, image audit, image size, alt text, seo images | Image optimization analysis for SEO and performance. Checks alt text, file sizes, formats, responsive images, lazy loading, and CLS preve... |
| seo-page | .claude/skills/seo-page/ | analyze this page, check page SEO, seo page | Deep single-page SEO analysis covering on-page elements, content quality, technical meta tags, schema, images, and performance. Use when ... |
| seo-plan | .claude/skills/seo-plan/ | SEO strategy, site architecture, SEO roadmap, content strategy, SEO plan, seo plan | Strategic SEO planning for new or existing websites. Industry-specific templates, competitive analysis, content strategy, and implementat... |
| seo-programmatic | .claude/skills/seo-programmatic/ | seo programmatic, template pages, programmatic SEO, generated pages, pages at scale, dynamic pages | Programmatic SEO planning and analysis for pages generated at scale from data sources. Covers template engines, URL patterns, internal li... |
| seo-schema | .claude/skills/seo-schema/ | structured data, rich results, seo schema, markup, schema, JSON-LD | Detect, validate, and generate Schema.org structured data. JSON-LD format preferred. Use when user says "schema", "structured data", "ric... |
| seo-sitemap | .claude/skills/seo-sitemap/ | generate sitemap, sitemap issues, seo sitemap, sitemap, XML sitemap | Analyze existing XML sitemaps or generate new ones with industry templates. Validates format, URLs, and structure. Use when user says "si... |
| seo-technical | .claude/skills/seo-technical/ | robots.txt, site speed, seo technical, crawl issues, Core Web Vitals, technical SEO | Technical SEO audit across 9 categories: crawlability, indexability, security, URL structure, mobile, Core Web Vitals, structured data, J... |
| site-architecture | .claude/skills/site-architecture/ | site architecture,  , s page hierarchy, navigation, URL structure, or internal linking. Also use when the user mentions  | When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal linking. Also use... |

### Email (6)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| email-audit | .claude/skills/email-audit/ | email audit | Audits email domain deliverability setup (SPF, DKIM, DMARC, MX records, blacklists, TLS) and generates health score (0-100) with prioriti... |
| email-check | .claude/skills/email-check/ | s urgent, or get reply suggestions. Triggers on check email, inbox triage, what, email check | Intelligent inbox triage that connects to Gmail or Outlook, scores emails by importance (0-100) using sender recognition, urgency keyword... |
| email-plan | .claude/skills/email-plan/ | email plan | Generate comprehensive email marketing strategy with 90-day implementation roadmap. Analyzes business type (local-business, saas, ecommer... |
| email-review | .claude/skills/email-review/ | email review | Pre-send email quality review and scoring across 5 dimensions (subject line, copy quality, technical/HTML, deliverability, compliance). A... |
| email-sequence | .claude/skills/email-sequence/ | drip campaign,, welcome sequence,, onboarding emails,, email sequence, nurture sequence,, email sequence, | When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email program. Also use wh... |
| email-write | .claude/skills/email-write/ | email write | Compose high-converting emails using proven copy frameworks (PAS, AIDA, BAB, FAB, 4Ps). Generates subject line variants with scores, resp... |

### Social Media (8)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| carousel | .claude/skills/carousel/ | slides, instagram carousel, karussell, carousel, IG slides | Generate branded Instagram carousels from topic/content using {User}'s brand assets, HTML rendering, and Playwright screenshots |
| instagram-caption-generator | .claude/skills/instagram-caption-generator/ | instagram caption generator | Generate engaging, platform-optimized Instagram captions for images, carousels, and reels tailored by niche and audience. Use when users ... |
| linkedin-post-formatter | .claude/skills/linkedin-post-formatter/ | linkedin post formatter | Transform rough ideas into polished, engagement-optimized LinkedIn posts with proper formatting, hooks, and calls-to-action. Use when use... |
| reel-template | .claude/skills/reel-template/ | reel machen, reel, tiktok script, reel script, viral format, reel template | Instagram/TikTok Reel script templates based on proven viral formats from analyzed creator videos |
| social-content | .claude/skills/social-content/ | social content, Twitter thread,, LinkedIn post,, content calendar,, social media,, social scheduling, | When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, o... |
| social-media-bio-writer | .claude/skills/social-media-bio-writer/ | social media bio writer | Create concise, compelling social media bios optimized for different platforms (LinkedIn, Twitter/X, Instagram, TikTok). Use when users n... |
| tweet-thread-generator | .claude/skills/tweet-thread-generator/ | tweet thread generator | Generate engaging Twitter/X threads that build narrative, drive engagement, and deliver value in digestible chunks. Use when users need t... |
| youtube-script-outliner | .claude/skills/youtube-script-outliner/ | youtube script outliner | Create structured video script outlines optimized for viewer retention and engagement. Use when users need YouTube scripts, video outline... |

### Marketing & Sales (18)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| ab-test-setup | .claude/skills/ab-test-setup/ | A/B test,, experiment,, ab test setup, split test,, variant copy,, test this change, | When the user wants to plan, design, or implement an A/B test or experiment. Also use when the user mentions "A/B test," "split test," "e... |
| ad-creative | .claude/skills/ad-creative/ | ad copy variations,, ad creative, generate headlines,, ad creative,, bulk ad copy,, RSA headlines, | When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad variations — for any p... |
| analytics-tracking | .claude/skills/analytics-tracking/ | analytics tracking, GA4,, set up tracking,, event tracking,, Google Analytics,, conversion tracking, | When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions "set up tracking," "... |
| cold-email | .claude/skills/cold-email/ | email to leads,, reach out to prospects,, prospecting email,, cold outreach,, outbound email,, cold email | Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails, prospecting emails... |
| competitor-alternatives | .claude/skills/competitor-alternatives/ | competitor comparison,, comparison page,, vs page,, [Product] vs [Product],, alternative page,, competitor alternatives | When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when the user mentions 'a... |
| free-tool-strategy | .claude/skills/free-tool-strategy/ | marketing tool,, engineering as marketing,, generator,, free tool,, free tool strategy, calculator, | When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or brand awareness. Also... |
| launch-strategy | .claude/skills/launch-strategy/ | launch,, announcement,, launch strategy, go-to-market,, feature release,, Product Hunt, | When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user mentions 'launch,' 'Produ... |
| lead-magnets | .claude/skills/lead-magnets/ | downloadable,, gated content,, content upgrade,, lead magnet,, lead magnets, ebook, | When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the user mentions "lea... |
| marketing-ideas | .claude/skills/marketing-ideas/ | marketing strategies,, marketing tactics,, growth ideas,, marketing ideas, marketing ideas,, how to market, | When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the user asks for 'mark... |
| marketing-psychology | .claude/skills/marketing-psychology/ | psychology,, persuasion,, mental models,, marketing psychology, cognitive bias,, behavioral science, | When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when the user mentions... |
| page-cro | .claude/skills/page-cro/ | conversion rate optimization,, this page isn, page cro, CRO,,   | When the user wants to optimize, improve, or increase conversions on any marketing page — including homepage, landing pages, pricing page... |
| paid-ads | .claude/skills/paid-ads/ | CPA,, ROAS,, paid media,, PPC,, ad campaign,, paid ads | When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X, or other ad platf... |
| podcast-show-notes-generator | .claude/skills/podcast-show-notes-generator/ | podcast show notes generator | Create comprehensive podcast show notes with timestamps, key takeaways, guest info, and resource links. Use when users need episode descr... |
| pricing-strategy | .claude/skills/pricing-strategy/ | pricing strategy, free trial,, packaging,, pricing tiers,, freemium,, pricing, | When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions 'pricing,' 'pricing... |
| product-description-writer | .claude/skills/product-description-writer/ | product description writer | Create compelling e-commerce product descriptions that drive conversions across multiple length formats (short, medium, long). Use when u... |
| product-marketing-context | .claude/skills/product-marketing-context/ | who is my target audience,, product context,, product marketing context, positioning,, marketing context,, set up context, | When the user wants to create or update their product marketing context document. Also use when the user mentions 'product context,' 'mar... |
| referral-program | .claude/skills/referral-program/ | referral program, word of mouth,, ambassador,, referral,, viral loop,, affiliate, | When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. Also use when the u... |
| sales-enablement | .claude/skills/sales-enablement/ | objection handling,, sales deck,, leave-behind,, one-pager,, sales enablement, pitch deck, | When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also use when the user... |

### Development (13)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| code-garden | .claude/skills/code-garden/ | algorithmic art system, generative art, generative kunst, code garden, hardware art, autonome kunst | Generative art system using hardware metrics and algorithmic processes as creative inputs - autonomous art creation |
| executing-plans | .claude/skills/executing-plans/ | executing plans | Use when you have a written implementation plan to execute in a separate session with review checkpoints |
| receiving-code-review | .claude/skills/receiving-code-review/ | receiving code review | Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionabl... |
| requesting-code-review | .claude/skills/requesting-code-review/ | requesting code review | Use when completing tasks, implementing major features, or before merging to verify work meets requirements |
| spec-to-implementation | .claude/skills/spec-to-implementation/ | spec to implementation | Parse specifications and create implementation plans with task tracking in Notion |
| subagent-driven-development | .claude/skills/subagent-driven-development/ | subagent driven development | Use when executing implementation plans with independent tasks in the current session |
| systematic-debugging | .claude/skills/systematic-debugging/ | systematic debugging | Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes |
| test-driven-development | .claude/skills/test-driven-development/ | test driven development | Use when implementing any feature or bugfix, before writing implementation code |
| verification-before-completion | .claude/skills/verification-before-completion/ | verification before completion | Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands a... |
| writing-plans | .claude/skills/writing-plans/ | writing plans | Use when you have a spec or requirements for a multi-step task, before touching code |

### GitHub & DevOps (8)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| finishing-a-development-branch | .claude/skills/finishing-a-development-branch/ | finishing a development branch | Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development ... |
| using-git-worktrees | .claude/skills/using-git-worktrees/ | using git worktrees | Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated gi... |

### Design & Creative (5)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| algorithmic-art | .claude/skills/algorithmic-art/ | algorithmic art | Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating a... |
| canvas-design | .claude/skills/canvas-design/ | canvas design | Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a ... |
| ui-ux-pro-max | .claude/skills/ui-ux-pro-max/ | ui ux pro max | UI/UX design intelligence for web and mobile. Includes 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guideli... |
| video-remotion | .claude/skills/video-remotion/ | video generieren, programmatic video, project animation, remotion, video automatisch, video remotion | Generate programmatic videos using Remotion (React video framework) for portfolio reels, animations, social content |
| website-clone-analyze | .claude/skills/website-clone-analyze/ | website clone analyze, website analysieren, wie haben die das gemacht, seite analysieren, source code analyse, design inspiration | Deep website analysis using source code + screenshots + visual inspection for design inspiration and reconstruction |

### Documents (4)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| docx | .claude/skills/docx/ | Word doc, docx, memo, word document, .docx, report | Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files). Triggers include: any mention o... |
| pdf | .claude/skills/pdf/ | pdf | Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combinin... |
| pptx | .claude/skills/pptx/ | presentation,\, pptx, slides,\, deck,\ | Use this skill any time a .pptx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks... |
| xlsx | .claude/skills/xlsx/ | xlsx, the xlsx in my downloads\ | Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit,... |

### Research & Analysis (3)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| batch-import | .claude/skills/batch-import/ | batch import | Batch Import - Process Multiple Videos |
| research-summary | .claude/skills/research-summary/ | research summary | Research Summary - Meta-Analysis Generator |
| video-import | .claude/skills/video-import/ | video import | Video Import - Multi-Platform Knowledge Extractor |

### Workflow & Automation (17)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| brainstorming | .claude/skills/brainstorming/ | brainstorming | You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explore... |
| browser | .claude/skills/browser/ | /browser, browse, screenshot, navigate, browser, scrape | Web browser automation with AI-optimized snapshots |
| delegate-task | .claude/skills/delegate-task/ | delegate task | Delegate tasks to OpenSpace — a full-stack autonomous worker for coding, DevOps, web research, and desktop automation, backed by an exten... |
| dispatching-parallel-agents | .claude/skills/dispatching-parallel-agents/ | dispatching parallel agents | Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies |
| firecrawl-web | .claude/skills/firecrawl-web/ | firecrawl web | Fetch web content, take screenshots, extract structured data, search the web, and crawl documentation sites. Use when the user needs curr... |
| knowledge-capture | .claude/skills/knowledge-capture/ | knowledge capture | Transform conversations and discussions into structured Notion documentation |
| meeting-intelligence | .claude/skills/meeting-intelligence/ | meeting intelligence | Prepare for meetings by gathering context and creating comprehensive agendas |
| memory-dream | .claude/skills/memory-dream/ | aufraeumen, dream, memory cleanup, memory aufraeumen, memory dream, deduplizieren | Memory hygiene and maintenance - merge duplicates, resolve contradictions, update stale info, compress index, optimize CLAUDE.md |
| playwright-skill | .claude/skills/playwright-skill/ | playwright skill | Complete browser automation with Playwright. Auto-detects dev servers, writes clean test scripts to /tmp. Test pages, fill forms, take sc... |
| research-documentation | .claude/skills/research-documentation/ | research documentation | Research topics and document findings in Notion with organized structure and sources |
| skill-builder | .claude/skills/skill-builder/ | skill builder | Create new Claude Code Skills with proper YAML frontmatter, progressive disclosure structure, and complete directory organization. Use wh... |
| skill-discovery | .claude/skills/skill-discovery/ | skill discovery | Search for reusable skills across OpenSpace's local registry and cloud community. Reusing proven skills saves tokens, improves reliabilit... |
| using-superpowers | .claude/skills/using-superpowers/ | using superpowers | Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response includin... |
| writing-skills | .claude/skills/writing-skills/ | writing skills | Use when creating new skills, editing existing skills, or verifying skills work before deployment |

## Special: claude-mem (plugin)

`claude-mem` is a third-party plugin containing 5 sub-skills (do, make-plan, mem-search, smart-explore, timeline-report).
These are nested one level deeper and follow a different discovery pattern.

### Studio Tools (4) — NEW

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| ae-automation | .claude/skills/ae-automation/ | After Effects, AE, batch render, ExtendScript, aerender, motion graphics | Automate Adobe After Effects via ExtendScript (.jsx), aerender CLI, and Computer Use for batch rendering, composition creation, footage i... |
| osc-control | .claude/skills/osc-control/ | Resolume, MadMapper, OSC, VJ, video mapping, live visuals, projection | Control Resolume Arena and MadMapper via OSC using python-osc. Trigger clips, change effects, control opacity, manage layers for live per... |
| ffmpeg-batch | .claude/skills/ffmpeg-batch/ | ffmpeg, video conversion, Instagram format, thumbnails, time-lapse, reel | Batch process video footage with ffmpeg for Instagram Reels, thumbnails, frame extraction, time-lapses, text overlays, and music mixing |
| gallery-dl | .claude/skills/gallery-dl/ | gallery-dl, ArtStation, Behance, DeviantArt, Pinterest, references, mood board | Download reference material from art platforms (ArtStation, Behance, DeviantArt, Pinterest, Tumblr) using gallery-dl |

### Web Content (1)

| Skill | Path | Triggers | Description |
|-------|------|----------|-------------|
| defuddle | .claude/skills/defuddle/ | defuddle, clean markdown, extract web content, web page to markdown | Extract clean markdown from web pages using Defuddle CLI, removing clutter and navigation to save tokens |
