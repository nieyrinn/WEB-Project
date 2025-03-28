import { User } from "./user.model";

export interface UserProfile {
    id: number;
    user: User;
    bio: string;
    location: string;
    birth_date: string | null;
    profile_image: string | null;
}