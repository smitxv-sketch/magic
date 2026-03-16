import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { useTenantStore } from '@/store/tenantStore';
import { PresentationBlock } from '@/types/presentation';
import { HeroIntroSection } from './blocks/HeroIntroSection';
import { ProblemChaosSection } from './blocks/ProblemChaosSection';
import { SolutionRoutingSection } from './blocks/SolutionRoutingSection';
import { ShadowModeIntroSection } from './blocks/ShadowModeIntroSection';
import { DemoShadowAuditSection } from './blocks/DemoShadowAuditSection';
import { DemoSecretarySection } from './blocks/DemoSecretarySection';
import { DemoLawyerSection } from './blocks/DemoLawyerSection';
import { MetricsRoiSection } from './blocks/MetricsRoiSection';
import { ItArchitectureSection } from './blocks/ItArchitectureSection';
import { FutureAgentsSection } from './blocks/FutureAgentsSection';
import { CtaPilotSection } from './blocks/CtaPilotSection';
import { ExoskeletonConceptSection } from './blocks/ExoskeletonConceptSection';
import { ToolOrchestratorSection } from './blocks/ToolOrchestratorSection';
import { SpeakerModal } from './SpeakerModal';
import { Loader2 } from 'lucide-react';

export const PresentationView = () => {
  const { setActiveMode, setPlayerOpen } = useAppStore();
  const { presentation, isLoading } = useTenantStore();
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string>('');
  
  const slides = (presentation?.blocks || []) as PresentationBlock[];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        setShowSpeakerModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveBlockId(entry.target.id.replace('section-', ''));
        }
      });
    }, { threshold: 0.5 });

    slides.forEach(slide => {
      const el = document.getElementById(`section-${slide.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slides]);

  const activeBlock = slides.find(b => b.id === activeBlockId);

  const handleAction = (actionId: string) => {
    if (actionId === 'start') {
      const nextSection = document.getElementById('section-exoskeleton-concept');
      nextSection?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionId === 'open-player') {
      setPlayerOpen(true);
    } else if (actionId === 'open-studio') {
      setActiveMode('studio');
    }
  };

  if (isLoading || !presentation) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // Helper to safely get a block by ID
  const getBlock = (id: string) => slides.find(b => b.id === id);

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* Сборка лендинга из независимых секций */}
      {getBlock('hero-intro') && (
        <div id="section-hero-intro">
          <HeroIntroSection block={getBlock('hero-intro')!} onAction={handleAction} />
        </div>
      )}

      {getBlock('exoskeleton-concept') && (
        <div id="section-exoskeleton-concept">
          <ExoskeletonConceptSection block={getBlock('exoskeleton-concept')!} />
        </div>
      )}

      {getBlock('tool-orchestrator') && (
        <div id="section-tool-orchestrator">
          <ToolOrchestratorSection block={getBlock('tool-orchestrator')!} />
        </div>
      )}

      {getBlock('problem-chaos') && (
        <div id="section-problem-chaos">
          <ProblemChaosSection block={getBlock('problem-chaos')!} />
        </div>
      )}

      {getBlock('solution-routing') && (
        <div id="section-solution-routing">
          <SolutionRoutingSection block={getBlock('solution-routing')!} />
        </div>
      )}

      {getBlock('shadow-mode-intro') && (
        <div id="section-shadow-mode-intro">
          <ShadowModeIntroSection block={getBlock('shadow-mode-intro')!} />
        </div>
      )}

      {getBlock('demo-shadow-audit') && (
        <div id="section-demo-shadow-audit">
          <DemoShadowAuditSection block={getBlock('demo-shadow-audit')!} />
        </div>
      )}

      {getBlock('demo-secretary') && (
        <div id="section-demo-secretary">
          <DemoSecretarySection block={getBlock('demo-secretary')!} />
        </div>
      )}

      {getBlock('demo-lawyer') && (
        <div id="section-demo-lawyer">
          <DemoLawyerSection block={getBlock('demo-lawyer')!} />
        </div>
      )}

      {getBlock('metrics-roi') && (
        <div id="section-metrics-roi">
          <MetricsRoiSection block={getBlock('metrics-roi')!} />
        </div>
      )}

      {getBlock('it-architecture') && (
        <div id="section-it-architecture">
          <ItArchitectureSection block={getBlock('it-architecture')!} />
        </div>
      )}

      {getBlock('future-agents') && (
        <div id="section-future-agents">
          <FutureAgentsSection block={getBlock('future-agents')!} />
        </div>
      )}

      {getBlock('cta-pilot') && (
        <div id="section-cta-pilot">
          <CtaPilotSection block={getBlock('cta-pilot')!} onAction={handleAction} />
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-600 text-center text-sm border-t border-slate-900">
        <p>© {new Date().getFullYear()} {presentation.meta.company}. {presentation.meta.department}.</p>
        <p className="mt-2">Confidential. Internal Use Only.</p>
        
        {/* Tenant Switcher (Dev Only) */}
        <div className="mt-8 flex justify-center gap-4 text-xs">
            <a href="?org=default" className="text-slate-700 hover:text-emerald-500 transition-colors">
                Magic Cube (General)
            </a>
            <span className="text-slate-800">|</span>
            <a href="?org=ues" className="text-slate-700 hover:text-emerald-500 transition-colors">
                Уралэнергосбыт (Client Demo)
            </a>
        </div>
      </footer>

      {/* Director's Cut Modal */}
      <SpeakerModal 
        isOpen={showSpeakerModal} 
        onClose={() => setShowSpeakerModal(false)} 
        block={activeBlock} 
      />
    </div>
  );
};

