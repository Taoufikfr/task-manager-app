import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  category: 'Daily' | 'Weekly' | 'Other';
  status: 'New' | 'In Progress' | 'Done'; // <--- NEW FIELD
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  // Input fields
  newTask: string = '';
  newCategory: 'Daily' | 'Weekly' | 'Other' = 'Daily';
  
  // Data management
  allTasks: Task[] = [];       // Stores all tasks from DB
  currentFilter: string = 'All'; // Stores current filter selection

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    // Subscribe to real-time data
    const taskCollection = collection(this.firestore, 'tasks');
    collectionData(taskCollection, { idField: 'id' }).subscribe((data) => {
      this.allTasks = data as Task[];
    });
  }

  // Getter to return only tasks that match the filter
  get filteredTasks() {
    if (this.currentFilter === 'All') {
      return this.allTasks;
    }
    return this.allTasks.filter(task => task.category === this.currentFilter);
  }

  // 1. Add Task (Default status is 'New')
  addTask() {
    if (this.newTask.trim() !== '') {
      addDoc(collection(this.firestore, 'tasks'), {
        title: this.newTask,
        category: this.newCategory,
        status: 'New' 
      });
      this.newTask = '';
    }
  }

  // 2. Update Status (New -> In Progress -> Done)
  updateStatus(task: Task, newStatus: string) {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    updateDoc(taskDocRef, { status: newStatus });
  }

  // 3. Delete Task
  deleteTask(taskId: string) {
    deleteDoc(doc(this.firestore, `tasks/${taskId}`));
  }

  // Helper to change filter
  setFilter(category: string) {
    this.currentFilter = category;
  }
}