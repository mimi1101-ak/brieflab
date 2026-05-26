// 워크플로우 단계: 1=브리프수령, 2=질의응답, 3=시안제출, 4=피드백수용, 5=최종납품
export type WorkflowStep = 1 | 2 | 3 | 4 | 5;

export interface Attachment {
  type: 'url';
  label: string;
  value: string;
}

export interface QAEmail {
  id: string;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sentAt: string;
}

export interface Project {
  id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: WorkflowStep;
  createdAt: string;
  updatedAt: string;

  settings: {
    category: '상세페이지' | '웹사이트' | '브랜딩' | '앱';
    difficulty: '입문' | '초급' | '중급' | '고급';
    duration: '1주' | '2주' | '1개월' | '2개월+';
    clientType?: '스타트업' | '소상공인' | '중소기업' | '대기업' | '공공기관' | '개인사업자';
    budget?: '30만원 이하' | '30~100만원' | '100~300만원' | '300만원 이상';
    styleTags?: ('미니멀' | '트렌디' | '클래식' | '볼드')[];
    preferredColors?: string[];
    avoidStyles?: string;
    referenceUrls?: string[];
  };

  briefEmail: {
    sender: {
      name: string;
      role: string;
      company: string;
      email: string;
      phone: string;
    };
    subject: string;
    body: string;
    receivedAt: string;
    attachments?: Attachment[];
  };

  qaEmails: QAEmail[];
  qaCount: number;

  // 3~5단계: 추후 구현 예정
  draftSubmission?: { note: string; submittedAt: string };
  feedback?: { body: string; receivedAt: string };
  finalDelivery?: { submittedAt: string };

  // AI 답장 대기 중 여부 (페이지 이탈 후 재진입 시 복원용)
  pendingAIReply?: boolean;
  pendingAIReplyAt?: string;
}
