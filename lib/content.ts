export const SECTIONS = [
  { id: "player", no: "01", name: "Player", hud: "CHARACTER" },
  { id: "arsenal", no: "02", name: "Arsenal", hud: "WEAPON WHEEL" },
  { id: "missions", no: "03", name: "Missions", hud: "MISSIONS" },
  { id: "heist", no: "04", name: "The Job", hud: "HEIST PLANNING" },
  { id: "story", no: "05", name: "Story", hud: "STORY MODE" },
  { id: "garage", no: "06", name: "Garage", hud: "GARAGE" },
  { id: "contact", no: "07", name: "Contact", hud: "PHONE" }
] as const;
export type SectionId = typeof SECTIONS[number]["id"];
export const SECTION_TOTAL = String(SECTIONS.length).padStart(2, "0");

const GH = "https://github.com/kiruba11k/";

export const LINKS = {
  email: "mailto:kiruba11geo@gmail.com",
  emailLabel: "kiruba11geo@gmail.com",
  linkedin: "https://www.linkedin.com/in/kirubakaranperiyasamy/",
  github: "https://github.com/kiruba11k"
};

/** Headlines for the Vice Coast News ticker. Every line maps to a real result. */
export const NEWS = [
  "BREAKING: Local engineer ships 3 GenAI automation tools to production",
  "Manual work down ~40% after AI pipelines go live at LeadStrategus",
  "Mistral-7B spotted wearing LoRA adapters; SFT quality up 35%",
  "10+ data sources and APIs now flow through one ingestion pipeline",
  "Traffic cameras learn to count: cars, bikes, buses and trucks tracked live",
  "Parcel damage caught on the conveyor before dispatch, say inspectors",
  "8+ Django REST endpoints connect AI inference to real-time apps",
  "Hybrid FAISS + BM25 retrieval keeps the chatbot honest"
];

export const STATS = [
  { label: "Deep learning", value: 92 },
  { label: "GenAI · LLMs", value: 89 },
  { label: "Computer vision", value: 86 },
  { label: "Backend APIs", value: 78 },
  { label: "Data pipelines", value: 74 },
  { label: "MLOps", value: 70 }
];

export const ACHIEVEMENTS = [
  { value: "3", label: "GenAI tools shipped", code: "GEN" },
  { value: "~40%", label: "less manual work", code: "OPS" },
  { value: "10+", label: "sources & APIs wired", code: "API" },
  { value: "35%", label: "SFT quality lift", code: "SFT" }
];

export type Proof = { what: string; result: string; href?: string };

