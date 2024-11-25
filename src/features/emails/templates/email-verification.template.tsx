import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  render,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type EmailVerificationTemplateProps = Readonly<{
  name: string;
  email: string;
  initialPassword: string;
  verificationUrl: string;
}>;

export default function EmailVerificationTemplate({
  name,
  email,
  initialPassword,
  verificationUrl,
}: EmailVerificationTemplateProps) {
  return (
    <Html lang="en">
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
        />
      </Head>
      <Tailwind>
        <Body className="bg-[#fafafa] font-[Montserrat,Arial,sans-serif]">
          <Container className="mx-auto my-[40px] w-[580px] rounded-lg bg-white p-8 shadow-sm">
            <Section>
              <Text className="m-0 text-center text-4xl font-bold tracking-tight text-[#020817]">
                Welcome
              </Text>
              <Text className="m-0 text-center text-xl font-medium tracking-tight text-[#020817]">
                to
              </Text>
              <Text className="m-0 text-center font-['Playfair_Display',Georgia,serif] text-3xl font-bold tracking-tight text-[#020817]">
                Naturist Vacation Club
              </Text>
            </Section>

            <Section>
              <Text className="text-base text-[#020817]">Hello {name},</Text>
              <Text className="text-base text-[#020817]">
                Your account has been created by our team. Here are your login
                credentials:
              </Text>

              <Section className="my-4 rounded-md bg-[#f8fafc] p-4">
                <Text className="m-0 text-sm text-[#020817]">
                  <strong>Email:</strong> {email}
                </Text>
                <Text className="m-0 mt-2 text-sm text-[#020817]">
                  <strong>Initial Password:</strong> {initialPassword}
                </Text>
              </Section>

              <Text className="text-base text-[#020817]">
                Please verify your email address by clicking the button below:
              </Text>

              <Section className="my-8 text-center">
                <Button
                  href={verificationUrl}
                  className="inline-flex items-center justify-center rounded-md bg-[#020817] px-8 py-2.5 text-base font-medium text-white no-underline transition-colors hover:bg-[#020817]/90"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-sm text-[#64748b]">
                For security reasons, we recommend changing your password after
                your first login.
              </Text>
            </Section>

            <Hr className="my-6 border-[#e2e8f0]" />

            <Section>
              <Text className="m-0 text-center text-sm text-[#64748b]">
                &copy; {new Date().getFullYear()} Naturist Vacation Club. All
                rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function renderEmailVerificationTemplate(
  props: EmailVerificationTemplateProps,
) {
  return await render(<EmailVerificationTemplate {...props} />);
}
