resource "aws_acm_certificate" "cert" {
  domain_name               = "questo.live"
  subject_alternative_names = [kubernetes_ingress.questo-server-ingress.status.0.load_balancer.0.ingress.0.hostname]
  validation_method         = "DNS"

  tags = {
    Environment = var.env
  }

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "questo" {
  name         = "questo.live"
  private_zone = false
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

resource "aws_acm_certificate_validation" "questo" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.questo : record.fqdn]
}
