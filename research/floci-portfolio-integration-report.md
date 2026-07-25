# FLOCI x KEN-MURITU PORTFOLIO — COMPREHENSIVE INTEGRATION REPORT

Date: 2026-07-25
Author: Hermes Agent (automated code-to-code audit)
Scope: floci-io/floci (cloned at HEAD, full README + docs/services + src tree inspected)
       vs. ALL 40 repos under github.com/ken-muritu (every repo cloned, package.json /
       requirements.txt / pubspec / compose files / source grepped for cloud-service usage).

---

## PART 1 — WHAT FLOCI ACTUALLY IS (from the code, not marketing)

Repo: https://github.com/floci-io/floci — MIT license, Java (Quarkus/Vert.x, GraalVM
native image), single binary/container exposing the AWS wire protocol on port 4566.

Important correction to the framing: Floci is NOT "open-source AWS for production
hosting". It is a LOCAL AWS EMULATOR — the free successor to LocalStack Community
(which sunsets March 2026 behind auth tokens). You do not deploy your apps ON floci;
you point your AWS SDK/CLI/Terraform at http://localhost:4566 during development,
testing, and CI. Anything that must be reachable by real users still needs a real
host (Vercel, Render, a VPS, or real AWS).

That distinction drives every recommendation below: floci's value for your portfolio is
(a) local dev without cloud accounts/keys, (b) hermetic CI, (c) de-risking a future
migration from your current vendor mix (Turso, Cloudinary, Upstash, Supabase, Firebase,
Resend, Africa's Talking) onto AWS-shaped primitives you can emulate for free.

### Verified capabilities (from README/docs/services/, 69 services)
- In-process, high fidelity: S3 (versioning, multipart, PRESIGNED URLS, event
  notifications), DynamoDB (+Streams), SQS (std/FIFO/DLQ), SNS, SES v1/v2, IAM/STS,
  KMS, Secrets Manager, SSM Parameter Store, EventBridge (+Pipes +Scheduler),
  Step Functions, CloudWatch Logs/Metrics, Cognito (user pools, JWT/JWKS/OIDC
  well-known endpoints), API Gateway REST + v2 HTTP (JWT authorizers), AppSync,
  Route53, ACM, CloudFront, WAFv2, CloudFormation, ELBv2, Kinesis, Firehose, Athena
  (real SQL via DuckDB sidecar), Glue.
- Real Docker-backed (needs /var/run/docker.sock mounted): Lambda (real AWS runtime
  images), RDS (postgres:16 / mysql:8 / mariadb:11 — real engines + IAM auth),
  ElastiCache/MemoryDB (valkey:8 — real Redis protocol), DocumentDB (mongo:7),
  MSK (Redpanda Kafka), Amazon MQ (RabbitMQ), OpenSearch, Neptune (Gremlin/Neo4j),
  ECS/EC2/EKS(k3s)/ECR(registry:2), CodeBuild/CodeDeploy/CodePipeline.
- Ops properties: ~24ms startup, ~13MiB idle RAM, ~90MB image — genuinely CI-friendly.
- Storage modes: memory | persistent | hybrid | wal (FLOCI_STORAGE_MODE).
- Multi-account isolation: AWS_ACCESS_KEY_ID as 12 digits = separate account namespace.
- Testcontainers modules published for Java/Node/Python/Go.
- Stubs only (don't rely on): Bedrock Runtime, Textract, Transcribe.

### One-liner setup used throughout this report
```yaml
# compose.yaml
services:
  floci:
    image: floci/floci:latest
    ports: ["4566:4566"]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock"]   # only if Lambda/RDS/Redis needed
    user: root
    environment:
      FLOCI_STORAGE_MODE: hybrid
```
```bash
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test
```
Modern AWS SDK v3 (JS) and boto3 both honor AWS_ENDPOINT_URL automatically.

---

## PART 2 — REPO-BY-REPO ANALYSIS (all 40 repos, from actual dependency + source scan)

Tiering: [A] direct, high-value fit today · [B] fit after a small refactor ·
[C] useful only if you migrate a vendor service to AWS-shaped API · [D] no meaningful fit.

### TIER A — USE FLOCI NOW

1. msingi [A — the single best fit in your portfolio]
   Stack found: Turborepo; NestJS backend with @aws-sdk/client-s3, @aws-sdk/lib-storage,
   @aws-sdk/s3-request-presigner (storage.service.ts points at Cloudflare R2 via custom
   `endpoint`), bull + bullmq + ioredis, meilisearch, prisma, africastalking, resend,
   posthog; Next.js web + store apps; render.yaml.
   Why floci: your storage.service.ts is ALREADY generic S3Client-with-endpoint code.
   Change one env var and local dev/CI needs zero R2 credentials:
     R2 endpoint -> http://localhost:4566, bucket auto-creatable at boot.
   Presigned upload flow (storage.controller.ts POST /presign and the KYC
   verification.service.ts presign path) works against floci S3 presigned URLs —
   you can finally integration-test KYC document upload end-to-end in CI.
   Also: bull/bullmq needs Redis — run floci ElastiCache (real valkey:8) OR keep plain
   redis container; floci wins when you also want SQS-shaped queues later.
   Concrete steps:
   - Add compose.yaml above to repo root; add `S3_ENDPOINT` env consumed in
     storage.service.ts constructor (it already branches on env — extend the branch).
   - CI (GitHub Actions): `docker run -d -p 4566:4566 floci/floci`, then
     `aws s3 mb s3://msingi-assets`, run Nest e2e tests with AWS_ENDPOINT_URL set.
   - Testcontainers-node module exists if you prefer per-suite isolation.

2. frameflow [A]
   Stack found: Next.js + Supabase + Stripe frontend; python/ backend with FastAPI,
   celery, redis, yt-dlp, whisper, torch, and BOTO3 1.34 in requirements.txt.
   Why floci: boto3 present for object storage of rendered video/frames. boto3
   honors AWS_ENDPOINT_URL — zero code change to develop the whole video pipeline
   (upload source -> celery worker -> write derivatives to S3) locally:
     aws s3 mb s3://frameflow-media
   Celery's redis broker can be floci ElastiCache or plain redis. If you ever want to
   replace celery with AWS-native, floci lets you prototype SQS + Lambda workers
   locally first. S3 event notifications in floci can trigger processing on upload —
   a cleaner architecture than polling, testable entirely offline.

3. hermes-saas [A]
   Stack found: Django 5 + DRF + gunicorn + psycopg2 backend, Next.js frontend,
   render.yaml with Render Postgres.
   Why floci: floci RDS runs a REAL postgres:16 container behind AWS RDS control-plane
   APIs. Local dev/CI parity with Render Postgres without installing postgres:
     aws rds create-db-instance --db-instance-identifier hermes --engine postgres ...
   then point DATABASE_URL at the endpoint floci returns. Also SES emulation for the
   inevitable Django email flows (password reset), and Secrets Manager/SSM to rehearse
   proper secret handling instead of render.yaml plaintext env vars.
   (Deploy still stays on Render — floci is your dev/CI twin.)

4. addplus [A]
   Stack found: Express API (apps/api) with prisma+libsql/Turso, redis, cloudinary,
   multer, node-cron, expo-server-sdk, africastalking, jwt; Expo mobile; Next.js web
   with web-push, stream-chat; render.yaml + vercel.json; heavy security docs.
   Why floci:
   - cloudinary + multer image pipeline -> develop/test against floci S3 with presigned
     URLs (same pattern as msingi). Keeps you vendor-portable; your SECURITY_AUDIT.md
     concerns about upload handling become locally testable.
   - redis -> floci ElastiCache (real valkey; IAM-auth optional).
   - node-cron jobs -> prototype as EventBridge Scheduler rules -> SQS/Lambda locally;
     kills the "cron dies when the dyno sleeps" class of bugs on Render free tier.
   - JWT auth -> optionally rehearse Cognito user pools (floci serves real JWKS/OIDC
     endpoints), which your Express middleware can verify like any OIDC issuer.

5. solera + solera0 + caspahub + edifice [A as a family — same platform DNA]
   Stack found (verified nearly identical package.json): Next.js 15, drizzle-orm +
   @libsql/client (Turso), next-auth, stream-chat, web-push, serwist PWA, sharp,
   Sentry; solera adds @ai-sdk/anthropic; solera0 adds Django backend (Render Postgres
   + per-tenant Turso, requirements.txt confirms psycopg + libsql-client).
   Why floci:
   - solera0's Django "platform/registry DB on Render Postgres" -> floci RDS postgres
     locally (same as hermes-saas). Multi-tenant registry logic finally integration-
     testable without touching prod Turso/Render.
   - Pharmacy/clinic docs, prescriptions, product images (sharp present) -> floci S3
     presigned uploads instead of stuffing blobs in Turso or relying on Vercel-only paths.
   - web-push notification fan-out -> model as SNS->SQS locally if you outgrow the
     current direct loop; floci SNS delivers to SQS/Lambda/HTTP.
   - Multi-account isolation feature (12-digit AKID = isolated namespace) is a neat
     local model for TENANT isolation experiments: one floci account per pharmacy.
   - Health-data angle: solera is the repo where "no real patient data in dev" matters
     most — floci gives you a full fake cloud so dev never touches production stores.

6. bodalink [A for its backend]
   Stack found: Flutter app; backend/functions = Firebase Functions + firebase-admin +
   twilio + node-cron + geofire-common + express; jest tests.
   Why floci: if/when you outgrow Firebase Functions (cold starts, vendor lock),
   floci Lambda runs REAL AWS runtime containers locally — port each function and test
   offline; API Gateway v2 HTTP API emulation fronts them exactly like prod would.
   node-cron -> EventBridge Scheduler. Twilio SMS stays Twilio (floci SNS SMS is not a
   real sender, but SNS topic fan-out logic is testable). Firestore has no floci
   equivalent (DynamoDB is the AWS analog — a rewrite, only if you choose to migrate).

### TIER B — GOOD FIT AFTER SMALL REFACTOR

7. breeze [B]
   Stack: Next.js, drizzle+libsql, next-auth, inngest, uploadthing, resend,
   africastalking.
   Floci angle: uploadthing -> S3 presigned uploads (removes a paid vendor; sqlite/
   drizzle stays); inngest background jobs -> EventBridge Scheduler + SQS + Lambda is
   the AWS-shaped equivalent you can develop 100% locally; resend -> SES v2 API for
   dev/test (floci SES captures emails; keep Resend in prod or move to real SES).

8. rpos / rpacademy / rpwebsite (Royal Priesthood family) [B]
   Stack: Next.js + prisma/libsql + next-auth + @upstash/redis + @upstash/ratelimit +
   Sentry + cloudinary (rpos) + @react-pdf/renderer + pino; rpacademy adds Expo mobile
   + supabase package + tiptap courses.
   Floci angle:
   - @upstash/redis is REST-based — floci ElastiCache is protocol Redis, so a rate-limit
     refactor to ioredis would be needed to emulate locally. Worth it only if you want
     to drop Upstash.
   - cloudinary (rpos) -> S3 presigned pattern, same playbook as addplus.
   - rpacademy certificates (@react-pdf/renderer) -> generate in a floci Lambda,
     store to floci S3, serve via presigned GET — the whole pipeline dev-tested offline.
   - Course video/assets storage -> S3 + CloudFront emulation for the URL shapes.

9. varidi [B]
   Stack: Expo app (drizzle-kit present, expo-secure-store, notifications, location)
   + Next.js web.
   Floci angle: mobile apps need a backend; if the missing API layer lands on AWS-shaped
   services (API GW v2 + Lambda + DynamoDB), floci lets you build it locally before
   paying for anything. expo-notifications server side -> SNS platform semantics
   prototyped locally.

10. deriviq [B]
    Stack: NestJS API + Next.js web monorepo, docker-compose.yml already present.
    Floci angle: trading/analytics shape — Kinesis (tick streams), DynamoDB (positions),
    Athena+DuckDB (backtest queries over S3 parquet) are all emulated. Add floci as a
    service in the existing docker-compose.yml; it composes cleanly with a Nest app.

11. churchcrm (fork) + CRM [B]
    Stack: PHP + mysql2 + extensive docker/ compose variants already in repo.
    Floci angle: floci RDS MySQL (real mysql:8.0 container behind RDS APIs) can stand in
    for the DB in an AWS-hosted deployment rehearsal; S3 for member-photo/document
    storage (ChurchCRM supports S3-style backends via config). Low priority — the
    upstream compose files already solve local dev; floci matters only if you plan to
    host a church instance on AWS and want to rehearse first.

12. kilimax [B, speculative]
    Stack: python serve.py/extract.py + static site + erp folder (early stage).
    Floci angle: if the ERP grows a real backend, starting AWS-shaped-on-floci from day
    one costs nothing and keeps prod options open (boto3 + AWS_ENDPOINT_URL).

### TIER C — ONLY IF YOU MIGRATE VENDORS

13. mat3 / ma3app / schedulepro / velanoah [C]
    Stacks: Supabase and/or Firebase clients (mat3: supabase+firebase; schedulepro:
    supabase; velanoah: supabase + Solana web3). Floci has NO Supabase/Firestore
    emulation — the AWS analogs (Cognito for auth, DynamoDB/RDS for data, S3 for
    storage) are rewrites, not drop-ins. Use floci only if you deliberately migrate off
    Supabase/Firebase. Supabase ships its own local CLI emulator — use that instead.
    velanoah's Solana side is fully out of scope for floci.

14. muritukennedy / muri-tuu [C]
    muritukennedy: Next.js + prisma/libsql + cloudinary + stream-chat.
    muri-tuu: Django 6 + whitenoise + Pillow (+ archived Next.js).
    Floci angle: cloudinary->S3 and Django media->S3 (django-storages + AWS_ENDPOINT_URL
    works against floci) are the only realistic hooks. Portfolio sites — low ROI.

### TIER D — NO MEANINGFUL FIT (static/frontend-only/tooling)

15. aang (Next.js + nodemailer contact form — SES emulation is the only conceivable hook)
16. filum, v0filum, framecore, v0framecore, vela (marketing/landing sites)
17. itsdeno, mypagemoringa, website, farisbyjaza, pesastudio (better-sqlite3 local),
    rewind, rhema (Tauri desktop), luminary (local-first PWA/Tauri, Turso-wasm),
    makao (Next.js+prisma/libsql — pure Vercel shape, no cloud services beyond Turso)
    -> nothing AWS-shaped in these codebases today. Skip.
18. skiiforge (this research repo) — floci is itself a research subject here, not a
    dependency.

---

## PART 3 — CROSS-CUTTING PLAYBOOKS (patterns repeated across your portfolio)

P1. Cloudinary -> S3 presigned uploads (addplus, rpos, muritukennedy)
    Server: @aws-sdk/s3-request-presigner getSignedUrl(PutObjectCommand) — identical
    code against floci locally and real S3/R2 in prod. msingi already contains the
    reference implementation you can copy verbatim (storage.service.ts).

P2. Upstash/Redis -> floci ElastiCache (addplus, msingi, rp* family)
    Real valkey protocol; supports IAM auth + SigV4 like real ElastiCache. Plain
    ioredis clients connect unchanged. Upstash REST clients need refactor first.

P3. node-cron / inngest -> EventBridge Scheduler + SQS + Lambda (addplus, bodalink,
    breeze, msingi bull jobs)
    Floci emulates schedule groups, flexible windows, retries, DLQs — the entire
    scheduled-job architecture is testable with `aws scheduler create-schedule` locally.

P4. Resend/nodemailer -> SES for dev capture (breeze, msingi, aang, hermes-saas)
    Point the SDK at floci; assert sent-mail in tests via floci's SES state instead of
    mocking your mail module.

P5. next-auth/JWT -> Cognito rehearsal (addplus, all next-auth apps)
    Floci Cognito exposes real JWKS + OpenID well-known endpoints, so next-auth's OIDC
    provider or express-jwt can point at it. Do this only when an AWS migration is
    actually on the table.

P6. CI recipe (drop into any repo's GitHub Actions)
    ```yaml
    services:
      floci:
        image: floci/floci:latest
        ports: [ "4566:4566" ]
    env:
      AWS_ENDPOINT_URL: http://localhost:4566
      AWS_ACCESS_KEY_ID: test
      AWS_SECRET_ACCESS_KEY: test
      AWS_DEFAULT_REGION: us-east-1
    ```
    24ms startup means it adds essentially zero CI time.

P7. Turso/libSQL caveat (nearly every Tier A/B repo)
    Floci has NO Turso/libSQL emulation — Turso is not an AWS service. Your drizzle/
    prisma-libsql layers stay exactly as they are (local file: sqlite for dev). Floci
    complements Turso (object storage, queues, email, cron, cache); it does not
    replace it. The nearest AWS analogs would be RDS or DynamoDB — full migrations.

---

## PART 4 — PRIORITIZED ACTION PLAN

1. msingi   — set S3 endpoint env, add compose + CI service. ~1 hour, immediate payoff
              (KYC presign flow e2e-testable). Zero prod risk.
2. frameflow— export AWS_ENDPOINT_URL for boto3, create bucket, run pipeline locally.
3. hermes-saas — floci RDS postgres as local twin of Render Postgres; wire into tests.
4. addplus  — S3-presign refactor of cloudinary path + EventBridge Scheduler prototype
              for node-cron jobs (the biggest architectural win).
5. solera/solera0 — floci RDS for the Django registry DB; S3 for pharmacy documents;
              experiment with per-tenant multi-account isolation.
6. breeze / rp* family — vendor-reduction refactors (uploadthing/cloudinary/upstash)
              on the P1/P2/P3 playbooks, at leisure.
Everything else: no action needed today.

## PART 5 — LIMITS / DO-NOT-ASSUME LIST (verified)

- Floci is dev/test/CI only. It is not a production host and offers no durability
  guarantees beyond its wal storage mode on your own disk.
- Docker socket must be mounted for Lambda/RDS/ElastiCache/etc.; on your Kali/Linux
  boxes that's fine, but note the container runs as root for that.
- Bedrock/Textract/Transcribe are stubs — your @ai-sdk/anthropic code in solera cannot
  be meaningfully exercised through floci (it doesn't need to be; it's Anthropic-direct).
- No emulation exists for: Turso, Supabase, Firebase/Firestore, Cloudinary API shape,
  Stream Chat, PayHero/M-Pesa, Africa's Talking, Stripe, Solana. Those keep their own
  sandboxes/mocks.
- LocalStack migration table in the README confirms env-var compatibility shims
  (LOCALSTACK_* accepted) if you ever used LocalStack snippets from tutorials.

— End of report —
