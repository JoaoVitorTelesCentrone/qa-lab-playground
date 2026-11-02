# QA Lab blog improvement plan

**Date:** 2026-11-02  
**Status:** Repository implementation complete; editorial and release gates remain open  
**Scope:** `/blog`, published article pages, their content model, and the path from reading to practice. Published copy remains in Brazilian Portuguese.

## Outcome

Make the blog a useful entry into QA Lab: a reader can find the right article, learn one applicable idea, and reach a relevant exercise or the free Broto Lab. The first release of this plan should improve the existing library before expanding it.

Success is observable when a new reader can find an article by subject, identify its series and next step, and complete the linked practice without help. Measure article discovery and practice clicks separately from the product's first-evidence metric; do not call a click a completed learning outcome.

## Implementation record · 2026-11-02

Completed in the repository:

- Replaced the one-grid index with a Portuguese topic and series index, beginner route, accent-insensitive search, and ordinary article links.
- Added article series position, a three-step artifact, previous/next navigation, relevance-ranked related links, and article structured data and social metadata.
- Made publication and modification dates optional; removed the unverified shared date from the 60 editorial posts and omit unsupported sitemap `lastModified` values.
- Added authenticated-only blog events for article views, series navigation, practice CTA clicks, and arrivals at `/labs` or `/trilhas`; extended the admin dashboard and documented the event contract.
- Added a 61-post audit register and revised the practical exercise in the first 12 articles to produce observable artifacts; their technical/editorial sign-off remains pending.

Still open before calling the full editorial plan complete: a subject-matter editor must approve the 61 articles and verify exercise destinations against the live product; the selected 12 need that review before revisions are approved; publication history must be sourced; Search Console and deployed robots/sitemap metadata need production access; representative responsive, keyboard, reduced-motion, and reader sessions need browser/user evidence. These checks cannot be truthfully marked complete from repository contents alone. See [the content audit](BLOG_CONTENT_AUDIT.md) and [the event contract](BLOG_ANALYTICS_CONTRACT.md).

## Current state and evidence

| Observation | Evidence | Implication |
| --- | --- | --- |
| 61 posts are published: 60 in 20 three-article series, plus one earlier article. All 60 series posts have empty `tags`, share `2026-10-28` as their date, and have no duplicate slugs. | `packages/web/lib/blog-posts.ts`, `packages/web/lib/blog-editorial/index.ts`; repository inventory run on 2026-11-02 | Series is the strongest existing navigation key. Check dates against actual publication history before displaying freshness or using sitemap `lastModified`. |
| 56 of 61 post bodies contain fewer than 300 words; the median is about 151 words. | Word count of `blocos` and list items in the published `posts` array on 2026-11-02 | Review each note against the reader's task. Expand only where an example, expected result, source, or limitation is missing; word count is not an acceptance target. |
| `/blog` renders all posts in one uniform card grid. Article pages show a title, summary, date, reading time, body, practice CTA, and collaboration CTA. | `packages/web/app/blog/page.tsx`, `packages/web/app/blog/[slug]/page.tsx` | Readers need entry paths by topic and series. Preserve the existing practice action while improving the reading path. |
| The editorial direction calls for a field-notebook index and an article artifact with three steps. CSS for those components exists but the current blog pages do not render them. | `packages/web/app/blog/EDITORIAL-DIRECTION.md`, `packages/web/app/globals.css` | Reuse or prune the existing design work after checking it in the browser; avoid creating a second visual system. |
| `getRelatedPosts` relies on tags and is not used on `/blog` article pages. Every series post has empty tags. | `packages/web/lib/blog-posts.ts`, `packages/web/app/blog/[slug]/page.tsx` | Add a series-first continuation rule and explicit related links. |
| Article pages have title, description, canonical URL, and basic Open Graph fields. The sitemap uses `post.data` as `lastModified`. No blog-specific event is emitted by the blog components. | `packages/web/app/blog/[slug]/page.tsx`, `packages/web/app/sitemap.ts`, `packages/web/components/blog/*` | Verify publication data, add useful article metadata, and establish a measurement baseline. |

