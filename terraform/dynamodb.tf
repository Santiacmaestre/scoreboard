resource "aws_dynamodb_table" "leaderboard" {
  name         = "${var.project_name}-${var.environment}"
  billing_mode = "PROVISIONED"
  hash_key     = "PK"
  range_key    = "SK"

  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "N"
  }

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"

    read_capacity  = var.dynamodb_read_capacity
    write_capacity = var.dynamodb_write_capacity
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-table"
  }
}
