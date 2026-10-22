---
trigger: always_on
---

# 자동 푸시(배포) 규칙 (Auto-Push Rule)

1. 코드, UI, 설정 등 어떤 파일이든 수정하면 사용자에게 별도로 묻지 않고 **즉시 자동으로 푸시(배포)**(`cmd.exe /c "npx vercel deploy --temporary --yes"`)를 실행하여 실시간 인터넷 접속 주소에 반영한다.
2. 만약 기존 임시 배포 세션이 만료되었거나 에러가 발생하면 `.vercel` 폴더를 삭제한 뒤 즉시 재배포하고 최신 접속 주소를 안내한다.
