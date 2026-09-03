import { SurveyForm } from "@/components/survey/SurveyForm";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/config";

/**
 * Bingkai halaman survei. Isi dan seluruh interaksinya ada di `SurveyForm`
 * (klien); yang di sini cuma latar dan ritme halamannya, supaya kedua route
 * locale memakai tata letak yang sama persis.
 */
export function SurveyScreen({ locale }: { locale: Locale }) {
  return (
    <div className="gradient-cream-veil min-h-[70dvh]">
      <Container className="py-10 md:py-24">
        <SurveyForm locale={locale} />
      </Container>
    </div>
  );
}
