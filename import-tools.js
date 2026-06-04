// GTOOLS — Sanity Import Script
// Run from mein-archiv/ with:
//   node import-tools.js
//
// Requires: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local

const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");

// Load .env.local manually
const envFile = fs.readFileSync(path.join(__dirname, ".env.local"), "utf8");
envFile.split("\n").forEach((line) => {
  const [key, ...val] = line.split("=");
  if (key && val.length) process.env[key.trim()] = val.join("=").trim();
});

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Category mapping: CSV → Sanity schema
const CATEGORY_MAP = {
  "alternative-software": "alt",
  "fonts": "fonts",
  "small-tech": "small",
  "big-tech": "big",
  "web-constructors": "web",
  "web": "web",
};

// Tag group mapping based on tag value patterns
function mapTagToGroup(tagValue) {
  const tag = tagValue.trim().toLowerCase();
  
  const accessTags = ["free", "freemium", "one-time payment", "student discount", "free trial", "cultural sales", "illegal"];
  const licenseTags = ["open source", "independent authors", "community"];
  const exportTags = ["svg", "png", "pdf", "gif", "mp4", "otf", "jpeg", "stl", "webp", "3d"];
  const platformTags = ["browser", "desktop", "mobile", "tablet", "windows", "mac os", "linux"];
  const rootsTags = ["archive.org", "github repositories", "old applications", "p5.js"];
  const typoTags = ["font prototyping", "variable type", "plugins", "shop"];

  if (accessTags.includes(tag)) return "ACCESS";
  if (licenseTags.includes(tag)) return "LICENSE";
  if (exportTags.includes(tag)) return "EXPORT";
  if (platformTags.includes(tag)) return "PLATFORM";
  if (rootsTags.includes(tag)) return "ROOTS";
  if (typoTags.includes(tag)) return "TYPO";
  return "BROWSER"; // fallback
}

// Default color per group
function groupColor(group) {
  const map = {
    ACCESS: "var(--tag-access-base)",
    LICENSE: "var(--tag-license-base)",
    EXPORT: "var(--tag-export-3)",
    PLATFORM: "var(--tag-platform-base)",
    ROOTS: "var(--tag-roots-base)",
    TYPO: "var(--tag-typo-base)",
    BROWSER: "var(--tag-browser-base)",
  };
  return map[group] || "var(--surface)";
}

// Parse tags string → array of tag objects
function parseTags(tagsStr) {
  if (!tagsStr) return [];
  return tagsStr.split(",").map((t) => t.trim()).filter(Boolean).map((value) => {
    const group = mapTagToGroup(value);
    return { _type: "tag", group, value, color: groupColor(group) };
  });
}

// Format date from YYYY-MM-DD
function formatDate(dateStr) {
  return dateStr ? dateStr.trim() : null;
}

