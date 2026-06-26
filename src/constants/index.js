import { C } from '../styles/colors'

export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected']

export const CATEGORIES = ['Water Supply', 'Electricity', 'Sanitation', 'Security', 'Road Damage', 'Other']

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

export const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E']

export const STATUS_COLOR_MAP = {
  Pending:       C.amber,
  'In Progress': C.primary,
  Resolved:      C.green,
  Rejected:      C.red,
}

export const PRIORITY_COLOR_MAP = {
  Low:    C.green,
  Medium: C.amber,
  High:   C.red,
  Urgent: C.purple,
}
