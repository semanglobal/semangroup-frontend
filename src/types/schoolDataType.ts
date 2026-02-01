type SchoolContact = {
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    email: string;
    phoneNumbers: string[];
    website: string;
};

export interface SchoolData {
    schoolId: string;
    schoolName: string;
    schoolContact: SchoolContact;
    schoolAccountStatus: "active" | "suspended";
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    totalGuardians: number;
    totalUsers: number;
    domain: string;
};

type GrowthData = {
    students: string;
    teachers: string;
    admins: string;
    overall: string;
};

export interface SummaryData {
    totalSchools: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    growth: GrowthData;
};

export interface ChangeStatusType {
    schoolId: string;
    status: string;
    domain: string;
};