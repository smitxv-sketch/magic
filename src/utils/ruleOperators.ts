import { RuleMetric, RuleOperator } from '@/store/appStore';

export type MetricValueType = 'numeric' | 'categorical' | 'boolean';

export const METRIC_VALUE_TYPE: Record<RuleMetric, MetricValueType> = {
  severity_score:     'numeric',
  violations_count:   'numeric',
  confidence:         'numeric',
  document_category:  'categorical',
  risk_type_present:  'categorical',
  has_blocking_issue: 'boolean',
  boolean_check:      'boolean',
};

// Допустимые операторы для каждого типа
export const OPERATORS_BY_TYPE: Record<MetricValueType, RuleOperator[]> = {
  numeric:     ['gt', 'lt', 'gte', 'lte', 'eq'],
  categorical: ['eq', 'neq'],
  boolean:     ['is_true', 'is_false'],
};

// Человекочитаемые метки операторов
export const OPERATOR_LABELS: Record<RuleOperator, string> = {
  gt:       '> больше',
  lt:       '< меньше',
  gte:      '≥ не меньше',
  lte:      '≤ не больше',
  eq:       '= равно',
  neq:      '≠ не равно',
  is_true:  '✅ Да (истина)',
  is_false: '❌ Нет (ложь)',
};
