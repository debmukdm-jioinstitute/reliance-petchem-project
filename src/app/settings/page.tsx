'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  Settings,
  Cpu,
  ShieldCheck,
  Database,
  Lock,
  CheckCircle2,
  RefreshCw,
  Server,
  Layers
} from 'lucide-react';

export default function SettingsPage() {
  const [llmProvider, setLlmProvider] = useState<string>('ollama');
  const [embeddingModel, setEmbeddingModel] = useState<string>('bge-m3');
  const [forecastEngine, setForecastEngine] = useState<string>('timesfm');
  const [activeRole, setActiveRole] = useState<string>('Leadership');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-[#BFA161]" />
                System Administration & Governance
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Model Abstraction & Role Permissions</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              PLATFORM SETTINGS & MODEL ROUTER
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Open-source first model routing, local LLM provider abstraction, embedding models, and enterprise role-based access control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#BFA161] hover:bg-[#D4BA7B] text-[#080B10] text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedSuccess ? 'Configuration Saved' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

        {/* Model Architecture Settings */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2738]">
            <Cpu className="w-4 h-4 text-[#BFA161]" />
            <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
              Layer 1 & 2: ModelRouter Abstraction (LLM & Embeddings)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* LLM Provider */}
            <div className="space-y-2">
              <label className="font-semibold text-[#CBD5E1] block">
                Primary LLM Provider (`LLM_PROVIDER`)
              </label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0A0E17] border border-[#242F44] text-[#F8FAFC] focus:border-[#BFA161] focus:outline-none font-mono"
              >
                <option value="ollama">Ollama (Local Qwen / Llama-3)</option>
                <option value="vllm">vLLM High-Throughput Server</option>
                <option value="huggingface">Hugging Face Transformers</option>
                <option value="api">Enterprise API Fallback</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                Permissively licensed open-source models running locally on premise.
              </p>
            </div>

            {/* Embedding Model */}
            <div className="space-y-2">
              <label className="font-semibold text-[#CBD5E1] block">
                Vector Embedding (`EMBEDDING_MODEL`)
              </label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0A0E17] border border-[#242F44] text-[#F8FAFC] focus:border-[#BFA161] focus:outline-none font-mono"
              >
                <option value="bge-m3">BAAI/bge-m3 (Dense + Sparse Multi-Vector)</option>
                <option value="bge-reranker">BAAI/bge-reranker-v2-m3</option>
                <option value="text-embedding-3">OpenAI Text-Embedding-3-Small</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                Supports multilingual dense, sparse, and long-context retrieval.
              </p>
            </div>

            {/* Forecasting Stack */}
            <div className="space-y-2">
              <label className="font-semibold text-[#CBD5E1] block">
                Foundation Time-Series Model
              </label>
              <select
                value={forecastEngine}
                onChange={(e) => setForecastEngine(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0A0E17] border border-[#242F44] text-[#F8FAFC] focus:border-[#BFA161] focus:outline-none font-mono"
              >
                <option value="timesfm">Google TimesFM (Zero-Shot Foundation)</option>
                <option value="neuralforecast">NeuralForecast (NHITS / NBEATS)</option>
                <option value="lightgbm">LightGBM (Lagged Gradient Boosting)</option>
              </select>
              <p className="text-[11px] text-[#64748B]">
                Pre-trained foundation model for multi-horizon price projections.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Role-Based Access Control */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2738]">
            <Lock className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
              Security & Role-Based Access Control (RBAC)
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#CBD5E1] block mb-2">
                Simulated Active Role:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Leadership', 'Project Team', 'Mentor', 'Admin', 'Viewer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`px-3.5 py-1.5 rounded-lg border font-mono transition-all ${
                      activeRole === role
                        ? 'bg-[#10B981] text-[#080B10] font-bold border-[#10B981]'
                        : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E2738] hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-semibold">
                Access Permissions for [{activeRole}]:
              </span>
              <ul className="space-y-1 text-xs text-[#CBD5E1]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Access to executive briefings and 60-second leadership digests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Interactive execution of multi-variable financial scenarios and Monte Carlo simulations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Full traceability into the document store, decisions register, and assumption logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
