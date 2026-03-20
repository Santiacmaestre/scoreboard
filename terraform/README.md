<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.5.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | 5.100.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_amplify_app.leaderboard](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/amplify_app) | resource |
| [aws_amplify_branch.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/amplify_branch) | resource |
| [aws_amplify_domain_association.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/amplify_domain_association) | resource |
| [aws_budgets_budget.monthly](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/budgets_budget) | resource |
| [aws_cognito_identity_provider.google](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_identity_provider) | resource |
| [aws_cognito_user_pool.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool) | resource |
| [aws_cognito_user_pool_client.app](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_client) | resource |
| [aws_cognito_user_pool_domain.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool_domain) | resource |
| [aws_dynamodb_table.leaderboard](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table) | resource |
| [aws_iam_role.amplify_ssr](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.amplify_dynamodb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_iam_role_policy.amplify_ssm](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_route53_zone.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone) | resource |
| [aws_ssm_parameter.cognito_client_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_ssm_parameter.google_client_id](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_ssm_parameter.google_client_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |
| [aws_ssm_parameter.nextauth_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ssm_parameter) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_admin_emails"></a> [admin\_emails](#input\_admin\_emails) | List of email addresses allowed to access the admin panel | `list(string)` | <pre>[<br/>  "aiawsugcolombia@gmail.com"<br/>]</pre> | no |
| <a name="input_aws_region"></a> [aws\_region](#input\_aws\_region) | AWS region for all resources | `string` | `"us-west-2"` | no |
| <a name="input_budget_alert_email"></a> [budget\_alert\_email](#input\_budget\_alert\_email) | Email to receive budget alerts | `string` | `"aiawsugcolombia@gmail.com"` | no |
| <a name="input_budget_limit_usd"></a> [budget\_limit\_usd](#input\_budget\_limit\_usd) | Monthly budget alert threshold in USD (0 to disable) | `number` | `5` | no |
| <a name="input_domain_name"></a> [domain\_name](#input\_domain\_name) | Custom domain for the app (e.g., leaderboard.aiawsug.com) | `string` | `"leaderboard.aiawsug.com"` | no |
| <a name="input_dynamodb_read_capacity"></a> [dynamodb\_read\_capacity](#input\_dynamodb\_read\_capacity) | DynamoDB provisioned read capacity units (low value acts as cost ceiling) | `number` | `5` | no |
| <a name="input_dynamodb_write_capacity"></a> [dynamodb\_write\_capacity](#input\_dynamodb\_write\_capacity) | DynamoDB provisioned write capacity units (low value acts as cost ceiling) | `number` | `5` | no |
| <a name="input_environment"></a> [environment](#input\_environment) | Environment name (dev, staging, prod) | `string` | `"dev"` | no |
| <a name="input_github_access_token"></a> [github\_access\_token](#input\_github\_access\_token) | GitHub personal access token for Amplify | `string` | n/a | yes |
| <a name="input_github_branch"></a> [github\_branch](#input\_github\_branch) | Git branch to deploy | `string` | `"main"` | no |
| <a name="input_github_repository"></a> [github\_repository](#input\_github\_repository) | GitHub repository URL (https://github.com/user/repo) | `string` | `"https://github.com/Santiacmaestre/scoreboard.git"` | no |
| <a name="input_google_client_id"></a> [google\_client\_id](#input\_google\_client\_id) | Google OAuth Client ID for Cognito | `string` | n/a | yes |
| <a name="input_google_client_secret"></a> [google\_client\_secret](#input\_google\_client\_secret) | Google OAuth Client Secret for Cognito | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Project name used as prefix for resources | `string` | `"leaderboard"` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_amplify_app_id"></a> [amplify\_app\_id](#output\_amplify\_app\_id) | Amplify App ID |
| <a name="output_amplify_custom_domain"></a> [amplify\_custom\_domain](#output\_amplify\_custom\_domain) | Custom domain configured |
| <a name="output_amplify_default_domain"></a> [amplify\_default\_domain](#output\_amplify\_default\_domain) | Amplify default domain |
| <a name="output_cognito_client_id"></a> [cognito\_client\_id](#output\_cognito\_client\_id) | Cognito App Client ID |
| <a name="output_cognito_domain"></a> [cognito\_domain](#output\_cognito\_domain) | Cognito Hosted UI domain |
| <a name="output_cognito_user_pool_id"></a> [cognito\_user\_pool\_id](#output\_cognito\_user\_pool\_id) | Cognito User Pool ID |
| <a name="output_dynamodb_table_arn"></a> [dynamodb\_table\_arn](#output\_dynamodb\_table\_arn) | DynamoDB table ARN |
| <a name="output_dynamodb_table_name"></a> [dynamodb\_table\_name](#output\_dynamodb\_table\_name) | DynamoDB table name |
| <a name="output_route53_nameservers"></a> [route53\_nameservers](#output\_route53\_nameservers) | Route 53 nameservers |
| <a name="output_route53_zone_id"></a> [route53\_zone\_id](#output\_route53\_zone\_id) | Route 53 Zone ID |
<!-- END_TF_DOCS -->