export interface Profile {
    id: string; 
}

export interface Task {
    id: string; 
    description: string; 
    priority: number;
    complete: boolean;
}