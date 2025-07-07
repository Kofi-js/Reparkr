
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  username: string;
  plate: string;
}

export const EmailTemplate = ({ username, plate }: EmailTemplateProps) => {
  const previewText = `🚗 Repark Request for ${plate} - Someone needs to exit`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            {/* Logo Section */}
            <Section className="mt-[32px]">
              <div className="mx-auto my-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Text className="text-white text-xl font-bold m-0">🚗</Text>
                </div>
                <Text className="text-[20px] font-bold text-black m-0">
                  ReParkr
                </Text>
              </div>
            </Section>

            {/* Main Heading */}
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Someone needs to <strong>exit</strong> the parking area
            </Heading>

            {/* Greeting */}
            <Text className="text-[14px] text-black leading-[24px]">
              Hello {username},
            </Text>

            {/* Main Message */}
            <Text className="text-[14px] text-black leading-[24px]">
              Another driver is trying to leave and your car is blocking their
              way. Could you please move your vehicle <strong>{plate}</strong>{" "}
              as soon as possible?
            </Text>

            {/* Car Visual Section */}
            <Section className="my-[32px]">
              <Row>
                <Column align="center">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                    <Text className="text-[12px] text-blue-600 font-medium m-0 mb-1">
                      Your Vehicle
                    </Text>
                    <Text className="text-[18px] font-bold text-blue-900 m-0 font-mono">
                      {plate}
                    </Text>
                    <Text className="text-[24px] m-0 mt-2">🚘</Text>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Delegate Link */}
            <Text className="text-[14px] text-black leading-[24px]">
              Can't move right now?{" "}
              <Link
                href="https://reparkra.app/delegate"
                className="text-blue-600 no-underline"
              >
                Set up a delegate driver
              </Link>{" "}
              for future situations like this.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

            {/* Footer */}
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This repark request was sent via ReParkr's secure blockchain
              network. Your contact information is encrypted and never shared
              with other users.
            </Text>

            <Text className="text-[#666666] text-[12px] leading-[24px] mt-[12px]">
              Need help? Visit our{" "}
              <Link href="#" className="text-blue-600 no-underline">
                Help Center
              </Link>{" "}
              or{" "}
              <Link
                href="https://reparkra.app/settings"
                className="text-blue-600 no-underline"
              >
                manage your email preferences
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailTemplate.PreviewProps = {
  username: "John Doe",
  plate: "ABC-123",
} as EmailTemplateProps;

export default EmailTemplate;
