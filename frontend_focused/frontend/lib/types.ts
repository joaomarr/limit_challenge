export type SubmissionStatus = 'new' | 'in_review' | 'closed' | 'lost';
export type SubmissionPriority = 'high' | 'medium' | 'low';

export interface Broker {
  id: number;
  name: string;
  primaryContactEmail: string;
}

export interface Company {
  id: number;
  legalName: string;
  industry: string;
  headquartersCity: string;
}

export interface TeamMember {
  id: number;
  fullName: string;
  email: string;
}

export interface NoteSummary {
  authorName: string;
  bodyPreview: string;
  createdAt: string;
}

export interface SubmissionListItem {
  id: number;
  status: SubmissionStatus;
  priority: SubmissionPriority;
  summary: string;
  createdAt: string;
  updatedAt: string;
  broker: Broker;
  company: Company;
  owner: TeamMember;
  documentCount: number;
  noteCount: number;
  latestNote: NoteSummary | null;
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Document {
  id: number;
  title: string;
  docType: string;
  uploadedAt: string;
  fileUrl: string;
}

export interface NoteDetail {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
}

/** Fields shared by the list item and the detail payload. */
export type SubmissionCore = Omit<SubmissionListItem, 'documentCount' | 'noteCount' | 'latestNote'>;

export interface SubmissionDetail extends SubmissionCore {
  contacts: Contact[];
  documents: Document[];
  notes: NoteDetail[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SubmissionListFilters {
  status?: SubmissionStatus;
  priority?: SubmissionPriority;
  brokerId?: string;
  companySearch?: string;
  page: number;
  pageSize: number;
}

export interface StatusCount {
  status: SubmissionStatus;
  count: number;
}
