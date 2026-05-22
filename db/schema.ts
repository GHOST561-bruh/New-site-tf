// Database schema definition
// Example using a simple structure

export interface DatabaseSchema {
  users: User[];
  posts: Post[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

// Initialize mock database
export const mockDatabase: DatabaseSchema = {
  users: [],
  posts: [],
};
