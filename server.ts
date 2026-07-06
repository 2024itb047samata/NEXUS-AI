import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { processDocumentContent, performSemanticSearch, executeRAGChat, generateInterviewQuestion, rateInterviewAnswer } from './server/gemini';
import { DocumentItem, DocumentCategory, VersionItem, GraphNode, GraphEdge, TimelineEvent, ChatMessage, CareerInsights } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Auth Simulation Session State
let currentUserSession = db.get().user;

// --- Authentication Routes ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  // Simplified Auth Mockup
  const user = db.get().user;
  user.email = email;
  currentUserSession = user;
  db.save((d) => { d.user = user; });
  res.json({ success: true, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, bio, careerGoal, targetRole } = req.body;
  const user = db.get().user;
  user.name = name || user.name;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  user.careerGoal = careerGoal || user.careerGoal;
  user.targetRole = targetRole || user.targetRole;
  currentUserSession = user;
  db.save((d) => { d.user = user; });
  res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  currentUserSession = null as any;
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  if (!currentUserSession) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json(currentUserSession);
});

// --- Documents API ---
app.get('/api/documents', (req, res) => {
  res.json(db.get().documents);
});

app.post('/api/documents/upload', async (req, res) => {
  const { name, type, size, contentText, category: userCategory } = req.body;

  if (!name || !type) {
    res.status(400).json({ error: 'Name and type are required' });
    return;
  }

  try {
    const rawContent = contentText || `Sample extracted OCR text content for the uploaded document: ${name}. Detailed academic and professional credentials.`;
    
    // Call AI Processing Pipeline (OCR + metadata extraction)
    const processed = await processDocumentContent(name, rawContent);

    const docId = `doc_${Date.now()}`;
    const newDoc: DocumentItem = {
      id: docId,
      name,
      type,
      category: userCategory || processed.category,
      uploadDate: new Date().toISOString(),
      size: size || '1.2 MB',
      contentText: rawContent,
      metadata: processed.metadata,
      versionHistory: [
        {
          version: 1,
          name,
          updatedAt: new Date().toISOString(),
          size: 1200000
        }
      ]
    };

    // Save document to DB
    db.save((data) => {
      data.documents.unshift(newDoc);

      // Add suggested Nodes to Knowledge Graph
      processed.suggestedNodes.forEach(sNode => {
        // Prevent duplicate nodes
        if (!data.nodes.some(n => n.id === sNode.id)) {
          data.nodes.push({
            ...sNode,
            docId: docId // link it
          });
        }
      });

      // Also create a primary document node in the graph
      const primaryNodeId = `node_${docId}`;
      if (!data.nodes.some(n => n.id === primaryNodeId)) {
        data.nodes.push({
          id: primaryNodeId,
          label: name.replace(/\.[^/.]+$/, ""),
          type: 'document',
          category: newDoc.category,
          docId: docId,
          summary: newDoc.metadata.summary
        });
      }

      // Add primary upload link edge
      data.edges.push({
        id: `edge_${Date.now()}_primary`,
        source: 'node_user',
        target: primaryNodeId,
        label: 'Uploaded File'
      });

      // Add suggested Edges
      processed.suggestedEdges.forEach(sEdge => {
        data.edges.push(sEdge);
      });

      // Link any other nodes suggested to the primary document node
      processed.suggestedNodes.forEach(sNode => {
        data.edges.push({
          id: `edge_auto_${Date.now()}_${sNode.id}`,
          source: primaryNodeId,
          target: sNode.id,
          label: 'Contains Metadata'
        });
      });

      // Add suggested Events to Timeline
      processed.suggestedEvents.forEach(sEvent => {
        data.timeline.push({
          ...sEvent,
          category: newDoc.category,
          documentId: docId,
          nodeId: primaryNodeId
        });
      });
    });

    res.json({ success: true, document: newDoc });
  } catch (error: any) {
    console.error('File processing error:', error);
    res.status(500).json({ error: error.message || 'Error processing document content' });
  }
});

