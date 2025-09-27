import QuizClient from "@/components/QuizClient";

export default function Page({ params }: { params: { year: string; block: string } }) {
  const year = Number(params.year);
  const block = Number(params.block);
  return <QuizClient year={year} block={block} />;
}
