export type DemoSlug =
  | 'neurascan'
  | 'oncoseg'
  | 'cardiopulse'
  | 'clinicallm'
  | 'molforge'
  | 'vitalstream';

export interface Project {
  slug: DemoSlug;
  name: string;
  tagline: string;
  domain: string;
  description: string;
  highlights: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  accent: string; // hex tint for the card glow
  github?: string;
  paper?: string;
}

export const projects: Project[] = [
  {
    slug: 'neurascan',
    name: 'NeuraScan',
    tagline: 'Chest X-ray pathology detection',
    domain: 'Computer Vision · Radiology',
    description:
      'A multi-label thoracic disease classifier trained on 220k chest radiographs. A DenseNet-121 backbone with Grad-CAM localization surfaces 14 pathologies in <40ms on a single A100, packaged for Triton Inference Server.',
    highlights: [
      'Grad-CAM heatmaps for clinician-facing explainability',
      'Mixed-precision training on NVIDIA A100 (AMP + DALI pipeline)',
      'Exported to TensorRT — 3.1× lower latency vs. vanilla PyTorch',
    ],
    stack: ['PyTorch', 'MONAI', 'TensorRT', 'Triton', 'Grad-CAM'],
    metrics: [
      { label: 'AUROC', value: '0.94' },
      { label: 'Latency', value: '38ms' },
      { label: 'Pathologies', value: '14' },
    ],
    accent: '#76b900',
  },
  {
    slug: 'oncoseg',
    name: 'OncoSeg',
    tagline: 'Brain tumor MRI segmentation',
    domain: 'Medical Imaging · Segmentation',
    description:
      'A 3D U-Net (nnU-Net derived) that segments glioma sub-regions — enhancing tumor, edema, and necrotic core — from multi-modal MRI volumes. Volumetric Dice loss with deep supervision across BraTS modalities.',
    highlights: [
      'Volumetric 3D segmentation across 4 MRI modalities',
      'Sliding-window inference with test-time augmentation',
      'Tumor-volume tracking for longitudinal treatment response',
    ],
    stack: ['PyTorch', 'nnU-Net', 'MONAI', 'CUDA', 'ITK'],
    metrics: [
      { label: 'Dice (WT)', value: '0.91' },
      { label: 'Dice (TC)', value: '0.87' },
      { label: 'Modalities', value: '4' },
    ],
    accent: '#8fcf1f',
  },
  {
    slug: 'cardiopulse',
    name: 'CardioPulse',
    tagline: 'Real-time ECG arrhythmia detection',
    domain: 'Time Series · Signal Processing',
    description:
      'A 1D residual CNN + temporal transformer that classifies arrhythmias from single-lead ECG in real time. Streams beat-by-beat predictions with sub-second alerting for atrial fibrillation and ventricular ectopy.',
    highlights: [
      'Beat-level classification on streaming single-lead ECG',
      'On-device quantized model (INT8) for wearable deployment',
      'Calibrated confidence with conformal prediction intervals',
    ],
    stack: ['PyTorch', 'ONNX Runtime', 'NumPy', 'WebAssembly'],
    metrics: [
      { label: 'F1 (AFib)', value: '0.96' },
      { label: 'Throughput', value: '500 Hz' },
      { label: 'Model size', value: '1.2 MB' },
    ],
    accent: '#a9df47',
  },
  {
    slug: 'clinicallm',
    name: 'ClinicalLM',
    tagline: 'Grounded clinical reasoning assistant',
    domain: 'LLM · Retrieval-Augmented Generation',
    description:
      'A retrieval-augmented medical assistant that answers clinical questions grounded in a vector index of guidelines and literature. Fine-tuned with constitutional-style safety constraints and citation-faithful decoding.',
    highlights: [
      'RAG over 2.1M clinical abstracts with hybrid BM25 + dense retrieval',
      'Citation-grounded answers with abstention on low evidence',
      'Guardrails for scope-of-practice and dosage safety',
    ],
    stack: ['Transformers', 'vLLM', 'LangGraph', 'pgvector', 'FastAPI'],
    metrics: [
      { label: 'Faithfulness', value: '0.92' },
      { label: 'Tok/s', value: '180' },
      { label: 'Context', value: '32k' },
    ],
    accent: '#76b900',
  },
  {
    slug: 'molforge',
    name: 'MolForge',
    tagline: 'Molecular property & binding prediction',
    domain: 'Graph Neural Nets · Drug Discovery',
    description:
      'A message-passing graph neural network that predicts ADMET properties and protein-ligand binding affinity from molecular graphs, accelerating early-stage virtual screening of candidate therapeutics.',
    highlights: [
      'Directed message passing over molecular graphs (D-MPNN)',
      'Multi-task ADMET head: solubility, toxicity, permeability',
      'Screens 1M compounds/hour on a single GPU',
    ],
    stack: ['PyTorch Geometric', 'RDKit', 'CUDA', 'Ray'],
    metrics: [
      { label: 'ROC-AUC', value: '0.89' },
      { label: 'Screen rate', value: '1M/hr' },
      { label: 'Tasks', value: '6' },
    ],
    accent: '#c9ec8a',
  },
  {
    slug: 'vitalstream',
    name: 'VitalStream',
    tagline: 'ICU deterioration early-warning',
    domain: 'Time Series · Critical Care',
    description:
      'A temporal-fusion transformer that ingests live ICU vitals and labs to forecast patient deterioration up to 6 hours ahead, deployed as a streaming microservice with a real-time risk dashboard.',
    highlights: [
      'Multi-horizon risk forecasting from irregular time series',
      'Streaming inference on Kafka + Triton at hospital scale',
      'SHAP attributions for each contributing vital sign',
    ],
    stack: ['PyTorch Forecasting', 'Triton', 'Kafka', 'Grafana'],
    metrics: [
      { label: 'AUPRC', value: '0.81' },
      { label: 'Lead time', value: '6 hr' },
      { label: 'Latency', value: '120ms' },
    ],
    accent: '#8fcf1f',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
