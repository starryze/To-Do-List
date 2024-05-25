document.addEventListener('DOMContentLoaded', function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTask(task.text, task.completed);
    });
});

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newTask = todoInput.value.trim();

    if (newTask === '') {
        alert('Please enter a task!');
        return;
    }
    todoInput.value = '';
    addTask(newTask);
    saveTasksToLocalStorage();
});

function addTask(task, completed = false) {
    const checkBox = document.createElement('input');
    const listItem = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = task;
    
    checkBox.setAttribute('type', 'checkbox');
    checkBox.checked = completed;
    
    if (completed) {
        taskText.style.textDecoration = 'line-through';
    }

    checkBox.style.cursor = 'pointer';
    listItem.appendChild(checkBox);
    taskText.className = 'left-side';
    listItem.appendChild(taskText);
    todoList.appendChild(listItem);

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt'; 
    deleteIcon.title = 'Delete'; 
    deleteIcon.style.cursor = 'pointer';  

    deleteIcon.addEventListener('click', function() {
        todoList.removeChild(listItem);
        saveTasksToLocalStorage();
});
    listItem.appendChild(deleteIcon);

    checkBox.addEventListener('change', function() {
        if (this.checked) {
            taskText.style.textDecoration = 'line-through';
            listItem.classList.add('completed');
        } else {
            taskText.style.textDecoration = 'none';
            listItem.classList.remove('completed');
        }
        saveTasksToLocalStorage();
    });

    taskText.addEventListener('click', function() {
        if (!listItem.classList.contains('editing')) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskText.textContent;
            input.maxLength = 25;
            input.style.width = '300px';
            input.style.border = 'none';
            input.style.outline = 'none';
            input.style.marginLeft = '10px';
            input.style.padding = '0';
            input.style.font = 'inherit';
            input.style.background = 'transparent';
            listItem.insertBefore(input, taskText);
            listItem.removeChild(taskText);
            listItem.classList.add('editing');

            input.focus();
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    saveTask(input, taskText, listItem);
                }
            });
            input.addEventListener('blur', function() {
                saveTask(input, taskText, listItem);
            });
        }
        saveTasksToLocalStorage();
    });
    
    function saveTask(input, taskText, listItem) {
        taskText.textContent = input.value;
        listItem.insertBefore(taskText, input);
        listItem.removeChild(input);
        listItem.classList.remove('editing');
        // editButton.textContent = 'Edit'; // No need for editButton here, so commenting it out
        saveTasksToLocalStorage();
    }    

    if (completed) {
        listItem.classList.add('completed');
    }
}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#todo-list li').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const isCompleted = task.classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