export const ARSENAL: {
  id: string; slot: string; name: string; glyph: string; level: number; ammo: string; ammoLabel: string;
  note: string; skills: string[]; proof: Proof[];
}[] = [
  { id: "ml", slot: "Rifle", name: "Machine learning", glyph: "▲", level: 8, ammo: "3", ammoLabel: "frameworks in daily use",
    note: "Training, evaluating and debugging deep neural networks end to end.",
    skills: ["Python", "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "NumPy", "Pandas"],
    proof: [
      { what: "ML/DL models at LeadStrategus", result: "Built and evaluated with PyTorch, TensorFlow and scikit-learn" },
      { what: "ImageSegmentation", result: "U-Net trained from scratch in TensorFlow/Keras", href: GH + "ImageSegmentation" },
      { what: "Amazon sales analytics", result: "Pandas EDA feeding a Power BI dashboard", href: GH + "Analyzing-Amazon-Sales-Data" }
    ] },
  { id: "vision", slot: "Scope", name: "Computer vision", glyph: "◎", level: 7, ammo: "4", ammoLabel: "vehicle classes tracked",
    note: "Detection, segmentation and multi-object tracking on live video.",
    skills: ["OpenCV", "YOLO", "CNNs", "U-Net", "Mask R-CNN", "ByteTrack"],
    proof: [
      { what: "ParcelGuard", result: "Detect, segment, track and compare to flag parcel damage" },
      { what: "Smart Traffic Intelligence", result: "Persistent IDs and virtual-line counting with ByteTrack" },
      { what: "ImageSegmentation", result: "Pixel-level masks with an encoder/decoder U-Net", href: GH + "ImageSegmentation" }
    ] },
  { id: "llm", slot: "Launcher", name: "LLMs & RAG", glyph: "✦", level: 9, ammo: "7B", ammoLabel: "parameters fine-tuned",
    note: "Agents, retrieval pipelines and parameter-efficient fine-tuning.",
    skills: ["LLMs", "RAG", "LangChain", "LangGraph", "LoRA / QLoRA", "PEFT", "FAISS"],
    proof: [
      { what: "Mistral-7B LoRA / QLoRA", result: "5K domain pairs, 35% SFT quality lift, published to HF Hub" },
      { what: "Fitness Chatbot Agentic RAG", result: "Tool-using agent graph with LangGraph", href: GH + "Fitness-Chatbot-Agentic-Rag" },
      { what: "TextScrapping RAG", result: "Hybrid FAISS + BM25 retrieval", href: GH + "TextScrapping-RAG" }
    ] },
  { id: "nlp", slot: "Radio", name: "Language & documents", glyph: "≋", level: 7, ammo: "5K", ammoLabel: "training pairs curated",
    note: "Text understanding, embeddings and document extraction.",
    skills: ["Transformers", "BERT", "Hugging Face", "Embeddings", "BM25", "OCR"],
    proof: [
      { what: "Invoice Data Extraction AI App", result: "GenAI pulls structured fields from invoices", href: GH + "Invoice-Data-Extraction-AI-App" },
      { what: "Multi-PDF Chatbot", result: "Chat across many PDFs with LangChain + FAISS", href: GH + "Multi-PDF-Chatbot" }
    ] },
  { id: "backend", slot: "Wrench", name: "Backend & APIs", glyph: "⌘", level: 7, ammo: "8+", ammoLabel: "REST APIs designed",
    note: "Serving models behind dependable, documented interfaces.",
    skills: ["FastAPI", "Django REST", "Streamlit", "REST", "SQL"],
    proof: [
      { what: "Cerina GPT at Tecosys", result: "8+ Django REST APIs linking inference to live workflows" },
      { what: "GenAI tools at LeadStrategus", result: "3 internal tools shipped and in daily use" }
    ] },
  { id: "ops", slot: "Vehicle", name: "Data & delivery", glyph: "⬢", level: 6, ammo: "10+", ammoLabel: "sources ingested",
    note: "Ingestion pipelines, packaging, deployment and experiment tracking.",
    skills: ["Docker", "AWS", "Weights & Biases", "Git", "Linux"],
    proof: [
      { what: "Data ingestion at LeadStrategus", result: "10+ sources and APIs, ~40% less manual work" },
      { what: "Fine-tuning runs", result: "Every experiment tracked in Weights & Biases" }
    ] }
];

export type MissionScene = "parcel" | "traffic" | "llm";
export const MISSIONS: {
  no: string; scene: MissionScene; tag: string; title: string; desc: string; stack: string[];
  objectives: string[]; results: [string, string][]; difficulty: number; href: string;
}[] = [
  { no: "01", scene: "parcel", tag: "Computer vision · Inspection", title: "ParcelGuard",
    desc: "A visual inspection system combining detection, segmentation, tracking and reference-guided anomaly analysis to identify parcel damage on a moving line.",
    stack: ["YOLO", "Mask R-CNN / U-Net", "ByteTrack", "PyTorch"],
    objectives: ["Detect every parcel on the belt", "Segment the parcel surface", "Track it across frames", "Compare against a clean reference", "Classify the damage"],
    results: [["Models chained", "4"], ["Pipeline", "Detect → Classify"], ["Outcome", "Damage flagged before dispatch"]],
    difficulty: 4, href: LINKS.github },
  { no: "02", scene: "traffic", tag: "Real-time video analytics", title: "Smart Traffic Intelligence",
    desc: "Detects and tracks cars, motorcycles, buses and trucks with persistent identities, virtual-line counting and live traffic analytics.",
    stack: ["YOLO", "OpenCV", "ByteTrack"],
    objectives: ["Detect 4 vehicle classes", "Keep identities across frames", "Count crossings on a virtual line", "Report live lane analytics"],
    results: [["Classes", "4"], ["Tracking", "Persistent IDs"], ["Outcome", "Live per-lane counts"]],
    difficulty: 3, href: LINKS.github },
  { no: "03", scene: "llm", tag: "LLM fine-tuning · NLP", title: "Mistral-7B · LoRA / QLoRA",
    desc: "Fine-tuned a 7B language model on 5K domain pairs with PEFT, tracked every run, and published the model to the Hugging Face Hub.",
    stack: ["Mistral-7B", "PEFT", "W&B", "Hugging Face"],
    objectives: ["Curate 5K domain pairs", "Attach LoRA / QLoRA adapters", "Track every run in W&B", "Evaluate against the base model", "Publish to Hugging Face Hub"],
    results: [["Base", "7B params"], ["Data", "5K pairs"], ["Quality lift", "+35%"]],
    difficulty: 5, href: LINKS.github }
];

/** Heist planning board: the end-to-end way a model gets from idea to production. */
export const HEIST = [
  { id: "scope", step: "Setup 1", title: "Case the joint", role: "Problem framing",
    lines: ["Talk to the people doing the manual work", "Pick the metric that proves it worked", "Decide what 'good enough' means"],
    proof: "~40% less manual work was the target, and the result" },
  { id: "intel", step: "Setup 2", title: "Gather intel", role: "Data engineering",
    lines: ["Ingest from APIs, PDFs, scrapes and databases", "Clean, dedupe and label", "Version the dataset"],
    proof: "10+ sources and APIs feeding one pipeline" },
  { id: "crew", step: "Setup 3", title: "Pick the crew", role: "Modelling",
    lines: ["Baseline first, then YOLO / U-Net / LLM", "LoRA when a full fine-tune is overkill", "RAG when the facts change weekly"],
    proof: "Mistral-7B + LoRA: 35% SFT quality lift" },
  { id: "dry", step: "Setup 4", title: "Dry run", role: "Evaluation",
    lines: ["Hold-out sets and failure review", "Track every run in W&B", "Compare against the base model"],
    proof: "Every fine-tuning run tracked and compared" },
  { id: "score", step: "Finale", title: "The score", role: "Deployment",
    lines: ["Wrap it in FastAPI / Django REST", "Containerise with Docker", "Ship a UI people actually use"],
    proof: "3 GenAI tools shipped · 8+ REST APIs built" }
];

export const RAP_SHEET = {
  charges: [
    { count: "3 counts", text: "Shipping GenAI automation tools to production" },
    { count: "1 count", text: "Grand theft of manual work (~40% taken)" },
    { count: "1 count", text: "Possession of a 7B model with intent to fine-tune" },
    { count: "8+ counts", text: "Building REST APIs without supervision" },
    { count: "Ongoing", text: "Tracking vehicles that never asked to be counted" }
  ],
  associates: ["PyTorch", "LangGraph", "YOLO", "Hugging Face", "FastAPI", "Docker"],
  lastSeen: "Bengaluru, IN · building something new"
};

export const STORY = [
  { when: "Apr 2025 · Now", status: "In progress", kind: "Main story · Bengaluru", role: "AI / ML Engineer", org: "LeadStrategus",
    body: "Building and deploying GenAI automation tools, data-ingestion pipelines and fine-tuned language models. Developing and evaluating ML/DL models with PyTorch, TensorFlow and scikit-learn.",
    wins: ["3 GenAI tools shipped", "~40% less manual work", "10+ sources ingested", "+35% SFT quality"],
    tags: ["GenAI", "ML/DL", "Pipelines", "LLMs"] },
  { when: "Aug 2024 · Sep 2024", status: "Complete", kind: "Side mission · Internship", role: "Django Developer Intern", org: "Tecosys",
    body: "Contributed to Cerina GPT and designed REST APIs connecting AI inference endpoints to real-time application workflows.",
    wins: ["8+ REST APIs designed", "Cerina GPT contributor"],
    tags: ["Python", "Django REST", "APIs"] },
  { when: "2020 · 2024", status: "Complete", kind: "Prologue · Coimbatore", role: "B.E. Computer Science & Engineering", org: "Sree Sakthi Engineering College",
    body: "Foundations in algorithms, systems and machine learning, where the first models were trained.",
    wins: ["Degree unlocked"],
    tags: ["CS", "Foundations"] }
];
