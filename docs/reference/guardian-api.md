# Guardian Open Platform API

**Base URL:** `https://content.guardianapis.com`
**Auth:** API key as `api-key` query parameter on every request
**Env var:** `GUARDIAN_API_KEY`
**Docs:** [open-platform.theguardian.com](https://open-platform.theguardian.com/documentation/)

The Guardian is the only SPUR founding member with a public content API. This makes it the natural first integration for the SPUR telemetry endpoint - real content, real URLs, real metadata.

---

## Endpoints

| Endpoint | Path | Returns |
|----------|------|---------|
| Content | `/search` | All content (articles, liveblogs, galleries, etc.) |
| Tags | `/tags` | 50,000+ manual content tags |
| Sections | `/sections` | Logical content groupings (technology, politics, etc.) |
| Editions | `/editions` | Regionalised front pages (UK, US, Australia, Europe) |
| Single item | `/{path}` | Full data for one content item, tag, or section |

## Content search

```
GET /search?q=artificial+intelligence&from-date=2026-01-01&api-key={key}
```

**Key parameters:**

| Param | Description |
|-------|-------------|
| `q` | Free text query. Supports `AND`, `OR`, `NOT`, phrase search (`"exact phrase"`) |
| `tag` | Filter by tag (e.g. `technology/artificialintelligenceai`) |
| `section` | Filter by section (e.g. `technology`) |
| `from-date` | ISO date (e.g. `2026-01-01`) |
| `to-date` | ISO date |
| `page` | Page number (results paginated, default 10 per page) |
| `page-size` | Results per page (max 50) |
| `order-by` | `newest`, `oldest`, `relevance` |
| `show-fields` | Comma-separated: `body`, `byline`, `headline`, `standfirst`, `thumbnail`, `wordcount`, etc. |
| `show-tags` | Comma-separated: `keyword`, `contributor`, `series`, `tone`, `type`, `blog` |

**Query operators:**
- `debate AND economy` - both terms required
- `debate AND NOT immigration` - exclusion
- `debate AND (economy OR education)` - grouping
- `"mitochondrial donation"` - exact phrase
- `OR` is default operator between terms

**Filter operators (for tag, section, etc.):**
- `,` = AND
- `|` = OR
- `-` = NOT
- `()` for grouping

## Response shape (content)

```json
{
  "response": {
    "status": "ok",
    "total": 12345,
    "startIndex": 1,
    "pageSize": 10,
    "currentPage": 1,
    "pages": 1235,
    "results": [
      {
        "id": "technology/2026/mar/01/article-slug",
        "type": "article",
        "sectionId": "technology",
        "sectionName": "Technology",
        "webPublicationDate": "2026-03-01T14:00:00Z",
        "webTitle": "Article headline",
        "webUrl": "https://www.theguardian.com/technology/2026/mar/01/article-slug",
        "apiUrl": "https://content.guardianapis.com/technology/2026/mar/01/article-slug",
        "fields": {},
        "tags": []
      }
    ]
  }
}
```

## Tag types

| Type | Description | Example |
|------|-------------|---------|
| `keyword` | Topic tag | `environment/recycling` |
| `series` | Regular feature | `technology/series/pushing-buttons` |
| `contributor` | Author | `profile/caraborrell` |
| `tone` | Intent | `tone/features`, `tone/obituaries` |
| `type` | Media type | `type/article`, `type/video` |
| `blog` | Blog name | Deprecated, largely unused |

## Rate limits

- Default key: rate-limited (contact Guardian for elevated limits)
- Pagination: default 10 results, max 50 per page
- HTTPS: `https://content.guardianapis.com/`

## Rust client: aletheia

[`aletheia`](https://crates.io/crates/aletheia) - Guardian content API client (async + blocking).

```toml
[dependencies]
aletheia = "1.1.0"
tokio = { version = "1", features = ["full"] }
```

```rust
use aletheia::GuardianContentClient;
use aletheia::enums::*;

let client = GuardianContentClient::new("YOUR_API_KEY");
let response = client
    .build_request()
    .search("artificial intelligence")
    .date_from(2026, 1, 1)
    .page_size(10)
    .show_fields(vec![Field::Byline, Field::Body, Field::Headline])
    .order_by(OrderBy::Newest)
    .send()
    .await?;
```

## Python client

[`theguardian-api-python`](https://github.com/prabhath6/theguardian-api-python) (community, not officially supported).

For SPUR's FastAPI endpoint, direct `httpx` calls are likely simpler:

```python
import httpx

async def search_guardian(query: str, from_date: str | None = None) -> dict:
    params = {"q": query, "api-key": GUARDIAN_API_KEY, "show-fields": "byline,headline,body"}
    if from_date:
        params["from-date"] = from_date
    async with httpx.AsyncClient() as client:
        resp = await client.get("https://content.guardianapis.com/search", params=params)
        return resp.json()["response"]
```

## Relevance to SPUR

The Guardian API gives us:

1. **Real content URLs** - `webUrl` fields map directly to the `content_url` in telemetry events
2. **Structured metadata** - tags, sections, publication dates for enriching telemetry data
3. **A testable integration** - Guardian content retrieved via API, then tracked as `content_retrieved` events through the SPUR endpoint
4. **Proof of concept** - "Here's what telemetry looks like when an AI platform retrieves and cites Guardian journalism"
