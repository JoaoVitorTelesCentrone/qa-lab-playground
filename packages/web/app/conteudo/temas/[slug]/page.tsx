import ThemePage, {
  generateMetadata as getThemeMetadata,
  generateStaticParams as getThemeParams,
} from "@/app/mentoria/conteudo/temas/[slug]/page";

export const dynamic = "force-dynamic";
export const generateMetadata = getThemeMetadata;
export const generateStaticParams = getThemeParams;
export default ThemePage;
