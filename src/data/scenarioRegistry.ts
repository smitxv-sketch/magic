import { Scenario } from '@/schemas/scenarioConfig';

// Боевой сценарий №0: Теневой Аудит (Для продажи идеи безопасности Амбассадору)
const shadowAuditScenario: Scenario = {
  scenario_id: 'shadow_audit',
  scenario_name: 'Теневой сбор метрик (Входящие и Договоры)',
  document_mock: {
    file_name: 'Пакет_документов_за_неделю.zip',
    extracted_text: 'Анализ потока: 500 входящих писем (ГЖИ, Физлица) и 40 Хозяйственных договоров.'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Штатный процесс (Человек)',
      subtitle: 'Документы идут по стандартным маршрутам 1С:ДО',
      animation_delay_ms: 1000
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI-Наблюдатель: Входящие',
      subtitle: 'Пассивный анализ классификации Управления Делами',
      active_prompt: 'Сравни свою маршрутизацию с действиями секретаря...',
      boolean_checks_config: [
        { check_name: 'Писем от ГЖИ проанализировано', is_passed: true, result_text: '142 документа' },
        { check_name: 'Точность совпадения AI и Человека', is_passed: true, result_text: '98.5%' },
        { check_name: 'AI Инсайт (Рекомендация)', is_passed: false, result_text: 'Можно автоматизировать маршрут ГЖИ -> Директор по клиентам. Экономия: 12 часов в неделю.' }
      ]
    },
    {
      type: 'ai_node',
      step_id: 'step_3',
      title: 'AI-Наблюдатель: Договоры',
      subtitle: 'Пассивный анализ решений Финдирекции',
      active_prompt: 'Найди ошибки, которые пропустил человек...',
      boolean_checks_config: [
        { check_name: 'Проверено Хоздоговоров', is_passed: true, result_text: '40 документов' },
        { check_name: 'Пропущенных человеком ошибок', is_passed: false, result_text: 'В 3 договорах найдены скрытые пени >0.1%' },
        { check_name: 'AI Инсайт (Рекомендация)', is_passed: false, result_text: 'Требуется активация "Финансового Firewall" для блокировки кабальных условий до подписания.' }
      ]
    },
    {
      type: 'standard_node',
      step_id: 'step_4',
      title: 'Генерация отчета',
      subtitle: 'Отчет отправлен Амбассадору для принятия решения о запуске.',
      animation_delay_ms: 1500
    }
  ]
};

// Боевой сценарий №1: Демо для Амбассадора (Начальник Управления Делами)
const incomingLetterScenario: Scenario = {
  scenario_id: 'incoming_letter',
  scenario_name: 'Маршрутизация входящих (Управление делами)',
  document_mock: {
    file_name: 'Письмо_ГЖИ_Металлургическое_отделение.pdf',
    extracted_text: 'ПРЕДПИСАНИЕ. Государственная жилищная инспекция требует предоставить разъяснения о порядке начисления платы за электроэнергию по лицевым счетам потребителей (Металлургическое отделение). Срок исполнения: 3 рабочих дня.'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Входящее письмо',
      subtitle: 'Регистрация скан-копии в канцелярии 1С:ДО',
      animation_delay_ms: 800
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI-Извлечение фактов',
      subtitle: 'Чтение неструктурированного текста',
      active_prompt: 'Извлеки критичные параметры из текста...',
      boolean_checks_config: [
        { check_name: 'Тип документа: Предписание/Надзор', is_passed: true, result_text: 'Государственная жилищная инспекция' },
        { check_name: 'Тематика обращения', is_passed: true, result_text: 'Порядок начисления платы (электроэнергия)' },
        { check_name: 'Срочность (менее 5 дней)', is_passed: false, result_text: 'ВНИМАНИЕ: 3 рабочих дня' }
      ]
    },
    {
      type: 'ai_node',
      step_id: 'step_3',
      title: 'AI-Маршрутизатор',
      subtitle: 'Сверка с Матрицей исполнения УЭС',
      active_prompt: 'Найди куратора по п.1 Матрицы входящих...',
      boolean_checks_config: [
        { check_name: 'Поиск профильного Директора', is_passed: true, result_text: 'Назначен: Директор по работе с клиентами' },
        { check_name: 'Определение списка рассылки', is_passed: true, result_text: '+ Генеральный директор, + Правовое управление' }
      ]
    },
    {
      type: 'standard_node',
      step_id: 'step_4',
      title: 'Проект резолюции готов',
      subtitle: 'Назначен Куратор, проставлен высокий приоритет. Время: 0.8 сек.',
      animation_delay_ms: 1200
    }
  ]
};

