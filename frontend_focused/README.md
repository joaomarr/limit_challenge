# Submission Tracker

A workspace for operations managers to triage broker submissions: filter the incoming
queue, scan the latest activity on each one, and open the full record.

The list is built for triage. Status sits in one-click tabs, high priority stands out, and
each row shows the latest note so most decisions don't need a click. Every filter lives in
the URL, so any view can be shared or bookmarked and survives a refresh.

## Run it

```bash
# Backend (http://localhost:8000)
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_submissions
python manage.py runserver

# Frontend (http://localhost:3000)
cd frontend
npm install
npm run dev
```

Tests: `python manage.py test submissions` (backend) and `npm test` (frontend).

## Key decisions

**Frontend**

- **The URL is the only source of truth for filters.** Filters are parsed and validated
  from the URL and never mirrored into component state, so there's nothing to keep in
  sync. Updates use `history.replaceState`: Next keeps `useSearchParams` in sync, no
  server round trip is made, and the history isn't flooded with one entry per click.
  Default values stay out of the URL so each view has a single link.
- **No global store.** Server state lives in React Query (a query key factory,
  `keepPreviousData` so changing a filter doesn't flash skeletons). Filters live in the
  URL. Nothing else needs to be shared, so Redux would only add code.
- **Navigation feels instant.** Hovering a row prefetches its detail, and the detail
  `loading.tsx` renders the header straight from the list cache. From the list, the real
  header appears in about 10ms, and only contacts, documents and notes wait for the API.
- **Stable layout.** An app-shell layout where only the table scrolls, fixed column
  widths and skeletons that mirror the table keep layout shift at about 0 (CLS measured
  in Chrome) across filters, pages and loading states.
- **Search is debounced, and clearing cancels it in the click handler.** Cancelling from
  an effect raced with Next's deferred URL update, so a search typed just before
  "Clear filters" could land afterwards. A test reproduces that race.

**Backend**

- **List and detail are shaped differently.** The list returns counts and a latest-note
  preview in 3 queries per page (`select_related` + one `prefetch_related`), and the
  detail prefetches contacts, documents and notes. A test pins the query count.
- **Counts use `distinct=True`.** Two `Count`s over joined tables multiply each other (a
  submission with 4 documents and 5 notes reported 20 and 20).
- **Ordering is explicit, with an id tiebreaker.** `Meta.ordering` is dropped on
  `GROUP BY` queries, which made pagination unstable.
- **The API contract is camelCase both ways.** The camel-case renderer converts response
  keys, and its middleware converts query params (`?brokerId=`), so the Python stays
  snake_case. Invalid filter values return 400 instead of an empty list.
- **`hasDocuments` and `hasNotes` use `EXISTS`** rather than a join, so they can't
  inflate the counts.

## Found along the way

- The seed's document dates were ignored: `auto_now_add` overwrites explicit values, so
  every document shared one timestamp. It now uses `default=timezone.now`, like the
  other models.
- `requirements.txt` listed packages the project never imports (pynvim, pikepdf, lxml…).
  It's trimmed to direct dependencies and verified in a fresh venv.

## Tests

- **Backend (17):** counts, latest note, every filter, ordering, page size, query count.
- **Frontend (16):** URL parsing and updates, the debounce hook, and the workspace
  rendered end to end with only the API client and router faked.

Each bug fixed during development was reintroduced to confirm a test catches it.

## Beyond the brief

Filters for priority, date range (`createdFrom`/`createdTo`), `hasDocuments` and
`hasNotes`; a page-size option (10/20/50, capped at 100 server-side); detail prefetch on
hover; a "back" link that returns to the filtered list; and a distinct
"page doesn't exist" state for stale links.

## What I'd do next

- Add the date and has-documents/has-notes filters to the UI (the API already supports
  them).
- Sort by priority and age, so "new and high priority" is the default view.
- Return `pageSize` and `totalPages` from the API so the client doesn't duplicate the
  page size.
- At scale: compute the latest note with a `Subquery` instead of prefetching every note,
  and run E2E tests (Playwright) against a production build.

---

# Original challenge brief

This repository hosts the boilerplate for the Submission Tracker assignment. It includes a Django +
Django REST Framework backend and a Next.js frontend scaffold so candidates can focus on API
design, relational data modelling, and product-focused UI work.

## Challenge Overview

Operations managers need a workspace to review broker-submitted opportunities. Build a lightweight
tool that lets them browse incoming submissions, filter by business context, and inspect full
details per record. Deliver a polished frontend experience backed by clean APIs.

### Goals

- **Backend:** Model the domain, expose list and detail endpoints, and support realistic filtering.
- **Frontend (higher weight):** Craft an intuitive list and detail experience with filters that map
  to query parameters. Focus on UX clarity, organization, and maintainability.

## Data Model

Required entities (already defined in `submissions/models.py`):

- `Broker`: name, contact email
- `Company`: legal name, industry, headquarters city
- `TeamMember`: internal owner for a submission
- `Submission`: links to company, broker, owner with status, priority, and summary
- `Contact`: primary contacts for a submission
- `Document`: references to supporting files
- `Note`: threaded context for collaboration

Seed data (~25 submissions with dozens of related contacts, documents, and notes) is available via
`python manage.py seed_submissions`. Re-run with `--force` to rebuild the dataset.

## API Requirements

- `GET /api/submissions/`
  - Returns paginated submissions with company, broker, owner, counts of related documents/notes,
    and the latest note preview.
  - Supports filters via query params. `status` is wired up; extend filters for `brokerId` and
    `companySearch` (plus optional extras like `createdFrom`, `createdTo`, `hasDocuments`, `hasNotes`).
- `GET /api/submissions/<id>/`
  - Returns the full submission plus related contacts, documents, and notes.
- `GET /api/brokers/`
  - Returns brokers for the frontend dropdown.

## Frontend Workspace Overview

The Next.js 16 + React 19 app in `frontend/` is pre-wired for this challenge. Material UI handles
layout, axios powers HTTP requests, and `@tanstack/react-query` is ready for data fetching. The list
and detail routes under `/submissions` are scaffolded so you can focus on API consumption and UX
polish.

### What is pre-built?

- Global providers supply Material UI theming and a shared React Query client.
- `/submissions` hosts the list view with filter inputs and hints about required query params.
- `/submissions/[id]` hosts the detail shell and links back to the list.
- Custom hooks in `lib/hooks` define how to fetch submissions and brokers. Each hook is disabled by
  default (`enabled: false`) so no network requests fire until you enable them.

### What you need to implement

- Wire the filter state to query parameters and React Query `queryFn`s.
- Render table/card layouts for the submission list along with loading, empty, and error states.
- Build the detail page sections for summary data, contacts, documents, and notes.
- Enable the queries and handle pagination or other UX you want to highlight.

## Project Structure

- `backend/`: Django project with REST API, seed command, and submission models.
- `frontend/`: Next.js app described above.

## Environment Variables

- Frontend requests default to `http://localhost:8000/api`. Override this by creating
  `frontend/.env.local` and setting `NEXT_PUBLIC_API_BASE_URL`.

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_submissions  # optional but recommended
# add --force to rebuild the generated sample data
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # create if you want a custom API base
# NEXT_PUBLIC_API_BASE_URL defaults to http://localhost:8000/api
npm run dev
```

Visit `http://localhost:3000/submissions` to start building.

## Development Workflow

1. Start the Django server on port 8000 (`python manage.py runserver`).
2. Start the Next.js dev server on port 3000 (`npm run dev`).
3. Iterate on backend filters, serializers, and viewsets, then refresh the frontend to see updated
   data.
4. When ready, add README notes summarizing your approach, tradeoffs, and any stretch goals.

## Submission Instructions

- Provide a short README update summarizing approach, tradeoffs, and how to run the solution.
- Record and share a brief screen capture (max 2 minutes) demonstrating the frontend working end-to-end with the backend.
- Call out any stretch goals implemented.
- Automated tests are optional, but including targeted backend or frontend tests is a strong signal.

## Evaluation Rubric

- **Frontend (45%)** – UX clarity, filter UX tied to query params, state/data management, handling
  of loading/empty/error cases, and overall polish.
- **Backend (30%)** – API design, serialization choices, filtering implementation, and attention to
  relational data handling.
- **Code Quality (15%)** – Structure, naming, documentation/readability, testing where it adds
  value.
- **Product Thinking (10%)** – Workflow clarity, assumptions noted, and thoughtful UX details.

## Optional Bonus

Authentication, deployment, or extra tooling are not required but welcome if scope allows.
