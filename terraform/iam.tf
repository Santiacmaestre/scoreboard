resource "aws_iam_role" "amplify_ssr" {
  name = "${var.project_name}-amplify-ssr-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "amplify.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-amplify-ssr-role"
  }
}

resource "aws_iam_role_policy" "amplify_dynamodb" {
  name = "${var.project_name}-dynamodb-access"
  role = aws_iam_role.amplify_ssr.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:TransactWriteItems",
          "dynamodb:TransactGetItems",
        ]
        Resource = [
          aws_dynamodb_table.leaderboard.arn,
          "${aws_dynamodb_table.leaderboard.arn}/index/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "amplify_ssm" {
  name = "${var.project_name}-ssm-access"
  role = aws_iam_role.amplify_ssr.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath",
        ]
        Resource = "arn:aws:ssm:${var.aws_region}:*:parameter/${var.project_name}/${var.environment}/*"
      }
    ]
  })
}
