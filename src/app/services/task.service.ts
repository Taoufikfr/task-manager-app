import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, collectionData, 
  query, where, orderBy, addDoc, updateDoc, doc, Timestamp 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private firestore = inject(Firestore);
  private tasksCollection = collection(this.firestore, 'tasks');

  // Get Tasks filtered by Date Range
  getTasks(start: Date, end: Date): Observable<Task[]> {
    const q = query(
      this.tasksCollection,
      where('dueDate', '>=', Timestamp.fromDate(start)),
      where('dueDate', '<=', Timestamp.fromDate(end)),
      // Composite Index required here (Firebase will give you a link to click)
      orderBy('dueDate', 'asc') 
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
  }

  // Add a new task
  addTask(title: string, date: Date) {
    const task: Task = {
      title: title,
      dueDate: Timestamp.fromDate(date),
      isPinned: false,
      isCompleted: false
    };
    return addDoc(this.tasksCollection, task);
  }

  // Pin/Unpin
  togglePin(taskId: string, currentStatus: boolean) {
    const taskRef = doc(this.firestore, `tasks/${taskId}`);
    return updateDoc(taskRef, { isPinned: !currentStatus });
  }
}