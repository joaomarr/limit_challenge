import { SubmissionPriority, SubmissionStatus } from '@/lib/types';

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: 'New',
  in_review: 'In review',
  closed: 'Closed',
  lost: 'Lost',
};

export const PRIORITY_LABELS: Record<SubmissionPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
