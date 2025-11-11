export interface User {
  idUser: number;
  idUniversity: number;
  email: string;
  enrollmentNumber?: string;
  password?: string; // Only for creation/update, not displayed
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string; // UUID from storage service
  status: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface UserWithDetails extends User {
  profileImageUrl?: string;
  universityName?: string;
  fullName?: string;
  // Academic assignments
  groupCode?: string;
  groupName?: string;
  divisionCode?: string;
  divisionName?: string;
  assignedGroups?: string[]; // For tutors with multiple groups
  hasAssignment?: boolean; // Whether user has any academic assignment
}

export interface UserFormData {
  email: string;
  enrollmentNumber?: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
}