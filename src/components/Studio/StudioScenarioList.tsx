import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Mail, ArrowRight, Box } from 'lucide-react';

export const StudioScenarioList = () => {
  const { setActiveCube } = useAppStore();

  const scenarios = [
    {
      id: 'contract_review',
      title: 'Согласование договора',
      description: 'Проверка орфографии, юридических рисков и финансовых лимитов.',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      nodes: [
        { id: 'ai_node_1', title: 'AI: Орфография и Реквизиты', type: 'ai' },
        { id: 'ai_node_2', title: 'AI: Юридические риски', type: 'ai' },
        { id: 'ai_node_3', title: 'AI: Фин. контроль', type: 'ai' },
      ]
    },
    {
      id: 'outgoing_letter',
      title: 'Исходящее письмо',
      description: 'Проверка реквизитов и тональности ответа регулятору.',
      icon: <Mail className="w-6 h-6 text-purple-500" />,
      nodes: [
        { id: 'ai_node_letter_1', title: 'AI: Нормоконтроль', type: 'ai' },
        { id: 'ai_node_letter_2', title: 'AI: Тональность', type: 'ai' },
      ]
    }
  ];

  const handleNodeClick = (scenarioTitle: string, nodeTitle: string) => {
    // In a real app, we would load the specific node config here.
    // For now, we simulate opening the editor with some context.
    setActiveCube({
      id: 'demo_node',
      title: nodeTitle,
      prompt: '', // Would load from backend
      scenarioName: scenarioTitle
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-2 text-text-primary">Сценарии автоматизации</h1>
      <p className="text-text-secondary mb-8">Выберите Активность для настройки логики и промптов.</p>

      <div className="grid gap-8 pb-12">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-[#009845]/5 overflow-hidden hover:shadow-2xl hover:shadow-[#009845]/10 transition-all duration-300 group/card">
            <div className="bg-gradient-to-r from-white/80 to-white/40 border-b border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-lg shadow-[#009845]/10 border border-[#009845]/10 text-[#009845]">
                  {scenario.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">{scenario.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{scenario.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white/40">
              <div className="flex flex-wrap gap-4">
                {scenario.nodes.map((node) => (
                  <div 
                    key={node.id} 
                    className="w-40 h-40 bg-white rounded-2xl border border-[#009845]/10 shadow-sm hover:shadow-xl hover:shadow-[#009845]/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-4 text-center gap-3 group/node relative overflow-hidden"
                    onClick={() => handleNodeClick(scenario.title, node.title)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#009845]/5 to-transparent opacity-0 group-hover/node:opacity-100 transition-opacity" />
                    
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009845] to-[#007d39] flex items-center justify-center text-white shadow-lg shadow-[#009845]/30 group-hover/node:scale-110 transition-transform duration-300">
                      <Box className="w-6 h-6" />
                    </div>
                    
                    <span className="font-semibold text-sm text-gray-700 group-hover/node:text-[#009845] transition-colors z-10 leading-tight">
                      {node.title.replace('AI: ', '')}
                    </span>
                    
                    <div className="absolute bottom-3 opacity-0 group-hover/node:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/node:translate-y-0">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-[#009845] bg-[#009845]/10 px-2 py-1 rounded-full">Настроить</span>
                    </div>
                  </div>
                ))}
                
                {/* Add New Node Placeholder */}
                <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#009845]/50 hover:bg-[#009845]/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#009845]">
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center transition-colors">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="text-xs font-medium">Добавить активность</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
