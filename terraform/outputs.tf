output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.leaderboard.name
}

output "dynamodb_table_arn" {
  description = "DynamoDB table ARN"
  value       = aws_dynamodb_table.leaderboard.arn
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = aws_cognito_user_pool_client.app.id
}

output "cognito_domain" {
  description = "Cognito Hosted UI domain"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "amplify_app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.leaderboard.id
}

output "amplify_default_domain" {
  description = "Amplify default domain"
  value       = aws_amplify_app.leaderboard.default_domain
}

output "amplify_custom_domain" {
  description = "Custom domain configured"
  value       = var.domain_name
}

output "route53_zone_name" {
  description = "Route 53 Zone domain"
  value       = var.zone_name
}

output "route53_zone_id" {
  description = "Route 53 Zone ID"
  value       = data.aws_route53_zone.main.zone_id
}

output "route53_nameservers" {
  description = "Route 53 nameservers"
  value       = data.aws_route53_zone.main.name_servers
}


