import fs from 'fs';
import path from 'path';
import { User, DocumentItem, GraphNode, GraphEdge, TimelineEvent, ChatMessage, CareerInsights, ResumeTemplateData, PortfolioData } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  user: User;
  documents: DocumentItem[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  timeline: TimelineEvent[];
  chatHistory: ChatMessage[];
  resumeConfig: ResumeTemplateData;
  portfolioConfig: PortfolioData;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultUser: User = {
  id: 'user_1',
  name: 'Alex Mercer',
  email: 'alex.mercer@university.edu',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  bio: 'Computer Science & AI Undergraduate | Full-Stack Developer | Open Source Enthusiast. Passionate about computer vision, cloud architectures, and building products that make a difference.',
  careerGoal: 'Become a Lead Machine Learning Engineer / Full-Stack Architect at a cutting-edge technology lab.',
  targetRole: 'Machine Learning Engineer / Full-Stack Developer'
};

const initialDocuments: DocumentItem[] = [
  {
    id: 'doc_1',
    name: 'Alex_Mercer_Placement_Resume_2026.pdf',
    type: 'pdf',
    category: 'Resume',
    uploadDate: '2026-01-15T10:30:00Z',
    size: '1.4 MB',
    contentText: `ALEX MERCER
Email: alex.mercer@university.edu | Phone: +1-555-0199 | GitHub: github.com/alexmercer | Portfolio: alexmercer.dev

EDUCATION
- Bachelor of Technology in Computer Science & Engineering (GPA: 9.4/10) | Expected 2026
  Key Courses: Machine Learning, Neural Networks, Computer Vision, Cloud Computing, Algorithms

EXPERIENCE
- Machine Learning Intern | IIT Bombay | May 2025 - July 2025
  * Built real-time Deep Learning models for PPE detection on edge devices.
  * Achieved 94.2% mAP on custom datasets using PyTorch and YOLOv8.
  * Optimized inference speeds by 40% using TensorRT and ONNX.

PROJECTS
- Smart PPE Detection Engine (TensorFlow, YOLOv8, OpenCV, React, FastAPI)
  * End-to-end computer vision pipeline deploying custom safety gear detection.
  * Integrated web UI using React and WebSockets for real-time video stream alerts.
- CloudScale serverless cluster (AWS, Docker, Kubernetes)
  * Architected serverless microservices autoscaling cluster.

CERTIFICATIONS & LEADERBOARD
- AWS Certified Solutions Architect (2025)
- Google IT Automation with Python Professional Certificate (Coursera - 2025)
- 1st Place Winner - Smart India Hackathon 2025 (AI Track)`,
    metadata: {
      name: 'Alex Mercer',
      college: 'Indian Institute of Technology',
      university: 'IIT Bombay',
      skills: ['Python', 'React', 'FastAPI', 'PyTorch', 'TensorFlow', 'OpenCV', 'AWS', 'Docker', 'Kubernetes', 'Computer Vision', 'Deep Learning', 'SQL', 'Serverless'],
      programmingLanguages: ['Python', 'TypeScript', 'JavaScript', 'C++'],
      frameworks: ['React', 'FastAPI', 'PyTorch', 'TensorFlow', 'TailwindCSS'],
      libraries: ['OpenCV', 'NumPy', 'Pandas', 'scikit-learn'],
      projects: ['Smart PPE Detection Engine', 'CloudScale serverless cluster'],
      achievements: ['1st Place Winner - Smart India Hackathon 2025', 'Final Year CS Top Ranker'],
      internships: ['Machine Learning Intern at IIT Bombay'],
      certificates: ['AWS Certified Solutions Architect', 'Google IT Automation with Python'],
      organizations: ['IIT Bombay', 'Coursera', 'AWS'],
      hackathons: ['Smart India Hackathon 2025'],
      dates: ['May 2025', 'July 2025', '2025', 'Expected 2026'],
      awards: ['1st Place Smart India Hackathon'],
      cgpa: '9.4/10',
      researchPapers: ['Real-Time Edge Computer Vision for Industrial Safety (Preprint)'],
      patents: [],
      technologies: ['YOLOv8', 'TensorRT', 'ONNX', 'WebSockets', 'Serverless', 'Microservices'],
      softSkills: ['Leadership', 'Problem Solving', 'Public Speaking', 'Team Collaboration'],
      responsibilities: ['Industrial safety model engineering', 'Serverless microservice architecture design'],
      companies: ['IIT Bombay'],
      jobRoles: ['Machine Learning Intern'],
      mentions: ['TensorRT', 'ONNX', 'YOLOv8', 'IIT Bombay'],
      summary: 'Comprehensive placement resume for Alex Mercer, a top-performing CS student specializing in Machine Learning, Edge AI, and Full-Stack cloud application development.'
    },
    versionHistory: [
      { version: 1, name: 'Alex_Mercer_Draft_Resume_2025.pdf', updatedAt: '2025-08-20T14:22:00Z', size: 1250000 },
      { version: 2, name: 'Alex_Mercer_Placement_Resume_2026.pdf', updatedAt: '2026-01-15T10:30:00Z', size: 1400000 }
    ]
  },
  {
    id: 'doc_2',
    name: 'Google_Python_Automation_Specialization.pdf',
    type: 'pdf',
    category: 'Certificates',
    uploadDate: '2025-03-10T15:45:00Z',
    size: '720 KB',
    contentText: `COURSERA CERTIFICATE OF COMPLETION
This is to certify that Alex Mercer has successfully completed the online, non-credit professional specialization:
Google IT Automation with Python
Authorized by Google and offered through Coursera.
Courses Completed:
1. Crash Course on Python
2. Using Python to Interact with the Operating System
3. Introduction to Git and GitHub
4. Troubleshooting and Debugging Techniques
5. Configuration Management and the Cloud
6. Automating Real-World Tasks with Python
Verify at: coursera.org/verify/googlepython2025`,
    metadata: {
      name: 'Alex Mercer',
      skills: ['Python', 'Automation', 'Operating Systems', 'Git', 'GitHub', 'Troubleshooting', 'Debugging', 'Configuration Management', 'Cloud Automation'],
      programmingLanguages: ['Python'],
      frameworks: [],
      libraries: [],
      projects: [],
      achievements: ['Professional Python Specialization Completion'],
      internships: [],
      certificates: ['Google IT Automation with Python'],
      organizations: ['Google', 'Coursera'],
      hackathons: [],
      dates: ['March 2025'],
      awards: [],
      cgpa: '',
      researchPapers: [],
      patents: [],
      technologies: ['Git', 'GitHub', 'Configuration Management', 'Bash Shell'],
      softSkills: ['Troubleshooting', 'Debugging', 'Systems Engineering'],
      responsibilities: [],
      companies: ['Google'],
      jobRoles: [],
      mentions: ['Coursera', 'Google'],
      summary: 'Professional certificate from Google and Coursera, certifying mastery of Python scripting, operational automation, Git version control, troubleshooting, and cloud configuration.'
    },
    versionHistory: [
      { version: 1, name: 'Google_Python_Automation_Specialization.pdf', updatedAt: '2025-03-10T15:45:00Z', size: 737280 }
    ]
  },
  {
    id: 'doc_3',
    name: 'AWS_Certified_Solutions_Architect.pdf',
    type: 'pdf',
    category: 'Certificates',
    uploadDate: '2025-09-22T09:12:00Z',
    size: '840 KB',
    contentText: `AMAZON WEB SERVICES (AWS) CERTIFICATION
AWS Certified Solutions Architect – Associate
This is to certify that Alex Mercer is hereby awarded this certification on successful completion of all requirements.
Validation ID: AWS-ASA-77491-2025
Issue Date: Sep 22, 2025 | Expiration Date: Sep 22, 2028
Topics Covered: High Availability, Elastic Computing, Serverless Architectures, Cloud Security, Cost Optimization, IAM, VPC, S3, RDS, Lambda`,
    metadata: {
      name: 'Alex Mercer',
      skills: ['AWS', 'Cloud Computing', 'Serverless', 'VPC', 'IAM', 'Amazon S3', 'AWS Lambda', 'RDS', 'Security', 'Cost Optimization', 'High Availability'],
      programmingLanguages: [],
      frameworks: [],
      libraries: [],
      projects: [],
      achievements: ['AWS Certified Solutions Architect Associate'],
      internships: [],
      certificates: ['AWS Certified Solutions Architect – Associate'],
      organizations: ['Amazon Web Services'],
      hackathons: [],
      dates: ['Sep 22, 2025', 'Sep 22, 2028'],
      awards: [],
      cgpa: '',
      researchPapers: [],
      patents: [],
      technologies: ['AWS Lambda', 'VPC', 'IAM', 'Amazon S3', 'RDS', 'EC2'],
      softSkills: ['Systems Design', 'Architectural Thinking'],
      responsibilities: [],
      companies: ['Amazon Web Services'],
      jobRoles: [],
      mentions: ['AWS', 'Solutions Architect'],
      summary: 'AWS Solutions Architect Associate certificate, validating Alex\'s expertise in designing resilient, highly available, secure, and cost-optimized serverless cloud infrastructures.'
    },
    versionHistory: [
      { version: 1, name: 'AWS_Certified_Solutions_Architect.pdf', updatedAt: '2025-09-22T09:12:00Z', size: 860160 }
    ]
  },
  {
    id: 'doc_4',
    name: 'IIT_Bombay_ML_Internship_Letter.pdf',
    type: 'pdf',
    category: 'Internships',
    uploadDate: '2025-08-05T11:00:00Z',
    size: '1.1 MB',
    contentText: `INDIAN INSTITUTE OF TECHNOLOGY BOMBAY (IIT BOMBAY)
DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
Date: August 5, 2025

TO WHOM IT MAY CONCERN

This is to certify that Alex Mercer, a student of Computer Science, has successfully completed a research internship under my supervision from May 15, 2025, to July 31, 2025.
During this tenure, Alex worked on the project titled "Real-Time industrial Edge AI Systems for Safety Monitoring".
He engineered a state-of-the-art computer vision model using PyTorch and YOLOv8 for detecting personal protective equipment (PPE) like helmets and high-visibility vests.
He optimized the inference pipeline on NVIDIA Jetson edge boards using TensorRT, achieving a 40% speed-up without losing mAP.
Alex demonstrated excellent problem-solving, theoretical knowledge, and coding skills. His dedication is highly commendable.
Signed,
Dr. Ramesh Sharma, Professor
CSE Department, IIT Bombay`,
    metadata: {
      name: 'Alex Mercer',
      college: 'IIT Bombay',
      university: 'Indian Institute of Technology Bombay',
      skills: ['PyTorch', 'YOLOv8', 'Computer Vision', 'NVIDIA Jetson', 'TensorRT', 'Edge AI', 'Industrial Safety Monitoring', 'Model Optimization'],
      programmingLanguages: ['Python'],
      frameworks: ['PyTorch'],
      libraries: ['OpenCV'],
      projects: ['Real-Time industrial Edge AI Systems for Safety Monitoring'],
      achievements: ['Successful completion of IIT Bombay research internship', '40% inference optimization accomplishment'],
      internships: ['Research Internship at IIT Bombay'],
      certificates: [],
      organizations: ['IIT Bombay'],
      hackathons: [],
      dates: ['May 15, 2025', 'July 31, 2025', 'August 5, 2025'],
      awards: [],
      cgpa: '',
      researchPapers: [],
      patents: [],
      technologies: ['YOLOv8', 'TensorRT', 'NVIDIA Jetson Nano', 'Edge Devices'],
      softSkills: ['Problem Solving', 'Theoretical Knowledge', 'Dedication', 'Team Collaboration'],
      responsibilities: ['Engineering Edge AI vision model', 'Developing optimization using TensorRT', 'Deploying on NVIDIA Jetson boards'],
      companies: ['IIT Bombay'],
      jobRoles: ['Research Intern'],
      mentions: ['Dr. Ramesh Sharma', 'IIT Bombay'],
      summary: 'Internship recommendation letter from IIT Bombay Department of CS, confirming Alex\'s contributions to Edge AI and deep learning optimizations under Dr. Ramesh Sharma.'
    },
    versionHistory: [
      { version: 1, name: 'IIT_Bombay_ML_Internship_Letter.pdf', updatedAt: '2025-08-05T11:00:00Z', size: 1126400 }
    ]
  },
  {
    id: 'doc_5',
    name: 'Smart_India_Hackathon_2025_Certificate.pdf',
    type: 'pdf',
    category: 'Hackathons',
    uploadDate: '2025-11-20T18:00:00Z',
    size: '950 KB',
    contentText: `SMART INDIA HACKATHON 2025
Organized by Ministry of Education, Govt. of India
CERTIFICATE OF ACHIEVEMENT
This is awarded to Alex Mercer representing Team Visionaries for winning the FIRST PLACE (1st Prize) in the National AI Track.
Problem Statement: AI-based real-time surveillance of rail tracks for safety hazards.
The project involved processing high-definition drone footage using deep neural network grids to trigger automated structural crack and obstruction warnings under 2 seconds.
Date: November 18, 2025`,
    metadata: {
      name: 'Alex Mercer',
      skills: ['Surveillance AI', 'Drone Footage Processing', 'Deep Neural Networks', 'Real-Time Alerting', 'Crack Detection', 'Structure Safety Grid'],
      programmingLanguages: ['Python', 'TypeScript'],
      frameworks: ['PyTorch'],
      libraries: ['OpenCV', 'PyQt', 'TailwindCSS'],
      projects: ['Drone Rail Surveillance AI Grid'],
      achievements: ['First Place (1st Prize) - Smart India Hackathon 2025'],
      internships: [],
      certificates: ['Smart India Hackathon 2025 Winner'],
      organizations: ['Ministry of Education, India'],
      hackathons: ['Smart India Hackathon 2025'],
      dates: ['November 18, 2025'],
      awards: ['1st Prize Smart India Hackathon National Winner'],
      cgpa: '',
      researchPapers: [],
      patents: [],
      technologies: ['Neural Network Grids', 'Surveillance Alerts', 'Drone Processing'],
      softSkills: ['Team Leadership', 'Fast Prototyping', 'Pressure Management', 'Presentation Skills'],
      responsibilities: ['Team Lead and Lead AI Architect'],
      companies: ['Govt. of India'],
      jobRoles: [],
      mentions: ['Ministry of Education', 'Smart India Hackathon'],
      summary: 'Prestigious national achievement certificate awarding First Prize at the Smart India Hackathon 2025 for building a real-time AI rail surveillance alerting platform.'
    },
    versionHistory: [
      { version: 1, name: 'Smart_India_Hackathon_2025_Certificate.pdf', updatedAt: '2025-11-20T18:00:00Z', size: 972800 }
    ]
  },
  {
    id: 'doc_6',
    name: 'Real_Time_PPE_Detection_Project_Report.pdf',
    type: 'pdf',
    category: 'Projects',
    uploadDate: '2025-12-05T14:00:00Z',
    size: '2.1 MB',
    contentText: `B.TECH CAPSTONE PROJECT REPORT
Title: Smart PPE Detection and Alerting Engine
Author: Alex Mercer
Undergraduate CS Capstone, 2025
ABSTRACT:
This project presents an industrial-grade edge computer vision framework developed to automate safety compliance monitoring.
Utilizing a light YOLOv8 neural network, the model detects safety helmets, high-vis jackets, and protective goggles in milliseconds.
The solution features a dashboard engineered in React and WebSockets, which streams real-time feed detections and displays analytics.
We deployed the backend using FastAPI, routing inference logs directly to a PostgreSQL analytics base.
The system was optimized with NVIDIA TensorRT, enabling 45 FPS on Jetson edge accelerators.`,
    metadata: {
      name: 'Alex Mercer',
      college: 'Computer Science Department',
      skills: ['YOLOv8', 'Computer Vision', 'React', 'FastAPI', 'PostgreSQL', 'WebSockets', 'NVIDIA TensorRT', 'Industrial Compliance Automation', 'Model Deployment'],
      programmingLanguages: ['Python', 'TypeScript'],
      frameworks: ['React', 'FastAPI'],
      libraries: ['OpenCV', 'PyTorch'],
      projects: ['Smart PPE Detection and Alerting Engine'],
      achievements: ['Top-rated Capstone Project Award'],
      internships: [],
      certificates: [],
      organizations: [],
      hackathons: [],
      dates: ['December 2025'],
      awards: ['Best Engineering Capstone Project'],
      cgpa: '',
      researchPapers: ['Real-Time Industrial Safety Surveillance using Edge AI'],
      patents: [],
      technologies: ['YOLOv8', 'TensorRT', 'Jetson Edge Boards', 'WebSockets', 'PostgreSQL'],
      softSkills: ['Scientific Writing', 'Full-stack System Design', 'Product Presentation'],
      responsibilities: ['Author and Lead Developer'],
      companies: [],
      jobRoles: [],
      mentions: ['YOLOv8', 'TensorRT', 'WebSockets', 'FastAPI', 'PostgreSQL'],
      summary: 'Official undergraduate Capstone Project Report detailing the engineering, architectural choices, and performance optimizations of the Smart PPE computer vision platform.'
    },
    versionHistory: [
      { version: 1, name: 'Real_Time_PPE_Detection_Project_Report.pdf', updatedAt: '2025-12-05T14:00:00Z', size: 2202009 }
    ]
  },
  {
    id: 'doc_7',
    name: 'github.com/alexmercer/ppe-detector-engine',
    type: 'url',
    category: 'Open Source',
    uploadDate: '2025-12-10T16:00:00Z',
    size: '12 KB',
    contentText: `GITHUB REPOSITORY OVERVIEW
URL: https://github.com/alexmercer/ppe-detector-engine
Stars: 142 | Forks: 38 | Issues: 2
Readme Content:
# Smart PPE Detection Engine
This repository houses the complete full-stack codebase for our Edge-AI compliance supervisor.
Frontend is powered by React with Vite and styled via Tailwind.
Backend uses FastAPI with an integrated WebSocket pipeline for immediate alerting.
Model training weights and Python optimization scripts are nested in /training, fully supporting YOLOv8 exports to TensorRT engine targets.`,
    metadata: {
      name: 'Alex Mercer',
      skills: ['GitHub', 'Open Source Collaboration', 'FastAPI', 'React', 'Vite', 'TailwindCSS', 'WebSocket Pipeline', 'Model Export', 'Git Workflow'],
      programmingLanguages: ['Python', 'TypeScript', 'Shell'],
      frameworks: ['React', 'FastAPI', 'Vite', 'TailwindCSS'],
      libraries: [],
      projects: ['Smart PPE Detection Engine open-source repository'],
      achievements: ['140+ GitHub Stars on Safety Tech repository'],
      internships: [],
      certificates: [],
      organizations: ['GitHub'],
      hackathons: [],
      dates: ['December 2025'],
      awards: [],
      cgpa: '',
      researchPapers: [],
      patents: [],
      technologies: ['YOLOv8 Export', 'TensorRT Engine', 'WebSocket Streaming'],
      softSkills: ['Open Source Management', 'Documentation Writing', 'Community Support'],
      responsibilities: ['Maintainer and Lead Developer'],
      companies: [],
      jobRoles: [],
      mentions: ['GitHub', 'YOLOv8'],
      summary: 'Public open-source code repository documenting the end-to-end full stack architecture, training workflows, and deployment setups for the Edge PPE Detector.'
    },
    versionHistory: [
      { version: 1, name: 'github.com/alexmercer/ppe-detector-engine', updatedAt: '2025-12-10T16:00:00Z', size: 12288 }
    ]
  },
  {
    id: 'doc_8',
    name: 'alexmercer.dev (Portfolio)',
    type: 'url',
    category: 'Portfolio',
    uploadDate: '2026-01-05T09:00:00Z',
    size: '8 KB',
    contentText: `PERSONAL PORTFOLIO WEBSITE
URL: https://alexmercer.dev
Sections:
- Hero: "Building intelligent systems that see and scale."
- Interactive Live Knowledge Graph visualizing academic papers, certificates, projects, and skill progression.
- Projects Showcase:
  * Smart PPE detector live web demo.
  * Serverless CloudScale deployment dashboard.
- Certificates panel hosting verifiable Google Python and AWS Architect links.
- Contact page with GitHub, LinkedIn, and email buttons.`,
    metadata: {
      name: 'Alex Mercer',
      skills: ['Web Design', 'UI/UX', 'Portfolio Building', 'Interactive Visualization', 'Cloud Deployment Showcase', 'Web Demos Integration'],
      programmingLanguages: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
      frameworks: ['React', 'TailwindCSS', 'Framer Motion'],
      libraries: ['d3.js'],
      projects: ['Personal Portfolio Website'],
      achievements: ['Interactive digital portfolio design'],
      internships: [],
      certificates: [],
      organizations: [],
      hackathons: [],
      dates: ['January 2026'],
      awards: [],
      cgpa: '',
      researchPapers: [],
      patents: [],
      technologies: ['Framer Motion animations', 'Interactive canvas', 'D3 visualization'],
      softSkills: ['Creative Design', 'Personal Branding', 'Communication'],
      responsibilities: ['Creator and Web Designer'],
      companies: [],
      jobRoles: [],
      mentions: ['D3.js', 'Framer Motion'],
      summary: 'VERIFIABLE portfolio link highlighting Alex Mercer\'s engineering projects, active certificate details, interactive d3 resume graphs, and live web application demos.'
    },
    versionHistory: [
      { version: 1, name: 'alexmercer.dev (Portfolio)', updatedAt: '2026-01-05T09:00:00Z', size: 8192 }
    ]
  }
];

const initialNodes: GraphNode[] = [
  // User/Career Node
  { id: 'node_user', label: 'Alex Mercer', type: 'career', summary: 'Lead Machine Learning & Full-Stack Architect', details: 'B.Tech CS Undergrad with 9.4 GPA, specializing in Computer Vision, Edge Deployment, and Serverless Cloud Solutions.' },
  
  // Document Nodes
  { id: 'node_doc_1', label: 'Placement Resume', type: 'document', category: 'Resume', docId: 'doc_1', summary: 'Core academic/professional placements catalog.' },
  { id: 'node_doc_2', label: 'Google Python Certificate', type: 'document', category: 'Certificates', docId: 'doc_2', summary: 'Credential validating Python & OS automation automation.' },
  { id: 'node_doc_3', label: 'AWS SA Certificate', type: 'document', category: 'Certificates', docId: 'doc_3', summary: 'Cloud architecture validation ID: AWS-ASA-77491.' },
  { id: 'node_doc_4', label: 'IIT Bombay Internship Letter', type: 'document', category: 'Internships', docId: 'doc_4', summary: 'Research recommendation signed by Dr. Ramesh Sharma.' },
  { id: 'node_doc_5', label: 'Smart India Hackathon Prize', type: 'document', category: 'Hackathons', docId: 'doc_5', summary: 'First place national award in the AI rail safety track.' },
  { id: 'node_doc_6', label: 'PPE Detector Capstone Report', type: 'document', category: 'Projects', docId: 'doc_6', summary: 'Official project specs and TensorRT benchmark metrics.' },
  { id: 'node_doc_7', label: 'PPE Engine Github Repo', type: 'document', category: 'Open Source', docId: 'doc_7', summary: 'Open-source code base, stars: 142.' },
  { id: 'node_doc_8', label: 'Personal Portfolio Link', type: 'document', category: 'Portfolio', docId: 'doc_8', summary: 'Verifiable personal portfolio hosting live models demos.' },

  // Skill Nodes
  { id: 'node_skill_python', label: 'Python Automation', type: 'skill', details: 'Expert scripting, shell integration, configuration workflows.' },
  { id: 'node_skill_cv', label: 'Computer Vision', type: 'skill', details: 'YOLOv8 tracking, OpenCV frames manipulation, drone grids processing.' },
  { id: 'node_skill_edge_ai', label: 'Edge AI Inference', type: 'skill', details: 'NVIDIA Jetson, TensorRT optimization, ONNX runtime compilations.' },
  { id: 'node_skill_cloud', label: 'AWS Cloud Solutions', type: 'skill', details: 'AWS Lambda, serverless VPC topologies, S3 data pipelines, microservices.' },
  { id: 'node_skill_fullstack', label: 'Full-Stack Engineering', type: 'skill', details: 'React, FastAPI, WebSockets, Tailwind, and database operations.' },

  // Project Nodes
  { id: 'node_proj_ppe', label: 'Smart PPE Detection', type: 'project', details: 'Deep Learning safety supervisor running at 45 FPS on Jetson Nano.' },
  { id: 'node_proj_cloudscale', label: 'CloudScale Serverless Cluster', type: 'project', details: 'Dockerized microservice cluster with automated auto-scaling triggers.' }
];

const initialEdges: GraphEdge[] = [
  // User to Core documents
  { id: 'e1', source: 'node_user', target: 'node_doc_1', label: 'Represented By' },
  { id: 'e2', source: 'node_user', target: 'node_doc_8', label: 'Portrayed In' },

  // Google Certificate connections
  { id: 'e3', source: 'node_doc_2', target: 'node_skill_python', label: 'Grants Skill' },
  { id: 'e4', source: 'node_skill_python', target: 'node_doc_1', label: 'Featured In' },

  // AWS Certificate connections
  { id: 'e5', source: 'node_doc_3', target: 'node_skill_cloud', label: 'Grants Skill' },
  { id: 'e6', source: 'node_skill_cloud', target: 'node_proj_cloudscale', label: 'Applied In' },

  // IIT Bombay Internship connections
  { id: 'e7', source: 'node_doc_4', target: 'node_proj_ppe', label: 'Sponsored Project' },
  { id: 'e8', source: 'node_doc_4', target: 'node_skill_edge_ai', label: 'Validated Expertise' },

  // Project Report, Code, and Demos
  { id: 'e9', source: 'node_doc_6', target: 'node_proj_ppe', label: 'Specifies' },
  { id: 'e10', source: 'node_doc_7', target: 'node_proj_ppe', label: 'Open Sources' },
  { id: 'e11', source: 'node_doc_8', target: 'node_proj_ppe', label: 'Showcases Demo' },

  // Hackathon connections
  { id: 'e12', source: 'node_doc_5', target: 'node_skill_cv', label: 'Demonstrates' },
  { id: 'e13', source: 'node_doc_5', target: 'node_user', label: 'Recognizes' },

  // Skill mappings to projects
  { id: 'e14', source: 'node_skill_cv', target: 'node_proj_ppe', label: 'Core Tech' },
  { id: 'e15', source: 'node_skill_edge_ai', target: 'node_proj_ppe', label: 'Performance Mod' },
  { id: 'e16', source: 'node_skill_fullstack', target: 'node_proj_ppe', label: 'Dashboard Stack' }
];

const initialTimeline: TimelineEvent[] = [
  {
    id: 'tl_1',
    year: '2023',
    date: 'August 10, 2023',
    title: 'Started Computer Science B.Tech',
    description: 'Enrolled in Computer Science & Engineering undergraduate track, anchoring foundational modules in algorithms and neural grids.',
    category: 'Academics'
  },
  {
    id: 'tl_2',
    year: '2025',
    date: 'March 10, 2025',
    title: 'Google Python Professional Credential',
    description: 'Mastered Operating System level scripts automation and continuous deployment Git mechanics.',
    category: 'Certificates',
    documentId: 'doc_2',
    nodeId: 'node_doc_2'
  },
  {
    id: 'tl_3',
    year: '2025',
    date: 'May 15, 2025',
    title: 'Machine Learning Research Intern at IIT Bombay',
    description: 'Commissioned under Dr. Ramesh Sharma. Researched Edge AI pipelines, YOLOv8 modeling, and TensorRT compilation benchmarks.',
    category: 'Internships',
    documentId: 'doc_4',
    nodeId: 'node_doc_4'
  },
  {
    id: 'tl_4',
    year: '2025',
    date: 'September 22, 2025',
    title: 'AWS Certified Solutions Architect – Associate',
    description: 'Successfully accredited. Achieved verified solutions competency covering high-resiliency VPC patterns and serverless AWS Lambda setups.',
    category: 'Certificates',
    documentId: 'doc_3',
    nodeId: 'node_doc_3'
  },
  {
    id: 'tl_5',
    year: '2025',
    date: 'November 18, 2025',
    title: 'First Place Winner - Smart India Hackathon',
    description: 'Won 1st Prize in National AI Surveillance Track for developing drone-sourced rail safety track cracking analysis.',
    category: 'Hackathons',
    documentId: 'doc_5',
    nodeId: 'node_doc_5'
  },
  {
    id: 'tl_6',
    year: '2025',
    date: 'December 5, 2025',
    title: 'Smart PPE Capstone Project Release',
    description: 'Released full technical documentation report outlining edge computer vision model running 45 FPS on Jetson Nano grids.',
    category: 'Projects',
    documentId: 'doc_6',
    nodeId: 'node_doc_6'
  },
  {
    id: 'tl_7',
    year: '2025',
    date: 'December 10, 2025',
    title: 'Open Source PPE Detector Released',
    description: 'Publicly pushed code and weights repository to GitHub, gaining traction from industrial compliance developers and gathering 140+ stars.',
    category: 'Open Source',
    documentId: 'doc_7',
    nodeId: 'node_doc_7'
  },
  {
    id: 'tl_8',
    year: '2026',
    date: 'January 5, 2026',
    title: 'Verifiable Personal Portfolio Launch',
    description: 'Launched alexmercer.dev interactive brand hub featuring reactive d3 graph indices of skill nodes and live web model demos.',
    category: 'Portfolio',
    documentId: 'doc_8',
    nodeId: 'node_doc_8'
  },
  {
    id: 'tl_9',
    year: '2026',
    date: 'January 15, 2026',
    title: 'Resume Version 2 Generated for Placements',
    description: 'Finalized and validated structural placement resume consolidating capstone projects, certifications, and IITBombay internship credentials.',
    category: 'Resume',
    documentId: 'doc_1',
    nodeId: 'node_doc_1'
  }
];

const defaultResumeConfig: ResumeTemplateData = {
  title: 'Alex Mercer - Machine Learning & Full-Stack Architect',
  summary: 'Intelligent, performance-oriented CS undergraduate with a 9.4 GPA, specializing in Computer Vision algorithms, edge neural network optimizations, and serverless scalable backend clouds.',
  skills: ['Python', 'TypeScript', 'C++', 'PyTorch', 'TensorFlow', 'YOLOv8', 'OpenCV', 'TensorRT', 'AWS Lambda', 'Docker', 'Kubernetes', 'FastAPI', 'React', 'PostgreSQL'],
  projects: [
    {
      name: 'Smart PPE Detection and Alerting Engine',
      desc: 'Edge-compiled Computer Vision suite monitoring industrial compliance and transmitting real-time alert sockets.',
      technologies: ['YOLOv8', 'TensorRT', 'FastAPI', 'React', 'WebSockets', 'NVIDIA Jetson']
    },
    {
      name: 'CloudScale Serverless Cluster',
      desc: 'AWS autoscaling infrastructure supporting decoupled, containerized serverless tasks and microservices operations.',
      technologies: ['AWS Lambda', 'EC2', 'Docker', 'Kubernetes', 'S3']
    }
  ],
  experience: [
    {
      role: 'Machine Learning Research Intern',
      company: 'Indian Institute of Technology Bombay (IIT Bombay)',
      duration: 'May 2025 - July 2025',
      bullets: [
        'Built real-time deep learning compliance detection structures utilizing YOLOv8 PyTorch frameworks.',
        'Engineered custom ONNX/TensorRT optimization compilation pipelines, advancing frame speeds on Jetson boards by 40%.',
        'Authored Edge AI safe industrial research preprints and consolidated scalable hardware test metrics.'
      ]
    }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Top Rank Tech University',
      year: '2022 - 2026',
      gpa: '9.4/10'
    }
  ],
  certificates: [
    'AWS Certified Solutions Architect – Associate (2025)',
    'Google IT Automation with Python Professional Credential (2025)',
    '1st Prize National Winner - Smart India Hackathon (2025)'
  ]
};

