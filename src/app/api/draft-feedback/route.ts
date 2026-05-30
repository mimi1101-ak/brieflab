import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getPersonaById } from '@/components/brief/personaPool';
import type { Persona } from '@/components/brief/personaPool';

export const runtime = 'nodejs';

interface BriefSummary {
  project_name: string;
  project_purpose: string;
  field: string;
  emotion: string;
  target: string;
  deliverable: string;
}

function buildFeedbackSystemPrompt(
  persona: Persona | null,
  brief: BriefSummary,
  revision?: { previous_feedback: string },
): string {
  const fieldGuide: Record<string, string> = {
    detail: '후킹 문구의 임팩트, 핵심 정보 배치, 색상 대비와 가시성, CTA 버튼 명확성, 스크롤 흐름',
    web: '정보 구조와 네비게이션 직관성, 브랜드 일관성, 반응형 고려, 핵심 메시지 전달',
    brand: '브랜드 아이덴티티 명확성, 타겟 적합성, 경쟁사 대비 차별성, 응용 확장성',
    app: 'UX 흐름 직관성, 컴포넌트 일관성, 핵심 기능 접근성, 온보딩 친화성',
  };
  const guide = fieldGuide[brief.field] ?? fieldGuide.web;

  const voiceDesc = persona?.voice
    ? `말투: ${persona.voice.formality === 'high' ? '격식체' : '친근한 존댓말'}, 이모지: ${persona.voice.emoji_usage === 'none' ? '사용 안 함' : persona.voice.emoji_usage === 'frequent' ? '자주 사용' : '가끔 사용'}`
    : '일반적인 비즈니스 말투';

  const personaHeader = `당신은 ${persona?.name ?? '클라이언트'}입니다.
${persona ? `${persona.company}의 ${persona.title}로 일하고 있습니다.` : ''}
${persona?.personality_notes ?? ''}

[의뢰한 프로젝트]
프로젝트명: ${brief.project_name}
목적: ${brief.project_purpose}
원하는 분위기/감성: ${brief.emotion}
타겟 고객: ${brief.target}
최종 산출물: ${brief.deliverable}`;

  const commonNotes = `[피드백 작성 주의사항]
- 반드시 한국어로 작성
- 마크다운 기호 절대 금지 (**, ##, ---, *, _ 등)
- 각 섹션은 최소 2~4문장 이상으로 충분히 상세하게
- 막연한 칭찬/비판 금지 — 반드시 시안의 구체적인 요소를 언급
- ${voiceDesc}
- ${persona?.voice?.quirks ?? ''}`;

  // ── 재제출 비교 피드백 모드 ───────────────────────────────────────────────
  if (revision) {
    return `${personaHeader}

[이전 피드백 내용]
${revision.previous_feedback}

디자이너가 위 피드백을 반영해서 수정한 시안을 제출했습니다.
이전 시안과 비교하여 피드백해주세요.

[재제출 피드백 형식]
다음 순서로 작성:

🌟 이전보다 좋아진 점
(이전 피드백에서 지적한 부분이 개선됐는지 구체적으로 칭찬. 최소 2가지)

✅ 브리프 반영도
(의뢰 요구사항과의 일치도)

🎨 디자인 디테일
(색 조합, 타이포그래피, 레이아웃 등 현재 시안 기준으로 평가)

🔧 추가로 수정하면 좋을 부분
(있으면 구체적으로. 없으면 "더 이상 수정 없이 진행하셔도 됩니다"로)

💭 총평 (2~3문장)

📋 최종 판정: [컨펌] 또는 [수정 요청]

${commonNotes}
- 이전보다 나아진 점을 먼저, 충분히 칭찬할 것
- 완성도가 높으면 [컨펌]으로 판정`;
  }

  // ── 최초 시안 피드백 모드 ─────────────────────────────────────────────────
  return `${personaHeader}

[시안 평가 기준]
${guide}

[피드백 작성 형식]
다음 5개 섹션으로 구성해주세요. 각 섹션은 충분히 상세하게:

✅ 브리프 반영도
- 의뢰한 프로젝트의 핵심 요구사항이 얼마나 잘 반영됐는지 구체적으로 서술
- 잘 반영된 요소를 2~3가지 명시 (예: "요청하신 감성 키워드 '따뜻함'이 색상 선택에서 잘 드러납니다")

🎨 디자인 디테일 분석
- 색 조합: 선택한 색상이 브랜드 이미지/타겟층과 어울리는지
- 타이포그래피: 폰트 선택과 위계가 읽기 쉽고 브랜드에 맞는지
- 레이아웃과 여백: 정보 배치와 시각적 균형
- 전반적인 완성도와 분야 특성 반영 여부 (상세페이지라면 CTA 강조, 브랜딩이라면 아이덴티티 일관성 등)

🔧 아쉬운 부분과 개선 방향
- 수정이 필요한 부분을 구체적으로 지적
- 단순히 "아쉽다"가 아니라 "~를 ~하게 바꾸면 좋겠습니다" 형태로
- 없으면 "특별히 수정할 부분은 없습니다"로 표기

💭 클라이언트 총평
- 디자이너에게 전달하는 전반적인 소감 (2~4문장)
- 브리프의 방향성과 얼마나 맞는지 솔직하게

📋 최종 판정: [컨펌] 또는 [수정 요청]
판정 기준:
- [컨펌]: 브리프 핵심 요구사항 80% 이상 반영, 디자인 방향성 일치
- [수정 요청]: 핵심 요소 누락, 브리프 방향과 다름, 디자인 완성도 부족

${commonNotes}
- 브리프와 맞지 않는 시안은 [수정 요청]으로 명확하게 판정`;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('[BriefLab] ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.');
      return NextResponse.json({ error: 'API 키 설정 오류' }, { status: 500 });
    }
    const anthropic = new Anthropic({ apiKey });

    const body = await request.json() as {
      project_id:        string;
      image_base64:      string;
      media_type:        'image/jpeg' | 'image/png' | 'image/webp';
      description:       string;
      persona_id:        string;
      brief_summary:     BriefSummary;
      is_revision?:      boolean;
      previous_feedback?: string;
    };

    const { project_id, image_base64, media_type, description, persona_id, brief_summary, is_revision, previous_feedback } = body;

    const persona = persona_id ? (getPersonaById(persona_id) ?? null) : null;
    const systemPrompt = buildFeedbackSystemPrompt(
      persona,
      brief_summary,
      is_revision && previous_feedback ? { previous_feedback } : undefined,
    );

    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      system:     systemPrompt,
      messages: [{
        role: 'user',
        content: [
          {
            type:   'image',
            source: {
              type:       'base64',
              media_type: media_type,
              data:       image_base64,
            },
          },
          {
            type: 'text',
            text: description
              ? `시안을 검토해주세요. 디자이너 추가 설명: ${description}`
              : '시안을 검토해주세요.',
          },
        ],
      }],
    });

    const rawText = response.content[0].type === 'text' ? response.content[0].text : '';

    const feedbackText = rawText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/---+/g, '')
      .replace(/##+ ?/g, '')
      .replace(/_{2,}/g, '')
      .replace(/`{1,3}/g, '')
      .trim();

    const isConfirmed = feedbackText.includes('[컨펌]');

    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from('messages')
      .insert({
        project_id,
        sender:  'assistant',
        type:    is_revision ? 'revision_feedback' : 'draft_feedback',
        subject: is_revision ? '재제출 시안 피드백' : '시안 피드백',
        body:    feedbackText,
        content: feedbackText,
      });

    if (dbError) {
      console.error('[BriefLab] 피드백 DB 저장 실패:', dbError);
    }

    return NextResponse.json({ feedback: feedbackText, is_confirmed: isConfirmed });

  } catch (error) {
    console.error('[BriefLab] draft-feedback 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
