import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getPersonaById } from '@/components/brief/personaPool';
import type { Persona } from '@/components/brief/personaPool';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── 시스템 프롬프트 빌더 ───────────────────────────────────────────────────
function buildSystemPrompt(persona: Persona | null, brief_summary: string): string {
  if (!persona?.voice) {
    return `당신은 클라이언트입니다. 다음 프로젝트에 대해 디자이너의 질문에 답변해주세요: ${brief_summary}. 한국어로, 비즈니스 이메일 형식으로 답장을 작성해주세요.`;
  }

  const voice = persona.voice;
  const formalityDesc =
    voice.formality === 'high'   ? '격식체, 존경어 사용' :
    voice.formality === 'medium' ? '일반 존댓말' :
                                   '친근한 존댓말, 가벼운 톤';
  const emojiDesc =
    voice.emoji_usage === 'none'     ? '이모지 절대 사용하지 않음' :
    voice.emoji_usage === 'rare'     ? '^^, ㅎㅎ 같은 텍스트 이모티콘 가끔' :
    voice.emoji_usage === 'moderate' ? '😊✨🌿 같은 이모지 적당히' :
                                       '💕♥️✨💅 같은 이모지 자주 사용';
  const warmthDesc =
    voice.warmth === 'high'   ? '매우 친근하고 따뜻함' :
    voice.warmth === 'medium' ? '적당히 친근함' :
                                '다소 거리감 있고 사무적';
  const pacingDesc =
    voice.pacing === 'casual'    ? '짧고 가볍게, 줄바꿈 많이' :
    voice.pacing === 'efficient' ? '핵심만 간결하게' :
                                   '충분히 설명하며 길게';

  return `당신은 ${persona.name}입니다. ${persona.company}의 ${persona.title}입니다.

[캐릭터]
${persona.personality_notes}

[말투 지침]
- 격식: ${formalityDesc}
- 친근함: ${warmthDesc}
- 이모지: ${emojiDesc}
- 문장 스타일: ${pacingDesc}
- 자주 쓰는 표현: ${voice.quirks}
- 서명: ${voice.signature}

[답장 규칙]
1. 반드시 한국어로만 작성
2. 이메일 형식: 인사 → 질문 답변 → 마무리 → 서명
3. 위 캐릭터와 말투를 정확히 반영할 것
4. 질문에 구체적으로 답변 (모르는 내용은 "확인 후 알려드리겠습니다" 처리)
5. 200~400자 분량

[프로젝트 컨텍스트]
${brief_summary}`;
}

// ─── POST 핸들러 ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      project_id:      string;
      user_subject:    string;
      user_body:       string;
      persona_id:      string;
      brief_summary:   string;
      message_history: { role: 'user' | 'assistant'; content: string }[];
    };

    const { project_id, user_subject, user_body, persona_id, brief_summary, message_history } = body;

    // 1. 페르소나 조회 (없으면 null — fallback 프롬프트 사용)
    const persona = persona_id ? (getPersonaById(persona_id) ?? null) : null;

    // 2. 시스템 프롬프트 생성
    const systemPrompt = buildSystemPrompt(persona, brief_summary);

    // 3. Anthropic 메시지 배열 구성 (이전 대화 + 현재 질문)
    const messages: Anthropic.MessageParam[] = [
      ...message_history.map((m) => ({
        role:    m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: user_body },
    ];

    // 4. Anthropic SDK 호출
    const response = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system:     systemPrompt,
      messages,
    });

    const replyBody    = response.content[0].type === 'text' ? response.content[0].text : '';
    const replySubject = `Re: ${user_subject}`;

    // 5. Supabase에 assistant 메시지 저장
    const supabase   = await createClient();
    const { data: saved, error: dbError } = await supabase
      .from('messages')
      .insert({
        project_id,
        sender:  'assistant',
        type:    'qna_answer',
        subject: replySubject,
        body:    replyBody,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('[BriefLab] 답장 DB 저장 실패:', dbError);
      // 저장 실패해도 답장 텍스트는 반환 (현재 세션에서는 표시)
    }

    return NextResponse.json({
      reply_body:    replyBody,
      reply_subject: replySubject,
      saved_id:      saved?.id ?? null,
    });

  } catch (error) {
    console.error('[BriefLab] qna-reply 처리 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
