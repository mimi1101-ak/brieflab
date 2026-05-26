import { BriefData } from '@/components/brief/types';

/**
 * BriefData를 바탕으로 자연스러운 줄글 이메일 본문을 생성한다.
 * "[섹션 헤더]" 형태의 항목 구분 없이 단락 형태로 작성.
 */
export function buildEmailBody(brief: BriefData): string {
  const { persona, project, dates, target, emotion, deliverable, budget, styleLabels, refUrl, avoid } = brief;

  const paragraphs = [
    `안녕하세요. ${persona.company} ${persona.title} ${persona.name}입니다. 먼저 연락 주셔서 감사드리고, 이번 프로젝트를 함께 진행할 디자이너분을 찾고 있어 이렇게 메일 드립니다.`,

    `이번 작업은 ${project.name}입니다. ${project.purpose} 저희 내부에서는 오래전부터 이 부분에 대한 개선 필요성을 인지하고 있었고, 이번 기회에 제대로 정비하고 싶습니다.`,

    `주로 활용될 채널은 자사 채널이며, 완성된 결과물은 실제 고객 접점에 바로 적용될 예정입니다. 따라서 완성도와 실용성 모두 중요하게 생각하고 있습니다.`,

    `주요 타겟 고객층은 ${target.age} 연령대이며, 성별 비율은 ${target.gender} 정도입니다. 이분들의 라이프스타일을 한마디로 표현하면 "${target.lifestyle}" 정도라고 할 수 있고, 이에 맞는 언어와 비주얼 접근이 필요합니다.`,

    `디자인 방향에 대해서는, 전반적으로 ${styleLabels !== '제한 없음' ? styleLabels + ' 스타일을 선호합니다.' : '방향에 큰 제약은 두지 않겠습니다.'} 결과물을 보았을 때 고객이 "${emotion}" 느낌을 받으면 좋겠습니다. ${refUrl !== '없음' ? `참고할 만한 레퍼런스 링크도 함께 공유드립니다 (아래 첨부 참고).` : '특별히 참고하실 레퍼런스는 따로 없으나, 디자이너분의 제안을 적극 반영하겠습니다.'}`,

    `${avoid !== '특별한 제한 없음' ? `다만, "${avoid}" 느낌은 저희 브랜드 방향과 맞지 않아 가급적 피해주시면 좋겠습니다.` : '스타일 면에서 특별한 금기 사항은 없습니다.'}`,

    `산출물 형식은 ${deliverable}로 납품해 주시면 되고, 수정 사항이 있을 경우에는 단계별로 피드백 드리겠습니다. 예산 범위는 ${budget} 선으로 생각하고 있으며, 최종 범위는 작업 범위 협의 후 조율할 수 있습니다.`,

    `일정과 관련해서는, ${dates.kickoff}을 킥오프 기준으로 잡고 있고, ${dates.mid}에 중간 시안을 검토하여 ${dates.final}에 최종 납품이 마무리되면 좋겠습니다. 혹시 일정 조율이 필요하시면 미리 말씀해주세요.`,

    `궁금하신 점이나 추가로 필요한 정보가 있으시면 편하게 질문해 주세요. 좋은 작업물이 나올 수 있도록 적극 협력하겠습니다. 감사합니다.`,
  ];

  return paragraphs.join('\n\n');
}
