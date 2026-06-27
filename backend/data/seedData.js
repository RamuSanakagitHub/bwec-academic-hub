const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Subject = require('../models/Subject');
const Unit = require('../models/Unit');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bwec_academic_hub';

// ─── SUBJECTS ────────────────────────────────────────────────────────────────
const subjectsData = [
  // 1st Year – COMMON (Sem 1 & 2)
  { code: 'MA101', name: 'Engineering Mathematics – I', branch: 'COMMON', year: 1, semester: 1, credits: 4, description: 'Matrices, Differential Calculus, Multivariable Calculus' },
  { code: 'PH101', name: 'Engineering Physics', branch: 'COMMON', year: 1, semester: 1, credits: 3, description: 'Wave Optics, Quantum Mechanics, Semiconductors, Lasers' },
  { code: 'CS101', name: 'Programming in C', branch: 'COMMON', year: 1, semester: 1, credits: 3, description: 'C language fundamentals, Arrays, Pointers, Functions' },
  { code: 'ME101', name: 'Engineering Drawing', branch: 'COMMON', year: 1, semester: 2, credits: 2, description: 'Orthographic projections, Sectional views, Isometric drawing' },
  { code: 'CH101', name: 'Engineering Chemistry', branch: 'COMMON', year: 1, semester: 2, credits: 3, description: 'Polymers, Electrochemistry, Corrosion, Water technology' },
  { code: 'EE101', name: 'Basic Electrical Engineering', branch: 'COMMON', year: 1, semester: 2, credits: 4, description: 'DC circuits, AC circuits, Transformers, DC machines' },

  // 2nd Year – ECE (Sem 3 & 4)
  { code: 'EC201', name: 'Electronic Devices and Circuits', branch: 'ECE', year: 2, semester: 3, credits: 4, description: 'Diodes, BJT, FET, Amplifiers, Feedback' },
  { code: 'EC202', name: 'Network Analysis', branch: 'ECE', year: 2, semester: 3, credits: 4, description: 'Network theorems, Two-port networks, Laplace transforms' },
  { code: 'EC203', name: 'Signals and Systems', branch: 'ECE', year: 2, semester: 4, credits: 4, description: 'Continuous and discrete signals, LTI systems, Fourier analysis' },
  { code: 'EC204', name: 'Digital Electronics', branch: 'ECE', year: 2, semester: 4, credits: 4, description: 'Boolean algebra, Combinational and sequential circuits' },
  { code: 'MA201', name: 'Mathematics – III (Transform Calculus)', branch: 'ECE', year: 2, semester: 3, credits: 4, description: 'Laplace, Fourier, Z-transforms, PDE' },

  // 2nd Year – CSE (Sem 3 & 4)
  { code: 'CS201', name: 'Data Structures', branch: 'CSE', year: 2, semester: 3, credits: 4, description: 'Arrays, Linked lists, Trees, Graphs, Sorting and searching' },
  { code: 'CS202', name: 'Object-Oriented Programming (Java)', branch: 'CSE', year: 2, semester: 3, credits: 4, description: 'OOP concepts, Inheritance, Polymorphism, Exception handling' },
  { code: 'CS203', name: 'Computer Organization', branch: 'CSE', year: 2, semester: 4, credits: 4, description: 'CPU design, Memory organization, I/O, Pipelining' },
  { code: 'CS204', name: 'Discrete Mathematics', branch: 'CSE', year: 2, semester: 4, credits: 4, description: 'Logic, Sets, Relations, Graph theory, Combinatorics' },
  { code: 'CS205', name: 'Operating Systems', branch: 'CSE', year: 2, semester: 4, credits: 4, description: 'Process management, Memory, File systems, Deadlocks' },

  // 2nd Year – AIML (Sem 3 & 4)
  { code: 'AI201', name: 'Introduction to Artificial Intelligence', branch: 'AIML', year: 2, semester: 3, credits: 4, description: 'Search algorithms, Knowledge representation, Agents' },
  { code: 'AI202', name: 'Python Programming for AI', branch: 'AIML', year: 2, semester: 3, credits: 3, description: 'Python fundamentals, NumPy, Pandas, Matplotlib' },
  { code: 'AI203', name: 'Statistics for Machine Learning', branch: 'AIML', year: 2, semester: 4, credits: 4, description: 'Probability, Distributions, Hypothesis testing, Regression' },
  { code: 'AI204', name: 'Linear Algebra & Calculus for ML', branch: 'AIML', year: 2, semester: 4, credits: 4, description: 'Vectors, Matrices, Eigenvalues, Gradient, Optimization' },

  // 3rd Year – ECE (Sem 5 & 6)
  { code: 'EC301', name: 'Analog Communications', branch: 'ECE', year: 3, semester: 5, credits: 4, description: 'AM, FM, PM modulation; Noise analysis; Receivers' },
  { code: 'EC302', name: 'Digital Signal Processing', branch: 'ECE', year: 3, semester: 5, credits: 4, description: 'DFT, FFT, FIR/IIR filters, DSP processors' },
  { code: 'EC303', name: 'VLSI Design', branch: 'ECE', year: 3, semester: 6, credits: 4, description: 'CMOS logic, Digital IC design, Layout, Verilog HDL' },
  { code: 'EC304', name: 'Microprocessors and Microcontrollers', branch: 'ECE', year: 3, semester: 5, credits: 4, description: '8085/8086, 8051, ARM, Interfacing techniques' },
  { code: 'EC305', name: 'Control Systems', branch: 'ECE', year: 3, semester: 6, credits: 4, description: 'Transfer functions, Root locus, Bode plot, PID control' },
  { code: 'EC306', name: 'Antenna and Wave Propagation', branch: 'ECE', year: 3, semester: 6, credits: 4, description: 'Antenna parameters, Arrays, Propagation modes' },

  // 3rd Year – CSE (Sem 5 & 6)
  { code: 'CS301', name: 'Database Management Systems', branch: 'CSE', year: 3, semester: 5, credits: 4, description: 'Relational model, SQL, Normalization, Transactions' },
  { code: 'CS302', name: 'Computer Networks', branch: 'CSE', year: 3, semester: 5, credits: 4, description: 'OSI/TCP-IP model, Protocols, Routing, Security' },
  { code: 'CS303', name: 'Algorithm Design and Analysis', branch: 'CSE', year: 3, semester: 5, credits: 4, description: 'Complexity, Divide & Conquer, DP, Greedy, NP problems' },
  { code: 'CS304', name: 'Software Engineering', branch: 'CSE', year: 3, semester: 6, credits: 4, description: 'SDLC models, UML, Testing, Project management' },
  { code: 'CS305', name: 'Compiler Design', branch: 'CSE', year: 3, semester: 6, credits: 4, description: 'Lexical analysis, Parsing, Semantic analysis, Code generation' },
  { code: 'CS306', name: 'Theory of Computation', branch: 'CSE', year: 3, semester: 6, credits: 4, description: 'Automata, Regular languages, Context-free grammars, Turing machines' },

  // 3rd Year – AIML (Sem 5 & 6)
  { code: 'AI301', name: 'Machine Learning', branch: 'AIML', year: 3, semester: 5, credits: 4, description: 'Supervised, Unsupervised learning; SVM, Random Forest, Neural Networks' },
  { code: 'AI302', name: 'Deep Learning', branch: 'AIML', year: 3, semester: 5, credits: 4, description: 'CNNs, RNNs, LSTM, Transformers, GANs, Transfer learning' },
  { code: 'AI303', name: 'Computer Vision', branch: 'AIML', year: 3, semester: 6, credits: 4, description: 'Image processing, Object detection, Segmentation, OpenCV' },
  { code: 'AI304', name: 'Natural Language Processing', branch: 'AIML', year: 3, semester: 6, credits: 4, description: 'Tokenization, POS tagging, Named entities, Transformers, BERT' },
  { code: 'AI305', name: 'Reinforcement Learning', branch: 'AIML', year: 3, semester: 6, credits: 4, description: 'MDP, Q-learning, Policy gradient, Actor-Critic methods' },

  // 4th Year – ECE (Sem 7 & 8)
  { code: 'EC401', name: 'Digital Communications', branch: 'ECE', year: 4, semester: 7, credits: 4, description: 'PCM, DPCM, DM, BPSK, QPSK, QAM, OFDM, Error coding' },
  { code: 'EC402', name: 'Wireless Communications', branch: 'ECE', year: 4, semester: 7, credits: 4, description: 'Cellular concepts, CDMA, GSM, LTE, 5G, MIMO' },
  { code: 'EC403', name: 'Image and Video Processing', branch: 'ECE', year: 4, semester: 8, credits: 4, description: 'Image transforms, Filtering, Compression, Video codecs' },
  { code: 'EC404', name: 'Embedded Systems', branch: 'ECE', year: 4, semester: 7, credits: 4, description: 'RTOS, ARM Cortex, Peripheral interfaces, IoT basics' },
  { code: 'EC405', name: 'Optical Fiber Communications', branch: 'ECE', year: 4, semester: 8, credits: 4, description: 'Fiber types, Signal propagation, Splicing, WDM, OTN' },

  // 4th Year – CSE (Sem 7 & 8)
  { code: 'CS401', name: 'Cloud Computing', branch: 'CSE', year: 4, semester: 7, credits: 4, description: 'IaaS, PaaS, SaaS, AWS, Azure, Docker, Kubernetes' },
  { code: 'CS402', name: 'Artificial Intelligence', branch: 'CSE', year: 4, semester: 7, credits: 4, description: 'Search, CSP, Bayesian networks, Machine learning, Planning' },
  { code: 'CS403', name: 'Cyber Security', branch: 'CSE', year: 4, semester: 8, credits: 4, description: 'Cryptography, Network security, Web security, Ethical hacking' },
  { code: 'CS404', name: 'Mobile App Development', branch: 'CSE', year: 4, semester: 8, credits: 4, description: 'Android, React Native, API integration, Publishing' },

  // 4th Year – AIML (Sem 7 & 8)
  { code: 'AI401', name: 'Advanced Deep Learning', branch: 'AIML', year: 4, semester: 7, credits: 4, description: 'Attention mechanisms, Vision Transformers, Diffusion models' },
  { code: 'AI402', name: 'MLOps and Model Deployment', branch: 'AIML', year: 4, semester: 7, credits: 4, description: 'ML pipelines, Docker, FastAPI, Model monitoring, CI/CD for ML' },
  { code: 'AI403', name: 'Generative AI', branch: 'AIML', year: 4, semester: 8, credits: 4, description: 'GANs, VAEs, LLMs, Prompt engineering, Fine-tuning' },
  { code: 'AI404', name: 'AI Ethics and Governance', branch: 'AIML', year: 4, semester: 8, credits: 3, description: 'Bias, Fairness, Explainability, Regulation, Responsible AI' },
];

