import { AINode, Scenario } from '@/schemas/scenarioConfig';

export async function compilePrompt(
  node: AINode,
  scenario: Scenario,
  artifacts: Record<string, string>
): Promise<string> {
  let knowledgeBaseContent = '';

  // 1. Load Knowledge Base if attached
  if (node.attached_knowledge_base) {
    try {
      const response = await fetch(`/knowledge/${node.attached_knowledge_base}`);
      if (response.ok) {
        knowledgeBaseContent = await response.text();
      } else {
        console.warn(`Failed to load knowledge base: ${node.attached_knowledge_base}`);
        knowledgeBaseContent = '(Knowledge base not found)';
      }
    } catch (e) {
      console.error('Error loading knowledge base', e);
      knowledgeBaseContent = '(Error loading knowledge base)';
    }
  }

  // 2. Resolve Placeholders (simple substitution for now, can be extended)
  // In a real app, we'd parse the document or use the mock's extracted text
  // For this demo, we assume the prompt might contain {{placeholder}} 
  // but the TZ says placeholders are in the node config.
  // Let's just include the document context.

  const documentContext = `
[КОНТЕКСТ ДОКУМЕНТА]
Название документа: ${scenario.document_mock.file_name}
Текст документа:
${scenario.document_mock.extracted_text}
`;

  // 3. Artifacts
  let artifactsContext = '';
  if (node.input_artifacts && node.input_artifacts.length > 0) {
    artifactsContext = '\n[АРТЕФАКТЫ ОТ ПРЕДЫДУЩИХ ЭТАПОВ]\n';
    node.input_artifacts.forEach(key => {
      if (artifacts[key]) {
        artifactsContext += `${key}: ${artifacts[key]}\n`;
      }
    });
  }

  // 4. Assemble
  return `
[СИСТЕМНАЯ ИНСТРУКЦИЯ]
Ты — AI-контролер документооборота. Твоя задача: проверить документ согласно корпоративному регламенту и вернуть результат СТРОГО в формате JSON без какого-либо текста до или после JSON.

[РЕГЛАМЕНТ КОМПАНИИ]
${knowledgeBaseContent}

${documentContext}

${artifactsContext}

[ЗАДАЧА]
${node.active_prompt}

[ФОРМАТ ОТВЕТА — СТРОГО JSON]
{
  "status": "success",
  "ai_analysis": {
    "severity_score": <число от 0 до 10>,
    "findings": ["находка 1", "находка 2"],
    "artifact": "<краткое саммари для следующего кубика, если нужно>"
  },
  "execution_command": {
    "action_id": "<approve|return_to_author|escalate|skip_node>",
    "comment_to_user": "<понятный комментарий для сотрудника>"
  },
  "time_saved_minutes": <число>
}
`.trim();
}
