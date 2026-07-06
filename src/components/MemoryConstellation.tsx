import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  Sparkles, 
  FileText, 
  Cpu, 
  Plus, 
  X, 
  Zap, 
  Info, 
  Award, 
  Briefcase,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { GraphNode, GraphEdge } from '../types';

interface MemoryConstellationProps {
  documents: any[];
}

interface PhysicsNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
  radius: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitCenterId?: string;
  orbitAngle?: number;
}

export default function MemoryConstellation({ documents }: MemoryConstellationProps) {
  const [rawNodes, setRawNodes] = useState<GraphNode[]>([]);
  const [rawEdges, setRawEdges] = useState<GraphEdge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedNode, setSelectedNode] = useState<PhysicsNode | null>(null);

  // Simulation physics nodes/edges state
  const nodesRef = useRef<PhysicsNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const [displayNodes, setDisplayNodes] = useState<PhysicsNode[]>([]);
  
  // Custom manual link builders
  const [linkSource, setLinkSource] = useState('');
  const [linkTarget, setLinkTarget] = useState('');
  const [linkLabel, setLinkLabel] = useState('Requires Proficiency');

  // Interactive Viewports (Pan, Zoom, Drag)
  const [pan, setPan] = useState({ x: 50, y: 30 });
  const [zoom, setZoom] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Load Graph Data
  const fetchGraph = async () => {
    try {
      const res = await fetch('/api/graph');
      const data = await res.json();
      setRawNodes(data.nodes);
      setRawEdges(data.edges);

      const width = 750;
      const height = 480;

      // Construct physics nodes
      const initializedPhysicsNodes: PhysicsNode[] = data.nodes.map((node: GraphNode) => {
        let radius = 12;
        let x = width / 2 + (Math.random() - 0.5) * 300;
        let y = height / 2 + (Math.random() - 0.5) * 200;

        // Custom setup based on node type
        if (node.id === 'node_user') {
          radius = 24;
          x = width / 2;
          y = height / 2;
        } else if (node.type === 'skill') {
          radius = 16;
        } else if (node.type === 'project') {
          radius = 14;
        } else if (node.type === 'certificate') {
          radius = 10;
        }

        const pNode: PhysicsNode = {
          ...node,
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius
        };

        // Assign some orbit centers to projects and certificates to make them orbit "Skills"
        if (node.type === 'project' && Math.random() > 0.3) {
          pNode.orbitRadius = 80 + Math.random() * 40;
          pNode.orbitSpeed = 0.005 + Math.random() * 0.01;
          pNode.orbitAngle = Math.random() * Math.PI * 2;
        } else if (node.type === 'certificate') {
          pNode.orbitRadius = 140 + Math.random() * 60;
          pNode.orbitSpeed = 0.002 + Math.random() * 0.005;
          pNode.orbitAngle = Math.random() * Math.PI * 2;
        }

        return pNode;
      });

      // Tie orbit centers to real physical skill/project nodes if possible
      const skillNodes = initializedPhysicsNodes.filter(n => n.type === 'skill');
      if (skillNodes.length > 0) {
        initializedPhysicsNodes.forEach(node => {
          if (node.orbitRadius && node.id !== 'node_user' && node.type !== 'skill') {
            const randomSkill = skillNodes[Math.floor(Math.random() * skillNodes.length)];
            node.orbitCenterId = randomSkill.id;
          }
        });
      }

      nodesRef.current = initializedPhysicsNodes;
      edgesRef.current = data.edges;
      setDisplayNodes([...initializedPhysicsNodes]);

    } catch (err) {
      console.error('Error fetching knowledge graph nodes:', err);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [documents]);

  // Main custom Physics Engine loop (60 FPS smooth vector force simulation)
  useEffect(() => {
    const width = 750;
    const height = 480;

    const runPhysicsSimulation = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      if (nodes.length === 0) {
        animationFrameId.current = requestAnimationFrame(runPhysicsSimulation);
        return;
      }

      // 1. Apply Central Gravity and repulsive forces
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // If dragged, fix position to cursor
        if (n1.id === draggedNodeId) {
          n1.vx = 0;
          n1.vy = 0;
          continue;
        }

        // Pull towards User Center
        if (n1.id !== 'node_user') {
          const dx = width / 2 - n1.x;
          const dy = height / 2 - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const gravity = 0.04;
          n1.vx += (dx / dist) * gravity;
          n1.vy += (dy / dist) * gravity;
        }

        // Many-body repulsion (so nodes don't overlap)
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = n1.radius + n2.radius + 35;

          if (dist < minDist) {
            const force = (minDist - dist) * 0.08;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1.id !== 'node_user' && n1.id !== draggedNodeId) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (n2.id !== 'node_user' && n2.id !== draggedNodeId) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Spring connection forces (pull connected nodes closer)
        edges.forEach(edge => {
          if (edge.source === n1.id || edge.target === n1.id) {
            const partnerId = edge.source === n1.id ? edge.target : edge.source;
            const partner = nodes.find(n => n.id === partnerId);
            if (partner) {
              const dx = partner.x - n1.x;
              const dy = partner.y - n1.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const targetLen = 100;
              const k = 0.004; // Spring constant
              const force = (dist - targetLen) * k;

              if (n1.id !== 'node_user' && n1.id !== draggedNodeId) {
                n1.vx += (dx / dist) * force;
                n1.vy += (dy / dist) * force;
              }
            }
          }
        });

        // Custom Orbital Math (makes projects/certs gracefully rotate around their target center hubs)
        if (n1.orbitRadius && n1.orbitCenterId && n1.orbitSpeed && n1.orbitAngle !== undefined) {
          const center = nodes.find(n => n.id === n1.orbitCenterId);
          if (center) {
            n1.orbitAngle += n1.orbitSpeed;
            const targetX = center.x + Math.cos(n1.orbitAngle) * n1.orbitRadius;
            const targetY = center.y + Math.sin(n1.orbitAngle) * n1.orbitRadius;
            
            // Blend physical inertia with orbital coordinates
            n1.vx += (targetX - n1.x) * 0.06;
            n1.vy += (targetY - n1.y) * 0.06;
          }
        }

        // Friction and bounds
        n1.vx *= 0.85;
        n1.vy *= 0.85;
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Keep inside boundary boxes
        n1.x = Math.max(n1.radius + 10, Math.min(width - n1.radius - 10, n1.x));
        n1.y = Math.max(n1.radius + 10, Math.min(height - n1.radius - 10, n1.y));
      }

      setDisplayNodes([...nodes]);
      animationFrameId.current = requestAnimationFrame(runPhysicsSimulation);
    };

    animationFrameId.current = requestAnimationFrame(runPhysicsSimulation);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draggedNodeId]);

  // Handle manual linking of nodes
  const handleLinkNodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkSource || !linkTarget || linkSource === linkTarget) return;

    try {
      const res = await fetch('/api/graph/edge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: linkSource,
          target: linkTarget,
          label: linkLabel
        })
      });
      await res.json();
      fetchGraph();
      setLinkSource('');
      setLinkTarget('');
    } catch (err) {
      console.error('Linking error:', err);
    }
  };

  // SVG Mouse handlers for Panning & Zooming
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target.closest('.graph-node')) return;

    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();

    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    } else if (draggedNodeId) {
      // Scale coordinates relative to current pan & zoom
      const cursorX = (e.clientX - rect.left - pan.x) / zoom;
      const cursorY = (e.clientY - rect.top - pan.y) / zoom;
      
      const node = nodesRef.current.find(n => n.id === draggedNodeId);
      if (node) {
        node.x = cursorX;
        node.y = cursorY;
        node.vx = 0;
        node.vy = 0;
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev * factor)));
  };

  const handleResetView = () => {
    setPan({ x: 50, y: 30 });
    setZoom(1.0);
  };

  // Node Drag handlers
  const startDragNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNodeId(id);
  };

  // Filter logic
  const filteredNodes = displayNodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (node.summary && node.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && node.type === categoryFilter;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  // Determine elegant gradient color coding for custom floating memory nodes
  const getNodeStyles = (type: string, isSelected: boolean) => {
    if (isSelected) {
      return {
        fill: 'url(#selectedGlow)',
        stroke: '#d8b4fe',
        shadowColor: '#a855f7',
        textColor: '#e9d5ff',
        glowStyle: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))'
      };
    }
    switch (type) {
      case 'career':
        return {
          fill: 'url(#gradientCareer)',
          stroke: '#c084fc',
          shadowColor: '#a855f7',
          textColor: '#e9d5ff',
          glowStyle: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))'
        };
      case 'document':
        return {
          fill: 'url(#gradientDoc)',
          stroke: '#60a5fa',
          shadowColor: '#3b82f6',
          textColor: '#bfdbfe',
          glowStyle: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))'
        };
      case 'skill':
        return {
          fill: 'url(#gradientSkill)',
          stroke: '#34d399',
          shadowColor: '#10b981',
          textColor: '#a7f3d0',
          glowStyle: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))'
        };
      case 'project':
        return {
          fill: 'url(#gradientProj)',
          stroke: '#f43f5e',
          shadowColor: '#f43f5e',
          textColor: '#fecdd3',
          glowStyle: 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.3))'
        };
      default:
        return {
          fill: 'url(#gradientCert)',
          stroke: '#fbbf24',
          shadowColor: '#f59e0b',
          textColor: '#fef3c7',
          glowStyle: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.3))'
        };
    }
  };

  // Find document summary / metadata matching clicked node
  const getSelectedNodeDetails = () => {
    if (!selectedNode) return null;
    if (selectedNode.docId) {
      const matchedDoc = documents.find(d => d.id === selectedNode.docId);
      if (matchedDoc) {
        return {
          title: matchedDoc.name,
          category: matchedDoc.category,
          summary: matchedDoc.metadata.summary,
          skills: matchedDoc.metadata.skills,
          organizations: matchedDoc.metadata.organizations,
          date: matchedDoc.metadata.dates?.[0] || matchedDoc.uploadDate,
          confidence: 98
        };
      }
    }
    return {
      title: selectedNode.label,
      category: selectedNode.type.toUpperCase(),
      summary: selectedNode.summary || 'Verifiable core competency mapped in the LifeGraph synaptic index.',
      skills: [],
      organizations: [],
      date: 'N/A',
      confidence: 95
    };
  };

  const nodeDetails = getSelectedNodeDetails();

  return (
    <div className="space-y-8 animate-fade-in" id="memory-constellation-container">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b0629]/40 border border-purple-950/20 p-5 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="flex flex-1 items-center gap-3 bg-[#110c32]/60 border border-purple-950/40 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search synaptic memory stars (e.g. YOLOv8, AWS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-gray-500 w-full focus:outline-none"
            id="constellation-search-input"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#110c32]/60 border border-purple-950/40 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            id="constellation-filter-select"
          >
            <option value="all">All Clusters</option>
            <option value="career">Identity Hubs</option>
            <option value="document">Memory Files</option>
            <option value="skill">Skill Cores</option>
            <option value="project">Project Spheres</option>
            <option value="certificate">Certification Orbits</option>
          </select>

          <div className="flex items-center border border-purple-950/40 rounded-2xl bg-[#110c32]/40 overflow-hidden">
            <button onClick={() => handleZoom(1.15)} className="px-3 py-2 text-xs text-purple-400 hover:bg-white/5 font-bold font-mono border-r border-purple-950/30" title="Zoom In">+</button>
            <button onClick={() => handleZoom(0.85)} className="px-3 py-2 text-xs text-purple-400 hover:bg-white/5 font-bold font-mono border-r border-purple-950/30" title="Zoom Out">-</button>
            <button onClick={handleResetView} className="px-3 py-2 text-xs text-purple-400 hover:bg-white/5 font-mono" title="Recenter">Recenter</button>
          </div>
        </div>
      </div>

      {/* Main interactive area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Memory Space Canvas */}
        <div className="lg:col-span-2 bg-[#050117] border border-purple-950/30 rounded-3xl h-[520px] relative overflow-hidden shadow-[0_4px_40px_rgba(0,0,0,0.6)] glow-box">
          
          {/* Cyber Instructions */}
          <div className="absolute top-4 left-4 bg-black/60 border border-purple-900/40 px-3 py-2 rounded-xl text-[10px] text-purple-300 font-mono flex items-center gap-2 z-10 pointer-events-none">
            <Info className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Interactive Space Model: Drag stars, scroll pan, click nodes to analyze.</span>
          </div>

          <div className="absolute top-4 right-4 bg-purple-950/20 border border-purple-900/30 px-3 py-1.5 rounded-xl text-[9px] text-purple-400 font-mono flex items-center gap-1.5 z-10 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
            <span>SIMULATION FRAME: 60 FPS</span>
          </div>

          <svg 
            className="w-full h-full select-none cursor-grab active:cursor-grabbing bg-radial-dots"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            id="constellation-canvas-svg"
          >
            <defs>
              <radialGradient id="gradUser" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#581c87" />
              </radialGradient>
              <linearGradient id="gradientCareer" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="gradientDoc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="gradientSkill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="gradientProj" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
              <linearGradient id="gradientCert" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <radialGradient id="selectedGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </radialGradient>
              
              <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing background grid */}
            <g opacity="0.08">
              <rect width="100%" height="100%" fill="transparent" />
              <path d="M 0,40 L 1000,40 M 0,80 L 1000,80 M 0,120 L 1000,120 M 0,160 L 1000,160 M 0,200 L 1000,200 M 0,240 L 1000,240 M 0,280 L 1000,280 M 0,320 L 1000,320 M 0,360 L 1000,360 M 0,400 L 1000,400 M 0,440 L 1000,440 M 0,480 L 1000,480" stroke="#8b5cf6" strokeWidth="0.5" />
              <path d="M 40,0 L 40,600 M 80,0 L 80,600 M 120,0 L 120,600 M 160,0 L 160,600 M 200,0 L 200,600 M 240,0 L 240,600 M 280,0 L 280,600 M 320,0 L 320,600 M 360,0 L 360,600 M 400,0 L 400,600 M 440,0 L 440,600 M 480,0 L 480,600 M 520,0 L 520,600 M 560,0 L 560,600 M 600,0 L 600,600 M 640,0 L 640,600 M 680,0 L 680,600 M 720,0 L 720,600" stroke="#8b5cf6" strokeWidth="0.5" />
            </g>

            {/* Main view container with zooming / panning */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              
              {/* Starry Particle Accents */}
              <g opacity="0.3" className="pointer-events-none">
                <circle cx="100" cy="80" r="1.5" fill="#fff" />
                <circle cx="340" cy="120" r="1" fill="#fff" />
                <circle cx="500" cy="50" r="2" fill="#fff" className="animate-pulse" />
                <circle cx="680" cy="220" r="1" fill="#fff" />
                <circle cx="150" cy="380" r="1.5" fill="#fff" />
                <circle cx="450" cy="420" r="1" fill="#fff" />
                <circle cx="620" cy="350" r="2.5" fill="#fff" className="animate-pulse" />
                <circle cx="280" cy="290" r="1" fill="#fff" />
              </g>

              {/* Draw Orbits around Hub Center Node */}
              {rawNodes.filter(n => n.type === 'skill').map((skill) => {
                const pos = filteredNodes.find(fn => fn.id === skill.id);
                if (!pos) return null;
                return (
                  <g key={`orbit-${skill.id}`} opacity="0.15">
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={85} 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="1" 
                      strokeDasharray="3 6"
                      className="animate-spin"
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '40s' }}
                    />
                    <circle 
                      cx={pos.x} 
                      cy={pos.y} 
                      r={145} 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="0.5" 
                      strokeDasharray="4 8"
                      className="animate-spin"
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '60s', animationDirection: 'reverse' }}
                    />
                  </g>
                );
              })}

              {/* Connections (Edges) */}
              {rawEdges.map((edge) => {
                const sourceNode = filteredNodes.find(n => n.id === edge.source);
                const targetNode = filteredNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isHighlighted = filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);
                const isSelectedEdge = selectedNode?.id === edge.source || selectedNode?.id === edge.target;

                return (
                  <g key={edge.id} className="transition-all duration-300">
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isSelectedEdge ? '#a855f7' : isHighlighted ? '#4c2e8c' : '#100a26'}
                      strokeWidth={isSelectedEdge ? 2.5 : isHighlighted ? 1.5 : 0.8}
                      strokeDasharray={edge.animated || isSelectedEdge ? "5 5" : "none"}
                      className={edge.animated || isSelectedEdge ? "stroke-dasharray-anim" : ""}
                    />
                    
                    {/* Tiny animated signal node traversing the edge */}
                    {(isHighlighted || isSelectedEdge) && (
                      <circle r="2.5" fill={isSelectedEdge ? "#fef08a" : "#c084fc"} className="traverse-anim">
                        <animateMotion 
                          path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`} 
                          dur="4s" 
                          repeatCount="indefinite" 
                        />
                      </circle>
                    )}

                    {/* Edge Label */}
                    {isSelectedEdge && (
                      <g transform={`translate(${(sourceNode.x + targetNode.x) / 2}, ${(sourceNode.y + targetNode.y) / 2 - 4})`}>
                        <rect x="-45" y="-7" width="90" height="13" rx="4" fill="#090424" stroke="#a855f7" strokeWidth="0.5" opacity="0.8" />
                        <text
                          fill="#d8b4fe"
                          fontSize={7}
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                          y="2"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Core Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const style = getNodeStyles(node.type, isSelected);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    onMouseDown={(e) => startDragNode(node.id, e)}
                    className="graph-node cursor-pointer group"
                    id={`constel-node-${node.id}`}
                  >
                    {/* Node Glowing Aura on select */}
                    <circle 
                      r={node.radius + (isSelected ? 10 : 6)} 
                      fill="transparent" 
                      stroke={isSelected ? '#ca8a04' : style.stroke} 
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="animate-spin opacity-50"
                      style={{ transformOrigin: '0px 0px', animationDuration: '12s' }}
                    />

                    {/* Central anchor circle body */}
                    <circle
                      r={node.radius}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={isSelected ? 3.0 : 1.5}
                      style={{ filter: style.glowStyle }}
                      className="transition-all duration-300"
                    />

                    {/* Decorative inner target ring */}
                    <circle r="3" fill="#ffffff" opacity="0.3" />

                    {/* Node Text Label */}
                    <text
                      y={node.radius + 15}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : style.textColor}
                      fontSize={isSelected ? 10 : 8.5}
                      fontWeight={isSelected ? 'bold' : 'medium'}
                      fontFamily="sans-serif"
                      className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}

            </g>
          </svg>
        </div>

        {/* Constellation context sidebar drawer */}
        <div className="space-y-6">
          {/* Details inspection */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
            {nodeDetails ? (
              <div className="space-y-4" id="constellation-details-card">
                <div className="flex justify-between items-start border-b border-purple-950/20 pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-purple-400 font-bold">{selectedNode?.type} MAPPED SYSTEM</span>
                    <h3 className="text-sm font-display font-bold text-white mt-0.5">{nodeDetails.title}</h3>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-white/5 rounded">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-purple-950/10 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-gray-400 block uppercase">Confidence Index</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {nodeDetails.confidence}% Verified
                    </span>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[8px] font-mono text-gray-400 block uppercase">Timeline Date</span>
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" /> {nodeDetails.date}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Cognitive Extraction Extract</span>
                  <p className="text-xs text-gray-300 bg-[#06021f]/70 p-3.5 rounded-xl border border-purple-950/20 leading-relaxed font-sans">
                    {nodeDetails.summary}
                  </p>
                </div>

                {nodeDetails.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Overlapping Skills Clusters</span>
                    <div className="flex flex-wrap gap-1.5">
                      {nodeDetails.skills.slice(0, 5).map((sk: string) => (
                        <span key={sk} className="text-[9px] px-2.5 py-0.5 rounded bg-purple-950/40 border border-purple-900/30 text-purple-300 font-medium">{sk}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedNode?.docId && (
                  <div className="pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 bg-blue-950/15 border border-blue-900/20 p-2.5 rounded-xl">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Linked with original PDF ledger</span>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Network className="w-9 h-9 mx-auto mb-3 text-purple-900 animate-pulse" />
                <h4 className="text-xs font-bold text-gray-400">Memory Node Scanner</h4>
                <p className="text-[10px] text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Select any celestial milestone node or connector within the live digital galaxy to inspect supporting proof vectors, confidence indicators, and timeline coordinates.
                </p>
              </div>
            )}
          </div>

          {/* Interactive manual linker */}
          <div className="bg-[#0b0629]/40 border border-purple-950/20 p-6 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="font-display font-bold text-sm text-white">Draw Manual Connection</h3>
            </div>
            
            <form onSubmit={handleLinkNodes} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase text-gray-400">Source Cluster</label>
                  <select 
                    value={linkSource}
                    onChange={(e) => setLinkSource(e.target.value)}
                    className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none"
                    id="link-source-select"
                  >
                    <option value="">-- Choose --</option>
                    {rawNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-mono uppercase text-gray-400">Target Cluster</label>
                  <select 
                    value={linkTarget}
                    onChange={(e) => setLinkTarget(e.target.value)}
                    className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2 py-1.5 text-[10px] text-white focus:outline-none"
                    id="link-target-select"
                  >
                    <option value="">-- Choose --</option>
                    {rawNodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono uppercase text-gray-400">Relationship Type</label>
                <input 
                  type="text" 
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-2.5 py-1.5 text-[10px] text-white focus:outline-none"
                  placeholder="e.g. Mapped Competency"
                  id="link-relationship-input"
                />
              </div>

              <button
                type="submit"
                disabled={!linkSource || !linkTarget}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-[10px] font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                id="btn-link-constel"
              >
                <Plus className="w-3.5 h-3.5" /> Bind Memory Nodes
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Embedded CSS for smooth physics animations and travel signals */}
      <style>{`
        .stroke-dasharray-anim {
          stroke-dasharray: 6 6;
          animation: dash 12s linear infinite;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -120;
          }
        }
        .traverse-anim {
          animation: scalePulse 2s ease-in-out infinite alternate;
        }
        @keyframes scalePulse {
          0% { r: 1.5; opacity: 0.5; }
          100% { r: 3.5; opacity: 1; }
        }
        .bg-radial-dots {
          background-image: radial-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
