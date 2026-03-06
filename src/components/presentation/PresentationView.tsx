import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { PresentationBlock } from '@/types/presentation';
import presentationData from '@/data/presentation_content.json';
import { HeroBlock } from './blocks/HeroBlock';
import { SplitBlock } from './blocks/SplitBlock';
import { BentoBlock } from './blocks/BentoBlock';
import { ITSummaryBlock } from './blocks/ITSummaryBlock';
import { VisionBlock } from './blocks/VisionBlock';
import { CTABlock } from './blocks/CTABlock';
import { InteractiveDemoBlock } from './blocks/InteractiveDemoBlock';
import { ExoskeletonBlock } from './blocks/ExoskeletonBlock';
import { ToolOrchestratorBlock } from './blocks/ToolOrchestratorBlock';
import { SpeakerModal } from './SpeakerModal';

export const PresentationView = () => {
  const { setActiveMode, setPlayerOpen } = useAppStore();
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string>('');
  
  // Use the new presentation data
  const slides = presentationData.blocks as PresentationBlock[];

  // Global listener for Director's Cut (Shift + ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        setShowSpeakerModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track active block for Speaker Modal context
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-slate-950">
      {slides.map((block) => {
        const renderBlock = () => {
          switch (block.layout) {
            case 'hero': return <HeroBlock block={block} onAction={handleAction} />;
            case 'split-right': return <SplitBlock block={block} />;
            case 'split-left': return <SplitBlock block={block} reverse />;
            case 'bento': return <BentoBlock block={block} />;
            case 'it-summary': return <ITSummaryBlock block={block} />;
            case 'vision': return <VisionBlock block={block} />;
            case 'cta': return <CTABlock block={block} onAction={handleAction} />;
            case 'interactive-demo': return <InteractiveDemoBlock block={block} />;
            case 'exoskeleton-concept': return <ExoskeletonBlock block={block} />;
            case 'tool-orchestrator': return <ToolOrchestratorBlock block={block} />;
            default: return null;
          }
        };

        return (
          <div id={`section-${block.id}`} key={block.id}>
            {renderBlock()}
          </div>
        );
      })}
      
      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-600 text-center text-sm border-t border-slate-900">
        <p>© {new Date().getFullYear()} Уралэнергосбыт. Цифровой Штат.</p>
        <p className="mt-2">Confidential. Internal Use Only.</p>
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

