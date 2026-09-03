import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SurveyScreen } from "@/components/survey/SurveyScreen";
import { buildSurveyMetadata } from "@/lib/survey/page";

/** Survei need assessment, versi Inggris. Pasangannya `/id/survei`. */

export function generateStaticParams() {
  return [{ locale: "en" }];
}

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  return buildSurveyMetadata("en");
}

export default async function SurveyPage({ params }: PageParams) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <SurveyScreen locale="en" />;
}
