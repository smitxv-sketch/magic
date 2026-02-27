import React from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/utils/cn';
import { FileText, Mail, Box, ChevronRight, Layers } from 'lucide-react';

export const StudioSidebar = () => {
  const { activeCubeId, activeCube, setActiveCube } = useAppStore();

  const scenarios = [
    {
      id: 'contract_review',
      title: 'Согласование договора',
      icon: <FileText className="w-4 h-4" />,
      nodes: [
        { id: 'ai_node_1', title: 'Орфография и Реквизиты', type: 'ai' },
        { id: 'ai_node_2', title: 'Юридические риски', type: 'ai' },
        { id: 'ai_node_3', title: 'Фин. контроль', type: 'ai' },
      ]
    },
    {
      id: 'outgoing_letter',
      title: 'Исходящее письмо',
      icon: <Mail className="w-4 h-4" />,
      nodes: [
        { id: 'ai_node_letter_1', title: 'Нормоконтроль', type: 'ai' },
        { id: 'ai_node_letter_2', title: 'Тональность', type: 'ai' },
      ]
    }
  ];

  const handleNodeClick = (scenarioTitle: string, nodeTitle: string, nodeId: string) => {
    setActiveCube({
      id: nodeId,
      title: nodeTitle,
      prompt: activeCube.prompt || '', 
      scenarioName: scenarioTitle
    });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Layers className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Процессы 1С / Bitrix24</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="mb-2">
            <div className="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
              {scenario.icon}
              {scenario.title}
            </div>
            <div className="pl-4 pr-2 space-y-0.5">
              {scenario.nodes.map((node) => {
                // Simple check for active state based on title since we mock IDs
                const isActive = activeCube.title === node.title && activeCube.scenarioName === scenario.title;
                
                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(scenario.title, node.title, node.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left group",
                      isActive 
                        ? "bg-[#009845]/10 text-[#009845] font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      isActive ? "bg-[#009845]" : "bg-gray-300 group-hover:bg-gray-400"
                    )} />
                    <span className="truncate">{node.title}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-gray-400 text-center">
          v2.5.0 Enterprise
        </div>
      </div>
    </div>
  );
};
