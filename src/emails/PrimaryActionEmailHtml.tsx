import {
  Body,
  Button,
  Container,
  Head,
  Html,
  render,
  Section,
  Text,
} from '@react-email/components';

import React = require('react');

interface EmailTemplateProps {
  headline: string;
  content: string;
  cta?: {
    buttonLabel: string;
    url: string;
  };
}

const EmailTemplate = (props: EmailTemplateProps) => {
  const { headline, content, cta } = props;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={headlineStyle}>{headline}</Text>
          <Container>
            <Text
              style={contentStyle}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Container>
          <Section style={btnContainer}>
            <Button style={button} href={cta?.url}>
              {cta?.buttonLabel}
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const PrimaryActionEmailHtml = (props: EmailTemplateProps) =>
  render(<EmailTemplate {...props} />, { pretty: true });

// Styles (you can customize these styles)
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const headlineStyle = {
  fontSize: '24px',
  margin: '0 0 30px',
};

const contentStyle = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  padding: '12px 12px',
  backgroundColor: '#2563eb',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};
