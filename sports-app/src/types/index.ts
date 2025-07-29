export interface Tournament {
    id: string;
    name: string;
    date: string;
    location: string;
    participants: string[];
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    tournamentsCreated: Tournament[];
    tournamentsJoined: Tournament[];
}