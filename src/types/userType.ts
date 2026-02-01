export interface UserType {
  verificationCode: string | null;
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  schoolName: string;
  role: string;
  profileImage: string;
  guardian?: {
    _id: string;
    fullName: string;
  }
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  schoolSlug: string;
  message?: string;
  regNumber?: string
}

export interface UserEditType {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  profileImage: string;
  yearOfAdmission?: number;
  isPrincipal?: boolean;
  isFinancialOfficer?: boolean;
  guardian?: {
    _id: string;
    fullName: string;
  } | null;
  studentClass?: {
    _id: string;
    name: string;
  } | null;
  message?: string;
}

export type BulkCreateResponse = {
  success: boolean;
  message: string;
  data: UserEditType[];
};

export interface PromoteStudentType {
  studentIds: string[];
  newClassId: string;
  message?: string
}