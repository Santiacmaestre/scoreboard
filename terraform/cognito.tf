resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Name = "${var.project_name}-user-pool"
  }
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "openid email profile"
    authorize_url    = "https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account"
  }

  attribute_mapping = {
    email    = "email"
    name     = "name"
    username = "sub"
  }
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id
}

resource "aws_cognito_user_pool_client" "app" {
  name         = "${var.project_name}-app"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret                      = true
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]

  callback_urls = compact([
    "https://${var.domain_name}/api/auth/callback/cognito",
    var.amplify_app_id != "" ? "https://${var.github_branch}.${var.amplify_app_id}.amplifyapp.com/api/auth/callback/cognito" : "",
    "http://localhost:3000/api/auth/callback/cognito",
  ])

  logout_urls = compact([
    "https://${var.domain_name}",
    "https://${var.domain_name}/admin/login",
    var.amplify_app_id != "" ? "https://${var.github_branch}.${var.amplify_app_id}.amplifyapp.com" : "",
    var.amplify_app_id != "" ? "https://${var.github_branch}.${var.amplify_app_id}.amplifyapp.com/admin/login" : "",
    "http://localhost:3000",
    "http://localhost:3000/admin/login",
  ])

  supported_identity_providers = [
    "Google",
    "COGNITO",
  ]

  depends_on = [aws_cognito_identity_provider.google]
}
