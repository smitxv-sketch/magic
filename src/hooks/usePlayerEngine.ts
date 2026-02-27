import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { useLLMInference } from './useLLMInference';
import { compilePrompt } from '@/utils/promptCompiler';

export function usePlayerEngine() {
  const {
    playerState,
    currentScenario,
    currentNodeIndex,
    artifacts,
    setPlayerState,
    setLastLLMResult,
    setArtifact,
    advanceToNextNode,
  } = useAppStore();

  const { infer } = useLLMInference();
  const processingRef = useRef(false);

  useEffect(() => {
    if (!currentScenario) return;
    if (playerState !== 'ANIMATING') return;

    const currentNode = currentScenario.visual_pipeline[currentNodeIndex];
    if (!currentNode) {
      setPlayerState('COMPLETED');
      return;
    }

    // Standard Node Logic
    if (currentNode.type === 'standard_node') {
      const timer = setTimeout(() => {
        advanceToNextNode();
      }, currentNode.animation_delay_ms);
      return () => clearTimeout(timer);
    }

    // AI Node Logic
    if (currentNode.type === 'ai_node') {
      // Transition to WAITING_LLM immediately to show processing state
      // But we need to wait for the "marker" to arrive? 
      // The TZ says: "ANIMATING -> (marker reached ai_node) -> WAITING_LLM"
      // For simplicity in this React implementation without complex physics:
      // We assume ANIMATING *is* the travel time. 
      // But standard nodes have `animation_delay_ms`.
      // Let's assume we travel for 1s then switch to WAITING_LLM.
      
      const travelTimer = setTimeout(async () => {
        setPlayerState('WAITING_LLM');
        
        if (processingRef.current) return;
        processingRef.current = true;

        try {
          const prompt = await compilePrompt(currentNode, currentScenario, artifacts);
          // Save prompt for Mirror Mode (we need to store it somewhere, maybe in result?)
          // The LLMResponse doesn't have a prompt field. 
          // We can hack it or add it to local state in PlayerWorkspace.
          // For now, let's just call infer.
          
          const result = await infer(prompt);
          
          // Save artifact if needed
          if (currentNode.output_artifact_key && result.ai_analysis.artifact) {
            setArtifact(currentNode.output_artifact_key, result.ai_analysis.artifact);
          }

          setLastLLMResult(result);
          setPlayerState('SHOWING_RESULT');
        } catch (error) {
          console.error('LLM Error:', error);
          setPlayerState('LLM_ERROR');
          // Auto-skip after 3s
          setTimeout(() => {
            advanceToNextNode(); // Skip this node
          }, 3000);
        } finally {
          processingRef.current = false;
        }
      }, 1000); // 1s travel time to the node

      return () => clearTimeout(travelTimer);
    }

  }, [playerState, currentNodeIndex, currentScenario, artifacts, advanceToNextNode, setPlayerState, setLastLLMResult, setArtifact, infer]);
}
