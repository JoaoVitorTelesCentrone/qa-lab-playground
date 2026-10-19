import ContentStepPage, {
  generateMetadata as getStepMetadata,
  generateStaticParams as getStepParams,
} from "@/app/mentoria/conteudo/[week]/[step]/page";

export const dynamic = "force-dynamic";
export const generateMetadata = getStepMetadata;
export const generateStaticParams = getStepParams;
export default ContentStepPage;
