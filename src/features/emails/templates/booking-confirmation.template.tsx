import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  render,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type BookingConfirmationTemplateProps = Readonly<{
  guestName: string;
  bookingNumber: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}>;

export default function BookingConfirmationTemplate({
  guestName,
  bookingNumber,
  roomName,
  checkIn,
  checkOut,
  totalAmount,
}: BookingConfirmationTemplateProps) {
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
          <Container className="mx-auto my-8 w-full max-w-lg rounded-lg bg-white p-6 shadow-sm">
            <Section className="space-y-4">
              <Text className="m-0 text-center font-['Playfair_Display',Georgia,serif] text-3xl font-bold tracking-tight text-[#020817]">
                Booking Confirmation
              </Text>
              <Text className="text-center text-base text-gray-600">
                Thank you for your booking, {guestName}
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Text className="mb-4 text-lg font-semibold text-[#020817]">
              Booking Details
            </Text>

            <Section className="my-4 rounded-md bg-[#f8fafc] p-4 text-[#020817]">
              <Text className="m-0">
                <span className="mr-2 font-medium">Booking:</span>#
                {bookingNumber}
              </Text>
              <Text className="m-0">
                <span className="mr-2 font-medium">Room:</span>
                {roomName}
              </Text>
              <Text className="m-0">
                <span className="mr-2 font-medium">Check-in:</span>
                {checkIn}
              </Text>
              <Text className="m-0">
                <span className="mr-2 font-medium">Check-out:</span>
                {checkOut}
              </Text>
              <Text className="m-0">
                <span className="mr-2 font-medium">Total Amount:</span>฿
                {(totalAmount / 100).toLocaleString()}
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Section>
              <Text className="m-0 text-center text-sm text-gray-500">
                If you have any questions about your booking, please don&apos;t
                hesitate to contact us.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export function renderBookingConfirmationTemplate(
  props: BookingConfirmationTemplateProps,
) {
  return render(<BookingConfirmationTemplate {...props} />);
}
