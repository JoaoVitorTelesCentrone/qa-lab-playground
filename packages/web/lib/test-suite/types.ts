export const testSuiteLanguages = ["typescript", "javascript", "python", "gherkin", "json", "yaml", "markdown", "text"] as const;
export const testSuiteFileTypes = ["spec", "fixture", "page_object", "helper", "config", "data", "other"] as const;

export type TestSuiteLanguage = (typeof testSuiteLanguages)[number];
export type TestSuiteFileType = (typeof testSuiteFileTypes)[number];
export type TestSuiteNodeType = "folder" | "file";

export type PersonalTestSuite = {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type TestSuiteNode = {
  id: string;
  suiteId: string;
  parentId: string | null;
  nodeType: TestSuiteNodeType;
  name: string;
  language: TestSuiteLanguage | null;
  fileType: TestSuiteFileType | null;
  content: string;
  position: number;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type TestSuiteTreeNode = TestSuiteNode & { children: TestSuiteTreeNode[] };
export type TestSuiteSnapshot = { suite: PersonalTestSuite; nodes: TestSuiteNode[] };

export type CreateTestSuiteNodeInput = {
  parentId: string | null;
  nodeType: TestSuiteNodeType;
  name: string;
  language?: TestSuiteLanguage;
  fileType?: TestSuiteFileType;
  content?: string;
};
