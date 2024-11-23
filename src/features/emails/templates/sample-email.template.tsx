import { Html, render, Tailwind } from '@react-email/components';

export default function SampleEmailTemplate() {
  return (
    <Html lang="en">
      <Tailwind>
        <h1 className="text-center font-sans font-bold">
          Welcome to Naturist Vacation Club
        </h1>
      </Tailwind>
    </Html>
  );
}

export async function renderSampleEmailTemplate() {
  return await render(<SampleEmailTemplate />);
}