// The 50 tools from CSV
const tools = [
  { id:"1", name:"Graphite", slug:"graphite", url:"https://editor.graphite.rs", functionShort:"Browser-based vector editor with node-based procedural workflow", author:"Keavon Chambers", description:"Fully editable vector graphics in the browser — no Creative Cloud needed. Node-based, procedural, entirely client-side.", category:"alternative-software", tags:"Browser, Free, Open Source, SVG", date:"2025-09-16" },
  { id:"2", name:"Inkscape", slug:"inkscape", url:"https://inkscape.org", functionShort:"Open source desktop alternative to Adobe Illustrator", author:"Bryce Harrington, MenTaLguY, Nathan Hurst, Ted Gould", description:"Completely free open-source vector editor. Import shortcuts from CorelDRAW or Illustrator. Many diverse image filters. No 3D effect option.", category:"alternative-software", tags:"Desktop, Free, Linux, Mac OS, Open Source, PDF, PNG, SVG, Windows", date:"2025-09-16" },
  { id:"3", name:"Kleki", slug:"kleki", url:"https://kleki.com", functionShort:"Completely free online painting tool — no paywalls, no ads", author:"bitbof", description:"No paywalls. Supports PSD, JPEG, PNG, SVG, WEBP, BMP, GIF. Works on tablets. No ads. Inspired by Harmony and early web applets.", category:"alternative-software", tags:"Browser, Free, PNG, Tablet", date:"2025-09-16" },
  { id:"4", name:"Photopea", slug:"photopea", url:"https://photopea.com", functionShort:"Free online Photoshop alternative with ad sidebar", author:"Ivan Kutskir", description:"Full Photoshop-like interface: layers, masks, filters, smart objects, vector tools, AI background removal. Supports PSD, AI, JPEG, SVG, PDF, RAW formats.", category:"alternative-software", tags:"Browser, Free, PDF, PNG, SVG", date:"2025-09-16" },
  { id:"5", name:"Pixlr Editor", slug:"pixlr-editor", url:"https://pixlr.com/de/editor/", functionShort:"Browser-based image editor — freemium model", author:"Ola Sevandersson", description:"Free browser-based Photoshop experience. All edit and export options remain free. Premium version adds AI tools and templates.", category:"alternative-software", tags:"Browser, PNG", date:"2025-09-16" },
  { id:"6", name:"LibreOffice", slug:"libreoffice", url:"https://libreoffice.org/download/download-libreoffice/", functionShort:"Free Microsoft Office alternative including a basic 3D modelling module", author:"The Document Foundation", description:"Downloadable on almost any operating system. Includes Writer, Calc, Impress, and a basic 3D modelling module. Developed by users who believe in Free Software principles.", category:"alternative-software", tags:"3D, Desktop, Free, Linux, Mac OS, Open Source, PDF, Windows", date:"2025-09-16" },
  { id:"7", name:"HOTGLUE", slug:"hotglue", url:"https://hotglue.me", functionShort:"Old-school browser web page constructor — 2000s collage aesthetic", author:"Buro Duplex, Danja Vasiliev, Gottfried Haider", description:"Primitive with a 2000s flashback but more accessible than modern web constructors in some aspects. Alternative to WordPress or Webflow.", category:"web-constructors", tags:"Browser, Community, Free, Old Applications, Open Source", date:"2025-09-16" },
  { id:"8", name:"Schultzschultz Studio", slug:"schultzschultz", url:"https://schultzschultz.com", functionShort:"German design studio — self-initiated graphic and type tools since 2007", author:"Marc Schütz, Ole Schulte", description:"Studio making graphic tools before it became mainstream — from customized typefaces to morphing custom images. Some tools are supported on iPad.", category:"fonts", tags:"Browser, Font Prototyping, Free, Independent Authors, SVG", date:"2025-09-16" },
  { id:"9", name:"Schultzschultz SCRIPTSCRIPT", slug:"schultzschultz-scriptscript", url:"https://schultzschultz.com/tools/scriptscript/", functionShort:"Rounded grid type creator — edit and export QWERTY letterforms as SVG", author:"Schultzschultz", description:"Customizer lets you edit each letter in the QWERTY keyboard set and export SVGs. Randomize shape, size, baseline, letter height, and other type parameters.", category:"fonts", tags:"Browser, Font Prototyping, Free, Independent Authors, SVG", date:"2025-09-16" },
  { id:"10", name:"Schultzschultz GRIDPAINT", slug:"schultzschultz-gridpaint", url:"https://schultzschultz.com/tools/gridpaint/", functionShort:"Browser-based grid painting tool — pixel-art and sketching on custom grids", author:"Schultzschultz", description:"Paint freely on a custom grid structure. Creates a unique canvas-like space for digital sketching or pixel-art experiments.", category:"small-tech", tags:"Browser, Free, Independent Authors", date:"2025-09-16" },
  { id:"11", name:"ASCIIflow", slug:"asciiflow", url:"https://asciiflow.com", functionShort:"Self-initiated ASCII drawing tool — hosted on GitHub", author:"Lewis Hemens", description:"Originally created by Lewis Hemens — now lives its own quiet life online. Proof that some web-relics never really die.", category:"small-tech", tags:"Archive.org, Browser, Free, GitHub Repositories, Old Applications, Open Source", date:"2025-09-16" },
  { id:"12", name:"LibreOffice Draw", slug:"libreoffice-draw", url:"https://libreoffice.org", functionShort:"Free vector drawing tool included in the LibreOffice suite", author:"The Document Foundation", description:"Basic vector drawing environment included in LibreOffice. Supports SVG, PDF, and common raster formats. Available on Mac, Windows, Linux.", category:"alternative-software", tags:"Desktop, Free, Linux, Mac OS, Open Source, PDF, PNG, SVG, Windows", date:"2025-09-16" },
  { id:"13", name:"Instagram as design tool", slug:"instagram-design-tool", url:"https://instagram.com", functionShort:"Mobile platform as primitive animated type creator using GIFs", author:"Kevin Systrom, Mike Krieger", description:"GIFs from giphy.com and inside Instagram's interface allow users to create animated type. Instagram's editing mode functions as a primitive graphic editor.", category:"small-tech", tags:"Free, Mobile", date:"2025-09-16" },
  { id:"14", name:"Burrow Lab Demo Type Tool", slug:"burrow-lab", url:"https://burrowlab.com/demo/", functionShort:"Parametric online type prototyping tool with OTF export", author:"Philipp Koller", description:"Animate outlines, export for free, plug in custom shapes from your own vectors. Stylize glyphs in real time using a slider-based toolkit. Export as Static or Variable OTF.", category:"fonts", tags:"Browser, Font Prototyping, Free, Independent Authors, SVG, Variable Type", date:"2025-09-16" },
  { id:"15", name:"Cooltext", slug:"cooltext", url:"https://cooltext.com", functionShort:"2000s animated type effects — fire, neon, retro logos", author:"Bryan Livingston, Livingston Technologies", description:"64 free animated type mockups from fire-style type to classic neon logos. More free fonts sorted by effect. Exportable as GIF or PNG.", category:"fonts", tags:"Browser, Free, GIF, Old Applications, PNG", date:"2025-09-16" },
  { id:"16", name:"Tinkercad", slug:"tinkercad", url:"https://tinkercad.com", functionShort:"Low-core browser-based 3D editor and animation tool", author:"Kai Backman, Mikko Mononen", description:"Limited 3D editor in browser with a big learning and community approach. Combine simple geometric shapes for 3D printing. Export as STL or OBJ. Animate objects.", category:"alternative-software", tags:"3D, Browser, Community, Free, STL", date:"2025-09-16" },
  { id:"17", name:"Diagrams.net", slug:"diagrams-net", url:"https://app.diagrams.net", functionShort:"Free online infographic and diagram tool — unlimited expanding canvas", author:"Gaudenz Alder, JGraph Ltd.", description:"Charts, mind maps, diagrams, and type experiments. Artboard expands automatically. Export: PNG, JPEG, SVG, PDF, XML.", category:"alternative-software", tags:"Browser, Free, JPEG, Open Source, PDF, PNG, SVG", date:"2025-09-16" },
  { id:"19", name:"StippleGen", slug:"stipplegen", url:"https://wiki.evilmadscientist.com/StippleGen", functionShort:"Dotted threshold image generator — originally for the EggBot plotter", author:"Windell H. Oskay", description:"Export SVGs or editable data. Control many parameters. Originally created for the EggBot, a plotter designed to draw on chicken eggs.", category:"small-tech", tags:"Archive.org, Free, Independent Authors, Old Applications, Open Source, SVG", date:"2025-09-16" },
  { id:"20", name:"Bookbinder JS", slug:"bookbinder-js", url:"https://momijizukamori.github.io/bookbinder-js/", functionShort:"PDF page formatter for bookbinding — no Acrobat needed", author:"momijizukamori", description:"Generates the correct PDF page order for bookbinding. Useful without access to Adobe Acrobat or InDesign.", category:"small-tech", tags:"Browser, Free, GitHub Repositories, Open Source, PDF", date:"2025-09-16" },
  { id:"21", name:"Paper.js", slug:"paper-js", url:"https://paperjs.org", functionShort:"Open source vector graphic scripting framework on HTML5 Canvas", author:"Jürg Lehni, Jonathan Puckey", description:"Port of Scriptographer to the web. Clean scene-graph model for interactive and animated drawings. Written in JavaScript, built on HTML5 Canvas.", category:"small-tech", tags:"Browser, Free, Open Source, p5.js, SVG", date:"2025-09-16" },
  { id:"22", name:"FontForge", slug:"fontforge", url:"https://fontforge.org", functionShort:"Open source font editor — 25-year-old alternative to Glyphs", author:"George Williams", description:"More technical compared to Mac-polished Glyphs. Wide tutorial support on YouTube. Available on Mac, Windows, and Linux.", category:"fonts", tags:"Desktop, Font Prototyping, Free, Linux, Mac OS, Open Source, Windows", date:"2025-09-16" },
  { id:"24", name:"PrePostPrint", slug:"prepostprint", url:"https://prepostprint.org/resources/", functionShort:"Community platform for experimental publishing with free-licensed tools", author:"Antoine Fauchié, Kiara Jouhanneau, Quentin Juhel, Martin Lemaire", description:"Label and website promoting tools published under free software licenses. Platform for sharing projects, workflows, and DIY alternatives to proprietary publishing.", category:"small-tech", tags:"Browser, Community, Free, Independent Authors, Open Source", date:"2025-09-16" },
  { id:"25", name:"Hackers & Designers Tools", slug:"h-and-d-tools", url:"https://hackersanddesigners.nl/tools/", functionShort:"Experimental and subversive tools — community-driven open-source collective", author:"H&D collective", description:"Etherpad, Ethercalc, ChattyPub, NDSMpaper, Emoji Tour, Momentary Zine. Community-driven DIY approaches that challenge commercial design platform standards.", category:"small-tech", tags:"Browser, Community, Free, Independent Authors, Open Source", date:"2025-09-16" },
  { id:"27", name:"Tooooools", slug:"tooooools", url:"https://tooooools.app", functionShort:"Lo-fi image and video effects — dithering, halftone, stipple, gradients", author:"Daniil Sukhovskoy", description:"Free for personal and commercial use. Apply classic dithering, stippling, halftone, patterns, and gradients — also works with videos. Export: SVG, PNG, MP4, GIF.", category:"small-tech", tags:"Browser, Free, GIF, Independent Authors, MP4, PNG, SVG", date:"2025-09-16" },
  { id:"28", name:"Semplice", slug:"semplice", url:"https://semplice.com", functionShort:"Portfolio web constructor — WordPress plugin, one-time payment, no ads", author:"Tobias van Schneider", description:"No ads. One-time payment only. Well-designed interface combining graphic editing workflows with HTML box flexibility.", category:"web-constructors", tags:"Browser, One-Time Payment, Plugins", date:"2025-09-16" },
  { id:"29", name:"Laytheme", slug:"laytheme", url:"https://laytheme.com", functionShort:"Portfolio web constructor — WordPress plugin with integrated shop support", author:"100k Studio GmbH", description:"No ads. One-time payment only. Animated and non-animated templates. Integrated shop support. Suited for small commercial projects by non-coding graphic designers.", category:"web-constructors", tags:"Browser, One-Time Payment, Plugins, Shop", date:"2025-09-16" },
  { id:"30", name:"ANTLII Sampl-Tool", slug:"antlii-sampl-tool", url:"https://antlii.work/sampl-tool/", functionShort:"Web animated type generator — one-time payment per tool", author:"Anatolii Babii", description:"Animated controllable presets for quick entry. Export as SVG, MP4, PNG, or WebP sequences. Import custom typefaces. Save all settings as JSON.", category:"fonts", tags:"Browser, Font Prototyping, Independent Authors, MP4, One-Time Payment, PNG, SVG, Variable Type", date:"2025-09-16" },
  { id:"32", name:"SumoPaint", slug:"sumo-paint", url:"https://sumopaint.com", functionShort:"Online painting tool — freemium, AI features on credits", author:"Lauri Koutaniemi, Andrea Giannini", description:"Painting in the browser. Basic plan covers most functions. Raster-based editor. Limited export functions. AI-powered features are credit-limited.", category:"alternative-software", tags:"Browser, PNG", date:"2025-09-16" },
  { id:"34", name:"Harmony", slug:"harmony", url:"https://mrdoob.github.io/harmony/#ribbon/", functionShort:"Minimalistic browser drawing tool — 11 brushes, open source code", author:"Ricardo Cabello (Mr.doob)", description:"Kleki's toolbrush was inspired by Harmony. Offers six buttons and eleven brushes plus a few shortcuts. Code is available to explore on GitHub.", category:"small-tech", tags:"Browser, Free, GitHub Repositories, Old Applications, Open Source", date:"2025-09-16" },
  { id:"35", name:"Enfont", slug:"enfont", url:"https://enfont.javierarce.com", functionShort:"Drag and drop font shaker — OTF distortion with multiple filters", author:"Javier Arce", description:"Upload any OTF font and shake it up with filters: Rotator, Zigzag, Wave, Pendulum, Boing Boing. Play with x- and y-height parameters.", category:"fonts", tags:"Browser, Font Prototyping, Free, Independent Authors", date:"2025-09-16" },
  { id:"36", name:"Javier Bórquez Studio", slug:"javier-borquez", url:"https://javier.xyz", functionShort:"Designer-developer making experimental creative web tools — blog-based", author:"Javier Bórquez", description:"Experimental tools and interfaces ranging from research websites to a custom 3D modeller in the browser. Blog-based with sources and tools openly provided.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source", date:"2025-09-16" },
  { id:"37", name:"Pintr", slug:"pintr", url:"https://javier.xyz/pintr/", functionShort:"SVG plotter-style outline generator — fully local, private processing", author:"Javier Bórquez", description:"Drag and drop your image to export a plotter-like line drawing in SVG. All processing is done locally — your images never leave your computer.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source, SVG", date:"2025-09-16" },
  { id:"38", name:"Droste Creator", slug:"droste-creator", url:"https://javier.xyz/droste-creator/", functionShort:"Recursive image generator — Droste effect, mise en abyme", author:"Javier Bórquez", description:"Tool for generating recursive images. Loop images with or without eternal recursive animation. Screen recording recommended to capture video output.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source", date:"2025-09-16" },
  { id:"39", name:"Brutalita", slug:"brutalita", url:"https://brutalita.com", functionShort:"Real-time browser font editor — design on a grid, export as OTF", author:"Javier Bórquez", description:"Design on a grid and create your own monotype cut from scratch by connecting grid points to form letter shapes. Uses OpenType.js to generate .otf files for export.", category:"fonts", tags:"Browser, Font Prototyping, Free, GitHub Repositories, Open Source", date:"2025-09-16" },
  { id:"40", name:"Synthymental", slug:"synthymental", url:"https://synthymental.com", functionShort:"Creative coding blog and self-initiated tools — object tracking, pixel effects", author:"Daniil Svetlov", description:"Senior Motion Designer and Creative Coder. Large YouTube tutorial library. Self-initiated tools including object tracking systems and glitchy pixel distortions.", category:"small-tech", tags:"Browser, Free, Independent Authors", date:"2025-09-16" },
  { id:"41", name:"Synthymental Vision", slug:"synthymental-vision", url:"https://synthymental.com/vision/", functionShort:"Live object tracking via webcam — browser-based AI vision tool", author:"Daniil Svetlov", description:"Ready-made video tracker in the browser. Tracks object types online or via webcam. Tracking dialogue windows and color boxes can be changed.", category:"small-tech", tags:"Browser, Free, Independent Authors", date:"2025-09-16" },
  { id:"42", name:"Constraint Systems", slug:"constraint-systems", url:"https://constraint.systems", functionShort:"Collection of 35 experimental browser-based creative tools with source files", author:"Grant Custer", description:"Experimental tools: image distorters, freeform text editors, weird website builders. Each tool has its own interface logic and shortcuts. Source files provided.", category:"small-tech", tags:"Browser, Free, GitHub Repositories, Independent Authors, Open Source, PNG", date:"2025-09-16" },
  { id:"43", name:"Constraint Systems / Flow", slug:"constraint-systems-flow", url:"https://flow.constraint.systems", functionShort:"Streaming pixel animator — animate rows of an uploaded image", author:"Grant Custer", description:"Define grids of an uploaded picture and animate rows of pixels. Creates Tetris-like sequences from a still image. Only PNG export available.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source, PNG", date:"2025-09-16" },
  { id:"44", name:"Constraint Systems / Collapse", slug:"constraint-systems-collapse", url:"https://collapse.constraint.systems", functionShort:"Pixel deconstructor — iterative superpixel collapse with PNG export", author:"Grant Custer", description:"Deconstruct raster images through mixed pixels. Upload custom footage and export as PNG. Accessible on mobile and tablet.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source, PNG", date:"2025-09-16" },
  { id:"45", name:"Constraint Systems / Moire", slug:"constraint-systems-moire", url:"https://moire.constraint.systems", functionShort:"Outline driving game — inspired by Asteroids and Bruno Munari", author:"Grant Custer", description:"Drive the whole screen with outlines. Inspired by Asteroids (Atari, 1979) and Bruno Munari's Xerographies.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source", date:"2025-09-16" },
  { id:"46", name:"Anime.js", slug:"anime-js", url:"https://animejs.com", functionShort:"Lightweight JavaScript animation library — open source, Draggable API", author:"Brandon Stosuy", description:"Animate HTML, CSS, SVG, and JS objects with smooth transitions or text effects. General-purpose animation engine for the web.", category:"small-tech", tags:"Browser, Community, Free, Open Source", date:"2025-09-16" },
  { id:"47", name:"The Creative Independent", slug:"the-creative-independent", url:"https://thecreativeindependent.com", functionShort:"Monospace editorial platform — interviews and wisdom for creative people", author:"Brandon Stosuy", description:"Reduced monospace social media with interviews, essays, guides, wisdom, and zines. Weekly how-to guides featuring different types of working artists.", category:"small-tech", tags:"Browser, Community, Free, Independent Authors", date:"2025-09-16" },
  { id:"48", name:"QR Draw", slug:"qr-draw", url:"https://research.swtch.com/qr/draw/", functionShort:"Picture-based QR code generator — drag and drop image into QR", author:"Russ Cox", description:"Drag and drop a high-contrast image to generate a pixelated silhouette of the motif integrated into a scannable QR code.", category:"small-tech", tags:"Browser, Free, Independent Authors, Open Source, SVG", date:"2025-09-16" },
  { id:"49", name:"p5.js", slug:"p5js", url:"https://p5js.org", functionShort:"JavaScript creative coding library — web-based reinterpretation of Processing", author:"Lauren Lee McCarthy, Processing Foundation", description:"Starts with the original goal of Processing — to make coding accessible for artists, designers, educators, and beginners — and reinterprets this for today's web.", category:"small-tech", tags:"Browser, Community, Free, GitHub Repositories, Open Source, p5.js, PNG, SVG", date:"2025-09-16" },
  { id:"50", name:"Processing", slug:"processing", url:"https://processing.org", functionShort:"Java-based creative coding environment — the root of p5.js", author:"Casey Reas, Ben Fry", description:"Developed in 2001 to create an environment where users could learn programming through direct visual feedback. The open-source predecessor of p5.js.", category:"small-tech", tags:"Community, Desktop, Free, GitHub Repositories, Open Source, p5.js, PNG, SVG", date:"2025-09-16" },
];

