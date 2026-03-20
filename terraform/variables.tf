variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used as prefix for resources"
  type        = string
  default     = "leaderboard"
}

variable "zone_name" {
  description = "Root domain for the Route53 hosted zone (e.g., aiawsug.com)"
  type        = string
  default     = "aiawsug.com"
}

variable "domain_name" {
  description = "Full domain for the app (e.g., leaderboard.aiawsug.com)"
  type        = string
  default     = "leaderboard.aiawsug.com"
}

variable "github_repository" {
  description = "GitHub repository URL (https://github.com/user/repo)"
  type        = string
  default     = "https://github.com/Santiacmaestre/scoreboard.git"
}

variable "github_access_token" {
  description = "GitHub personal access token for Amplify"
  type        = string
  sensitive   = true
}

variable "github_branch" {
  description = "Git branch to deploy"
  type        = string
  default     = "main"
}

variable "google_client_id" {
  description = "Google OAuth Client ID for Cognito"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret for Cognito"
  type        = string
  sensitive   = true
}

variable "admin_emails" {
  description = "List of email addresses allowed to access the admin panel"
  type        = list(string)
  default     = ["aiawsugcolombia@gmail.com"]
}

variable "dynamodb_read_capacity" {
  description = "DynamoDB provisioned read capacity units (low value acts as cost ceiling)"
  type        = number
  default     = 5
}


variable "dynamodb_write_capacity" {
  description = "DynamoDB provisioned write capacity units (low value acts as cost ceiling)"
  type        = number
  default     = 5
}

variable "budget_limit_usd" {
  description = "Monthly budget alert threshold in USD (0 to disable)"
  type        = number
  default     = 5
}

variable "budget_alert_email" {
  description = "Email to receive budget alerts"
  type        = string
  default     = "aiawsugcolombia@gmail.com"
}
