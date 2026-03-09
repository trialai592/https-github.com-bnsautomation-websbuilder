import BusinessIntakeForm from "@/components/forms/business-intake-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <main className="w-full max-w-4xl">
        <BusinessIntakeForm />
      </main>
    </div>
  );
}