// Боевой сценарий №2: Демо для Финансового директора (CFO)
const contractReviewScenario: Scenario = {
  scenario_id: 'contract_review',
  scenario_name: 'Финансовый Firewall (Хозяйственный договор)',
  document_mock: {
    file_name: 'Хоздоговор_Поставка_Оборудования_№45.docx',
    extracted_text: 'Хозяйственный договор на поставку серверов. Порядок расчетов: Аванс 60% в течение 5 дней, постоплата 50% после подписания акта. Ответственность: В случае просрочки оплаты начисляются пени в размере 1% за каждый день просрочки.'
  },
  visual_pipeline: [
    {
      type: 'standard_node',
      step_id: 'step_1',
      title: 'Загрузка проекта',
      subtitle: 'Инициатор направляет Хоздоговор на согласование',
      animation_delay_ms: 1000
    },
    {
      type: 'ai_node',
      step_id: 'step_2',
      title: 'AI-Проверка математики',
      subtitle: 'Защита от опечаток и подлога',
      active_prompt: 'Сверь суммы прописью и логику платежей...',
      boolean_checks_config: [
        { check_name: 'Сумма цифрами соответствует прописи', is_passed: true, result_text: 'Совпадает' },
        { check_name: 'Сумма аванса + постоплаты = 100%', is_passed: false, result_text: 'ОШИБКА: 60% + 50% = 110%' }
      ]
    },
    {
      type: 'ai_node',
      step_id: 'step_3',
      title: 'AI-Радар рисков',
      subtitle: 'Сверка с Приложением А (Фин. дирекция)',
      active_prompt: 'Проверь пени, налоги и валюту...',
      boolean_checks_config: [
        { check_name: 'Наличие налоговой оговорки', is_passed: true, result_text: 'Присутствует' },
        { check_name: 'Валютная оговорка отсутствует', is_passed: true, result_text: 'Договор в рублях' },
        { check_name: 'Размер пеней в пределах лимита (0.1%)', is_passed: false, result_text: 'КРИТИЧЕСКИЙ РИСК: Указано 1% в день' }
      ]
    },
    {
      type: 'standard_node',
      step_id: 'step_4',
      title: 'Возврат инициатору (Блок)',
      subtitle: 'Документ не допущен до Финдиректора. Экономия времени: 45 минут.',
      animation_delay_ms: 1500
    }
  ]
};

// Боевой сценарий №3: Теневой процесс (Сбор данных)
const shadowProcessScenario: Scenario = {
  scenario_id: 'shadow_process_demo',
  scenario_name: 'Согласование заявок на оплату (Сбор данных)',
  mode: 'shadow',
  document_mock: {
    file_name: 'Пакет_Заявок_100шт.zip',
    extracted_text: 'Агрегированный лог прохождения 100 заявок на оплату через систему 1С:ДО.'
  },
  collected_payloads: [
    { timestamp: '10:42', raw_text: 'Заявка №14. Оплата ООО "Металлург", ИНН 7453123456. Сумма: 1 500 000 руб. НДС включен.', extracted_entities: { "Контрагент": "ООО Металлург", "ИНН": "7453123456", "Сумма": "1500000" } },
    { timestamp: '11:15', raw_text: 'Заявка №15. ИП Иванов А.А., ИНН 0274111222. Сумма: 45 000 руб. Без договора.', extracted_entities: { "Контрагент": "ИП Иванов А.А.", "ИНН": "0274111222", "Сумма": "45000", "Риск": "Нет договора" } },
    { timestamp: '11:48', raw_text: 'Заявка №16. Оплата ПАО "ЭнергоСбыт", ИНН 7701010101. Сумма: 320 000 руб. По счету №55.', extracted_entities: { "Контрагент": "ПАО ЭнергоСбыт", "ИНН": "7701010101", "Сумма": "320000" } },
    { timestamp: '12:05', raw_text: 'Заявка №17. ООО "СтройКомплект", ИНН 5029384756. Сумма: 12 500 руб. Аванс.', extracted_entities: { "Контрагент": "ООО СтройКомплект", "ИНН": "5029384756", "Сумма": "12500" } },
    { timestamp: '13:30', raw_text: 'Заявка №18. ИП Петров В.В., ИНН 6677889900. Сумма: 95 000 руб. Услуги клининга.', extracted_entities: { "Контрагент": "ИП Петров В.В.", "ИНН": "6677889900", "Сумма": "95000" } }
  ],
  visual_pipeline: [] // Пока пустой, так как кубики еще не настроены
};

export const scenarios: Scenario[] = [
  shadowAuditScenario,
  incomingLetterScenario,
  contractReviewScenario,
  shadowProcessScenario
];

export const getScenarioById = (id: string): Scenario | undefined => {
  return scenarios.find(s => s.scenario_id === id);
};