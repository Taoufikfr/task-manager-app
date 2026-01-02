import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './../services/task.service'; // Check this path matches your folder structure
import { Task } from './../models/task.model'; // Check this path matches your folder structure
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] 
})
export class DashboardComponent implements OnInit {
  taskService = inject(TaskService);
  tasks$: Observable<Task[]> | undefined; 
  activeView: 'daily' | 'weekly' = 'daily';

  ngOnInit() {
    this.loadView('daily');
  }

  // --- NEW: Add Task Logic ---
  addTask(title: string) {
    if (!title.trim()) return; // Prevent empty tasks

    // Defaults to "Now" so it appears in your Daily view immediately
    const today = new Date();
    
    this.taskService.addTask(title, today)
      .then(() => {
        console.log('Task added successfully');
        // No need to reload; the Observable stream updates automatically!
      })
      .catch(err => console.error('Error adding task:', err));
  }
  // ---------------------------

  loadView(view: 'daily' | 'weekly') {
    this.activeView = view;
    const today = new Date();
    today.setHours(0,0,0,0); // Start of today

    let start = new Date(today);
    let end = new Date(today);

    if (view === 'daily') {
      end.setHours(23, 59, 59); // End of today
    } else {
      // Weekly logic: Adjust to Monday start
      const day = today.getDay(); 
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
      start.setDate(diff);
      end.setDate(start.getDate() + 6);
    }

    // Get data and Apply Sorting (Pinned First)
    this.tasks$ = this.taskService.getTasks(start, end).pipe(
      map(tasks => tasks.sort((a, b) => {
        // 1. Sort by Pinned (true comes first)
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        // 2. Sort by Date (Safe check for seconds)
        const dateA = a.dueDate?.seconds || 0;
        const dateB = b.dueDate?.seconds || 0;
        return dateA - dateB;
      }))
    );
  }

  togglePin(task: Task) {
    if (task.id) {
      this.taskService.togglePin(task.id, task.isPinned);
    }
  }
}