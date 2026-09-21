'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  Share2,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { KNOWLEDGE_GRAPH_NODES, KNOWLEDGE_GRAPH_LINKS } from '@/data/knowledgeStore';

export default function KnowledgeGraphPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-ril');

  const selectedNode =
    KNOWLEDGE_GRAPH_NODES.find((n) => n.id === selectedNodeId) || KNOWLEDGE_GRAPH_NODES[0];

  // Category Colors
  const categoryColors: Record<string, string> = {
    COMPANY: '#BFA161',
    PERSON: '#38BDF8',
    MEETING: '#10B981',
    COMMODITY: '#F59E0B',
    PLANT: '#818CF8',
    PROJECT: '#EC4899',
    RISK: '#F43F5E'
  };

  // ECharts Force-Directed Graph Option
  const graphOption = {
    tooltip: {
      backgroundColor: '#0E1420',
      borderColor: '#242F44',
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          return `<div class="font-mono text-xs">
            <div class="text-[#BFA161] font-bold">${params.data.name}</div>
            <div class="text-[#94A3B8]">Category: ${params.data.category}</div>
            <div class="text-[#CBD5E1] mt-1">${params.data.details}</div>
          </div>`;
        }
        if (params.dataType === 'edge') {
          return `<div class="font-mono text-xs text-[#38BDF8]">
            ${params.data.relationship}
          </div>`;
        }
        return '';
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 380,
          edgeLength: [80, 160],
          gravity: 0.12
        },
        roam: true,
        draggable: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          color: '#CBD5E1',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif'
        },
        edgeLabel: {
          show: true,
          formatter: '{c}',
          color: '#64748B',
          fontSize: 9,
          fontFamily: 'monospace'
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 6,
        data: KNOWLEDGE_GRAPH_NODES.map((n) => ({
          id: n.id,
          name: n.name,
          category: n.category,
          details: n.details,
          symbolSize: n.category === 'COMPANY' ? 36 : n.category === 'MEETING' ? 28 : 22,
          itemStyle: {
            color: categoryColors[n.category] || '#94A3B8',
            borderColor: selectedNodeId === n.id ? '#FFFFFF' : '#1E2738',
            borderWidth: selectedNodeId === n.id ? 3 : 1
          }
        })),
        links: KNOWLEDGE_GRAPH_LINKS.map((l) => ({
          source: l.source,
          target: l.target,
          value: l.relationship,
          relationship: l.relationship,
          lineStyle: {
            color: '#242F44',
            width: l.weight || 1.5,
            curveness: 0.1
          }
        }))
      }
    ]
  };

  const handleChartEvents = {
    click: (params: any) => {
      if (params.dataType === 'node') {
        setSelectedNodeId(params.data.id);
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#BFA161]" />
                Palantir-Grade Relational Graph
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Interconnected Entities & Dependencies</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              KNOWLEDGE GRAPH & ONTOLOGY
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Relational mapping across leadership, meetings, decisions, feedstock commodities, refinery plants, and financial scenarios. Drag or zoom to explore connections.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4BA7B] bg-[#0E1420] px-3.5 py-2 rounded-lg border border-[#1E2738]">
            <span>{KNOWLEDGE_GRAPH_NODES.length} Entities • {KNOWLEDGE_GRAPH_LINKS.length} Relational Links</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#0E1420] border border-[#1A2232] text-[11px] font-mono">
          <span className="text-[#64748B] uppercase font-semibold">Entity Tiers:</span>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[#CBD5E1]">{cat}</span>
            </div>
          ))}
        </div>

        {/* Interactive Graph Canvas & Side Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 p-4 rounded-2xl bg-[#080B10] border border-[#1A2232] shadow-xl relative overflow-hidden h-[560px]">
            <EChartsClient
              option={graphOption}
              height="100%"
              onEvents={handleChartEvents}
            />
          </div>

          {/* Node Inspector */}
          <div className="p-5 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase text-[#BFA161] font-bold">
                Selected Node Inspector
              </div>

              <div className="space-y-1">
                <span
                  className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: `${categoryColors[selectedNode.category]}20`,
                    color: categoryColors[selectedNode.category],
                    border: `1px solid ${categoryColors[selectedNode.category]}40`
                  }}
                >
                  {selectedNode.category}
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  {selectedNode.name}
                </h3>
              </div>

              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {selectedNode.details}
              </p>

              <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-[#64748B]">Graph Connectivity:</span>
                <div className="font-mono text-sm font-bold text-[#F8FAFC]">
                  {selectedNode.connectionsCount} Active Relationships
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#64748B] pt-3 border-t border-[#1E2738]">
              Click any node or connection to focus inspection.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
