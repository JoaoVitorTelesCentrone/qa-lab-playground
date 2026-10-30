import { describe, expect, it } from "bun:test";
import { appiumSeleniumModules } from "./appium-selenium-course";
import { apiTestingBrunoModules, apiTestingPostmanModules } from "./api-testing-course";
import { bugReportCourseModules } from "./bug-report-course";
import { communicationAgileModules } from "./comunicacao-agil-course";
import { cypressCourseModules } from "./cypress-course";
import { generativeAIQAModules } from "./generative-ai-qa-course";
import { gherkinCourseModules } from "./gherkin-course";
import { k6CourseModules } from "./k6-course";
import { manualTestingCourses } from "./manual-testing-courses";
import { playwrightCourseModules } from "./playwright-course";
import { qaMindsetModules } from "./qa-mindset-course";
import { sqlQAModules } from "./sql-qa-course";
import { brotoSpaceSite } from "./mentorship/brotospace-track";

describe("contexto de prática das trilhas", () => {
  it("usa o BrotoSpace como ambiente externo canônico", () => {
    expect(brotoSpaceSite.url).toBe("https://www.brotospace.com/");
  });

  it("não reintroduz a QA Lab Shop ou rotas da loja nos conteúdos das trilhas", () => {
    const trailContent = JSON.stringify({
      appiumSeleniumModules,
      apiTestingBrunoModules,
      apiTestingPostmanModules,
      bugReportCourseModules,
      communicationAgileModules,
      cypressCourseModules,
      generativeAIQAModules,
      gherkinCourseModules,
      k6CourseModules,
      manualTestingCourses,
      playwrightCourseModules,
      qaMindsetModules,
      sqlQAModules,
    });

    expect(trailContent).not.toMatch(/QA Lab Shop|QA Shop|\/shop(?:\/|["'`])/i);
  });
});
