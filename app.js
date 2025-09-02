

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderTasks();
        this.setupEventListeners();
        this.updateTaskCount();
    }

    setupEventListeners() {
        const taskInput = document.getElementById('taskInput');
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const text = taskInput.value.trim();

        if (text) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.tasks.unshift(task);
            this.saveTasks();
            this.renderTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    }

    clearCompleted() {
        if (confirm('Clear all completed tasks?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
        }
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filters button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();

        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = this.currentFilter === 'all' 
                ? 'No tasks yet. Add one above!'
                : `No ${this.currentFilter} tasks.`;
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#666';
            emptyMessage.style.padding = '20px';
            taskList.appendChild(emptyMessage);
            return;
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="taskManager.toggleTask(${task.id})">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">
                    Delete
                </button>
            `;
            
            taskList.appendChild(li);
        });

        this.updateTaskCount();
    }

    updateTaskCount() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;

        const taskCount = document.getElementById('taskCount');
        taskCount.textContent = `${activeTasks} active, ${completedTasks} completed, ${totalTasks} total`;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the task manager
const taskManager = new TaskManager();

// Global functions for HTML onclick attributes
function addTask() {
    taskManager.addTask();
}

function toggleTask(id) {
    taskManager.toggleTask(id);
}

function deleteTask(id) {
    taskManager.deleteTask(id);
}

function clearCompleted() {
    taskManager.clearCompleted();
}

function filterTasks(filter) {
    taskManager.filterTasks(filter);
}