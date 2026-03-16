import { Scenario } from '@/schemas/scenarioConfig';

// Default Demo Scenario 1: General Invoice Processing
const invoiceProcessingScenario: Scenario = {
  scenario_id: 'invoice_processing',
  scenario_name: 'Автоматизация обработки счетов',
  mode: 'active',
  document_mock: {
    file_name: 'Счет_#12345.pdf',
    extracted_text: 'Счет #12345 от ООО "Поставщик". Итого: 500,000 руб. Срок оплаты: 31.12.2023. Услуги: Разработка ПО.'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Получение счета',
      subtitle: 'Счет получен по email',
      animation_delay_ms: 800
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI: Извлечение данных',
      subtitle: 'Поставщик, Сумма, Дата',
      active_prompt: 'Извлечь ключевые поля из счета...',
      boolean_checks_config: [
        { check_name: 'Поставщик определен', is_passed: true, result_text: 'ООО "Поставщик"' },
        { check_name: 'Сумма извлечена', is_passed: true, result_text: '500,000 руб' },
        { check_name: 'Дата корректна', is_passed: true, result_text: '31.12.2023' }
      ]
    },
    {
      type: 'ai_node',
      step_id: 'step_3',
      title: 'AI: Проверка соответствия',
      subtitle: 'Сверка с заказом и бюджетом',
      active_prompt: 'Проверить наличие заказа на закупку...',
      boolean_checks_config: [
        { check_name: 'Сверка с заказом', is_passed: true, result_text: 'PO-998877' },
        { check_name: 'Бюджет доступен', is_passed: true, result_text: 'Да' }
      ]
    },
    {
      type: 'standard_node',
      step_id: 'step_4',
      title: 'Утверждено к оплате',
      subtitle: 'Передано в финансовую систему',
      animation_delay_ms: 1200
    }
  ]
};

// Default Demo Scenario 2: Contract Review
const contractReviewScenario: Scenario = {
  scenario_id: 'contract_review_default',
  scenario_name: 'Анализ рисков договора',
  mode: 'active',
  document_mock: {
    file_name: 'Договор_Услуг_Черновик.docx',
    extracted_text: 'Договор возмездного оказания услуг. Расторжение: уведомление за 30 дней. Лимит ответственности: 100% от суммы услуг. Подсудность: г. Москва.'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Загрузка черновика',
      subtitle: 'Юрист загружает новый проект',
      animation_delay_ms: 1000
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI: Анализ условий',
      subtitle: 'Выявление ключевых пунктов',
      active_prompt: 'Проанализировать условия расторжения и ответственности...',
      boolean_checks_config: [
        { check_name: 'Условия расторжения', is_passed: true, result_text: '30 дней (Стандарт)' },
        { check_name: 'Лимит ответственности', is_passed: true, result_text: '100% (Низкий риск)' }
      ]
    },
    {
      type: 'ai_node',
      step_id: 'step_3',
      title: 'AI: Выявление рисков',
      subtitle: 'Сверка с плейбуком рисков',
      active_prompt: 'Найти нестандартные условия...',
      boolean_checks_config: [
        { check_name: 'Юрисдикция', is_passed: true, result_text: 'Москва (ОК)' },
        { check_name: 'Возмещение убытков', is_passed: false, result_text: 'Отсутствует зеркальность' }
      ]
    },
    {
      type: 'standard_node',
      step_id: 'step_4',
      title: 'Отчет о проверке',
      subtitle: 'Сформирован отчет о рисках',
      animation_delay_ms: 1500
    }
  ]
};

export const scenarios: Scenario[] = [
  invoiceProcessingScenario,
  contractReviewScenario
];
