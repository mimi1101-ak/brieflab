import { Project } from '@/types/project';
import { AI_REPLY_DELAY_MS } from '@/lib/constants';

// MVP: 모킹된 AI 응답. 추후 실제 LLM API로 교체
export async function generateClientReply(
  project: Project,
  userQuestion: string
): Promise<string> {
  await new Promise((r) => setTimeout(r, AI_REPLY_DELAY_MS));

  const sender = project.briefEmail.sender;
  const lines = [
    `안녕하세요, 디자이너님.`,
    ``,
    `보내주신 질문 잘 받았습니다.`,
    ``,
    userQuestion.length > 0
      ? `말씀하신 내용 검토해보니, 저희 쪽에서 명확하게 전달드리지 못한 부분이 있었던 것 같습니다. 추가로 설명드리면, 전반적인 방향은 브랜드 톤앤매너에 맞추어 깔끔하고 신뢰감 있는 느낌을 원하고 있고요, 세부 레이아웃은 디자이너분께 많은 부분을 맡기고 싶습니다.`
      : `추가로 궁금하신 부분이 있으시면 편하게 말씀해주세요.`,
    ``,
    `다른 궁금하신 점 있으시면 언제든 연락 주세요.`,
    ``,
    `감사합니다.`,
    ``,
    `${sender.name} 드림`,
    `${sender.role} | ${sender.company}`,
  ];

  return lines.join('\n');
}
