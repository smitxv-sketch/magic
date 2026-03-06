import { Scenario } from '@/schemas/scenarioConfig';

// Mock scenarios data
const contractReviewScenario: Scenario = {
  scenario_id: 'contract_review',
  scenario_name: 'Согласование договора',
  document_mock: {
    file_name: 'Договор_поставки_№123.docx',
    extracted_text: 'Договор поставки оборудования...'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Загрузка документа',
      subtitle: 'Инициатор загружает проект договора',
      animation_delay_ms: 1000
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI-проверка реквизитов',
      subtitle: 'Сверка с базой ЕГРЮЛ',
      active_prompt: 'Проверь реквизиты контрагента...',
      boolean_checks_config: []
    },
    {
      type: 'ai_node',
      step_id: 'step_3',
      title: 'AI-анализ рисков',
      subtitle: 'Поиск штрафных санкций',
      active_prompt: 'Найди риски в договоре...',
      boolean_checks_config: []
    },
    {
      type: 'standard_node',
      step_id: 'step_4',
      title: 'Согласование юристом',
      subtitle: 'Финальное решение',
      animation_delay_ms: 1000
    }
  ]
};

const outgoingLetterScenario: Scenario = {
  scenario_id: 'outgoing_letter',
  scenario_name: 'Исходящее письмо',
  document_mock: {
    file_name: 'Письмо_партнеру.docx',
    extracted_text: 'Уважаемые партнеры...'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Подготовка черновика',
      subtitle: 'Сотрудник пишет письмо',
      animation_delay_ms: 1000
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI-проверка тональности',
      subtitle: 'Анализ вежливости и стиля',
      active_prompt: 'Проверь тон письма...',
      boolean_checks_config: []
    },
    {
      type: 'standard_node',
      step_id: 'step_3',
      title: 'Отправка адресату',
      subtitle: 'Письмо уходит получателю',
      animation_delay_ms: 1000
    }
  ]
};

export const scenarios: Scenario[] = [
  contractReviewScenario,
  outgoingLetterScenario
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find(s => s.scenario_id === id);
};
