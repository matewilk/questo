data "aws_alb" "questo-alb" {
  name = "questo-alb-${var.env}"
}

data "aws_route53_zone" "questo" {
  name         = "questo.live"
  private_zone = false
}

module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "3.2.1"

  create_certificate = true

  domain_name               = "questo.live"
  subject_alternative_names = [data.aws_alb.questo-alb.dns_name, "${var.env}.questo.live"]
  validation_method         = "DNS"

  zone_id = data.aws_route53_zone.questo.zone_id

  tags = {
    Environment = var.env
  }
}



resource "aws_route53_record" "questo" {
  for_each = {
    for dvo in module.acm.acm_certificate_domain_validation_options : dvo.domain_name => {
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
  certificate_arn         = module.acm.acm_certificate_arn
  validation_record_fqdns = [for record in aws_route53_record.questo : record.fqdn]
}