const defaultPortfolioConfig: PortfolioData = {
  hero: {
    title: 'Alex Mercer',
    subtitle: 'Building intelligent systems that see, think, and scale.'
  },
  about: 'I am a final-year Computer Science undergraduate specializing in Deep Learning optimization, edge computer vision execution, and serverless cloud systems engineering. I aim to bridge sophisticated model grids with robust, scalable user experiences.',
  skills: ['Deep Learning', 'Computer Vision', 'Edge AI Optimization', 'Serverless Clouds', 'Full-stack WebSockets', 'Industrial Surveillance'],
  projects: [
    {
      title: 'Smart PPE Detection',
      desc: 'Deploy-ready industrial compliance supervisor running at 45 FPS on Jetson edge hardware.',
      tags: ['YOLOv8', 'TensorRT', 'FastAPI', 'React'],
      link: 'https://github.com/alexmercer/ppe-detector-engine'
    },
    {
      title: 'CloudScale Serverless Cluster',
      desc: 'A decoupled serverless autoscaling stack for rapid heavy-duty computations.',
      tags: ['AWS', 'Docker', 'Kubernetes', 'EC2'],
      link: '#'
    }
  ],
  experience: [
    {
      role: 'Research Intern',
      company: 'IIT Bombay Computer Science Dept.',
      period: 'May 2025 - Jul 2025',
      desc: 'Optimized Deep Learning models and TensorRT deployment protocols on NVIDIA edge setups.'
    }
  ],
  achievements: [
    '1st Place Winner (AI Track) out of 10,000+ teams in national Smart India Hackathon 2025.',
    'Verifiably accredited AWS Solutions Architect Associate with a 94% credential score.',
    'Authored Capstone Project awarded "Best Practical Computer Vision Architecture 2025".'
  ]
};

