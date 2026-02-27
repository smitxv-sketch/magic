import React, { useState } from 'react';
import { Terminal, Server, Clock, Shield, Zap, Lock, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const CodeBlock = ({ code, language = 'json' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100 shadow-lg my-4 overflow-hidden">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="rounded-md bg-gray-800 p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const ITHubView = () => {
  return (
    <div className="min-h-full bg-gray-50/50 p-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Terminal className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Для ИТ: Интеграция</h1>
          </div>
          <p className="text-lg text-gray-600 ml-14">
            Быстрый старт: Интеграция с вашей СЭД (1С:ДО, Bitrix24, ELMA)
          </p>
        </div>

        {/* Summary Cards (Elevator Pitch) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex p-3 bg-amber-100 rounded-lg text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Time-to-market: 20-30 часов</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Без изменения ядра 1С. Только Webhook и парсер JSON. Работает как внешний микросервис.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Stateless Архитектура</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Zero Retention. Текст анализируется в RAM и удаляется. Мы не храним ваши документы.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-lg text-blue-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Универсальный REST API</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Стандартный HTTP/HTTPS. JSON Payload. Bearer Token аутентификация.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 inline-flex p-3 bg-purple-100 rounded-lg text-purple-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">On-Premise Ready</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Возможность развертывания в закрытом контуре (DMZ) с локальными LLM (Llama 3, GigaChat).
            </p>
          </motion.div>
        </div>

        {/* Technical Specification */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">Техническая спецификация</h2>

          {/* Step 1 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">1</span>
              Настройка триггера (Webhook)
            </h3>
            <p className="text-gray-600 mb-4">
              На нужном этапе бизнес-процесса (например, статус «На проверке») отправьте POST-запрос на endpoint 
              <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-blue-600">https://api.your-platform.ru/v1/inference</code>.
            </p>
            <CodeBlock 
              code={`{
  "document_id": "1C-DOC-8472",
  "cube_id": "node_legal_check_01",
  "document_text": "Сырой текст документа извлекается силами 1С...",
  "placeholders": {
    "Сумма_договора": "1500000",
    "ИНН_Контрагента": "7453198234"
  }
}`} 
            />
          </section>

          {/* Step 2 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">2</span>
              Обработка ответа (Response)
            </h3>
            <p className="text-gray-600 mb-4">
              Синхронный ответ в формате JSON (10-20 сек). Гарантированная валидация схемы.
            </p>
            <CodeBlock 
              code={`{
  "status": "success",
  "analysis": {
    "severity_score": 8,
    "has_blocking_issue": true,
    "findings": [
      { "type": "Юридический", "text": "Пени превышают 0.1%" }
    ]
  },
  "execution_command": {
    "action_id": "return_to_author",
    "comment_to_user": "AI: Найдены кабальные условия по штрафам.",
    "target_field_name": null
  }
}`} 
            />
          </section>

          {/* Step 3 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">3</span>
              Маппинг действий (Action Execution)
            </h3>
            <p className="text-gray-600 mb-4">
              Реализуйте <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">switch-case</code> обработчик для поля <code className="font-mono text-sm font-bold">action_id</code>:
            </p>
            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Логика 1С / СЭД</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    ['continue_process', 'Перевод на следующий этап согласования'],
                    ['return_to_author', 'Смена статуса на "Доработка", запись комментария'],
                    ['escalate', 'Смена исполнителя на руководителя'],
                    ['add_comment', 'Добавление записи в таймлайн (без смены статуса)'],
                    ['start_subprocess', 'Запуск фонового процесса по ID'],
                    ['set_field', 'Запись значения в реквизит документа'],
                    ['skip_node', 'Игнорирование (при таймауте > 30с)'],
                  ].map(([action, desc], idx) => (
                    <tr key={action} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-blue-600">{action}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">4</span>
              Безопасность
            </h3>
            <ul className="list-disc pl-14 space-y-2 text-gray-600">
              <li><strong className="text-gray-900">Auth:</strong> Bearer Token (генерируется в настройках).</li>
              <li><strong className="text-gray-900">IP Whitelisting:</strong> Предоставляем статические IP для Firewall.</li>
              <li><strong className="text-gray-900">Timeout:</strong> Рекомендуем 30 секунд на стороне клиента.</li>
            </ul>
          </section>
        </div>

        {/* Footer Action */}
        <div className="mt-16 border-t pt-8 flex justify-center">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
            <Server className="h-5 w-5" />
            Скачать спецификацию API (OpenAPI .yaml)
          </button>
        </div>

      </div>
    </div>
  );
};
