import React from 'react';
import { useAppStore, RuleMetric, RuleOperator, ActionId } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GitBranch } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { METRIC_VALUE_TYPE, OPERATORS_BY_TYPE, OPERATOR_LABELS as NEW_OPERATOR_LABELS } from '@/utils/ruleOperators';
import { Switch } from '@/components/ui/switch';

const METRIC_LABELS: Record<RuleMetric, string> = {
  severity_score:      '🔴 Критичность',
  violations_count:    '📋 Кол-во нарушений',
  has_blocking_issue:  '🚫 Есть блокер',
  document_category:   '📄 Категория документа',
  risk_type_present:   '⚠️ Тип риска',
  confidence:          '🤖 Уверенность AI',
  boolean_check:       '✅ Булева проверка',
};

const ACTION_LABELS: Record<ActionId, string> = {
  continue_process: '✅ Пропустить дальше',
  return_to_author: '↩️ Вернуть автору',
  escalate:         '🚀 Эскалировать',
  add_comment:      '💬 Оставить комментарий',
  start_subprocess: '⚙️ Запустить БП',
  set_field:        '📝 Изменить поле карточки',
  skip_node:        '⚠️ Системный пропуск'
};

export const OutputRulesPanel = () => {
  const { activeCube, updateActiveCube } = useAppStore();

  const addRule = () => {
    updateActiveCube({
      rules: [
        ...activeCube.rules,
        { 
          id: uuidv4(),
          metric: 'severity_score', 
          operator: 'gte', 
          threshold_number: 5, 
          action_id: 'escalate' 
        }
      ]
    });
  };

  const removeRule = (index: number) => {
    const newRules = [...activeCube.rules];
    newRules.splice(index, 1);
    updateActiveCube({ rules: newRules });
  };

  const updateRule = (index: number, field: string, value: any) => {
    const newRules = [...activeCube.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    
    // Reset operators/values when metric changes
    if (field === 'metric') {
      const metric = value as RuleMetric;
      const valueType = METRIC_VALUE_TYPE[metric];
      const defaultOperator = OPERATORS_BY_TYPE[valueType][0];

      newRules[index].operator = defaultOperator;
      newRules[index].threshold_number = undefined;
      newRules[index].threshold_string = undefined;
      newRules[index].boolean_check_key = undefined;

      // Set default values for specific types
      if (valueType === 'numeric') {
        newRules[index].threshold_number = 0;
      } else if (valueType === 'boolean') {
        newRules[index].operator = 'is_true';
      }
    }
    
    updateActiveCube({ rules: newRules });
  };

  const renderValueInput = (rule: any, index: number) => {
    const valueType = METRIC_VALUE_TYPE[rule.metric as RuleMetric];

    if (valueType === 'boolean') {
      // For boolean metrics, the operator (is_true/is_false) acts as the value toggle
      // But for 'boolean_check', we also need to select WHICH check
      if (rule.metric === 'boolean_check') {
        return (
          <Select
            value={rule.boolean_check_key}
            onValueChange={(val) => updateRule(index, 'boolean_check_key', val)}
          >
            <SelectTrigger className="h-9 bg-white border-gray-200 w-40 focus:ring-[#009845]">
              <SelectValue placeholder="Выбрать..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {(activeCube.boolean_checks_config || []).map(c => (
                <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      return null;
    }

    if (valueType === 'numeric') {
      return (
        <Input
          type="number"
          value={rule.threshold_number ?? 0}
          onChange={(e) => updateRule(index, 'threshold_number', parseFloat(e.target.value))}
          className="w-20 h-9 bg-white border-gray-200 focus-visible:ring-[#009845]"
          step={rule.metric === 'confidence' ? 0.1 : 1}
          min={0}
          max={rule.metric === 'confidence' ? 1 : (rule.metric === 'severity_score' ? 10 : undefined)}
        />
      );
    }

    if (rule.metric === 'document_category') {
      return (
        <Select
          value={rule.threshold_string}
          onValueChange={(val) => updateRule(index, 'threshold_string', val)}
        >
          <SelectTrigger className="h-9 bg-white border-gray-200 w-40 focus:ring-[#009845]">
            <SelectValue placeholder="Выбрать..." />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="договор_закупки">Договор закупки</SelectItem>
            <SelectItem value="договор_услуг">Договор услуг</SelectItem>
            <SelectItem value="исходящее_письмо">Исходящее письмо</SelectItem>
            <SelectItem value="иное">Иное</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (rule.metric === 'risk_type_present') {
      return (
        <Select
          value={rule.threshold_string}
          onValueChange={(val) => updateRule(index, 'threshold_string', val)}
        >
          <SelectTrigger className="h-9 bg-white border-gray-200 w-40 focus:ring-[#009845]">
            <SelectValue placeholder="Выбрать..." />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="юридический">Юридический</SelectItem>
            <SelectItem value="финансовый">Финансовый</SelectItem>
            <SelectItem value="репутационный">Репутационный</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return null;
  };

  const renderActionInputs = (rule: any, index: number) => {
    if (rule.action_id === 'start_subprocess') {
      return (
        <Input
          placeholder="ID процесса (напр. BP-123)"
          value={rule.target_process_id || ''}
          onChange={(e) => updateRule(index, 'target_process_id', e.target.value)}
          className="h-9 bg-white border-gray-200 w-48 focus-visible:ring-[#009845]"
        />
      );
    }
    if (rule.action_id === 'set_field') {
      return (
        <>
          <Input
            placeholder="Имя поля"
            value={rule.target_field_name || ''}
            onChange={(e) => updateRule(index, 'target_field_name', e.target.value)}
            className="h-9 bg-white border-gray-200 w-32 focus-visible:ring-[#009845]"
          />
          <Input
            placeholder="Значение"
            value={rule.target_field_value || ''}
            onChange={(e) => updateRule(index, 'target_field_value', e.target.value)}
            className="h-9 bg-white border-gray-200 w-32 focus-visible:ring-[#009845]"
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-4 text-text-primary font-semibold">
        <GitBranch className="w-4 h-4 text-[#009845]" />
        <h3>Маршрутизация</h3>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        {activeCube.rules.map((rule, index) => {
          const valueType = METRIC_VALUE_TYPE[rule.metric as RuleMetric];
          const allowedOperators = OPERATORS_BY_TYPE[valueType];

          return (
            <div key={index} className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm space-y-3 relative group hover:shadow-md transition-all duration-200">
              <button
                onClick={() => removeRule(index)}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* IF Section */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[#009845] bg-[#009845]/10 px-2 py-1 rounded-md">Если</span>
                
                {/* Metric Selector */}
                <Select
                  value={rule.metric}
                  onValueChange={(val) => updateRule(index, 'metric', val)}
                >
                  <SelectTrigger className="h-9 bg-white border-gray-200 w-48 focus:ring-[#009845]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.entries(METRIC_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator Selector (Hidden for boolean, shown for others) */}
                {valueType !== 'boolean' && (
                  <Select
                    value={rule.operator}
                    onValueChange={(val) => updateRule(index, 'operator', val)}
                  >
                    <SelectTrigger className="h-9 bg-white border-gray-200 w-32 focus:ring-[#009845]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {allowedOperators.map((op) => (
                        <SelectItem key={op} value={op}>{NEW_OPERATOR_LABELS[op]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Value Input */}
                {renderValueInput(rule, index)}

                {/* Boolean Toggle (Special case for boolean type) */}
                {valueType === 'boolean' && (
                   <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-gray-200 h-9">
                      <span className={rule.operator === 'is_true' ? "text-sm font-medium text-[#009845]" : "text-sm text-gray-400"}>Да</span>
                      <Switch 
                        checked={rule.operator === 'is_true'}
                        onCheckedChange={(checked) => updateRule(index, 'operator', checked ? 'is_true' : 'is_false')}
                        className="scale-75 data-[state=checked]:bg-[#009845]"
                      />
                      <span className={rule.operator === 'is_false' ? "text-sm font-medium text-red-600" : "text-sm text-gray-400"}>Нет</span>
                   </div>
                )}
              </div>

              {/* THEN Section */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-12 text-center">То</span>
                <Select
                  value={rule.action_id}
                  onValueChange={(val) => updateRule(index, 'action_id', val)}
                >
                  <SelectTrigger className="h-9 bg-white border-gray-200 w-56 focus:ring-[#009845]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.entries(ACTION_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Extra inputs for specific actions */}
                {renderActionInputs(rule, index)}
              </div>
            </div>
          );
        })}

        {activeCube.rules.length === 0 && (
          <div className="text-center text-sm text-text-muted py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            Нет правил маршрутизации.
            <br />
            <span className="text-xs opacity-70">Результат будет передан дальше по умолчанию.</span>
          </div>
        )}
      </div>

      <Button onClick={addRule} variant="outline" className="w-full gap-2 border-dashed border-[#009845]/30 text-[#009845] hover:bg-[#009845]/5 hover:border-[#009845]/50 h-12">
        <Plus className="w-4 h-4" />
        Добавить правило
      </Button>
    </div>
  );
};