async function importTools() {
  console.log("Starting GTOOLS import...\n");

  // Collect unique author names
  const authorNames = [...new Set(tools.map((t) => t.author))];
  const authorRefs = {};

  // 1. Create authors
  console.log(`Creating ${authorNames.length} authors...`);
  for (const name of authorNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const doc = {
      _type: "author",
      _id: `author-${slug}`,
      name,
      slug: { _type: "slug", current: slug },
    };
    await client.createOrReplace(doc);
    authorRefs[name] = { _type: "reference", _ref: `author-${slug}` };
    process.stdout.write(".");
  }
  console.log("\n✅ Authors done\n");

  // 2. Create tools
  console.log(`Creating ${tools.length} tools...`);
  for (const tool of tools) {
    const category = CATEGORY_MAP[tool.category] || "alt";
    const tags = parseTags(tool.tags);
    const authorRef = authorRefs[tool.author];

    const doc = {
      _type: "tool",
      _id: `tool-${tool.slug}`,
      title: tool.name,
      slug: { _type: "slug", current: tool.slug },
      url: tool.url,
      category,
      author: authorRef,
      functionLabel: "Function:",
      functionValue: tool.functionShort,
      description: tool.description,
      tags,
      editedAt: tool.date,
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ ${tool.name}`);
  }

  console.log("\n✅ All 50 tools imported!\n");
  console.log("Open http://localhost:3333 to see them in Sanity Studio.");
}

importTools().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});