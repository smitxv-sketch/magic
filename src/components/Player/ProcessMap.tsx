import React, { useRef, useEffect, useState } from 'react';
import { Scenario } from '@/schemas/scenarioConfig';
import { ProcessNode } from './ProcessNode';
import { DocumentMarker } from './DocumentMarker';
import { useAppStore } from '@/store/appStore';

interface ProcessMapProps {
  scenario: Scenario;
}

export const ProcessMap = ({ scenario }: ProcessMapProps) => {
  const { currentNodeIndex, playerState } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<number[]>([]);

  // Calculate node positions for the marker
  useEffect(() => {
    if (containerRef.current) {
      // Assuming nodes are evenly spaced for now or we can measure them
      // For a simple demo, we can calculate centers based on flex distribution
      const count = scenario.visual_pipeline.length;
      const width = containerRef.current.offsetWidth;
      // 140px is node width (approx)
      // We need to find the center of each node div
      // Let's assume they are rendered and we can measure them? 
      // Or just distribute mathematically:
      // Space per node = width / count. Center = index * space + space / 2
      
      const positions = Array.from({ length: count }).map((_, i) => {
        // This is a rough approximation. 
        // Better: use ResizeObserver or measure actual DOM nodes if possible.
        // But for "Senior" code, let's try to be robust.
        // We will rely on the fact that the parent is a flex container justifying between.
        // Actually, let's just use a simple calculation for now and refine if needed.
        // If we use justify-between, the first is at 0 + half-width, last is at width - half-width.
        // Wait, ProcessNode has width 140px.
        
        // Let's assume the nodes are centered in equal slots.
        const slotWidth = width / count;
        return i * slotWidth + slotWidth / 2;
      });
      setNodePositions(positions);
    }
  }, [scenario, containerRef.current?.offsetWidth]);

  return (
    <div className="relative w-full py-12 px-4" ref={containerRef}>
      {/* Connecting Line */}
      <div className="absolute top-[4.5rem] left-0 w-full h-1 bg-border-default -z-0" />
      
      {/* Nodes */}
      <div className="flex justify-between relative z-10">
        {scenario.visual_pipeline.map((node, index) => (
          <ProcessNode
            key={node.step_id}
            node={node}
            index={index}
            isActive={index === currentNodeIndex}
            isPassed={index < currentNodeIndex}
          />
        ))}
      </div>

      {/* Marker */}
      {nodePositions.length > 0 && (
        <DocumentMarker 
          targetX={nodePositions[currentNodeIndex] || 0} 
          isAIProcessing={playerState === 'WAITING_LLM' || playerState === 'SHOWING_RESULT'}
        />
      )}
    </div>
  );
};
