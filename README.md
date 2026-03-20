# Scoreboard — Leaderboard de Contribuidores

Aplicación web para rastrear y mostrar rankings de contribuidores y líderes de la comunidad AWS IA User Group Colombia. Built with Next.js (SSR) en AWS Amplify, DynamoDB, Cognito y Terraform.

## Arquitectura

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Route 53   │────▶│   Amplify    │────▶│  DynamoDB    │
│  (DNS)      │     │  (Next.js)   │     │ (Provisioned)│
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                    ┌──────▼───────┐
                    │   Cognito    │
                    │  + Google    │
                    │   OAuth      │
                    └──────────────┘
```

**Recursos AWS creados por Terraform:**
- **Amplify** — Hosting SSR (Next.js) con deploy automático desde GitHub
- **DynamoDB** — Tabla single-table con capacidad provisionada (techo de costo)
- **Cognito** — User Pool con Google como identity provider
- **Route 53** — Hosted zone para DNS
- **IAM** — Role para Amplify con acceso a DynamoDB y SSM
- **SSM Parameter Store** — Secrets (Cognito client secret, NextAuth secret, Google credentials)
- **Budget** — Alerta mensual de costo

---

## Pre-requisitos

- **Cuenta AWS** con permisos de administrador
- **AWS CLI** configurado
- **Terraform** >= 1.5.0
- **Node.js** >= 18
- **Cuenta de GitHub** con acceso al repositorio
- **Cuenta de Google Cloud** (gratis, solo para OAuth credentials)

---

## Paso 1 — Crear el backend de Terraform State

Antes del primer deploy, crea manualmente el bucket S3 para almacenar el state de Terraform (el locking usa el mecanismo nativo de S3 con `use_lockfile`):

```bash
# Crear bucket S3 para el state
aws s3api create-bucket \
  --bucket leaderboard-tfstate-aiawsug \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2

aws s3api put-bucket-versioning \
  --bucket leaderboard-tfstate-aiawsug \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket leaderboard-tfstate-aiawsug \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

---

## Paso 2 — Crear credenciales de Google OAuth

Estas credenciales permiten "Sign in with Google" en el panel admin via Cognito.