// Process GitHub/LinkedIn/Portfolio URLs
app.post('/api/documents/url', async (req, res) => {
  const { url, category } = req.body;
  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  const name = url.replace(/https?:\/\//, '');
  const type = 'url';
  const mockContent = `GitHub Repository analysis and online index profile for: ${url}. Highlights project deployments, programming code lines, release notes, and commit activity.`;

  try {
    const processed = await processDocumentContent(name, mockContent);
    const docId = `doc_${Date.now()}`;
    const newDoc: DocumentItem = {
      id: docId,
      name,
      type,
      category: category || processed.category || 'Open Source',
      uploadDate: new Date().toISOString(),
      size: '12 KB',
      contentText: mockContent,
      metadata: processed.metadata,
      versionHistory: [
        { version: 1, name, updatedAt: new Date().toISOString(), size: 12288 }
      ]
    };

    db.save((data) => {
      data.documents.unshift(newDoc);
      
      const primaryNodeId = `node_${docId}`;
      data.nodes.push({
        id: primaryNodeId,
        label: name,
        type: 'document',
        category: newDoc.category,
        docId: docId,
        summary: newDoc.metadata.summary
      });

      data.edges.push({
        id: `edge_url_${Date.now()}`,
        source: 'node_user',
        target: primaryNodeId,
        label: 'External Link'
      });

      processed.suggestedNodes.forEach(n => {
        if (!data.nodes.some(existing => existing.id === n.id)) {
          data.nodes.push({ ...n, docId });
        }
        data.edges.push({
          id: `edge_rel_${Date.now()}_${n.id}`,
          source: primaryNodeId,
          target: n.id,
          label: 'Contains Meta'
        });
      });

      processed.suggestedEvents.forEach(e => {
        data.timeline.push({
          ...e,
          category: newDoc.category,
          documentId: docId,
          nodeId: primaryNodeId
        });
      });
    });

    res.json({ success: true, document: newDoc });
  } catch (error: any) {
    res.status(500).json({ error: 'URL processing error' });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  db.save((data) => {
    // Remove doc
    data.documents = data.documents.filter(d => d.id !== id);
    // Remove associated timeline events
    data.timeline = data.timeline.filter(e => e.documentId !== id);
    // Remove document node
    const nodeId = `node_${id}`;
    data.nodes = data.nodes.filter(n => n.id !== nodeId);
    // Remove edges tied to this document node
    data.edges = data.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
  });
  res.json({ success: true });
});

// Rename and Version Save
app.post('/api/documents/rename', (req, res) => {
  const { id, newName } = req.body;
  if (!id || !newName) {
    res.status(400).json({ error: 'ID and newName are required' });
    return;
  }

  db.save((data) => {
    const doc = data.documents.find(d => d.id === id);
    if (doc) {
      const originalName = doc.name;
      doc.name = newName;
      // Append old name to version history
      doc.versionHistory.unshift({
        version: doc.versionHistory.length + 1,
        name: originalName,
        updatedAt: new Date().toISOString(),
        size: 1300000
      });
      // Update graph node label if it matches
      const gNode = data.nodes.find(n => n.docId === id && n.type === 'document');
      if (gNode) {
        gNode.label = newName.replace(/\.[^/.]+$/, "");
      }
    }
  });

  res.json({ success: true, documents: db.get().documents });
});

// --- Knowledge Graph ---
app.get('/api/graph', (req, res) => {
  res.json({
    nodes: db.get().nodes,
    edges: db.get().edges
  });
});

app.post('/api/graph/edge', (req, res) => {
  const { source, target, label } = req.body;
  if (!source || !target) {
    res.status(400).json({ error: 'Source and Target are required' });
    return;
  }

  const newEdge: GraphEdge = {
    id: `edge_manual_${Date.now()}`,
    source,
    target,
    label: label || 'Linked competency',
    animated: true
  };

  db.save((data) => {
    data.edges.push(newEdge);
  });

  res.json({ success: true, edge: newEdge });
});

// --- Timeline ---
app.get('/api/timeline', (req, res) => {
  // Sort timeline chronologically by year/date
  const timeline = [...db.get().timeline].sort((a, b) => {
    return parseInt(a.year) - parseInt(b.year);
  });
  res.json(timeline);
});

// --- AI Interviewer ---
app.post('/api/interview/generate', async (req, res) => {
  try {
    const { history } = req.body;
    const documents = db.get().documents;
    const questionData = await generateInterviewQuestion(documents, history || []);
    res.json(questionData);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error generating interview question' });
  }
});

app.post('/api/interview/rate', async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      res.status(400).json({ error: 'Question and answer are required' });
      return;
    }
    const documents = db.get().documents;
    const ratingData = await rateInterviewAnswer(question, answer, documents);
    res.json(ratingData);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error rating answer' });
  }
});

