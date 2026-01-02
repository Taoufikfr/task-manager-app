// src/app/models/task.model.ts
import { Timestamp } from '@angular/fire/firestore'; // <--- Import this!

export interface Task {
  id?: string;
  title: string;
  dueDate: Timestamp; // <--- Change this from 'Date' or 'string' to 'Timestamp'
  isPinned: boolean;
  isCompleted: boolean;
}