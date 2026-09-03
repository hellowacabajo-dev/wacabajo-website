import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SurveyScreen } from "@/components/survey/SurveyScreen";
import { buildSurveyMetadata } from "@/lib/survey/page";

/**
 * Survei need assessment, versi Indonesia. Pasangannya `/en/survey` — slug-nya
 * ikut bahasa locale (lihat `src/lib/i18n/routes.ts`), jadi `/en/survei` tidak
 * ada dan jatuh ke 404.
 */

export function generateStaticParams() {
  return [{ locale: "id" }];
}

type PageParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "id") return {};
  return buildSurveyMetadata("id");
}

export default async function SurveiPage({ params }: PageParams) {
  const { locale } = await params;
  if (locale !== "id") notFound();
  return <SurveyScreen locale="id" />;
}
