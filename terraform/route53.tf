resource "aws_route53_zone" "main" {
  name = var.zone_name

  tags = {
    Name = "${var.project_name}-zone"
  }
}

resource "aws_route53_record" "leaderboard" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "CNAME"
  ttl     = 300
  records = ["${var.github_branch}.${aws_amplify_app.leaderboard.id}.amplifyapp.com"]
}
