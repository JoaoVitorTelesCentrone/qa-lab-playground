export function isTestSuiteProductPath(pathname: string) {
  return pathname === "/test-suite"
    || pathname.startsWith("/test-suite/")
    || pathname === "/api/v1/test-suite"
    || pathname.startsWith("/api/v1/test-suite/");
}
