# EvoAlgo: Interactive Genetic Algorithm Studio

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-success?style=for-the-badge&logo=github)](https://rushild25.github.io/genetic-algorithm-visualizer/)
[![Demo Video](https://img.shields.io/badge/Demo_Video-Pending_Upload-lightgrey?style=for-the-badge&logo=youtube)](#-3-5-minute-demo-video-walkthrough)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **EvoAlgo** is an interactive, browser-based pedagogical platform inspired by [VisuAlgo.net](https://visualgo.net/en/) designed to teach **Genetic Algorithms (GA)** from first principles. It combines synchronized micro-phase execution, dynamic pseudocode line tracking, plain-language mathematical explanations, real-time DNA sandboxes, and **100% textbook verification** against David E. Goldberg's landmark 1989 benchmark.

---

## 🌐 Live Public Link & Repository
- **Interactive Web App (Deployed on GitHub Pages):** [https://rushild25.github.io/genetic-algorithm-visualizer/](https://rushild25.github.io/genetic-algorithm-visualizer/)
- **GitHub Repository:** [https://github.com/Rushild25/genetic-algorithm-visualizer](https://github.com/Rushild25/genetic-algorithm-visualizer)
- **Demo Video:** *(Pending upload)*

---

## 🎥 3-5 Minute Demo Video Walkthrough
*(Demo video link and player will be added here upon upload)*

| Timestamp | Topic / Feature Demonstrated | Description |
|---|---|---|
| **0:00 - 0:23** | Introduction to EvoAlgo | Overview of project goals, pedagogical architecture, and VisuAlgo inspiration. |
| **0:23 - 1:12** | Goldberg (1989) Textbook Audit | Direct side-by-side proof verifying Table 1.1 ($f(x)=x^2$) and Table 1.2 (+49.9% fitness leap). |
| **1:12 - 1:40** | 5-Phase Micro-Step Execution | Stepping through Evaluation, Roulette Wheel Selection, Recombination, Mutation, and Elitism. |
| **1:40 - 2:07** | Interactive DNA Microscope & Sandbox | Real-time bit-flipping laboratory demonstrating Hamming cliffs, epistasis, and what-if fitness delta. |
| **2:07 - 2:34** | Travelling Salesperson Problem (TSP) | Interactive 2D map, click-to-add cities, Order Crossover (OX1), and tour untangling. |
| **2:34 - 2:58** | 0/1 Knapsack Packing Manifest | Constrained optimization with live capacity progress bar and weight penalty violation handling. |
| **2:58 - 3:21** | Rastrigin 2D Multimodal Landscape | Continuous multimodal surface optimization and Allele Fixation diversity heatmap. |
| **3:21 - 3:45** | Interactive Mastery Quiz & Wrap-up | 5-question conceptual knowledge check with instant feedback and closing remarks. |

---

## 📘 Textbook Verification: David E. Goldberg (1989)
A critical requirement of rigorous educational software is empirical validation against established academic literature. EvoAlgo features an airtight verification suite replicating **David E. Goldberg's** foundational textbook:
> *Goldberg, D. E. (1989). Genetic Algorithms in Search, Optimization, and Machine Learning. Addison-Wesley Publishing Company.* Chapter 1: A Gentle Introduction to Genetic Algorithms, pp. 10–14.

### Problem Formulation
$$\text{Maximize } f(x) = x^2 \quad \text{for } x \in [0, 31], \quad x \in \mathbb{Z}$$
Chromosomes are represented as 5-bit binary strings ($L=5, 2^5=32$).

### Table 1.1: Initial Reproduction Scheme (Generation 0)
EvoAlgo checks every calculation digit-for-digit against Goldberg's Table 1.1:

$$\bar{f} = \frac{\sum f(x)}{N} = \frac{1170}{4} = 292.5, \quad p_i = \frac{f_i}{\sum f_k}, \quad \mathbb{E}[\text{Count}_i] = \frac{f_i}{\bar{f}}$$

| String No. | Initial String | Decoded $x$ | Fitness $f(x) = x^2$ | $p_{select} = f/\sum f$ | Expected Count $f/\bar{f}$ | Actual Roulette Count |
|---|---|---|---|---|---|---|
| **1** | `01101` | 13 | 169 | 0.144 (14.4%) | 0.58 | **1** |
| **2** | `11000` | 24 | 576 | 0.492 (49.2%) | 1.97 | **2** |
| **3** | `01000` | 8  | 64  | 0.055 (5.5%)  | 0.22 | **0** |
| **4** | `10011` | 19 | 361 | 0.309 (30.9%) | 1.23 | **1** |
| **Sum ($\sum$)** | — | — | **1170** | **1.000** | **4.00** | **4** |
| **Average ($\bar{f}$)** | — | — | **292.5** | **0.250** | **1.00** | **1** |
| **Max ($f_{max}$)** | — | — | **576** | **0.492** | **1.97** | **2** |

### Table 1.2: Crossover, Mutation & Next Generation (Generation 1)
From the actual counts above, the mating pool is $\{s_1, s_2, s_2, s_4\}$. Goldberg mates $(s_1, s_2)$ at locus $k=4$, and $(s_2, s_4)$ at locus $k=2$, with one mutation on String 4 bit 4 ($0 \to 1$):

| Mating Pair | Parents | Crossover Site ($k$) | Crossover Splicing | Final Gen 1 String | New $x$ | New $f(x)$ |
|---|---|---|---|---|---|---|
| **$(1, 2)$** | `01101` & `11000` | $k = 4$ | `0110` \| `0` & `1100` \| `1` | `01100`, `11001` | 12, 25 | 144, 625 |
| **$(2, 4)$** | `11000` & `10011` | $k = 2$ | `11` \| `011` & `10` \| `000` | `11011`, `10000` | 27, 16 | 729, 256 |
| **Gen 1 Sum** | — | — | — | — | — | **1754** |
| **Gen 1 Average** | — | — | — | — | — | **438.5** (+49.91% Gain!) |
| **Gen 1 Max** | — | — | — | — | — | **729** |

---

## 🎯 5 Diverse Problem Domains

1. **📘 Goldberg (1989) Textbook Benchmark ($f(x) = x^2$):**
   - Direct empirical audit with Goldberg Table 1.1 & 1.2 verification.
   - Deterministic textbook mode vs. stochastic exploration.
2. **🗺️ Travelling Salesperson Problem (TSP):**
   - Click anywhere on the 2D canvas to add custom cities dynamically.
   - Permutation chromosomes with **Order Crossover 1 (OX1)** avoiding duplicate cities.
   - Real-time route length minimization and visual untangling of Euclidean paths.
3. **🎒 0/1 Knapsack Constrained Packing:**
   - 10 distinct items (Laptop, Drone, Gold Bar, Solar Kit, Sat Phone, etc.) with dollar values and weights.
   - Dynamic capacity progress bar with constraint violation penalty functions.
4. **🏔️ Rastrigin 2D Multimodal Surface:**
   - Continuous optimization on $f(x, y) = 20 + x^2 - 10\cos(2\pi x) + y^2 - 10\cos(2\pi y)$.
   - Visual swarm convergence of individuals across multiple deceptive local minima toward global optimum $(0, 0)$.
5. **🐒 Dawkins' Target String Synthesis ("Weasel"):**
   - Cumulative character selection evolving random character strings into complex target phrases.

---

## 💡 What's New & Unique (Beyond VisuAlgo)

| Feature | Description |
|---|---|
| **Interactive DNA Microscope** | Click any chromosome in the population table to inspect each locus. Click to flip bits in real-time "What-If" sandbox mode to observe epistatic sensitivity and Hamming cliffs! |
| **Animated Roulette Wheel** | Visual canvas pie chart where wedge angles directly reflect $p_i = f_i / \sum f$. Spins dynamically with pointer needle during selection. |
| **DNA Recombination Slicer** | Animated SVG ribbon showing parent chromosomes, the cutting blade at locus $k$, and the resulting recombinant daughter strands. |
| **Allele Fixation Heatmap** | Real-time locus-by-locus allele frequency tracker illustrating genetic drift and demonstrating why mutation is essential to prevent premature convergence. |
| **Interactive Hand-Calc Workbench** | Custom input bench allowing students to type any 4 binary strings and verify homework arithmetic instantly. |
| **Procedural Web Audio** | Zero-dependency Web Audio API sound synthesizer generating subtle clicks, roulette spins, crossover chirps, and triumphant triad chimes. |
| **Interactive Mastery Quiz** | 5-question multiple choice test bench testing selection pressure, schema theorem, and crossover mechanics with instant pedagogical feedback. |

---

## ⚙️ Algorithm Architecture & Pseudocode

```text
procedure GeneticAlgorithm(Population, Parameters):
  P ← InitializeRandomPopulation(N)
  while not TerminationCriteriaMet() do
    fitness ← EvaluateFitness(P)                               // Line 4
    MatingPool ← SelectParents(P, fitness)                     // Line 5
    Offspring ← Crossover(MatingPool, Pc)                      // Line 6
    MutatedOffspring ← Mutate(Offspring, Pm)                   // Line 7
    P ← SurvivorSelection(P, MutatedOffspring, Elitism)        // Line 8
  end while
  return BestIndividual(P)                                     // Line 10
```

### Mathematical Formulations
- **Fitness-Proportionate (Roulette Wheel) Selection:**
  $$p_i = \frac{f_i}{\sum_{k=1}^N f_k}$$
- **Expected Reproduction Count:**
  $$\mathbb{E}[\text{Count}_i] = \frac{f_i}{\bar{f}} = N \cdot p_i$$
- **Holland's Schema Theorem:**
  $$\mathbb{E}[m(H, t+1)] \ge m(H, t) \cdot \frac{f(H)}{\bar{f}} \cdot \left[1 - p_c \frac{\delta(H)}{L-1} - o(H) p_m\right]$$
  Where $m(H, t)$ is schema count, $f(H)$ is schema average fitness, $\delta(H)$ is defining length, and $o(H)$ is schema order.

---

## 🛠️ Local Setup & Development

### Prerequisites
- Node.js $\ge$ 18.0
- npm $\ge$ 9.0

### Installation
```bash
# Clone the repository
git clone https://github.com/Rushild25/genetic-algorithm-visualizer.git
cd genetic-algorithm-visualizer

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
