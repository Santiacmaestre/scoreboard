data "aws_route53_zone" "main" {
  zone_id = var.route53_zone_id
}

# ACM certificate validation for Amplify custom domain
resource "aws_route53_record" "amplify_cert_validation" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "_771a567fa6b3b1b653582415b344c482.aiawsug.com"
  type    = "CNAME"
  ttl     = 300
  records = ["_7c9b3d5b006fca930f69a90dc1c9c7df.jkddzztszm.acm-validations.aws."]
}

# Leaderboard subdomain → Amplify CloudFront distribution
resource "aws_route53_record" "leaderboard" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "CNAME"
  ttl     = 300
  records = ["dnd9ru9eocg6j.cloudfront.net"]
}
