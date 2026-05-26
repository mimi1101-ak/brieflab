# Supabase Migrations

## 20260526120000_create_projects_and_messages

이 마이그레이션은 BriefLab의 핵심 데이터 테이블 2개(`projects`, `messages`)를 생성하고,
RLS 정책·인덱스·`updated_at` 자동 갱신 트리거를 함께 설정합니다.

---

### Supabase Dashboard에서 SQL 실행하기

1. [Supabase Dashboard](https://supabase.com/dashboard) → 해당 프로젝트 선택
2. 왼쪽 사이드바 **SQL Editor** 클릭
3. **New query** 버튼 클릭
4. `supabase/migrations/20260526120000_create_projects_and_messages.sql` 파일의 내용을 전체 복사해 붙여넣기
5. **Run** (단축키: `Ctrl+Enter` / `Cmd+Enter`) 클릭
6. 하단 결과 패널에 오류 없이 `Success` 메시지가 표시되면 완료

> **멱등성**: 이 SQL은 `IF NOT EXISTS` / `CREATE OR REPLACE` / `DROP … IF EXISTS`를 사용하므로 여러 번 실행해도 안전합니다.

---

### 적용 후 검증 방법

| 확인 항목 | 위치 | 기대 결과 |
|---|---|---|
| 테이블 생성 | Table Editor | `projects`, `messages` 테이블이 목록에 표시됨 |
| RLS 활성화 | Authentication → Policies | 두 테이블 모두 **RLS enabled** 배지 표시, 각 4개 정책(SELECT/INSERT/UPDATE/DELETE) 존재 |
| 인덱스 생성 | Database → Indexes | `idx_projects_user_created`, `idx_messages_project_created` 존재 |
| 트리거 | Database → Triggers | `set_projects_updated_at` ON `projects` BEFORE UPDATE |

**RLS 동작 확인 (선택)**

Table Editor → `projects` → **Insert row**에서 `user_id`를 현재 로그인한 사용자가 아닌 임의의 UUID로 입력하면 `new row violates row-level security policy` 오류가 발생해야 합니다.
