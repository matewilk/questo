data "aws_alb" "questo-alb" {
  name = "questo-alb-${var.env}"
}

data "aws_route53_zone" "questo" {
  name         = "questo.live"
  private_zone = false
}

resource "aws_acm_certificate" "cert" {
  domain_name               = "questo.live"
  subject_alternative_names = ["${var.env}.questo.live"]
  validation_method         = "DNS"

  tags = {
    Environment = var.env
  }

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_route53_record" "questo" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.questo.zone_id
}

resource "aws_route53_record" "alb-routing" {
  name    = "${var.env}.questo.live"
  records = ["dualstack.${data.aws_alb.questo-alb.dns_name}"]
  ttl     = 300
  type    = "A"
  zone_id = data.aws_route53_zone.questo.zone_id
}

resource "aws_acm_certificate_validation" "questo" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.questo : record.fqdn]
}