// ─── UNITS (per subject – abbreviated set) ───────────────────────────────────
function makeUnits(subjectId, unitDefs) {
  return unitDefs.map((u, i) => ({ subject: subjectId, unitNumber: i + 1, ...u }));
}

const unitTemplates = {
  EC302: [
    {
      title: 'Discrete-Time Signals and Systems',
      overview: 'Classification of DT signals, sampling theorem, LTI systems and their properties.',
      topics: [
        { title: 'Discrete-Time Signals', explanation: 'A discrete-time signal x[n] is defined only at integer values of n. Common sequences include unit impulse δ[n], unit step u[n], real exponential a^n, and complex exponential e^(jωn). Signals are classified as periodic (if x[n] = x[n+N] for all n) or aperiodic, energy signals (finite energy) or power signals.', keyPoints: ['Unit impulse: δ[n]=1 at n=0, else 0', 'Unit step: u[n]=1 for n≥0', 'Periodicity condition: x[n]=x[n+N]'], formulas: ['E = Σ|x[n]|²', 'P = lim(1/2N+1)Σ|x[n]|²'], diagramType: 'waveform', diagramLabel: 'Unit Impulse and Step Sequences' },
        { title: 'LTI Systems – Convolution', explanation: 'A Linear Time-Invariant (LTI) system satisfies superposition and time-invariance. The output y[n] = x[n] * h[n] where h[n] is the impulse response. Convolution sum: y[n] = Σ x[k]·h[n−k]. Stability: Σ|h[n]| < ∞. Causality: h[n]=0 for n<0.', keyPoints: ['Commutative: x*h = h*x', 'Associative: (x*h₁)*h₂ = x*(h₁*h₂)', 'BIBO stable ⟺ Σ|h[n]| < ∞'], formulas: ['y[n] = Σₖ x[k]h[n−k]'], diagramType: 'block', diagramLabel: 'LTI System Block Diagram' },
        { title: 'Z-Transform', explanation: 'The Z-transform converts discrete-time signals to the complex frequency domain. X(z) = Σ x[n]z⁻ⁿ. The Region of Convergence (ROC) determines system properties. Common pairs: δ[n] ↔ 1, u[n] ↔ z/(z−1). Inverse Z-transform is found by partial fractions or power series.', keyPoints: ['ROC determines causality and stability', 'Poles outside unit circle → unstable', 'Unit circle in ROC → DTFT exists'], formulas: ['X(z) = Σ x[n]z⁻ⁿ', 'Final value: lim x[n] = lim(z−1)X(z) as z→1'], diagramType: 'graph', diagramLabel: 'Z-Plane Pole-Zero Plot' }
      ]
    },
    {
      title: 'Discrete Fourier Transform (DFT)',
      overview: 'DFT definition, properties, circular convolution, and relationship to DTFT.',
      topics: [
        { title: 'DFT Definition and Properties', explanation: 'The N-point DFT of x[n] is X[k] = Σ x[n]·Wₙᴺⁿᵏ where Wₙ = e^(−j2π/N). The IDFT is x[n] = (1/N)Σ X[k]·Wₙ^(−nk). Key properties: linearity, circular shift, frequency shift, circular convolution theorem.', keyPoints: ['DFT is periodic with period N', 'Parseval\'s theorem: Σ|x[n]|² = (1/N)Σ|X[k]|²', 'Circular convolution in time ↔ multiplication in freq'], formulas: ['X[k] = Σₙ₌₀ᴺ⁻¹ x[n]e^(−j2πkn/N)', 'x[n] = (1/N)Σₖ₌₀ᴺ⁻¹ X[k]e^(j2πkn/N)'], diagramType: 'graph', diagramLabel: '8-Point DFT Magnitude Spectrum' },
        { title: 'Fast Fourier Transform (FFT)', explanation: 'FFT reduces DFT complexity from O(N²) to O(N log₂N) by exploiting the periodicity and symmetry of the twiddle factor Wₙ. Cooley-Tukey Radix-2 DIT algorithm splits even and odd samples. 8-point FFT requires 12 complex multiplications vs 64 for direct DFT.', keyPoints: ['Radix-2 requires N = 2^m', 'DIT: decimation in time; DIF: decimation in frequency', 'Butterfly computation is the core operation'], formulas: ['Multiplications: (N/2)log₂N', 'Additions: N·log₂N'], diagramType: 'flowchart', diagramLabel: '8-Point Radix-2 DIT FFT Butterfly Diagram' }
      ]
    },
    {
      title: 'FIR and IIR Filter Design',
      overview: 'Design of digital filters using windowing, bilinear transform, and frequency transformations.',
      topics: [
        { title: 'FIR Filter Design – Window Method', explanation: 'FIR filters have linear phase and are always stable. Ideal filters are truncated using windows to obtain realizable filters. Common windows: Rectangular (min stopband attenuation −13 dB), Hanning (−44 dB), Hamming (−53 dB), Blackman (−74 dB), Kaiser (adjustable). Window choice balances main-lobe width vs sidelobe level.', keyPoints: ['FIR always BIBO stable', 'Linear phase property for symmetric h[n]', 'Kaiser window best flexibility via β parameter'], formulas: ['h[n] = hd[n]·w[n]', 'Kaiser: w[n] = I₀(β√(1−((n−M/2)/(M/2))²))/I₀(β)'], diagramType: 'graph', diagramLabel: 'Window Function Frequency Responses' },
        { title: 'IIR Filter Design – Bilinear Transform', explanation: 'IIR filters are designed from analog prototypes using the bilinear transform s = 2/T·(z−1)/(z+1). This maps the entire jΩ axis to the unit circle with frequency warping. Pre-warping corrects critical frequencies: Ωa = (2/T)tan(ωd/2). Butterworth prototype has maximally flat passband.', keyPoints: ['Bilinear eliminates aliasing (unlike impulse invariance)', 'Pre-warp: Ωa = (2/T)·tan(ωd/2)', 'Butterworth: |H(jΩ)|² = 1/(1+(Ω/Ωc)^2N)'], formulas: ['s → 2/T·(1−z⁻¹)/(1+z⁻¹)', 'Order: N ≥ log(√((10^0.1As−1)/(10^0.1Ap−1)))/log(Ωs/Ωp)'], diagramType: 'block', diagramLabel: 'IIR Filter Design Flow' }
      ]
    }
  ],
  EC305: [
    {
      title: 'Mathematical Models of Systems',
      overview: 'Transfer functions, block diagrams, signal flow graphs for control systems.',
      topics: [
        { title: 'Transfer Function and Block Diagrams', explanation: 'A transfer function G(s) = C(s)/R(s) represents the ratio of output to input Laplace transforms with zero initial conditions. Block diagram algebra: series G₁G₂, parallel G₁+G₂, feedback G/(1+GH). Mason\'s gain formula provides a systematic method for signal flow graphs.', keyPoints: ['Poles: roots of denominator → system stability', 'Zeros: roots of numerator → response shape', 'Unity feedback: G(s)/(1+G(s))'], formulas: ['G(s) = C(s)/R(s)', 'Closed loop: T(s) = G(s)/(1+G(s)H(s))'], diagramType: 'block', diagramLabel: 'Closed-Loop Control System Block Diagram' },
        { title: 'Time Domain Analysis', explanation: 'Standard 2nd order system: T(s) = ωn²/(s²+2ζωns+ωn²). Transient response parameters: rise time (tr), peak time (tp = π/ωd), settling time (ts ≈ 4/ζωn), overshoot (Mp = e^(−πζ/√(1−ζ²))×100%). ζ<1: underdamped, ζ=1: critically damped, ζ>1: overdamped.', keyPoints: ['Underdamped: oscillatory response', 'ζ = 0.707 optimal for minimal overshoot with fast response', 'Steady-state error depends on system type'], formulas: ['ωd = ωn√(1−ζ²)', 'Mp = e^(−πζ/√(1−ζ²))×100%', 'ts ≈ 4/ζωn (2% criterion)'], diagramType: 'waveform', diagramLabel: 'Step Response for Different Damping Ratios' }
      ]
    },
    {
      title: 'Stability Analysis',
      overview: 'Routh-Hurwitz criterion, root locus method for stability analysis.',
      topics: [
        { title: 'Routh-Hurwitz Criterion', explanation: 'Determines stability without finding roots. For characteristic equation: arrange coefficients in Routh array. System stable iff all elements in first column are positive. Number of sign changes = number of right-half-plane poles. Special cases: zero in first column → replace with ε; entire row zero → use auxiliary polynomial.', keyPoints: ['All first-column elements positive → stable', 'Sign changes count unstable poles', 'Auxiliary polynomial for row of zeros'], formulas: ['For s² + as + b = 0: stable if a,b > 0'], diagramType: 'flowchart', diagramLabel: 'Routh Array Construction' },
        { title: 'Root Locus Method', explanation: 'Root locus is the locus of closed-loop poles as gain K varies from 0 to ∞. Rules: starts at open-loop poles, ends at open-loop zeros or infinity. Number of asymptotes = P−Z, angles = (2q+1)180/(P−Z). Centroid of asymptotes = (Σpoles−Σzeros)/(P−Z). Breakaway points found from dK/ds = 0.', keyPoints: ['Begins at OL poles (K=0), ends at OL zeros (K=∞)', 'Root locus on real axis if odd number of poles+zeros to its right', 'Gain margin and phase margin from root locus'], formulas: ['Characteristic eq: 1 + KG(s)H(s) = 0', 'Centroid: σ_a = (Σpᵢ−Σzⱼ)/(P−Z)'], diagramType: 'graph', diagramLabel: 'Root Locus Plot Example' }
      ]
    },
    {
      title: 'Frequency Response Analysis',
      overview: 'Bode plots, Nyquist criterion, phase and gain margins.',
      topics: [
        { title: 'Bode Plot', explanation: 'Bode plots show magnitude (in dB) and phase vs log frequency. For G(jω) = K·(jω+z)/((jω)(jω+p)): separate each factor and add. Gain margin: 20log|G(jω_pc)| in dB at phase crossover frequency. Phase margin: 180° + ∠G(jω_gc) at gain crossover frequency. PM > 45° for good stability.', keyPoints: ['Simple pole: −20dB/dec slope, −90° phase', 'Simple zero: +20dB/dec slope, +90° phase', 'Gain margin > 6dB and phase margin > 45° preferred'], formulas: ['|G|dB = 20log₁₀|G(jω)|', 'GM = −20log|G(jω_pc)|', 'PM = 180° + ∠G(jω_gc)'], diagramType: 'graph', diagramLabel: 'Bode Magnitude and Phase Plot' }
      ]
    }
  ],
  CS201: [
    {
      title: 'Arrays, Linked Lists and Stacks',
      overview: 'Linear data structures, their operations, and applications.',
      topics: [
        { title: 'Arrays and Dynamic Arrays', explanation: 'An array stores elements of same type in contiguous memory. Access O(1), insertion/deletion O(n). Dynamic arrays (ArrayList) double capacity when full, amortized O(1) append. 2D arrays stored in row-major or column-major order. Sparse matrices use compressed formats (CSR, COO) to save space.', keyPoints: ['Random access O(1)', 'Insertion at middle O(n)', 'Cache-friendly due to contiguous memory'], formulas: ['Address of a[i][j] (row major): base + (i*cols + j)*size'], diagramType: 'block', diagramLabel: '2D Array Memory Layout' },
        { title: 'Linked Lists', explanation: 'Singly linked list: each node has data + next pointer. Doubly linked list: prev + data + next. Circular: last node points to head. Insertion/deletion O(1) at known position, O(n) for search. No random access. Used for implementing stacks, queues, adjacency lists.', keyPoints: ['Dynamic size — no pre-allocation needed', 'No random access (sequential traversal)', 'DLL supports O(1) deletion given the node pointer'], formulas: [], diagramType: 'block', diagramLabel: 'Singly vs Doubly Linked List' },
        { title: 'Stacks', explanation: 'Stack: LIFO structure. Operations: push O(1), pop O(1), peek O(1). Applications: expression evaluation (infix→postfix), balanced parentheses, function call stack, DFS, undo operations. Array-based or linked-list-based implementation. Stack overflow when capacity exceeded.', keyPoints: ['LIFO: Last In First Out', 'Used in recursion (system call stack)', 'Infix to postfix: handle operators by precedence'], formulas: [], diagramType: 'flowchart', diagramLabel: 'Infix to Postfix Conversion Algorithm' }
      ]
    },
    {
      title: 'Trees and Binary Search Trees',
      overview: 'Tree terminology, binary trees, BST operations, balanced trees.',
      topics: [
        { title: 'Binary Trees', explanation: 'A binary tree has at most 2 children per node. Height h: at most 2^(h+1)−1 nodes. Full binary tree: every node has 0 or 2 children. Complete: all levels full except last, filled left to right. Perfect: all internal nodes have 2 children, all leaves same level. Traversals: inorder (L-root-R), preorder (root-L-R), postorder (L-R-root), level-order (BFS).', keyPoints: ['Inorder of BST gives sorted sequence', 'Height of balanced tree: O(log n)', 'Binary heap: complete binary tree with heap property'], formulas: ['Max nodes at level i: 2^i', 'Max nodes in height h tree: 2^(h+1)−1'], diagramType: 'flowchart', diagramLabel: 'Tree Traversal Methods' },
        { title: 'Binary Search Tree (BST)', explanation: 'BST property: left subtree < node < right subtree. Search, insert, delete: average O(log n), worst O(n) for skewed tree. Delete: three cases — leaf (just remove), one child (bypass), two children (replace with inorder successor). AVL tree maintains balance factor |−1, 0, +1|, rotations restore balance after each operation.', keyPoints: ['Balanced BST guarantees O(log n) all operations', 'AVL: height difference ≤ 1 at every node', 'Red-Black tree: guaranteed O(log n), fewer rotations than AVL'], formulas: ['Balance factor = height(left) − height(right)'], diagramType: 'graph', diagramLabel: 'BST Insert and Delete Operations' }
      ]
    },
    {
      title: 'Graphs and Sorting Algorithms',
      overview: 'Graph representations, traversals, shortest paths, and sorting.',
      topics: [
        { title: 'Graph Algorithms', explanation: 'Graph G=(V,E). Representations: adjacency matrix O(V²) space, adjacency list O(V+E) space. BFS uses queue, explores level by level, finds shortest path in unweighted graph. DFS uses stack/recursion, used for topological sort, cycle detection, SCCs. Dijkstra: single-source shortest path with non-negative weights, O((V+E)log V) with min-heap.', keyPoints: ['BFS shortest path in unweighted graph', 'DFS detects back edges → cycle detection', "Dijkstra doesn't work with negative edges"], formulas: ["Dijkstra: d[v] = min(d[v], d[u]+w(u,v))"], diagramType: 'graph', diagramLabel: 'BFS vs DFS Traversal Order' },
        { title: 'Sorting Algorithms', explanation: 'Comparison sorts lower bound: Ω(n log n). Merge sort: O(n log n) always, stable, O(n) space. Quick sort: average O(n log n), worst O(n²) for sorted input, in-place. Heap sort: O(n log n), in-place, not stable. Counting sort: O(n+k), not comparison-based, stable. Radix sort: O(d(n+k)) where d is number of digits.', keyPoints: ['Quick sort fastest in practice (good cache performance)', 'Merge sort preferred for stable sort and linked lists', 'Heap sort for in-place O(n log n) with no worst-case concern'], formulas: ['Quick sort average: O(n log n)', 'Counting sort: O(n+k)'], diagramType: 'flowchart', diagramLabel: 'Merge Sort Divide and Conquer' }
      ]
    }
  ],
  AI301: [
    {
      title: 'Introduction to Machine Learning',
      overview: 'Types of learning, hypothesis space, bias-variance tradeoff, evaluation metrics.',
      topics: [
        { title: 'Types of ML and Key Concepts', explanation: 'Supervised learning: labelled data, learns f: X→Y. Unsupervised: unlabelled, finds structure. Reinforcement: reward-based. Semi-supervised: mix. Hypothesis space H = set of all possible models. Overfitting: model memorises training data, high variance. Underfitting: model too simple, high bias. Bias-variance tradeoff: Total error = Bias² + Variance + Irreducible noise.', keyPoints: ['Train/Val/Test split: typically 60/20/20', 'Cross-validation reduces evaluation variance', 'Regularisation (L1/L2) reduces overfitting'], formulas: ['Bias² + Variance + Noise = Total MSE', 'k-fold CV: average error over k folds'], diagramType: 'graph', diagramLabel: 'Bias-Variance Tradeoff Curve' },
        { title: 'Linear and Logistic Regression', explanation: 'Linear regression: y = wᵀx + b. Loss: MSE = (1/n)Σ(ŷ−y)². Gradient descent update: w := w − α·∂L/∂w. Normal equation: w = (XᵀX)⁻¹Xᵀy. Logistic regression: sigmoid σ(z) = 1/(1+e⁻ᶻ), outputs probability. Binary cross-entropy loss. Decision boundary: wᵀx + b = 0. Multi-class: softmax regression.', keyPoints: ['Linear regression: closed-form solution via normal equation', 'Gradient descent: iterative, works for large data', 'Logistic regression: linear decision boundary'], formulas: ['MSE = (1/n)Σ(ŷᵢ−yᵢ)²', 'σ(z) = 1/(1+e⁻ᶻ)', 'w ← w − α·∇L'], diagramType: 'graph', diagramLabel: 'Logistic Regression Decision Boundary' }
      ]
    },
    {
      title: 'Tree-Based and Ensemble Methods',
      overview: 'Decision trees, Random Forest, Gradient Boosting, XGBoost.',
      topics: [
        { title: 'Decision Trees', explanation: 'Decision tree splits data on features to minimise impurity. Gini impurity: G = 1 − Σpᵢ². Entropy: H = −Σpᵢlog₂pᵢ. Information gain = parent entropy − weighted child entropy. Pros: interpretable, handles mixed types. Cons: high variance, overfitting. Pruning (cost-complexity) reduces overfitting.', keyPoints: ['ID3 uses entropy, CART uses Gini', 'Depth control and min-samples prevent overfitting', 'Decision boundaries are axis-aligned'], formulas: ['Gini = 1 − Σpᵢ²', 'IG = H(parent) − Σ(|Cᵢ|/|C|)H(Cᵢ)'], diagramType: 'flowchart', diagramLabel: 'Decision Tree Split on Feature' },
        { title: 'Random Forest and Gradient Boosting', explanation: 'Random Forest: bagging + random feature subsets. Each tree trained on bootstrap sample, random m features at each split. Final prediction: majority vote (classification) or mean (regression). Reduces variance. Gradient Boosting: sequential ensemble, each tree corrects residuals of previous. Learning rate η controls step. XGBoost adds regularisation, second-order gradients, faster with sparsity handling.', keyPoints: ['Random Forest: low variance via averaging', 'Gradient Boosting: reduces bias iteratively', 'XGBoost: best performance on tabular data'], formulas: ['RF: ŷ = (1/T)Σtree_t(x)', 'GB: F_m(x) = F_{m-1}(x) + η·h_m(x)'], diagramType: 'block', diagramLabel: 'Random Forest vs Gradient Boosting Architecture' }
      ]
    },
    {
      title: 'Neural Networks Fundamentals',
      overview: 'Perceptron, multi-layer networks, backpropagation, activation functions.',
      topics: [
        { title: 'Multi-Layer Perceptron', explanation: 'MLP: input layer → hidden layers → output. Each neuron: z = wᵀx + b, a = σ(z). Activation functions: sigmoid (vanishing gradient issue), tanh, ReLU (max(0,x), most common), Leaky ReLU, ELU. Forward pass: compute activations layer by layer. Backpropagation: chain rule to compute gradients, update weights via gradient descent. Universal approximation theorem: 1 hidden layer with enough neurons can approximate any continuous function.', keyPoints: ['ReLU solves vanishing gradient for deep networks', 'Backprop is just chain rule applied to computation graph', 'Batch normalisation stabilises training'], formulas: ['z^(l) = W^(l)a^(l-1) + b^(l)', 'a^(l) = g(z^(l))', 'δ^(l) = (W^(l+1))ᵀδ^(l+1) ⊙ g\'(z^(l))'], diagramType: 'block', diagramLabel: 'MLP Forward and Backward Pass' }
      ]
    }
  ],
  CS301: [
    {
      title: 'Relational Model and SQL',
      overview: 'Relational algebra, SQL DDL, DML, DCL, TCL statements.',
      topics: [
        { title: 'Relational Algebra', explanation: 'Relational algebra defines operations on relations (tables). Select σ: filters rows by condition. Project π: selects columns. Cartesian product ×: all combinations of rows. Natural join ⋈: join on common attributes. Set operations: union ∪, intersection ∩, difference −. Division ÷: tuples in R related to all tuples in S. Rename ρ: renames relation/attributes.', keyPoints: ['Select is horizontal slice; Project is vertical slice', 'Natural join automatically joins on same-named attributes', 'Division useful for "for all" queries'], formulas: ['σ_condition(R)', 'π_attrs(R)', 'R ⋈ S'], diagramType: 'flowchart', diagramLabel: 'Relational Algebra Operations' },
        { title: 'SQL – DDL, DML, Joins', explanation: 'DDL: CREATE TABLE, ALTER TABLE, DROP TABLE. DML: SELECT, INSERT, UPDATE, DELETE. Joins: INNER JOIN (matching rows only), LEFT JOIN (all left + matching right), RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN. Aggregate functions: COUNT, SUM, AVG, MAX, MIN with GROUP BY and HAVING. Subqueries: correlated and non-correlated. Views: virtual tables.', keyPoints: ['INNER JOIN = intersection; OUTER JOINs include non-matching', 'HAVING filters groups; WHERE filters rows', 'Subquery in SELECT called scalar subquery'], formulas: [], diagramType: 'flowchart', diagramLabel: 'SQL JOIN Types Venn Diagram' }
      ]
    },
    {
      title: 'Normalisation',
      overview: 'Functional dependencies, 1NF, 2NF, 3NF, BCNF.',
      topics: [
        { title: 'Functional Dependencies and Normal Forms', explanation: 'Functional dependency X→Y: value of X uniquely determines Y. Armstrong axioms: reflexivity, augmentation, transitivity. 1NF: atomic values only. 2NF: 1NF + no partial dependency on any part of composite primary key. 3NF: 2NF + no transitive dependency (non-key → non-key). BCNF: for every X→Y, X is a superkey. BCNF is stricter than 3NF; may lose lossless join or dependency preservation.', keyPoints: ['Partial dependency: non-key depends on part of composite PK', 'Transitive dependency: A→B→C where B is non-key', 'BCNF eliminates all anomalies but may not preserve all FDs'], formulas: ['Closure X⁺: apply all FDs starting from X'], diagramType: 'flowchart', diagramLabel: 'Decomposition to 3NF/BCNF' }
      ]
    },
    {
      title: 'Transactions and Concurrency Control',
      overview: 'ACID properties, schedules, locking, deadlock, recovery.',
      topics: [
        { title: 'ACID and Concurrency', explanation: 'Atomicity: all or nothing. Consistency: DB moves between valid states. Isolation: concurrent transactions non-interfering. Durability: committed changes survive failures. Serializability: a schedule is serializable if equivalent to some serial schedule. Conflict serializability: test with precedence graph (no cycle = conflict serializable). Two-phase locking (2PL): growing phase (acquire locks) then shrinking phase (release), guarantees conflict serializability.', keyPoints: ['2PL guarantees conflict serializability', 'Deadlock: cycle in wait-for graph, resolved by rollback', 'MVCC (used by PostgreSQL) avoids read locks'], formulas: [], diagramType: 'flowchart', diagramLabel: '2-Phase Locking Protocol' }
      ]
    }
  ]
};

