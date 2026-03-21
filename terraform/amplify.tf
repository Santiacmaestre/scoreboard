resource "aws_amplify_app" "leaderboard" {
  name       = "${var.project_name}-${var.environment}"
  repository = var.github_repository

  access_token = var.github_access_token

  iam_service_role_arn = aws_iam_role.amplify_ssr.arn

  build_spec = <<-EOT
    version: 1
    applications:
      - appRoot: leaderboard
        frontend:
          phases:
            preBuild:
              commands:
                - npm ci
            build:
              commands:
                - npx next build --webpack
          artifacts:
            baseDirectory: .next
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
              - .next/cache/**/*
  EOT

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "leaderboard"
    NEXT_PUBLIC_USE_MOCK      = "false"
    NEXT_PUBLIC_APP_URL       = "https://${var.domain_name}"
    APP_AWS_REGION            = var.aws_region
    DYNAMODB_TABLE_NAME       = aws_dynamodb_table.leaderboard.name
    COGNITO_USER_POOL_ID      = aws_cognito_user_pool.main.id
    COGNITO_CLIENT_ID         = aws_cognito_user_pool_client.app.id
    COGNITO_CLIENT_SECRET     = aws_cognito_user_pool_client.app.client_secret
    COGNITO_ISSUER            = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
    NEXTAUTH_SECRET           = random_password.nextauth_secret.result
    _CUSTOM_IMAGE             = "amplify:al2023"
  }

  platform = "WEB_COMPUTE"

  tags = {
    Name = "${var.project_name}-amplify"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.leaderboard.id
  branch_name = var.github_branch

  framework = "Next.js - SSR"
  stage     = "PRODUCTION"

  environment_variables = {
    NEXT_PUBLIC_ENVIRONMENT = var.environment
    NEXTAUTH_URL            = var.amplify_app_id != "" ? "https://${var.github_branch}.${var.amplify_app_id}.amplifyapp.com" : "https://${var.domain_name}"
  }
}

resource "aws_amplify_domain_association" "main" {
  app_id      = aws_amplify_app.leaderboard.id
  domain_name = var.zone_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "leaderboard"
  }

  wait_for_verification = false
}
