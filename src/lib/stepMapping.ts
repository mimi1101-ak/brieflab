/**
 * DB의 current_step 문자열 ↔ BriefProcess 컴포넌트의 stepIdx 숫자 변환
 *
 * DB:        'receive' | 'qna' | 'draft_submit' | 'feedback' | 'deliver'
 * Component: index      0        1                 2            3           4
 */

const DB_TO_IDX: Record<string, number> = {
  receive:      0,
  qna:          1,
  draft_submit: 2,
  draft:        2, // 안전 fallback (UI 측 ID)
  feedback:     3,
  deliver:      4,
};

const IDX_TO_DB: Record<number, string> = {
  0: 'receive',
  1: 'qna',
  2: 'draft_submit',
  3: 'feedback',
  4: 'deliver',
};

/** DB current_step → 컴포넌트 stepIdx (0~4). 매핑 실패 시 0 반환. */
export function mapDbStepToComponentIdx(dbStep: string): number {
  return DB_TO_IDX[dbStep] ?? 0;
}

/** 컴포넌트 stepIdx → DB current_step. 범위 밖이면 'receive' 반환. */
export function mapComponentIdxToDbStep(idx: number): string {
  return IDX_TO_DB[idx] ?? 'receive';
}
