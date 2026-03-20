resource "aws_ssm_parameter" "cognito_client_secret" {
  name  = "/${var.project_name}/${var.environment}/cognito-client-secret"
  type  = "SecureString"
  value = aws_cognito_user_pool_client.app.client_secret

  tags = {
    Name = "${var.project_name}-cognito-client-secret"
  }
}

resource "aws_ssm_parameter" "nextauth_secret" {
  name  = "/${var.project_name}/${var.environment}/nextauth-secret"
  type  = "SecureString"
  value = "REPLACE_ME_WITH_RANDOM_SECRET"

  tags = {
    Name = "${var.project_name}-nextauth-secret"
  }

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_client_id" {
  name  = "/${var.project_name}/${var.environment}/google-client-id"
  type  = "SecureString"
  value = var.google_client_id

  tags = {
    Name = "${var.project_name}-google-client-id"
  }
}

resource "aws_ssm_parameter" "google_client_secret" {
  name  = "/${var.project_name}/${var.environment}/google-client-secret"
  type  = "SecureString"
  value = var.google_client_secret

  tags = {
    Name = "${var.project_name}-google-client-secret"
  }
}
