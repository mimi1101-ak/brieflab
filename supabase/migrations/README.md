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

---

## 익명 인증 (Anonymous Sign-In) 설정

### 변경된 파일

| 파일 | 내용 |
|---|---|
| `src/lib/supabase/middleware.ts` | `ensureSession()` 함수 추가 — 세션 없으면 `signInAnonymously()` 자동 호출 |
| `src/proxy.ts` | `ensureSession()` 사용, `/auth/*` 경로는 코드 교환 흐름 보호를 위해 통과 |

### Supabase Dashboard 설정 (필수)

**Authentication → Configuration → Sign In / Up → "Allow anonymous sign-ins" 을 ON으로 설정해야 합니다.**

이 설정이 꺼져 있으면 서버 로그에 다음 에러가 출력됩니다:
```
[BriefLab] 익명 로그인 실패: Anonymous sign-ins are disabled
```

### 동작 방식

- 모든 페이지 첫 접속 시 `proxy.ts`(Next.js 미들웨어)가 세션을 확인합니다.
- 세션이 없으면 자동으로 `signInAnonymously()`를 호출해 익명 세션을 발급합니다.
- 이후 요청에서는 쿠키에 세션이 있으므로 `signInAnonymously()`를 재호출하지 않습니다.
- 로컬 환경에서 `/login` 페이지가 보일 수 있지만, 익명 인증이 백그라운드에서 먼저 처리되므로 로그인 없이도 모든 기능이 동작합니다.
- 기존 정식 로그인 코드(`src/app/login`, `src/app/auth`, `src/app/onboarding`)는 그대로 보존되어 있으며, 나중에 재활성화 시 익명 → 정식 계정 업그레이드(`supabase.auth.updateUser`)가 가능합니다.

### 검증 방법

1. 시크릿 창으로 접속
2. F12 → Application → Cookies에서 `sb-` 로 시작하는 Supabase 세션 쿠키 확인
3. Supabase Dashboard → Authentication → Users에서 `is_anonymous: true` 인 사용자 생성 확인

---

## 데이터 영속화 (A-2) — 변경 파일 목록

### 추가된 파일

| 파일 | 내용 |
|---|---|
| `src/lib/supabase/projects.ts` | Supabase DB 유틸: `insertDraftProject`, `acceptProject`, `deleteProject`, `getActiveProjects`, `getProject` |

### 수정된 파일

| 파일 | 변경 내용 |
|---|---|
| `src/stores/briefStore.ts` | `projectId` 필드 추가 — 미리보기 페이지와 DB 연동을 위해 |
| `src/components/brief/briefData.ts` | 프로젝트 이름에 무작위 변형 추가 (재생성 시 다른 내용 보장) |
| `src/components/brief/BriefNewClient.tsx` | `handleSubmit` 비동기화 + DB INSERT + 에러 표시 |
| `src/app/brief/preview/page.tsx` | `searchParams.id` 수락 후 `BriefPreviewClient`에 전달 |
| `src/components/brief/BriefPreviewClient.tsx` | 전면 재작성: DB 연동, 새로고침 견고성, 수락/재생성/거절 3개 버튼, 로딩 상태, 토스트 |
| `src/components/dashboard/Dashboard.tsx` | 더미 `ACTIVE_BRIEFS` 제거 → Supabase 실시간 조회, 링크 `/project/{id}` 연결 |
| `src/app/project/[id]/page.tsx` | 작업 C 전까지의 placeholder 페이지로 교체 |

### draft → active 흐름

```
/brief/new → 설정 선택 → "브리프 생성하기"
  → buildBrief() + buildEmailBody()
  → Supabase INSERT (status='draft')
  → /brief/preview?id={projectId}

/brief/preview
  → 수락하기   → UPDATE status='active' → /
  → 재생성하기 → DELETE → 새 브리프 생성 → INSERT → /brief/preview?id={newId}
  → 거절하기   → 확인 다이얼로그 → DELETE → /brief/new

/ (대시보드)
  → Supabase SELECT WHERE status='active' ORDER BY created_at DESC
  → 카드 렌더링 → "이어서 작업" → /project/{id} (placeholder)
```
