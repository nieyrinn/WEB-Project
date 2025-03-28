import { User } from "./user.model";

export interface Resource {
    id: number;
    title: string;
    description: string;
    category: number;
    category_name: string;
    url: string;
    file: string | null;
    created_by: User;
    created_at: string;
    updated_at: string;
  }