1. Ve a [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Crea un proyecto nuevo o selecciona uno existente
3. Configura la **OAuth consent screen**:
   - Tipo de usuario: **Externo**
   - Nombre de la app: `Leaderboard`
   - Correo de soporte: tu email
   - Scopes: agregar `email`, `profile`, `openid`
   - Guardar (queda en modo Testing)
4. Ve a **Credentials → Create Credentials → OAuth Client ID**:
   - Tipo: **Web application**
   - Nombre: `Leaderboard Cognito`
   - **Orígenes autorizados de JavaScript**: dejar vacío
   - **URIs de redireccionamiento autorizados**: 
     ```
     https://leaderboard-dev.auth.us-west-2.amazoncognito.com/oauth2/idpresponse
     ```
   - Crear
5. Copia el **Client ID** y **Client Secret**

> **Nota:** No necesitas pagar nada en Google Cloud. El OAuth es gratuito.

---

## Paso 3 — Crear GitHub Personal Access Token

Amplify necesita un token para conectarse al repositorio.

1. Ve a [GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. **Generate new token (classic)**
3. Scopes necesarios: `repo` (acceso completo al repo)
4. Copia el token

---

## Paso 4 — Configurar OIDC para GitHub Actions

Para que el pipeline pueda asumir un IAM Role sin access keys:

### 4.1 — Crear el Identity Provider en AWS

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 4.2 — Crear el IAM Role para GitHub Actions

Crea un archivo `trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<TU_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:Santiacmaestre/scoreboard:*"
        }
      }
    }
  ]
}
```

```bash
# Crear el role
aws iam create-role \
  --role-name github-actions-leaderboard \
  --assume-role-policy-document file://trust-policy.json

# Adjuntar permisos de administrador (para Terraform)
aws iam attach-role-policy \
  --role-name github-actions-leaderboard \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

> **Nota:** Para producción, limitar los permisos a solo los servicios usados (Amplify, DynamoDB, Cognito, Route53, SSM, IAM, Budgets, S3).

---

## Paso 5 — Configurar secretos en GitHub

Ve a **Settings → Secrets and variables → Actions → New repository secret** y agrega:

| Secret | Valor |
|--------|-------|
| `AWS_ROLE_ARN` | `arn:aws:iam::<TU_ACCOUNT_ID>:role/github-actions-leaderboard` |
| `GH_ACCESS_TOKEN` | El token de GitHub del Paso 3 |
| `GOOGLE_CLIENT_ID` | El Client ID de Google del Paso 2 |
| `GOOGLE_CLIENT_SECRET` | El Client Secret de Google del Paso 2 |

---

## Paso 6 — Deploy

### Opción A: Via GitHub Actions (recomendado)

Haz push a `main` y el pipeline se encarga de todo:

```bash
git push origin main
```

El workflow ejecuta: `init → fmt check → validate → plan → apply`

En PRs solo hace `plan` y comenta el resultado en el PR.

### Opción B: Manual (local)

```bash
cd terraform

# Exportar secretos
export TF_VAR_github_access_token="ghp_xxxxxxxxxxxx"
export TF_VAR_google_client_id="xxxxx.apps.googleusercontent.com"
export TF_VAR_google_client_secret="GOCSPX-xxxxx"

terraform init
terraform plan
terraform apply
```

---

## Paso 7 — Post-deploy

### 7.1 — Configurar nameservers en tu registrador DNS

Después del deploy, obtén los nameservers:

```bash
cd terraform
terraform output route53_nameservers
```

Configura estos nameservers en tu registrador de dominio (GoDaddy, Namecheap, etc.) para el dominio `leaderboard.aiawsug.com`.

### 7.2 — Actualizar el NextAuth Secret

```bash
# Generar un secret aleatorio
RANDOM_SECRET=$(openssl rand -base64 32)

# Actualizar en SSM
aws ssm put-parameter \
  --name "/leaderboard/dev/nextauth-secret" \
  --value "$RANDOM_SECRET" \
  --type SecureString \
  --overwrite \
  --region us-west-2

# Actualizar la env var en Amplify (obtén el app ID del output)
AMPLIFY_APP_ID=$(cd terraform && terraform output -raw amplify_app_id)

aws amplify update-app \
  --app-id "$AMPLIFY_APP_ID" \
  --environment-variables NEXTAUTH_SECRET="$RANDOM_SECRET" \
  --region us-west-2
```

### 7.3 — Seed de datos iniciales

```bash
cd leaderboard

# Configurar env vars locales
export AWS_REGION=us-west-2
export DYNAMODB_TABLE_NAME=leaderboard-dev

npx tsx scripts/seed.ts
```

---

## Desarrollo local

```bash
cd leaderboard
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Por defecto usa datos mock (`NEXT_PUBLIC_USE_MOCK=true`).

Para conectar a DynamoDB real:

```bash
NEXT_PUBLIC_USE_MOCK=false \
AWS_REGION=us-west-2 \
DYNAMODB_TABLE_NAME=leaderboard-dev \
npm run dev
```

---

## Costos

La infraestructura incluye protección contra costos excesivos:

- **DynamoDB** con capacidad provisionada (5 RCU / 5 WCU) — se throttlea bajo abuso en vez de escalar
- **Budget alarm** a $5 USD/mes con alertas al 80% y 100%
- **Amplify** tiene pricing por request pero el throttle de DynamoDB limita el impacto

---

## Estructura del proyecto

```
├── .github/workflows/    # CI/CD pipeline
│   └── deploy.yml
├── leaderboard/          # Next.js app
│   ├── app/              # Pages y API routes
│   ├── components/       # React components
│   ├── lib/              # Utils, types, DynamoDB client
│   └── scripts/          # Seed script
└── terraform/            # Infraestructura como código
    ├── amplify.tf
    ├── budget.tf
    ├── cognito.tf
    ├── dynamodb.tf
    ├── iam.tf
    ├── main.tf
    ├── outputs.tf
    ├── route53.tf
    ├── ssm.tf
    └── variables.tf
```
