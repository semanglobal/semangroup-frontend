export interface ApplicationCreate {
    _id?: string;
    siteName: string;
    buyer: string;
    applicationNumber: string;
    plotNumber: string;
    phoneNumber: string;
    emailAddress: string;
    houseType: string;
    amountPaid: number;
    amountDueForPayment: number;
    infrastructureFees: number;
    paymentStatus: string;
    allocationLetter: string;
    comment?: string;
    settingAndEvacuation: boolean;
    documentUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApplicationGet {
    success?: boolean;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: ApplicationCreate[]
}

export interface ApplicationPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};