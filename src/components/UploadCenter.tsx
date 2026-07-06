import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Globe, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Award, 
  Briefcase, 
  Cpu, 
  FolderOpen, 
  Sparkles,
  Play,
  Github,
  Plus,
  ArrowRight,
  Eye,
  FileCode,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';

interface UploadCenterProps {
  documents: any[];
  onUploadSuccess: () => void;
}

const PIPELINE_STAGES = [
  'Reading Document...',
  'Running OCR...',
  'Extracting Text...',
  'Understanding Content...',
  'Finding Skills...',
  'Finding Projects...',
  'Finding Dates...',
  'Finding Organizations...',
  'Finding Technologies...',
  'Detecting Certificates...',
  'Extracting Achievements...',
  'Creating Embeddings...',
  'Generating Metadata...',
  'Building Knowledge Graph...',
  'Creating Timeline...',
  'Saving Original File...'
];

export default function UploadCenter({ documents, onUploadSuccess }: UploadCenterProps) {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlCategory, setUrlCategory] = useState('Open Source');
  const [uploading, setUploading] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  // Run simulated/actual processing pipeline
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setCurrentStageIndex(0);

    // Read file text
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string || '';
      
      // Simulate pipeline progression beautifully
      const stageInterval = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev >= PIPELINE_STAGES.length - 1) {
            clearInterval(stageInterval);
            return prev;
          }
          setUploadProgress(((prev + 1) / PIPELINE_STAGES.length) * 100);
          return prev + 1;
        });
      }, 300);

      try {
        const fileType = file.name.split('.').pop() || 'txt';
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            type: fileType,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            contentText: text,
          })
        });

        const data = await response.json();
        
        // Wait a small moment to let pipeline finish
        setTimeout(() => {
          clearInterval(stageInterval);
          setUploading(false);
          onUploadSuccess();
        }, 1000);

      } catch (err) {
        console.error('Error uploading file:', err);
        clearInterval(stageInterval);
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setUploading(true);
    setUploadProgress(10);
    setCurrentStageIndex(0);

    // Speed up timeline simulation for URLs
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev >= PIPELINE_STAGES.length - 1) {
          clearInterval(stageInterval);
          return prev;
        }
        setUploadProgress(((prev + 1) / PIPELINE_STAGES.length) * 100);
        return prev + 1;
      });
    }, 150);

    try {
      const response = await fetch('/api/documents/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput, category: urlCategory })
      });

      const data = await response.json();
      setTimeout(() => {
        clearInterval(stageInterval);
        setUploading(false);
        setUrlInput('');
        onUploadSuccess();
      }, 600);
    } catch (err) {
      console.error('URL ingestion error:', err);
      clearInterval(stageInterval);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document? This will remove its knowledge graph mappings and timeline instances.')) return;
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      onUploadSuccess();
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleRename = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameValue) return;

    try {
      await fetch('/api/documents/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newName: editNameValue })
      });
      setEditingDocId(null);
      onUploadSuccess();
    } catch (err) {
      console.error('Error renaming file:', err);
    }
  };

  return (
    <div className="space-y-8" id="upload-center-view">
      {/* Upload Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drag & Drop Card */}
        <div className="lg:col-span-2 bg-[#0b0629]/40 border-2 border-dashed border-purple-900/30 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between relative overflow-hidden">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-all ${dragActive ? 'bg-purple-950/20 border-purple-500' : ''}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 flex items-center justify-center border border-purple-900/20 text-purple-400 mb-4 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <Upload className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Drag and drop credential files</h3>
            <p className="text-xs text-gray-400 max-w-sm mt-2">
              Supports **PDF**, **DOCX**, **PPT**, **ZIP**, **TXT** or scanned credentials screenshots. Maximum file size 15MB.
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileInput}
              className="hidden" 
              id="file-selector-input"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all glow-box-purple cursor-pointer flex items-center gap-1.5"
              id="btn-select-file"
            >
              Browse Files <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* URLs Card */}
        <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="font-display font-bold text-base text-white">Connect Web URLs</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Index your public digital presence instantly. LifeGraph AI crawls the content, extracts achievements and structures them in your Knowledge map.
            </p>
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-400">Category</label>
                <select 
                  value={urlCategory}
                  onChange={(e) => setUrlCategory(e.target.value)}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Open Source">GitHub Repository</option>
                  <option value="Portfolio">Portfolio Website</option>
                  <option value="Academics">Google Drive Link</option>
                  <option value="Others">LinkedIn URL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-400">URL Link</label>
                <input 
                  type="text"
                  placeholder="e.g. github.com/alex/project-x"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-[#110c32]/50 border border-purple-950/40 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  id="url-input-field"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                id="btn-submit-url"
              >
                Ingest Profile URL <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
          <div className="text-[10px] text-gray-500 mt-4 text-center font-mono">
            Encrypted API connections
          </div>
        </div>
      </div>

      {/* AI Pipeline Screen overlay */}
      {uploading && (
        <div className="bg-[#0b0629]/90 border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(139,92,246,0.2)] animate-pulse" id="ai-pipeline-processing">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-950/50 rounded-xl border border-purple-900/30 text-purple-400">
                <Cpu className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Active AI Processing Pipeline</h3>
                <p className="text-xs text-gray-400">Converting unstructured data to structured identity assets</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold text-purple-400">{Math.round(uploadProgress)}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#110c32] h-2 rounded-full overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
          </div>

          {/* 16-stage checklist Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isDone = idx < currentStageIndex;
              const isActive = idx === currentStageIndex;
              return (
                <div 
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-mono transition-all duration-300 ${
                    isDone 
                      ? 'bg-emerald-950/10 border-emerald-900/20 text-emerald-400' 
                      : isActive 
                        ? 'bg-purple-950/30 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
                        : 'bg-black/20 border-white/5 text-gray-500'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isActive ? (
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-white/5 flex items-center justify-center text-[8px]">{idx + 1}</span>
                  )}
                  <span className="truncate">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Directory / Document List */}
      <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-bold text-base text-white">Digital Assets Vault ({documents.length})</h3>
          </div>
          <span className="text-xs font-mono text-gray-400">Sorted by Date</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List panel */}
          <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              const isEditing = editingDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  id={`doc-item-${doc.id}`}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setEditingDocId(null);
                  }}
                  className={`
                    p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex justify-between items-center group
                    ${isSelected 
                      ? 'bg-purple-950/20 border-purple-800/40 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]' 
                      : 'bg-black/20 border-purple-950/10 hover:bg-white/5 hover:border-purple-900/20'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400 border border-purple-900/10 group-hover:scale-110 transition-transform">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      {isEditing ? (
                        <form onSubmit={(e) => handleRename(doc.id, e)} onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="text" 
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            onBlur={() => setEditingDocId(null)}
                            className="bg-black/50 border border-purple-500 rounded px-1.5 py-0.5 text-xs text-white w-32 focus:outline-none"
                            autoFocus
                            id={`input-rename-${doc.id}`}
                          />
                        </form>
                      ) : (
                        <h4 className="text-xs font-semibold text-white truncate max-w-[140px]">{doc.name}</h4>
                      )}
                      <p className="text-[9px] text-gray-400 mt-1 capitalize font-medium">{doc.category} &bull; {doc.size}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDocId(doc.id);
                        setEditNameValue(doc.name);
                      }}
                      className="p-1 text-gray-400 hover:text-purple-400 hover:bg-purple-950/30 rounded"
                      title="Rename (saves version history)"
                      id={`btn-rename-${doc.id}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded"
                      title="Delete asset"
                      id={`btn-delete-${doc.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Panel / Preview Panel */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <div className="bg-black/35 border border-purple-950/20 p-6 rounded-2xl space-y-6" id="doc-details-drawer">
                <div className="flex justify-between items-start border-b border-purple-950/20 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-semibold">{selectedDoc.category}</span>
                    <h3 className="text-base font-display font-bold text-white mt-1">{selectedDoc.name}</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Uploaded {new Date(selectedDoc.uploadDate).toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] bg-purple-950/30 border border-purple-900/30 px-2 py-0.5 rounded text-purple-300 font-mono">OCR Processed</span>
                </div>

                {/* Sub Metadata Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Skills Tag block */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Extracted Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoc.metadata.skills.length > 0 ? (
                        selectedDoc.metadata.skills.slice(0, 8).map((sk: string) => (
                          <span key={sk} className="text-[9px] px-2 py-0.5 rounded bg-purple-950/25 border border-purple-900/30 text-purple-300">{sk}</span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">None extracted</span>
                      )}
                    </div>
                  </div>

                  {/* Organizations Block */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Found Organizations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoc.metadata.organizations.length > 0 ? (
                        selectedDoc.metadata.organizations.map((org: string) => (
                          <span key={org} className="text-[9px] px-2 py-0.5 rounded bg-blue-950/25 border border-blue-900/30 text-blue-300">{org}</span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">None identified</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic/Score elements */}
                <div className="flex gap-4 border-t border-b border-purple-950/20 py-4">
                  {selectedDoc.metadata.cgpa && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono">GPA Score: <strong className="text-white">{selectedDoc.metadata.cgpa}</strong></span>
                    </div>
                  )}
                  {selectedDoc.metadata.dates.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-mono">Mapped Timeline: <strong className="text-white">{selectedDoc.metadata.dates[0]}</strong></span>
                    </div>
                  )}
                  {selectedDoc.metadata.college && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-mono">Institute: <strong className="text-white truncate max-w-[150px] inline-block align-bottom">{selectedDoc.metadata.college}</strong></span>
                    </div>
                  )}
                </div>

                {/* AI Summary Section */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Executive Summary
                  </span>
                  <p className="text-xs text-gray-300 bg-[#06021f]/50 p-3.5 rounded-xl border border-purple-950/20 leading-relaxed font-sans">
                    {selectedDoc.metadata.summary}
                  </p>
                </div>

                {/* Document raw content or version details */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Original File Extract Preview</span>
                  <div className="bg-black/50 border border-purple-950/30 rounded-xl p-3 max-h-32 overflow-y-auto font-mono text-[10px] text-gray-400 whitespace-pre-wrap">
                    {selectedDoc.contentText}
                  </div>
                </div>

                {/* Version history block */}
                {selectedDoc.versionHistory && selectedDoc.versionHistory.length > 0 && (
                  <div className="space-y-1.5 border-t border-purple-950/20 pt-4">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Version History</span>
                    <div className="space-y-1">
                      {selectedDoc.versionHistory.map((v: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-[10px] text-gray-400">
                          <span>v{v.version} - {v.name}</span>
                          <span>{new Date(v.updatedAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-black/10 border border-dashed border-purple-950/10 rounded-2xl">
                <FolderOpen className="w-10 h-10 mb-3 text-purple-950" />
                <h4 className="text-xs font-semibold text-gray-400">No Asset Selected</h4>
                <p className="text-[11px] text-gray-500 mt-1 max-w-xs">Select any parsed credential, certificate, or open source URL to audit AI extractions, summary notes, and compliance metadata.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
