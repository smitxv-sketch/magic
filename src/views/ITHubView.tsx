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
    <div className="min-h-full p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <Terminal className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Для ИТ: Интеграция</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl ml-[4.5rem]">
            Быстрый старт: Интеграция с вашей СЭД (1С:ДО, Bitrix24, ELMA)
          </p>
        </div>

        {/* Summary Cards (Elevator Pitch) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
          >
            <div className="mb-4 inline-flex p-3 bg-amber-100/50 rounded-2xl text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Time-to-market: 20-30 часов</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Для внедрения не нужно менять ядро 1С:ДО. Платформа работает как внешний микросервис. Интеграция требует настройки одного исходящего Webhook и одного парсера входящего JSON силами штатного программиста 1С.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
          >
            <div className="mb-4 inline-flex p-3 bg-emerald-100/50 rounded-2xl text-emerald-600">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Stateless Архитектура</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Платформа не хранит корпоративные документы. Текст передается в LLM транзитом (в оперативной памяти), анализируется и немедленно удаляется. Мы возвращаем только результат проверки (JSON).
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
          >
            <div className="mb-4 inline-flex p-3 bg-blue-100/50 rounded-2xl text-blue-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">Универсальный REST API</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Связь между вашей СЭД и Платформой осуществляется по стандартному HTTP/HTTPS протоколу. Поддерживается базовая аутентификация по Bearer-токену.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
          >
            <div className="mb-4 inline-flex p-3 bg-purple-100/50 rounded-2xl text-purple-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2 text-lg">On-Premise Ready</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Для демо-стенда используется облачная модель (SaaS). Для боевого контура Платформа и выбранная нейросеть (например, локальная Llama 3 или GigaChat) могут быть развернуты полностью внутри DMZ предприятия.
            </p>
          </motion.div>
        </div>

        {/* Technical Specification */}
        <div className="space-y-8 bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/40 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200/60 pb-6">Техническая спецификация</h2>

          {/* Step 1 */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">1</span>
              Настройка триггера в 1С / Bitrix24 (Webhook)
            </h3>
            <p className="text-gray-600 mb-4">
              На нужном этапе бизнес-процесса (например, статус «На проверке») ваш разработчик добавляет скрипт, который формирует POST-запрос на наш Endpoint: 
              <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-blue-600">https://api.your-platform.ru/v1/inference</code>.
            </p>
            <p className="text-gray-600 mb-2 font-medium">Что нужно передать (Payload):</p>
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
              Обработка ответа от AI-Платформы
            </h3>
            <p className="text-gray-600 mb-4">
              В течение 10–20 секунд Платформа вернет в вашу СЭД синхронный ответ строго в формате JSON. Ответ всегда валидируется по схеме, поэтому 1С никогда не получит «грязный» текст, из-за которого упадет парсер.
            </p>
            <p className="text-gray-600 mb-2 font-medium">Пример ответа Платформы:</p>
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
              Вашему разработчику нужно написать простой <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm">switch-case</code> обработчик в 1С, который реагирует на поле <code className="font-mono text-sm font-bold">action_id</code>.
            </p>
            <p className="text-gray-600 mb-4 font-medium">Платформа поддерживает 7 стандартизированных команд:</p>
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
                    ['continue_process', '1С переводит документ на следующий этап согласования.'],
                    ['return_to_author', '1С меняет статус на "Доработка" и записывает comment_to_user в историю.'],
                    ['escalate', '1С меняет исполнителя задачи на руководителя.'],
                    ['add_comment', '1С просто добавляет текст в таймлайн без смены статуса.'],
                    ['start_subprocess', '1С запускает фоновый БП по переданному target_process_id.'],
                    ['set_field', '1С записывает значение в доп. реквизит документа.'],
                    ['skip_node', 'Игнорировать результат AI (в случае таймаута).'],
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
              Сеть и Безопасность
            </h3>
            <ul className="list-disc pl-14 space-y-2 text-gray-600">
              <li><strong className="text-gray-900">Авторизация:</strong> Сгенерируйте API Token в настройках Платформы и передавайте его в заголовке <code className="bg-gray-100 px-1 rounded text-sm">Authorization: Bearer &lt;token&gt;</code>.</li>
              <li><strong className="text-gray-900">IP Whitelisting:</strong> Для боевого контура мы предоставляем статические IP-адреса Платформы для добавления в белые списки ваших межсетевых экранов (Firewall).</li>
              <li><strong className="text-gray-900">Отказоустойчивость:</strong> Рекомендуется настроить таймаут ожидания на стороне 1С в размере <strong>30 секунд</strong>. Если Платформа не ответила, СЭД должна перевести документ по ветке <code className="bg-gray-100 px-1 rounded text-sm">skip_node</code> (пропуск на ручной контроль), чтобы не блокировать работу предприятия.</li>
            </ul>
          </section>
        </div>

        {/* Footer Action */}
        <div className="mt-16 border-t pt-8 flex justify-center">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
            <Server className="h-5 w-5" />
            Скачать полную спецификацию API (Swagger/OpenAPI .yaml)
          </button>
        </div>

      </div>
    </div>
  );
};
