import { showNotification, formatDate, formatCommentDate, toISODate } from './utils.js';
import { fetchExecutorsOnTasks } from './executorsOnTask.js';
import { fetchHistory } from './history.js';
import { fetchSubtasks, syncSubtasks } from './subtasks.js';
import { tasks, allProjects } from './app.js';
import { BASE_URL } from './config.js';

async function createTask(taskData) {
    const url = `${BASE_URL}/tasks`;
    const body = {
        dateSet: toISODate(taskData.dateSet) || new Date().toISOString().split('T')[0],
        project: taskData.project || '',
        theme: taskData.theme || '',
        description: taskData.description || '',
        status: taskData.status || 'OPEN',
        deadline: toISODate(taskData.deadline) || null,
        customerId: taskData.customerId || null 
    };
    console.log('Создание задачи:', url, 'Тело:', body);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Создана задача:', data);
        return {
            id: data.id,
            dateSet: formatDate(data.dateSet),
            project: data.project,
            theme: data.theme,
            description: data.description,
            status: data.status,
            deadline: formatDate(data.deadline),
            customerId: data.customerId, 
            executors: [],
            files: [],
            history: [],
            subtasks: []
        };
    } catch (error) {
        console.error('Ошибка при создании задачи:', error);
        showNotification(`Не удалось создать задачу: ${error.message}`);
        throw error;
    }
}

async function fetchTasks(startDate, endDate) {
    if (!startDate || !endDate) {
        console.log('Дата начала или окончания не указана, пропуск запроса задач');
        return [];
    }
    if (new Date(endDate) < new Date(startDate)) {
        showNotification('Дата окончания не может быть раньше даты начала');
        return [];
    }
    const url = `${BASE_URL}/tasks/${startDate}/${endDate}`;
    console.log('Запрос задач:', url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Полученные задачи:', data);
        tasks.length = 0; 
        tasks.push(...data.map(task => ({
            id: task.id,
            dateSet: formatDate(task.dateSet),
            project: task.project,
            theme: task.theme,
            description: task.description,
            status: task.status,
            deadline: formatDate(task.deadline),
            customerId: task.customerId, 
            executors: [],
            files: [],
            history: [],
            subtasks: []
        })));
        await Promise.all([
            syncExecutorsOnTasks(),
            syncFiles(),
            syncSubtasks(),
            syncHistory()
        ]);
        updateDerivedData();
        console.log('Обновлённый массив tasks:', tasks);
        return tasks;
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        showNotification(`Не удалось загрузить задачи: ${error.message}`);
        return [];
    }
}

async function fetchFiles() {
    const url = `${BASE_URL}/files`;
    console.log('Запрос файлов:', url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Полученные файлы:', data);
        return data.map(file => ({
            id: file.id,
            taskId: file.taskId,
            name: file.name,
            url: `${BASE_URL}/files/${file.id}`
        }));
    } catch (error) {
        console.error('Ошибка при загрузке файлов:', error);
        return [];
    }
}

async function syncFiles() {
    const files = await fetchFiles();
    const fileMap = new Map();
    files.forEach(file => {
        if (!fileMap.has(file.taskId)) {
            fileMap.set(file.taskId, []);
        }
        fileMap.get(file.taskId).push({
            id: file.id,
            name: file.name,
            url: file.url
        });
    });
    tasks.forEach(task => {
        task.files = fileMap.get(task.id) || [];
    });
}

async function syncExecutorsOnTasks() {
    try {
        const relations = await fetchExecutorsOnTasks();
        console.log('Полученные связи исполнителей:', relations);
        if (!relations || !Array.isArray(relations)) {
            console.warn('Отношения исполнителей пусты или некорректны:', relations);
            return;
        }
        const executorMap = new Map();
        relations.forEach(rel => {
            if (rel.taskId && rel.executor && rel.executor.name) {
                if (!executorMap.has(rel.taskId)) {
                    executorMap.set(rel.taskId, []);
                }
                executorMap.get(rel.taskId).push(rel.executor.name);
            } else {
                console.warn('Некорректная запись отношения:', rel);
            }
        });
        tasks.forEach(task => {
            task.executors = executorMap.get(task.id) || [];
        });
        console.log('Исполнители синхронизированы:', tasks.map(t => ({ id: t.id, executors: t.executors })));
    } catch (error) {
        console.error('Ошибка синхронизации исполнителей:', error);
        showNotification('Не удалось синхронизировать исполнителей');
    }
}

async function syncHistory() {
    try {
        const historyCache = await fetchHistory();
        console.log('Полученная история:', historyCache);
        const historyMap = new Map();
        historyCache.forEach(record => {
            if (!historyMap.has(record.taskId)) {
                historyMap.set(record.taskId, []);
            }
            historyMap.get(record.taskId).push({
                id: record.id,
                date: formatCommentDate(record.date),
                rawDate: record.date,
                change: record.change,
                user: record.user
            });
        });
        tasks.forEach(task => {
            task.history = (historyMap.get(task.id) || [])
                .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
        });
    } catch (error) {
        console.error('Ошибка синхронизации истории:', error);
        showNotification('Не удалось синхронизировать историю');
    }
}

async function updateTask(task) { 
    const url = `${BASE_URL}/tasks/${task.id}`;
    const body = {
        dateSet: toISODate(task.dateSet),
        project: task.project,
        theme: task.theme,
        description: task.description,
        status: task.status,
        deadline: toISODate(task.deadline),
        customerId: task.customerId 
    };
    console.log('Обновление задачи:', task.id, url, 'Тело:', body);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const updatedTask = await response.json();
        console.log('Обновлённая задача:', updatedTask);
        return updatedTask;
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        showNotification(`Не удалось обновить задачу: ${error.message}`);
        throw error;
    }
}

function updateDerivedData() {
    allProjects.length = 0;
    allProjects.push(...[...new Set(tasks.map(task => task.project))]);
}

export { createTask, fetchTasks, updateTask, syncExecutorsOnTasks, syncFiles, syncHistory, updateDerivedData };