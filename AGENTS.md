# 프로젝트 자동 푸시(배포) 규칙

- 이 워크스페이스의 파일(`index.html`, `css/*`, `js/*`, `api/*`, `manifest.json`, `sw.js` 등)을 수정할 때마다 **항상 자동으로 인터넷 서버에 푸시(배포)**(`cmd.exe /c "npx vercel deploy --temporary --yes"`)합니다.
- 백그라운드 감시 데몬(`auto-push.js`) 또한 파일 변경을 감지하여 자동으로 서버에 푸시합니다.