// --- AI Chat Assistant (RAG Memory) ---
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    const response = await executeRAGChat(message, history || [], db.get().documents);
    
    // Append user & AI messages to local database persistent history
    const userMsg: ChatMessage = {
      id: `chat_user_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    const aiMsg: ChatMessage = {
      id: `chat_ai_${Date.now()}`,
      sender: 'ai',
      text: response.text,
      timestamp: new Date().toISOString(),
      suggestions: response.suggestions,
      relatedDocIds: response.relatedDocIds
    };

    db.save((data) => {
      data.chatHistory.push(userMsg, aiMsg);
      // Keep last 30 chats
      if (data.chatHistory.length > 30) {
        data.chatHistory.shift();
      }
    });

    res.json({ userMessage: userMsg, aiResponse: aiMsg });
  } catch (error) {
    res.status(500).json({ error: 'Error generating chat assistance' });
  }
});

// Get Chat History
app.get('/api/chat/history', (req, res) => {
  res.json(db.get().chatHistory);
});

// Clear Chat History
app.post('/api/chat/clear', (req, res) => {
  db.save((data) => {
    data.chatHistory = [];
  });
  res.json({ success: true });
});

// --- Smart Semantic Search ---
app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  try {
    const documents = db.get().documents;
    const matches = await performSemanticSearch(query, documents);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Semantic search failed' });
  }
});

// --- Career Insights, Gap Analysis & Digital Scores ---
app.get('/api/insights', (req, res) => {
  const documents = db.get().documents;
  
  // Dynamic Score Calculation based on current uploaded metadata
  const totalDocs = documents.length;
  
  // Skills extraction
  const allSkills = new Set<string>();
  documents.forEach(d => {
    d.metadata.skills.forEach(s => allSkills.add(s.toLowerCase()));
  });

  const uniqueSkillsCount = allSkills.size;
  const numProjects = documents.filter(d => d.category === 'Projects').length;
  const numCerts = documents.filter(d => d.category === 'Certificates').length;
  const numInterns = documents.filter(d => d.category === 'Internships').length;
  const numAchievements = documents.filter(d => d.category === 'Achievements' || d.category === 'Hackathons').length;

  // Compute scores (out of 100)
  const experienceScore = Math.min(45 + numInterns * 25, 98);
  const leadershipScore = Math.min(50 + numAchievements * 15, 95);
  const technicalScore = Math.min(40 + uniqueSkillsCount * 4 + numProjects * 10, 99);
  const researchScore = documents.some(d => d.category === 'Research' || d.metadata.researchPapers.length > 0) ? 90 : 45;
  const openSourceScore = Math.min(30 + documents.filter(d => d.category === 'Open Source').length * 30, 95);
  const communicationScore = Math.min(60 + numInterns * 15 + numAchievements * 10, 96);

  const careerReadinessScore = Math.round(
    (experienceScore + leadershipScore + technicalScore + researchScore + openSourceScore + communicationScore) / 6
  );

  // Dynamic lists
  const strongSkills = Array.from(allSkills).slice(0, 6).map(s => s.charAt(0).toUpperCase() + s.slice(1));
  const weakSkills = [];
  const missingCertifications = [];
  const missingProjects = [];

  if (!allSkills.has('docker') && !allSkills.has('kubernetes')) {
    weakSkills.push('Containerization & DevOps');
    missingCertifications.push('CKA (Certified Kubernetes Administrator)');
    missingProjects.push('Kubernetes Cluster Deployment');
  }
  if (!allSkills.has('aws') && !allSkills.has('azure')) {
    weakSkills.push('Cloud Infrastructure');
    missingCertifications.push('AWS Solutions Architect');
  }
  if (!allSkills.has('system design') && !allSkills.has('microservices')) {
    weakSkills.push('Distributed Systems Architecture');
    missingProjects.push('Distributed Event Streaming Queue');
  }

  if (weakSkills.length === 0) {
    weakSkills.push('LLM Fine-tuning', 'Reinforcement Learning');
  }

  // Recommendations and roadmaps
  const suggestedLearning = [
    {
      title: 'Docker & Kubernetes Professional Bootcamp',
      platform: 'Udemy / Coursera',
      url: 'https://kubernetes.io',
      desc: 'Learn container mechanics, pod coordination, and deploying robust server pods.'
    },
    {
      title: 'Advanced System Design (Microservices Patterns)',
      platform: 'ByteByteGo / Educative',
      url: 'https://bytebytego.com',
      desc: 'Master horizontal scaling, cache databases, proxy configurations, and load balancers.'
    }
  ];

  const recommendedJobs = [
    { role: 'Junior Machine Learning Engineer', company: 'NVIDIA', salary: '$125K - $145K', fit: technicalScore },
    { role: 'Cloud Full-Stack Developer', company: 'Stripe', salary: '$130K - $155K', fit: Math.round((technicalScore + experienceScore) / 2) },
    { role: 'AI Integration Engineer', company: 'Vercel', salary: '$110K - $135K', fit: Math.round((technicalScore + communicationScore) / 2) }
  ];

  const gapAnalysis = [
    {
      title: 'DevOps & Containers Gap',
      recommendation: 'You have solid model algorithms competencies (YOLOv8, TensorRT) but lack DevOps orchestrators. Containerize your PPE inference stack.',
      roadmap: ['Install Docker Desktop', 'Write a custom multi-stage Dockerfile', 'Deploy the containerized model on AWS EC2 behind Nginx']
    },
    {
      title: 'System Design Scaling',
      recommendation: 'Your project FastAPI backends are outstanding but depend on single-node processes. Implement Redis caches and message queues.',
      roadmap: ['Understand message queue primitives', 'Integrate Celery & Redis to handle heavy model requests', 'Implement horizontally scaled FastAPI clusters']
    }
  ];

  const insights: CareerInsights = {
    careerReadinessScore,
    scores: {
      experience: experienceScore,
      leadership: leadershipScore,
      technical: technicalScore,
      research: researchScore,
      openSource: openSourceScore,
      communication: communicationScore
    },
    strongSkills,
    weakSkills,
    missingCertifications,
    missingProjects,
    suggestedLearning,
    recommendedJobs,
    gapAnalysis
  };

  res.json(insights);
});

// Analytics Aggregator
app.get('/api/analytics', (req, res) => {
  const documents = db.get().documents;

  // Document categories distribution
  const categoryCounts: Record<string, number> = {};
  documents.forEach(d => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });

  const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Skills growth (simulation based on document upload history timeline)
  const skillsGrowth = [
    { month: 'Jan 2025', skills: 2, certifications: 0, projects: 0 },
    { month: 'Mar 2025', skills: 5, certifications: 1, projects: 0 },
    { month: 'May 2025', skills: 9, certifications: 1, projects: 1 },
    { month: 'Jul 2025', skills: 12, certifications: 1, projects: 1 },
    { month: 'Sep 2025', skills: 15, certifications: 2, projects: 1 },
    { month: 'Nov 2025', skills: 18, certifications: 3, projects: 2 },
    { month: 'Jan 2026', skills: 24, certifications: 3, projects: 2 }
  ];

  // Most used technologies extracted from metadata
  const techCounts: Record<string, number> = {};
  documents.forEach(d => {
    d.metadata.skills.slice(0, 5).forEach(tech => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });

  const topTechnologies = Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  res.json({
    categoryDistribution,
    skillsGrowth,
    topTechnologies,
    totalDocuments: documents.length,
    profileCompletion: Math.min(30 + documents.length * 10, 100)
  });
});

// --- Resume Builder ---
app.get('/api/resume/config', (req, res) => {
  res.json(db.get().resumeConfig);
});

app.post('/api/resume/config', (req, res) => {
  const { title, summary, skills, projects, experience, education, certificates } = req.body;
  
  db.save((data) => {
    data.resumeConfig = {
      title: title || data.resumeConfig.title,
      summary: summary || data.resumeConfig.summary,
      skills: skills || data.resumeConfig.skills,
      projects: projects || data.resumeConfig.projects,
      experience: experience || data.resumeConfig.experience,
      education: education || data.resumeConfig.education,
      certificates: certificates || data.resumeConfig.certificates
    };
  });

  res.json({ success: true, config: db.get().resumeConfig });
});

// --- Portfolio Builder ---
app.get('/api/portfolio/config', (req, res) => {
  res.json(db.get().portfolioConfig);
});

app.post('/api/portfolio/config', (req, res) => {
  const { hero, about, skills, projects, experience, achievements } = req.body;

  db.save((data) => {
    data.portfolioConfig = {
      hero: hero || data.portfolioConfig.hero,
      about: about || data.portfolioConfig.about,
      skills: skills || data.portfolioConfig.skills,
      projects: projects || data.portfolioConfig.projects,
      experience: experience || data.portfolioConfig.experience,
      achievements: achievements || data.portfolioConfig.achievements
    };
  });

  res.json({ success: true, config: db.get().portfolioConfig });
});

// Vite Setup for Development and Production Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html as SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeGraph AI Engine online at http://0.0.0.0:${PORT}`);
  });
}

startServer();
