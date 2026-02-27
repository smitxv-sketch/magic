import { z } from 'zod';

// Типы рисков — расширяемый список
export const RiskTypeSchema = z.enum([
  'юридический',
  'финансовый',
  'репутационный',
  'операционный',
  'регуляторный',
]);

// Категории документов — расширяемый список
export const DocumentCategorySchema = z.enum([
  'договор_закупки',
  'договор_услуг',
  'договор_аренды',
  'исходящее_письмо',
  'входящее_письмо',
  'заявка',
  'приказ',
  'иное',
]);

// Одна находка с типом и признаком блокера
export const FindingSchema = z.object({
  type: RiskTypeSchema,
  text: z.string(),
  blocking: z.boolean(),
});

// Профиль документа — что LLM определила
export const DocumentProfileSchema = z.object({
  category: DocumentCategorySchema,
  risk_types: z.array(RiskTypeSchema),
  confidence: z.number().min(0).max(1),
});

// Анализ — факты, не оценки
export const AnalysisSchema = z.object({
  severity_score: z.number().min(0).max(10),
  violations_count: z.number().min(0),
  has_blocking_issue: z.boolean(),
  // Булевы проверки — динамический набор, ключи задаются в конфиге кубика
  boolean_checks: z.record(z.boolean()),
  findings: z.array(FindingSchema),
  artifact: z.string().optional(),
});

// Полный ответ
export const ActionIdSchema = z.enum([
  'continue_process',
  'return_to_author',
  'escalate',
  'add_comment',
  'start_subprocess',
  'set_field',
  'skip_node'
]);

export type ActionId = z.infer<typeof ActionIdSchema>;

export const LLMResponseSchema = z.object({
  status: z.enum(['success', 'error', 'timeout']),
  document_profile: DocumentProfileSchema,
  analysis: AnalysisSchema,
  execution_command: z.object({
    action_id: ActionIdSchema,
    comment_to_user: z.string(),
    // Опциональные параметры, которые LLM может вернуть, если правило требует
    target_process_id: z.string().optional(), // для start_subprocess
    target_field_name: z.string().optional(), // для set_field
    target_field_value: z.string().optional() // для set_field
  }),
  time_saved_minutes: z.number().optional(),
});

export type LLMResponse = z.infer<typeof LLMResponseSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type DocumentProfile = z.infer<typeof DocumentProfileSchema>;
export type RiskType = z.infer<typeof RiskTypeSchema>;
export type DocumentCategory = z.infer<typeof DocumentCategorySchema>;
