import type { StaffRole } from "./auth";

export type InviteStaffRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roles: StaffRole[];
}

export type UpdateUserRolesRequest = {
    roles: StaffRole[];
}