class DBManager {
  private schema: DatabaseSchema;

  constructor() {
    this.schema = this.load();
  }

  private load(): DatabaseSchema {
    if (!fs.existsSync(DB_FILE)) {
      const initialSchema: DatabaseSchema = {
        user: defaultUser,
        documents: initialDocuments,
        nodes: initialNodes,
        edges: initialEdges,
        timeline: initialTimeline,
        chatHistory: [
          {
            id: 'welcome_1',
            sender: 'ai',
            text: `Welcome to **LifeGraph AI**, Alex! I've fully indexed your academic and career journey. 

I've automatically parsed and connected:
* Your **IIT Bombay ML Research Internship Letter** 🎓
* Your **AWS Solutions Architect Certification** ☁️
* Your **Google IT Automation with Python Specialization** 🐍
* Your **Smart India Hackathon First Prize** 🏆
* Your **PPE Detection Capstone Project Report** and **GitHub Code Repository** 💻

Try asking me:
* *"Which skills appeared most often?"*
* *"Where is my Google AI certificate?"*
* *"Generate a placement resume for me."*`,
            timestamp: new Date().toISOString(),
            suggestions: [
              'Which project uses TensorRT?',
              'Show all my certificates',
              'Compare Resume Version 1 and Version 2',
              'Analyze my career readiness and gap analysis'
            ]
          }
        ],
        resumeConfig: defaultResumeConfig,
        portfolioConfig: defaultPortfolioConfig
      };
      this.saveSchema(initialSchema);
      return initialSchema;
    }

    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading db.json, resetting database', e);
      return {
        user: defaultUser,
        documents: [],
        nodes: [],
        edges: [],
        timeline: [],
        chatHistory: [],
        resumeConfig: defaultResumeConfig,
        portfolioConfig: defaultPortfolioConfig
      };
    }
  }

  private saveSchema(data: DatabaseSchema) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  public get(): DatabaseSchema {
    return this.schema;
  }

  public save(updater: (db: DatabaseSchema) => void) {
    updater(this.schema);
    this.saveSchema(this.schema);
  }
}

export const db = new DBManager();
