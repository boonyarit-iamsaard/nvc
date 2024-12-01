export default async function Page() {
  return (
    <div className="container space-y-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payment Success</h1>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Your payment has been processed.</h2>
      </div>
    </div>
  );
}