**Unknowns to verify before ranking articles:** Search Console queries and indexing, blog traffic and referrers, actual publication dates, article-to-practice use, and the editor's capacity. Repository inspection cannot establish these.

## Execution sequence

### 1. Audit the library and set the editorial contract

1. Export one row for every published slug with title, series, section, actual publication date, last substantial revision, intended reader, reader question, practice destination, sources, and review status. Keep the registry in code as the source of truth; the audit sheet is a working view.
2. Review all 61 posts for accuracy, duplicate intent, dated claims, misleading examples, broken links, and whether the exercise gives a reader an observable result. Mark each **keep**, **revise**, **merge/redirect**, or **unpublish** with a reason. Use the current [editorial direction](../packages/web/app/blog/EDITORIAL-DIRECTION.md) as the content rubric: problem, concrete case, steps, and exercise.
3. Choose the first 12 revisions from the free Lab journey and the strongest beginner topics: QA do Zero, exploratory testing, bug reports, risk, regression, and the Broto case. Adjust the order with Search Console or reader evidence when available. Record the exact 12 slugs before editing.
4. For the remaining articles, assign one owner and a review order by series. Review all 20 series before calling the library audit complete.

**Done when:** every published slug has a recorded decision and next action; the 12 first revisions have owners; displayed dates can be traced to publication or substantial revision history. No date is changed merely to make an article appear recent. This follows [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### 2. Make the index navigable

1. Build the index from the existing `editorialSeries` sections: **Fundamentals and investigation**, **Tools and techniques**, **Collaboration and career**, and **Lab journeys**. Keep headings and article labels in Portuguese. Give each section an anchor and a short description of who should start there.
2. Add a clear first-reader route near the top: start with a beginner article, then the free Broto Lab. Feature one article by editorial choice rather than array position or a fabricated recency signal.
3. Within each series, show the three articles in learning order with series number, practical takeaway, and a link to its track. Show the one legacy article in an appropriate section after the audit assigns it a topic.
4. Test the resulting index with readers before adding search or filters. If readers still cannot locate an article from a known topic, add a lightweight search over title, summary, and assigned topics; keep the result URLs as ordinary crawlable links.

**Done when:** a reader can reach each of the 61 posts through a named topic or series, find a beginner starting point, and navigate the index at 320 px, desktop width, and by keyboard. The page remains useful without client-side search.

### 3. Improve the article reading and practice path

1. Use the existing `editorial.artifact` and `composition` data to render the three-step field note described in `EDITORIAL-DIRECTION.md`. Keep the article title, summary, and body readable before animation; support reduced motion. Use one consistent fallback layout for the legacy article.
2. Show series name and position in the article header. Add links to the previous and next article in that series, plus two related articles chosen by series and topic. Links must have meaningful labels; `getRelatedPosts` should be replaced or updated so empty tags cannot produce an empty continuation.
3. Keep one primary practice CTA per article. The CTA names the specific exercise and expected artifact: for beginner/Broto articles, link to the free Lab or Broto case; for specialist articles, link to the matching track. Verify every destination is available to the intended reader and explain sign-in only when required.
4. Improve code blocks and long lists where needed: language label, horizontal scrolling without page overflow, copy affordance only if useful, and visible focus. Add a contents list only to articles long enough to have multiple substantial sections.

**Done when:** each article identifies its place in a series, offers a useful next read, and has one working practice path. A keyboard or screen-reader user can reach content and CTA in reading order; mobile layout and reduced-motion mode preserve all content.

### 4. Upgrade content quality in batches

1. Revise the first 12 selected posts against a common review checklist: reader question in the opening, a concrete QA situation, a verifiable expected/observed distinction, an artifact or action the reader can produce, and a limitation or source where the claim needs one.
2. Verify technical claims against primary documentation or reproducible examples. Credit the actual author or QA Lab as an organization; do not invent personal credentials. Keep source links near the claims they support.
3. Keep concise notes concise when they answer the task. Merge articles with substantially duplicate intent and preserve existing inbound URLs with redirects. Record title and slug changes before touching routing.
4. Repeat the review series by series. Publish new posts only when a current learning gap, reader question, or product journey justifies them; each new post gets a series, practice destination, owner, and review date.

**Done when:** the first 12 posts pass editorial review and an unfamiliar reader can perform the stated exercise. The remaining 49 have review decisions and owners; revised batches pass the same check before publication.

### 5. Fix discoverability and measurement

1. Add explicit `publishedAt` and optional `updatedAt` to the post model using verified dates. Use the verified modified date in the sitemap; omit `lastModified` when it cannot be supported. Preserve canonical URLs and add consistent index metadata and social previews.
2. Add `BlogPosting` structured data to article pages with headline, description, canonical URL, real publication and modification dates, and the true author organization/person. Validate rendered output with Google's Rich Results Test. Structured data helps description and eligibility; it does not guarantee a search feature. See [Google's Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
3. Check published URLs in Search Console: indexing, queries, impressions, clicks, and pages with unexpected canonical selection. Capture a baseline before changing titles or metadata. Check the public robots and sitemap output on the deployed domain.
4. Define privacy-aware events for article view, series navigation, practice CTA click, and successful arrival at the practice destination. Use slug and series IDs, not article text or personal data. Compare these with existing Lab-start and first-evidence events; keep anonymous reading and authenticated learning metrics distinct because the current metrics contract has no reliable anonymous-to-account identity bridge.

**Done when:** metadata and structured data match the visible article, sitemap dates are truthful, all 61 intended URLs have an indexability decision, and a dashboard can show reading-to-practice activity without claiming unsupported user-level conversion. Use [the product metrics contract](METRICAS_PRODUTO_CONTRATO.md) for identity and deduplication rules.

### 6. Verify and release

1. Add small data checks for unique slugs, valid publication state, valid series and practice destinations, and truthful metadata fields. Test real behavior, such as reaching an article from its section and reaching its practice destination, rather than mirroring array construction.
2. Review the index, a legacy article, a short series article, and a longer revised article at mobile and desktop widths; test keyboard, zoom, reduced motion, links, code overflow, and focus. Run accessibility checks and manual reading checks on those representative templates.
3. Run the repository's lint, unit tests, build, and public smoke suite on the same commit. The existing unrelated CI failures must be resolved before this release gate can pass. Check the deployed URLs, canonical tags, sitemap, and event capture after release.
4. Observe at least five target readers doing two tasks: find a topic from the index and continue from an article to practice. Record where they hesitate, revise the highest-impact issues, and repeat the affected tasks. Review Search Console and reading-to-practice data after two weeks, then choose the next content batch.

**Done when:** the release checks pass, no critical navigation or accessibility issue remains, the deployed pages match the audited registry, and observed readers can complete both tasks. Record the result and residual issues in a short release note.

## Suggested delivery slices

| Slice | Ship together | Gate |
| --- | --- | --- |
| A — clarity | Audit and dates; grouped index; first-reader route; working series continuation | All 61 posts discoverable by subject and metadata dates verified |
| B — useful reading | Article artifact and reading layout; specific practice CTA; first 12 content revisions | Readers can understand and complete the stated exercise |
| C — trustworthy distribution | Structured data, social previews, sitemap, Search Console baseline, events | Deployed metadata and measurement validated |
| D — ongoing editorial cycle | Remaining series reviews, observed-user fixes, next content decisions | Every published post has an owner and review decision |

## Decisions to record before implementation

- **Editorial owner:** who approves technical accuracy and published wording for each series.
- **Canonical practice route:** which free Broto Lab or track each article should lead to; verify access rules first.
- **Publication history:** source for the actual dates of the 60 series posts.
- **Measurement stack:** where anonymous blog events are stored and how consent is handled; keep the product metrics contract as the authority for authenticated outcomes.
- **Priority evidence:** Search Console and usage data, if available, to reorder the first 12 posts without changing the release gates.
