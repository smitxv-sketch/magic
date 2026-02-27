import { create } from 'zustand';
import { LLMResponse } from '../schemas/llmResponse';
import { Scenario } from '../schemas/scenarioConfig';

// === ТИПЫ ===
export type PlayerState = 'IDLE' | 'ANIMATING' | 'WAITING_LLM' | 'SHOWING_RESULT' | 'PAUSED' | 'LLM_ERROR' | 'COMPLETED';

export type LLMProvider = 'gemini-flash' | 'gigachat' | 'local-llama';

export interface Placeholder {
  key: string;
  displayName: string;
  exampleValue: string;
}

export type ActionId = 
  | 'continue_process' 
  | 'return_to_author' 
  | 'escalate' 
  | 'add_comment' 
  | 'start_subprocess' 
  | 'set_field' 
  | 'skip_node';

export type RuleMetric =
  | 'severity_score'
  | 'violations_count'
  | 'has_blocking_issue'
  | 'document_category'
  | 'risk_type_present'
  | 'confidence'
  | 'boolean_check';

export type RuleOperator =
  | 'gte'   // >=
  | 'lte'   // <=
  | 'gt'    // >
  | 'lt'    // <
  | 'eq'    // =
  | 'neq'   // !=
  | 'is_true'   // для булевых
  | 'is_false'; // для булевых

export interface ActionRule {
  id: string;
  metric: RuleMetric;
  operator: RuleOperator;
  threshold_number?: number;
  threshold_string?: string;
  boolean_check_key?: string;
  action_id: ActionId;
  target_process_id?: string; // для start_subprocess
  target_field_name?: string; // для set_field
  target_field_value?: string; // для set_field
  combine_with_next?: 'AND' | 'OR';
}

export interface BooleanCheck {
  key: string;
  label: string;
  expected_in_doc: boolean;
}

interface AppState {
  // === РЕЖИМ ПРИЛОЖЕНИЯ ===
  activeMode: 'studio' | 'player' | 'action-library';
  setActiveMode: (mode: AppState['activeMode']) => void;

  // === НАСТРОЙКИ ===
  geminiApiKey: string | null;
  setGeminiApiKey: (key: string) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // === СТУДИЯ: активный кубик ===
  activeCubeId: string | null; // If null, show list. If set, show editor.
  activeCube: {
    id: string;
    title: string;
    scenarioName?: string; // Added for breadcrumbs
    prompt: string;
    knowledgeBase: string | null;
    knowledgeBaseFileName: string | null;
    placeholders: Placeholder[];
    inputArtifacts: Placeholder[]; // Added for "Process Artifacts" panel
    rules: ActionRule[];
    selectedProvider: LLMProvider;
    boolean_checks_config: BooleanCheck[];
  };
  setActiveCubeId: (id: string | null) => void;
  setActiveCube: (cube: Partial<AppState['activeCube']>) => void; // Helper to update and open editor
  updateActiveCube: (patch: Partial<AppState['activeCube']>) => void;

  // === ПЛЕЕР ===
  playerState: PlayerState;
  currentScenario: Scenario | null;
  artifacts: Record<string, string>;
  currentNodeIndex: number;
  lastLLMResult: LLMResponse | null;

  // Экшены плеера
  loadScenario: (scenario: Scenario) => void;
  startPlayer: () => void;
  pausePlayer: () => void;
  resumePlayer: () => void;
  resetPlayer: () => void;
  advanceToNextNode: () => void;
  setPlayerState: (state: PlayerState) => void;
  setLastLLMResult: (result: LLMResponse | null) => void;
  setArtifact: (key: string, value: string) => void;

  // === LIVE TEST (Студия) ===
  testDocument: {
    fileName: string | null;
    extractedText: string | null;
    isLoading: boolean;
    result: LLMResponse | null;
  };
  setTestDocument: (patch: Partial<AppState['testDocument']>) => void;
}

// === STORE ===
export const useAppStore = create<AppState>((set) => ({
  // Defaults
  activeMode: 'studio',
  geminiApiKey: localStorage.getItem('GEMINI_API_KEY'), // Init from local storage if available
  isSettingsOpen: false,

  activeCubeId: null,
  activeCube: {
    id: 'new_cube',
    title: 'Новый AI-контролёр',
    scenarioName: 'Новый сценарий',
    prompt: '',
    knowledgeBase: null,
    knowledgeBaseFileName: null,
    placeholders: [],
    inputArtifacts: [ // Mock artifacts
      { key: '{{normcontrol_result}}', displayName: 'Результат нормоконтроля', exampleValue: 'Ошибок не найдено' },
      { key: '{{previous_approver_comment}}', displayName: 'Комментарий руководителя', exampleValue: 'Согласовано с замечаниями' },
    ],
    rules: [],
    selectedProvider: 'gemini-flash',
    boolean_checks_config: [],
  },

  playerState: 'IDLE',
  currentScenario: null,
  artifacts: {},
  currentNodeIndex: 0,
  lastLLMResult: null,

  testDocument: {
    fileName: null,
    extractedText: null,
    isLoading: false,
    result: null,
  },

  // Actions
  setActiveMode: (mode) => set({ activeMode: mode }),

  setGeminiApiKey: (key) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    set({ geminiApiKey: key });
  },
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  setActiveCubeId: (id) => set({ activeCubeId: id }),
  
  setActiveCube: (cubePatch) => 
    set((state) => ({ 
      activeCubeId: cubePatch.id || state.activeCube.id,
      activeCube: { ...state.activeCube, ...cubePatch } 
    })),

  updateActiveCube: (patch) =>
    set((state) => ({ activeCube: { ...state.activeCube, ...patch } })),

  loadScenario: (scenario) =>
    set({
      currentScenario: scenario,
      playerState: 'IDLE',
      currentNodeIndex: 0,
      artifacts: {},
      lastLLMResult: null,
    }),

  startPlayer: () => set({ playerState: 'ANIMATING' }),
  pausePlayer: () => set({ playerState: 'PAUSED' }),
  resumePlayer: () => set((state) => ({ playerState: state.lastLLMResult ? 'SHOWING_RESULT' : 'ANIMATING' })), // Simplification, logic handled in hook
  resetPlayer: () =>
    set({
      playerState: 'IDLE',
      currentNodeIndex: 0,
      artifacts: {},
      lastLLMResult: null,
    }),

  advanceToNextNode: () =>
    set((state) => {
      if (!state.currentScenario) return {};
      const nextIndex = state.currentNodeIndex + 1;
      if (nextIndex >= state.currentScenario.visual_pipeline.length) {
        return { playerState: 'COMPLETED', currentNodeIndex: nextIndex };
      }
      return { currentNodeIndex: nextIndex, playerState: 'ANIMATING', lastLLMResult: null };
    }),

  setPlayerState: (state) => set({ playerState: state }),
  setLastLLMResult: (result) => set({ lastLLMResult: result }),
  setArtifact: (key, value) =>
    set((state) => ({ artifacts: { ...state.artifacts, [key]: value } })),

  setTestDocument: (patch) =>
    set((state) => ({ testDocument: { ...state.testDocument, ...patch } })),
}));
