%-------------------------
% Resume - Ruben Otano
%------------------------
\documentclass[letterpaper]{article}

\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage{helvet}
\renewcommand{\familydefault}{\sfdefault}
\usepackage[top=0.6in,bottom=0.6in,left=0.7in,right=0.7in]{geometry}
\usepackage{enumitem}
\usepackage{anyfontsize}
\usepackage[hidelinks]{hyperref}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{tabularx}
\usepackage{needspace}
\input{glyphtounicode}
\pdfgentounicode=1
\pagestyle{empty}
\raggedright
\setlength{\parindent}{0pt}

\titleformat{\section}{\fontsize{12}{14}\bfseries}{}{0em}{}[\vspace{2pt}\titlerule]
\titlespacing*{\section}{0pt}{10pt}{5pt}

\setlist[itemize]{leftmargin=1.6em, itemsep=2pt, topsep=1.5pt, parsep=0pt, after=\vspace{2pt}}

\newcommand{\entry}[3]{%
  \vspace{4pt}\needspace{4\baselineskip}
  \begin{tabular*}{\textwidth}{@{}l@{\extracolsep{\fill}}r@{}}
    \textbf{#1}#2 & \textit{#3} \\
  \end{tabular*}\par\vspace{1pt}}

\begin{document}

%---------- HEADER ----------
\begin{center}
  {\fontsize{18}{21}\selectfont\bfseries Ruben Otano}\\[4pt]
  {\fontsize{10.5}{13}\selectfont 786-868-9166 ~$|$~ \href{mailto:rubenotano13@gmail.com}{rubenotano13@gmail.com} ~$|$~ Miami, FL}\\[3pt]
  {\fontsize{10.5}{13}\selectfont \href{https://github.com/RubenOtano}{github.com/RubenOtano} ~$|$~ \href{https://linkedin.com/in/rubenotano}{linkedin.com/in/rubenotano} ~$|$~ AI/ML Engineer}
\end{center}

\vspace{6pt}
\fontsize{10.5}{13.2}\selectfont

%---------- EDUCATION ----------
\section{Education}
\begin{itemize}
  \item B.S. in Computer Science from Florida International University \hfill Expected 2028 \\
        \hspace*{2.1em}Minor in Deep Learning \& Mathematics
  \item A.A. in Computer Science from Miami Dade College \hfill Graduated Jun. 2026 \,\textbar\, GPA 4.00
\end{itemize}

%---------- WORK HISTORY ----------
\section{Work History}

\entry{AI/ML Engineer}{ at CodeCrunch, Miami, FL}{Sept. 2025 to Present}
\begin{itemize}
  \item Analyzed datasets of thousands of users for a modern ed-tech startup, building data pipelines that segmented and enriched users to power CodeCrunch's reach-out program and marketing campaigns.
  \item Built agentic AI workflows that automated large-scale research, gathering and synthesizing information on thousands of users so outreach could be personalized without manual work.
  \item Generated personalized outreach and marketing from the analyzed data, increasing engagement across campaigns while keeping a small team's workload low.
  \item Worked closely with the founding team to ship features quickly, turning raw user data into measurable growth for the platform.
\end{itemize}

%---------- PROJECTS ----------
\section{Projects}

\entry{NeuraScan}{ --- Chest X-ray Pathology Detection}{2026}
\begin{itemize}
  \item Built a multi-label thoracic disease classifier around a DenseNet-121 backbone in PyTorch with Grad-CAM localization so findings were highlighted for clinician review.
  \item Shipped an interactive in-browser demo in Next.js and React that runs the scan, overlays heatmaps, and reports per-pathology confidence in real time.
\end{itemize}

\entry{OncoSeg}{ --- Brain Tumor MRI Segmentation}{2026}
\begin{itemize}
  \item Implemented a 3D U-Net (nnU-Net style) to segment glioma sub-regions across multi-modal MRI, evaluating with volumetric Dice so tumor regions were measured accurately.
  \item Created a canvas-rendered slice viewer with a live segmentation overlay and tumor-volume readout so users could scrub through the scan.
\end{itemize}

\entry{CardioPulse}{ --- Real-Time ECG Arrhythmia Detection}{2026}
\begin{itemize}
  \item Built a 1D residual CNN with a temporal transformer head to classify arrhythmias like AFib and PVC from single-lead ECG, targeting low-latency on-device inference.
  \item Developed a live streaming ECG visualizer with beat-level alerting and heart-rate readout so abnormal rhythms surfaced as they happened.
\end{itemize}

\entry{ClinicalLM}{ --- Retrieval-Augmented Clinical Assistant}{2026}
\begin{itemize}
  \item Built a grounded medical Q\&A assistant using hybrid BM25 and dense retrieval over clinical literature, with citation-faithful responses and abstention on weak evidence.
  \item Implemented a token-streaming chat interface with inline source citations so answers stayed traceable to their sources.
\end{itemize}

\entry{MolForge}{ --- Molecular Property Prediction}{2026}
\begin{itemize}
  \item Implemented a directed message-passing graph neural network with PyTorch Geometric and RDKit to predict ADMET properties and drug-likeness for virtual screening.
  \item Built an animated molecular-graph viewer that renders 3D structure and live property predictions so candidates could be compared quickly.
\end{itemize}

\entry{VitalStream}{ --- ICU Deterioration Early-Warning}{2026}
\begin{itemize}
  \item Designed a temporal-fusion model that forecasts patient deterioration from streaming ICU vitals up to 6 hours ahead, with feature attributions per vital sign.
  \item Built a real-time dashboard with live vitals sparklines, a risk gauge, and an alert and event log so care teams could act early.
\end{itemize}

\end{document}
