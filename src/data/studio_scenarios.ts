import { ActionRule, BooleanCheck, Placeholder, LLMProvider } from '@/store/appStore';

export interface StudioNodeConfig {
  id: string;
  title: string;
  scenarioName: string;
  prompt: string;
  knowledgeBase: string | null;
  knowledgeBaseFileName: string | null;
  placeholders: Placeholder[];
  inputArtifacts: Placeholder[];
  rules: ActionRule[];
  selectedProvider: LLMProvider;
  boolean_checks_config: BooleanCheck[];
}

export const STUDIO_SCENARIOS_DATA: Record<string, StudioNodeConfig> = {
  // === Сценарий 1: Входящие письма (УД) ===
  'ai_node_1': {
    id: 'ai_node_1',
    title: 'AI: Извлечение фактов',
    scenarioName: 'Маршрутизация входящих (УД)',
    selectedProvider: 'gigachat',
    prompt: `Ты — опытный делопроизводитель. Твоя задача — проанализировать текст входящего письма и извлечь ключевые факты в формате JSON.

Входные данные:
- Текст письма: {{ocr_text}}
- Отправитель: {{sender_name}}

Инструкция:
1. Определи тип документа (Письмо, Претензия, Запрос госоргана, Реклама).
2. Выдели краткое содержание (суть) в 1 предложение.
3. Найди упоминания сроков ответа (если есть).
4. Определи тональность (Нейтральная, Негативная, Позитивная).

Формат ответа строго JSON.`,
    knowledgeBase: null,
    knowledgeBaseFileName: null,
    placeholders: [
      { key: '{{ocr_text}}', displayName: 'Текст письма (OCR)', exampleValue: 'Прошу предоставить информацию о тарифах...' },
      { key: '{{sender_name}}', displayName: 'Отправитель', exampleValue: 'ООО "Ромашка"' }
    ],
    inputArtifacts: [],
    rules: [],
    boolean_checks_config: [
      { key: 'doc_type_check', label: 'Тип документа определен', expected_in_doc: true },
      { key: 'sender_check', label: 'Отправитель распознан', expected_in_doc: true },
      { key: 'date_check', label: 'Дата документа корректна', expected_in_doc: true }
    ]
  },

  'ai_node_2': {
    id: 'ai_node_2',
    title: 'AI: Маршрутизатор',
    scenarioName: 'Маршрутизация входящих (УД)',
    selectedProvider: 'gigachat',
    prompt: `Ты — диспетчер входящей корреспонденции. Используя извлеченные факты и Матрицу Ответственности, определи, кому направить документ.

Входные данные:
- Тип документа: {{doc_type}}
- Суть: {{summary}}
- Отправитель: {{sender_name}}

Матрица ответственности (фрагмент):
- Жалобы на начисления -> Департамент расчетов
- Судебные запросы -> Юридическое управление
- Запросы СМИ -> PR-служба
- Коммерческие предложения -> АХО или Закупки

Твоя задача: вернуть ID подразделения и ФИО куратора.`,
    knowledgeBase: 'matrix_v12.pdf',
    knowledgeBaseFileName: 'Матрица_Ответственности_2024.pdf',
    placeholders: [
      { key: '{{doc_type}}', displayName: 'Тип документа', exampleValue: 'Претензия' },
      { key: '{{summary}}', displayName: 'Краткое содержание', exampleValue: 'Несогласие с начислением пени за март' },
      { key: '{{sender_name}}', displayName: 'Отправитель', exampleValue: 'Иванов И.И.' }
    ],
    inputArtifacts: [
      { key: '{{extraction_result}}', displayName: 'Результат извлечения', exampleValue: '{ "type": "claim", "urgency": "high" }' }
    ],
    rules: [
      {
        id: 'rule_1',
        metric: 'confidence',
        operator: 'lt',
        threshold_number: 0.8,
        action_id: 'escalate',
        target_field_name: 'reason',
        target_field_value: 'low_confidence'
      },
      {
        id: 'rule_2',
        metric: 'document_category',
        operator: 'eq',
        threshold_string: 'Судебный запрос',
        action_id: 'set_field',
        target_field_name: 'priority',
        target_field_value: 'critical'
      }
    ],
    boolean_checks_config: [
      { key: 'dept_found', label: 'Подразделение найдено в матрице', expected_in_doc: true },
      { key: 'curator_assigned', label: 'Куратор назначен', expected_in_doc: true }
    ]
  },

  // === Сценарий 2: Финансовый Firewall ===
  'ai_node_3': {
    id: 'ai_node_3',
    title: 'AI: Проверка математики',
    scenarioName: 'Финансовый Firewall',
    selectedProvider: 'gemini-flash',
    prompt: `Ты — финансовый аудитор. Проверь корректность расчетов в договоре.

Входные данные:
- Текст раздела "Стоимость": {{price_section}}
- Спецификация (таблица): {{spec_table}}

Инструкция:
1. Найди общую сумму договора прописью и цифрами. Сравни их.
2. Пересчитай сумму позиций в спецификации (Цена * Кол-во). Сравни с Итого.
3. Проверь ставку НДС (20%) и сумму НДС.

Если есть расхождения хотя бы в 1 копейку — верни ошибку блокирующего типа.`,
    knowledgeBase: null,
    knowledgeBaseFileName: null,
    placeholders: [
      { key: '{{price_section}}', displayName: 'Раздел "Стоимость"', exampleValue: 'Общая сумма составляет 100 000 (Сто тысяч) рублей...' },
      { key: '{{spec_table}}', displayName: 'Спецификация JSON', exampleValue: '[{"item": "Услуга 1", "qty": 1, "price": 100000}]' }
    ],
    inputArtifacts: [],
    rules: [
      {
        id: 'math_rule_1',
        metric: 'has_blocking_issue',
        operator: 'is_true',
        action_id: 'return_to_author',
        target_field_name: 'comment',
        target_field_value: 'Ошибка в расчетах'
      }
    ],
    boolean_checks_config: [
      { key: 'sum_match', label: 'Сумма прописью совпадает с цифрами', expected_in_doc: true },
      { key: 'vat_correct', label: 'НДС рассчитан верно', expected_in_doc: true },
      { key: 'advance_ok', label: 'Аванс не более 30%', expected_in_doc: true }
    ]
  },

  'ai_node_4': {
    id: 'ai_node_4',
    title: 'AI: Радар рисков',
    scenarioName: 'Финансовый Firewall',
    selectedProvider: 'gemini-flash',
    prompt: `Ты — риск-менеджер. Проверь договор на наличие недопустимых условий согласно Политике №54-ФЗ.

Входные данные:
- Полный текст договора: {{full_text}}

Критические риски (искать обязательно):
1. Аванс более 30% без банковской гарантии.
2. Отсутствие налоговой оговорки (ст. 431.2 ГК РФ).
3. Подсудность: Арбитражный суд г. Москвы (допустимо только Челябинской области).
4. Пени за просрочку оплаты более 0.1% в день.

Выведи список найденных рисков с цитатами.`,
    knowledgeBase: 'risk_policy_2024.pdf',
    knowledgeBaseFileName: 'Политика_Управления_Рисками.pdf',
    placeholders: [
      { key: '{{full_text}}', displayName: 'Текст договора', exampleValue: 'ДОГОВОР ПОСТАВКИ №...' }
    ],
    inputArtifacts: [
      { key: '{{math_check_result}}', displayName: 'Результат проверки математики', exampleValue: '{"valid": true}' }
    ],
    rules: [
      {
        id: 'risk_rule_1',
        metric: 'violations_count',
        operator: 'gt',
        threshold_number: 0,
        action_id: 'return_to_author',
        target_field_name: 'comment',
        target_field_value: 'Найдены критические риски'
      }
    ],
    boolean_checks_config: [
      { key: 'tax_clause', label: 'Налоговая оговорка присутствует', expected_in_doc: true },
      { key: 'jurisdiction_ok', label: 'Подсудность корректна (Челябинск)', expected_in_doc: true }
    ]
  }
};
