export const SECTIONS = [
  { id: "player", no: "01", name: "Player", hud: "CHARACTER" },
  { id: "arsenal", no: "02", name: "Arsenal", hud: "WEAPON WHEEL" },
  { id: "missions", no: "03", name: "Missions", hud: "MISSIONS" },
  { id: "story", no: "04", name: "Story", hud: "STORY MODE" },
  { id: "garage", no: "05", name: "Garage", hud: "GARAGE" },
  { id: "contact", no: "06", name: "Contact", hud: "PHONE" }
] as const;
export type SectionId = typeof SECTIONS[number]["id"];

export const LINKS = {
  email: "mailto:kiruba11geo@gmail.com",
  emailLabel: "kiruba11geo@gmail.com",
  linkedin: "https://www.linkedin.com/in/kirubakaranperiyasamy/",
  github: "https://github.com/kiruba11k"
};

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

export const ARSENAL = [
  { id: "ml", slot: "Rifle", name: "Machine learning", glyph: "▲", level: 8, ammo: "∞", note: "Training, evaluation and deep neural networks.", skills: ["Python", "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "NumPy", "Pandas"] },
  { id: "vision", slot: "Scope", name: "Computer vision", glyph: "◎", level: 7, ammo: "60fps", note: "Detection, segmentation and multi-object tracking.", skills: ["OpenCV", "YOLO", "CNNs", "U-Net", "Mask R-CNN", "ByteTrack"] },
  { id: "llm", slot: "Launcher", name: "LLMs & RAG", glyph: "✦", level: 9, ammo: "7B", note: "Orchestration, retrieval and fine-tuning.", skills: ["LLMs", "RAG", "LangChain", "LangGraph", "LoRA / QLoRA", "PEFT", "FAISS"] },
  { id: "nlp", slot: "Radio", name: "Language", glyph: "≋", level: 7, ammo: "BERT", note: "Text understanding and embeddings.", skills: ["Transformers", "BERT", "Hugging Face", "Embeddings", "BM25"] },
  { id: "backend", slot: "Wrench", name: "Backend & APIs", glyph: "⌘", level: 7, ammo: "8+", note: "Serving models behind dependable interfaces.", skills: ["FastAPI", "Django REST", "Streamlit", "REST", "SQL"] },
  { id: "ops", slot: "Vehicle", name: "Ship & track", glyph: "⬢", level: 6, ammo: "prod", note: "Packaging, deploying and measuring experiments.", skills: ["Docker", "AWS", "Weights & Biases", "Git", "Linux"] }
];

export type MissionScene = "parcel" | "traffic" | "llm";
export const MISSIONS: {
  no: string; scene: MissionScene; tag: string; title: string; desc: string; stack: string[];
  route: string[]; difficulty: number; reward: string; href: string;
}[] = [
  { no: "01", scene: "parcel", tag: "Computer vision · Inspection", title: "ParcelGuard", desc: "A visual inspection system combining detection, segmentation, tracking and reference-guided anomaly analysis to identify parcel damage on a moving line.", stack: ["YOLO", "Mask R-CNN / U-Net", "ByteTrack", "PyTorch"], route: ["Detect", "Segment", "Compare", "Classify"], difficulty: 4, reward: "Damage caught before dispatch", href: "https://github.com/kiruba11k" },
  { no: "02", scene: "traffic", tag: "Real-time video analytics", title: "Smart Traffic Intelligence", desc: "Detects and tracks cars, motorcycles, buses and trucks with persistent identities, virtual-line counting and live traffic analytics.", stack: ["YOLO", "OpenCV", "ByteTrack"], route: ["Detect", "Track", "Count", "Analyse"], difficulty: 3, reward: "Live lane-level counts", href: "https://github.com/kiruba11k" },
  { no: "03", scene: "llm", tag: "LLM fine-tuning · NLP", title: "Mistral-7B · LoRA / QLoRA", desc: "Fine-tuned a 7B language model on 5K domain pairs with PEFT, tracked every run, and published the model to the Hugging Face Hub.", stack: ["Mistral-7B", "PEFT", "W&B", "Hugging Face"], route: ["Prepare", "LoRA", "Evaluate", "Publish"], difficulty: 5, reward: "35% quality lift after SFT", href: "https://github.com/kiruba11k" }
];

export const STORY = [
  { when: "Apr 2025 — Now", status: "In progress", kind: "Main story · Bengaluru", role: "AI / ML Engineer", org: "LeadStrategus", body: "Building and deploying GenAI automation tools, data-ingestion pipelines and fine-tuned language models. Developing and evaluating ML/DL models with PyTorch, TensorFlow and scikit-learn.", tags: ["GenAI", "ML/DL", "Pipelines", "LLMs"] },
  { when: "Aug — Sep 2024", status: "Complete", kind: "Side mission · Internship", role: "Django Developer Intern", org: "Tecosys", body: "Contributed to Cerina GPT and designed 8+ Django REST APIs connecting AI inference endpoints to real-time application workflows.", tags: ["Python", "Django REST", "APIs"] },
  { when: "2020 — 2024", status: "Complete", kind: "Prologue · Coimbatore", role: "B.E. Computer Science & Engineering", org: "Sree Sakthi Engineering College", body: "Foundations in algorithms, systems and machine learning — where the first models were trained.", tags: ["CS", "Foundations"] }
];
