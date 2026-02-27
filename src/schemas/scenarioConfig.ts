import { z } from 'zod';

const StandardNodeSchema = z.object({
  type: z.literal('standard_node'),
  step_id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  animation_delay_ms: z.number().default(1500),
});

const AINodeSchema = z.object({
  type: z.literal('ai_node'),
  step_id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  active_prompt: z.string(),
  attached_knowledge_base: z.string().optional(),  // имя файла из /public/knowledge/
  input_artifacts: z.array(z.string()).optional(),  // ключи артефактов для передачи в промпт
  output_artifact_key: z.string().optional(),       // ключ под которым сохранить artifact из ответа
  placeholders: z.record(z.string()).optional(),    // { "Сумма_договора": "1 500 000" }
  boolean_checks_config: z.array(z.object({
    key: z.string(),
    label: z.string(),
    expected_in_doc: z.boolean(),
  })).optional(),
});

export const ScenarioNodeSchema = z.discriminatedUnion('type', [
  StandardNodeSchema,
  AINodeSchema,
]);

export const ScenarioSchema = z.object({
  scenario_id: z.string(),
  scenario_name: z.string(),
  document_mock: z.object({
    file_name: z.string(),
    extracted_text: z.string(),
  }),
  visual_pipeline: z.array(ScenarioNodeSchema),
});

export type Scenario = z.infer<typeof ScenarioSchema>;
export type ScenarioNode = z.infer<typeof ScenarioNodeSchema>;
export type AINode = z.infer<typeof AINodeSchema>;