// ─── QUIZZES DATA ─────────────────────────────────────────────────────────────
const quizTemplates = {
  EC302: {
    title: 'DSP – Unit Diagnostic Quiz',
    type: 'diagnostic',
    description: 'Tricky MCQs on DSP fundamentals with explanations.',
    questions: [
      { question: 'What is the theoretical complexity of a Radix-2 FFT compared to a direct DFT computation for N=1024 points?', options: ['O(N²) vs O(N log₂N)', 'O(N log₂N) vs O(N²)', 'O(N) vs O(N log₂N)', 'O(N log₂N) vs O(N log₂N)'], correctAnswer: 1, explanation: 'Direct DFT: O(N²) = 1,048,576 operations. FFT: O(N log₂N) = 1024×10 = 10,240 operations — roughly 100× faster.', difficulty: 'medium', topic: 'FFT' },
      { question: 'A causal LTI system has h[n] = (0.5)ⁿu[n]. What is the ROC of its Z-transform?', options: ['|z| < 0.5', '|z| > 0.5', '0.5 < |z| < 1', 'All z except z=0'], correctAnswer: 1, explanation: 'Z-transform: H(z)=z/(z−0.5). For causal signals, ROC is |z| > |pole| = 0.5.', difficulty: 'hard', topic: 'Z-Transform' },
      { question: 'Which window has the highest main-lobe width but best stopband attenuation?', options: ['Rectangular', 'Hamming', 'Hanning', 'Blackman'], correctAnswer: 3, explanation: 'Blackman window: widest main lobe (~12π/N) but best stopband attenuation of −74 dB. Rectangular: narrowest main lobe, worst attenuation (−13 dB).', difficulty: 'medium', topic: 'FIR Filters' },
      { question: 'For an N-point circular convolution, multiplying two DFTs X[k] and H[k] and taking IDFT gives:', options: ['Linear convolution', 'Circular convolution of length N', 'Cross-correlation', 'Linear correlation'], correctAnswer: 1, explanation: 'Multiplication in DFT domain corresponds to N-point circular (cyclic) convolution in time domain, not linear convolution.', difficulty: 'easy', topic: 'DFT' },
      { question: 'A Butterworth filter of order N=3 with cutoff Ωc=1 rad/s. What is |H(j1)|?', options: ['1', '0.707', '1/√2', '0.5'], correctAnswer: 1, explanation: '|H(jΩc)| = 1/√(1+(Ωc/Ωc)^2N) = 1/√2 ≈ 0.707 regardless of order N. The −3dB cutoff is always 1/√2 of passband.', difficulty: 'medium', topic: 'IIR Filters' }
    ]
  },
  CS201: {
    title: 'Data Structures – Diagnostic Quiz',
    type: 'diagnostic',
    description: 'MCQs covering arrays, trees, graphs and sorting.',
    questions: [
      { question: 'What is the worst-case time complexity to search for an element in a balanced BST?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 1, explanation: 'Balanced BST has height O(log n), so search traverses at most O(log n) nodes.', difficulty: 'easy', topic: 'BST' },
      { question: 'Which sorting algorithm is most efficient for nearly-sorted data?', options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'], correctAnswer: 2, explanation: 'Insertion sort runs in O(n) for nearly sorted data since each element moves very few positions. It has the lowest constant factors for small/nearly-sorted inputs.', difficulty: 'medium', topic: 'Sorting' },
      { question: 'In Dijkstra\'s algorithm with a binary min-heap, what is the overall time complexity for a graph with V vertices and E edges?', options: ['O(V²)', 'O(E log V)', 'O((V+E) log V)', 'O(V log E)'], correctAnswer: 2, explanation: 'With min-heap: each vertex extracted once O(V log V), each edge relaxed once O(E log V). Total: O((V+E) log V).', difficulty: 'hard', topic: 'Graphs' },
      { question: 'An AVL tree after insertion may require at most how many rotations to restore balance?', options: ['1', '2', 'O(log n)', 'O(n)'], correctAnswer: 1, explanation: 'AVL insertion requires at most 2 rotations (a double rotation like LR or RL). Deletion may require O(log n) rotations.', difficulty: 'medium', topic: 'Trees' },
      { question: 'Which data structure best supports O(1) average-case insertion, deletion, and lookup?', options: ['Balanced BST', 'Hash Table', 'Skip List', 'B-Tree'], correctAnswer: 1, explanation: 'Hash table with a good hash function provides O(1) average for all three operations. BST and B-Tree are O(log n).', difficulty: 'easy', topic: 'Hash Tables' }
    ]
  },
  AI301: {
    title: 'Machine Learning – Diagnostic Quiz',
    type: 'diagnostic',
    description: 'Conceptual and computational ML questions.',
    questions: [
      { question: 'What does a high bias and low variance model indicate?', options: ['Overfitting', 'Underfitting', 'Perfect fit', 'Noisy data'], correctAnswer: 1, explanation: 'High bias means the model has oversimplified assumptions and underfits the data. Low variance means predictions are consistent but systematically wrong.', difficulty: 'easy', topic: 'Bias-Variance' },
      { question: 'In gradient descent, if the learning rate α is too large, what happens?', options: ['Slow convergence', 'Divergence / oscillation', 'Immediate convergence', 'Overfitting'], correctAnswer: 1, explanation: 'Too large α causes the update steps to overshoot the minimum, leading to oscillation or divergence of the loss function.', difficulty: 'medium', topic: 'Gradient Descent' },
      { question: 'Which regularisation technique produces sparse weights (feature selection)?', options: ['L2 (Ridge)', 'L1 (Lasso)', 'Elastic Net', 'Dropout'], correctAnswer: 1, explanation: 'L1 regularisation adds |w| penalty. Its gradient is a constant sign(w), which drives small weights to exactly 0, producing sparsity and implicit feature selection.', difficulty: 'medium', topic: 'Regularisation' },
      { question: 'The decision boundary of a logistic regression classifier is:', options: ['A parabola', 'A hyperplane (linear)', 'A circle', 'Depends on data'], correctAnswer: 1, explanation: 'Logistic regression models P(y=1|x) = σ(wᵀx+b). The decision boundary wᵀx+b=0 is linear (a hyperplane in the feature space).', difficulty: 'easy', topic: 'Logistic Regression' },
      { question: 'What is the purpose of the softmax function in multi-class classification?', options: ['Normalises outputs to sum to 1 (probability distribution)', 'Prevents vanishing gradient', 'Performs feature scaling', 'Selects top-k features'], correctAnswer: 0, explanation: 'Softmax: σ(z)ᵢ = eᶻⁱ/Σeᶻʲ. Converts raw logits into a probability distribution over classes that sums to 1.', difficulty: 'easy', topic: 'Neural Networks' }
    ]
  },
  EC401: {
    title: 'Digital Communications – Diagnostic Quiz',
    type: 'diagnostic',
    description: 'MCQs on PCM, modulation schemes, and error coding.',
    questions: [
      { question: 'In BPSK, what is the minimum Eb/N0 required to achieve BER of 10⁻⁵?', options: ['9.6 dB', '12.6 dB', '6 dB', '3 dB'], correctAnswer: 0, explanation: 'BPSK BER = Q(√(2Eb/N0)). For BER=10⁻⁵, Q(x)=10⁻⁵ → x≈4.26, so 2Eb/N0≈18.1, Eb/N0≈9.06 ≈ 9.6 dB.', difficulty: 'hard', topic: 'Digital Modulation' },
      { question: 'Which source coding theorem states the minimum average code length?', options: ['Nyquist theorem', 'Shannon-Hartley theorem', "Shannon's first theorem (source coding)", 'Huffman bound'], correctAnswer: 2, explanation: "Shannon's source coding theorem: average code length L ≥ H(X) (entropy), with equality achievable for a perfect code.", difficulty: 'medium', topic: 'Source Coding' },
      { question: 'PCM with 8 bits per sample and 8 kHz sampling rate gives what bit rate?', options: ['8 kbps', '64 kbps', '32 kbps', '16 kbps'], correctAnswer: 1, explanation: 'Bit rate = sampling rate × bits per sample = 8000 × 8 = 64,000 bps = 64 kbps. This is the standard G.711 voice codec rate.', difficulty: 'easy', topic: 'PCM' },
      { question: 'OFDM mitigates inter-symbol interference (ISI) by:', options: ['Increasing symbol rate', 'Adding cyclic prefix longer than channel delay spread', 'Using higher-order QAM', 'Applying turbo codes'], correctAnswer: 1, explanation: 'Cyclic prefix (CP) of length ≥ channel delay spread turns linear convolution into circular, eliminating ISI between OFDM symbols.', difficulty: 'medium', topic: 'OFDM' },
      { question: 'A (7,4) Hamming code can detect up to how many bit errors?', options: ['1', '2', '3', '4'], correctAnswer: 1, explanation: 'Minimum Hamming distance dmin=3 for (7,4) Hamming code. Can detect dmin−1=2 errors, correct ⌊(dmin−1)/2⌋=1 error.', difficulty: 'medium', topic: 'Error Coding' }
    ]
  }
};

// ─── FLASHCARDS DATA ──────────────────────────────────────────────────────────
const flashcardTemplates = {
  EC302: [
    { question: 'What is the theoretical complexity of a Radix-2 FFT compared to direct DFT computation?', answer: 'FFT: O(N log₂N) vs Direct DFT: O(N²). For N=1024, FFT ≈ 10,240 operations vs 1,048,576 — about 100× faster.', topic: 'Fast Fourier Transform', difficulty: 'medium' },
    { question: 'State the condition for BIBO stability of an LTI system in terms of its impulse response h[n].', answer: 'BIBO stable ⟺ Σₙ |h[n]| < ∞ (absolute summability). Equivalently, all poles of H(z) must lie strictly inside the unit circle.', topic: 'LTI Systems', difficulty: 'medium' },
    { question: 'What is the key advantage of a Hamming window over a rectangular window in FIR filter design?', answer: 'Hamming window: −53 dB stopband attenuation vs −13 dB for rectangular, at the cost of a wider main lobe (and hence wider transition band).', topic: 'FIR Filters', difficulty: 'easy' },
    { question: 'Define the Region of Convergence (ROC) for a causal right-sided sequence.', answer: 'For a causal (right-sided) sequence, ROC is the exterior of a circle: |z| > r, where r is the magnitude of the outermost pole. The ROC always includes z = ∞.', topic: 'Z-Transform', difficulty: 'hard' },
    { question: 'What is the bilinear transform and why is pre-warping needed?', answer: 'Bilinear: s = (2/T)·(1−z⁻¹)/(1+z⁻¹). It maps jΩ axis to unit circle nonlinearly (frequency warping). Pre-warping adjusts critical frequency: Ωa = (2/T)·tan(ωd/2) to place it at the correct digital frequency.', topic: 'IIR Filters', difficulty: 'hard' }
  ],
  CS201: [
    { question: 'What is the amortized time complexity of appending n elements to a dynamic array (ArrayList)?', answer: 'O(1) amortized per append. Array doubles when full: total copies after n appends ≤ 2n, so average cost = O(1) per operation (O(n) total).', topic: 'Arrays', difficulty: 'medium' },
    { question: 'In a BST delete operation, when the node has two children, what replaces it?', answer: 'The inorder successor (smallest node in right subtree) or inorder predecessor (largest in left subtree). The replacement node is then deleted from its original position.', topic: 'BST', difficulty: 'medium' },
    { question: 'Why does Quick Sort perform poorly on already-sorted input with a naive pivot choice?', answer: 'With first/last element as pivot on sorted data, every partition is maximally unbalanced (0 and n−1 elements). Recursion depth becomes O(n), giving O(n²) time. Fix: randomised pivot or median-of-3.', topic: 'Sorting', difficulty: 'hard' },
    { question: 'What is the space complexity of BFS on a graph with V vertices and E edges?', answer: 'O(V) — the queue holds at most V vertices simultaneously. The visited array is also O(V). Total space O(V), not counting the adjacency list storage O(V+E).', topic: 'Graphs', difficulty: 'easy' },
    { question: 'Difference between a min-heap and a BST?', answer: 'Min-heap: parent ≤ children, complete binary tree, O(log n) insert/extract-min, no ordered traversal. BST: left < root < right, O(log n) search/insert/delete (balanced), inorder gives sorted order.', topic: 'Trees', difficulty: 'medium' }
  ],
  AI301: [
    { question: 'What does the bias-variance tradeoff mean in ML?', answer: 'Total error = Bias² + Variance + Irreducible noise. High bias (underfitting): model too simple. High variance (overfitting): model memorises training data. Goal: find model complexity that minimises both.', topic: 'Fundamentals', difficulty: 'easy' },
    { question: 'What is the difference between L1 and L2 regularisation?', answer: 'L1 (Lasso): adds Σ|wᵢ| penalty, drives weights to exactly 0 → sparse model, implicit feature selection. L2 (Ridge): adds Σwᵢ² penalty, shrinks weights uniformly toward 0 but rarely to exactly 0.', topic: 'Regularisation', difficulty: 'medium' },
    { question: 'Why is ReLU preferred over sigmoid/tanh in deep networks?', answer: 'Sigmoid/tanh saturate for large |x|, causing near-zero gradients (vanishing gradient problem). ReLU = max(0,x) has gradient 1 for x>0, enabling effective training of deep networks.', topic: 'Neural Networks', difficulty: 'medium' },
    { question: 'What is the kernel trick in SVM?', answer: 'Kernel trick implicitly maps data to a higher-dimensional space without explicitly computing coordinates. K(x,x\') = φ(x)·φ(x\'). Common kernels: RBF/Gaussian K=exp(−γ||x−x\'||²), polynomial, sigmoid. Enables non-linear decision boundaries.', topic: 'SVM', difficulty: 'hard' },
    { question: 'Explain the Gini impurity used in decision trees.', answer: 'Gini impurity G = 1 − Σpᵢ². Measures probability that a randomly chosen element is incorrectly classified. G=0: pure node. G=0.5: maximum impurity for binary class. CART minimises weighted Gini of child nodes at each split.', topic: 'Decision Trees', difficulty: 'medium' }
  ],
  EC401: [
    { question: 'What is the bandwidth of a standard PCM voice channel?', answer: '64 kbps. Derived from 8000 samples/sec × 8 bits/sample (G.711 standard). This is the basis of one DS0 channel in T1/E1 telephony.', topic: 'PCM', difficulty: 'easy' },
    { question: 'How does a cyclic prefix in OFDM eliminate ISI?', answer: 'CP copies the last Tcp seconds of each OFDM symbol to its front. If CP length ≥ channel delay spread, each subcarrier experiences flat fading. The CP converts linear convolution to circular, making equalisation trivial (1-tap per subcarrier).', topic: 'OFDM', difficulty: 'hard' },
    { question: 'State the Shannon channel capacity formula and its parameters.', answer: 'C = B·log₂(1 + S/N) bits/sec. B = bandwidth (Hz), S/N = signal-to-noise ratio (linear). C represents the theoretical maximum error-free data rate. For B=1 MHz and SNR=63: C=6 Mbps.', topic: 'Shannon Theory', difficulty: 'medium' },
    { question: 'What is the minimum Hamming distance needed to correct t errors?', answer: 'dmin ≥ 2t + 1. To detect t errors: dmin ≥ t + 1. Example: (7,4) Hamming code has dmin=3, can correct 1 error and detect 2 errors.', topic: 'Error Coding', difficulty: 'medium' },
    { question: 'Compare BPSK and QPSK in terms of bandwidth efficiency and BER.', answer: 'QPSK carries 2 bits/symbol vs BPSK 1 bit/symbol, doubling spectral efficiency. Same BER performance since QPSK effectively sends two independent BPSK signals in quadrature: BER = Q(√(2Eb/N0)).', topic: 'Digital Modulation', difficulty: 'hard' }
  ]
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Subject.deleteMany({});
  await Unit.deleteMany({});
  await Quiz.deleteMany({});
  await Flashcard.deleteMany({});
  console.log('Cleared existing data');

  // Insert subjects
  const subjects = await Subject.insertMany(subjectsData);
  console.log(`Inserted ${subjects.length} subjects`);

  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.code] = s._id; });

  // Insert units for each subject with template
  let unitCount = 0;
  for (const [code, unitDefs] of Object.entries(unitTemplates)) {
    if (!subjectMap[code]) continue;
    const units = makeUnits(subjectMap[code], unitDefs);
    await Unit.insertMany(units);
    unitCount += units.length;
  }

  // Generic units for subjects without specific templates
  for (const subject of subjects) {
    if (unitTemplates[subject.code]) continue;
    const genericUnits = [
      { subject: subject._id, unitNumber: 1, title: 'Fundamentals and Introduction', overview: `Core concepts and introduction to ${subject.name}.`, topics: [{ title: 'Overview and Scope', explanation: `${subject.name} covers ${subject.description}. This unit introduces foundational concepts, terminology, and the overall structure of the subject.`, keyPoints: ['Define key terms', 'Understand scope and applications', 'Historical background'], formulas: [], diagramType: 'block', diagramLabel: 'Subject Overview' }] },
      { subject: subject._id, unitNumber: 2, title: 'Core Principles', overview: `Fundamental principles and theorems in ${subject.name}.`, topics: [{ title: 'Key Theorems and Laws', explanation: `Core mathematical and theoretical framework of ${subject.name}. Understanding these principles is essential for advanced topics.`, keyPoints: ['Apply fundamental theorems', 'Derive key equations', 'Solve standard problems'], formulas: [], diagramType: 'graph', diagramLabel: 'Core Principle Diagram' }] },
      { subject: subject._id, unitNumber: 3, title: 'Applications and Design', overview: `Practical applications and design techniques in ${subject.name}.`, topics: [{ title: 'Design Methodology', explanation: `Systematic approach to designing systems/solutions in ${subject.name}. Includes step-by-step methodology and case studies.`, keyPoints: ['Follow systematic design steps', 'Apply specifications', 'Verify and validate'], formulas: [], diagramType: 'flowchart', diagramLabel: 'Design Flow' }] },
      { subject: subject._id, unitNumber: 4, title: 'Advanced Topics', overview: `Advanced and emerging topics in ${subject.name}.`, topics: [{ title: 'Advanced Concepts', explanation: `In-depth treatment of advanced topics in ${subject.name}, including recent developments and research directions.`, keyPoints: ['Understand advanced mechanisms', 'Compare approaches', 'Identify trade-offs'], formulas: [], diagramType: 'none', diagramLabel: '' }] },
      { subject: subject._id, unitNumber: 5, title: 'Practical Implementation', overview: `Laboratory and practical implementation aspects.`, topics: [{ title: 'Lab Work and Projects', explanation: `Hands-on implementation and project work for ${subject.name}. Includes lab procedures, common tools, and evaluation criteria.`, keyPoints: ['Set up laboratory environment', 'Implement and test', 'Document results'], formulas: [], diagramType: 'block', diagramLabel: 'Implementation Block' }] }
    ];
    await Unit.insertMany(genericUnits);
    unitCount += genericUnits.length;
  }
  console.log(`Inserted ${unitCount} units`);

  // Insert quizzes
  let quizCount = 0;
  for (const [code, quizDef] of Object.entries(quizTemplates)) {
    if (!subjectMap[code]) continue;
    await Quiz.create({ ...quizDef, subject: subjectMap[code] });
    quizCount++;
  }
  // Generic quiz for remaining subjects
  for (const subject of subjects) {
    if (quizTemplates[subject.code]) continue;
    await Quiz.create({
      subject: subject._id, title: `${subject.name} – Diagnostic Quiz`, type: 'diagnostic',
      description: `Test your knowledge of ${subject.name}.`,
      questions: [
        { question: `What is the primary focus of ${subject.name}?`, options: [subject.description, 'Hardware design only', 'Software only', 'Mathematics only'], correctAnswer: 0, explanation: `${subject.name} covers: ${subject.description}`, difficulty: 'easy', topic: 'Overview' },
        { question: `${subject.name} belongs to which year and semester?`, options: [`Year ${subject.year}, Semester ${subject.semester}`, `Year ${subject.year + 1}, Semester ${subject.semester}`, `Year ${subject.year}, Semester ${subject.semester + 1}`, 'Final Year only'], correctAnswer: 0, explanation: `This subject (${subject.code}) is taught in Year ${subject.year}, Semester ${subject.semester}.`, difficulty: 'easy', topic: 'General' },
        { question: `What does the subject code ${subject.code} represent?`, options: [`${subject.name}`, 'A lab course', 'An elective only', 'Common subject for all branches'], correctAnswer: 0, explanation: `${subject.code} is the official JNTU course code for ${subject.name}.`, difficulty: 'easy', topic: 'General' }
      ]
    });
    quizCount++;
  }
  console.log(`Inserted ${quizCount} quizzes`);

  // Insert flashcards
  let fcCount = 0;
  for (const [code, cards] of Object.entries(flashcardTemplates)) {
    if (!subjectMap[code]) continue;
    await Flashcard.insertMany(cards.map(c => ({ ...c, subject: subjectMap[code] })));
    fcCount += cards.length;
  }
  for (const subject of subjects) {
    if (flashcardTemplates[subject.code]) continue;
    await Flashcard.insertMany([
      { subject: subject._id, question: `Define the scope of ${subject.name} (${subject.code}).`, answer: subject.description, topic: 'Overview', difficulty: 'easy' },
      { subject: subject._id, question: `In which year and semester is ${subject.code} taught at BWEC?`, answer: `Year ${subject.year}, Semester ${subject.semester}. Credits: ${subject.credits}.`, topic: 'General', difficulty: 'easy' },
      { subject: subject._id, question: `Name two key applications of ${subject.name}.`, answer: `${subject.name} is applied in: (1) industry-level system design and (2) research and academic projects. Specific applications depend on the unit topic studied.`, topic: 'Applications', difficulty: 'medium' }
    ]);
    fcCount += 3;
  }
  console.log(`Inserted ${fcCount} flashcards`);

  console.log('\n✅ Seed complete!');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
