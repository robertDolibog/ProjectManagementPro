import MyHeader from "@/components/MyHeader";

export default function Home() {
  return (
    <>
      <MyHeader />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        This is the root page of the Project Management Pro app.
      </main>
    </>
  );
}
