import { BASE_URL } from './config.js';
import { showNotification, formatDate, toISODate } from './utils.js';
import { tasks, executors } from './app.js';

async function fetchSubtasks() {
    const url = `${BASE_URL}/subtasks`;
    console.log('Запрос подзадач:', url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText} `);
        }
        const data = await response.json();
        console.log('Полученные подзадачи:', data);
        return data.map(subtask => ({
            id: subtask.id,
            taskId: subtask.taskId,
            description: subtask.description || '',
            dateSet: formatDate(subtask.dateSet),
            deadline: subtask.deadline ? formatDate(subtask.deadline) : null, 
            done: subtask.done || false,
            executorId: subtask.executorId || null,
            executorName: executors.find(ex => ex.id === subtask.executorId)?.name || 'Не назначен'
        }));
    } catch (error) {
        console.error('Ошибка при загрузке подзадач:', error);
        showNotification('Не удалось загрузить подзадачи');
        return [];
    }
}

async function syncSubtasks() {
    const subtasks = await fetchSubtasks();
    const subtaskMap = new Map();
    subtasks.forEach(subtask => {
        if (!subtaskMap.has(subtask.taskId)) {
            subtaskMap.set(subtask.taskId, []);
        }
        subtaskMap.get(subtask.taskId).push({
            id: subtask.id,
            description: subtask.description,
            dateSet: subtask.dateSet,
            deadline: subtask.deadline,
            done: subtask.done,
            executorId: subtask.executorId,
            executorName: subtask.executorName
        });
    });
    tasks.forEach(task => {
        task.subtasks = subtaskMap.get(task.id) || [];
    });
    console.log('Подзадачи синхронизированы:', tasks.map(t => ({ id: t.id, subtasks: t.subtasks })));
}

async function createSubtask(taskId, subtaskData) {
    const url = `${BASE_URL}/subtasks`;
    const body = {
        taskId,
        description: subtaskData.description || 'Новая подзадача',
        dateSet: toISODate(subtaskData.dateSet) || new Date().toISOString().split('T')[0],
        deadline: subtaskData.deadline ? toISODate(subtaskData.deadline) : null,
        done: subtaskData.done || false,
        executorId: subtaskData.executorId || null
    };
    console.log('Создание подзадачи:', url, 'Тело:', body);
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
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText} `);
        }
        const data = await response.json();
        console.log('Создана подзадача:', data);
        return {
            id: data.id,
            taskId: data.taskId,
            description: data.description || '',
            dateSet: formatDate(data.dateSet),
            deadline: data.deadline ? formatDate(data.deadline) : null, 
            done: data.done || false,
            executorId: data.executorId || null,
            executorName: executors.find(ex => ex.id === data.executorId)?.name || 'Не назначен'
        };
    } catch (error) {
        console.error('Ошибка при создании подзадачи:', error);
        showNotification(`Не удалось создать подзадачу: ${error.message} `);
        throw error;
    }
}

async function updateSubtask(subtaskId, subtaskData) {
    const url = `${BASE_URL}/subtasks/${subtaskId}`;
    const body = {
        taskId: subtaskData.taskId,
        description: subtaskData.description || '',
        dateSet: toISODate(subtaskData.dateSet) || null,
        deadline: subtaskData.deadline ? toISODate(subtaskData.deadline) : null,
        done: subtaskData.done || false,
        executorId: subtaskData.executorId || null
    };
    console.log('Обновление подзадачи:', url, 'Тело:', body);
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
        const data = await response.json();
        console.log('Обновлена подзадача:', data);
        return {
            id: data.id,
            taskId: data.taskId,
            description: data.description || '',
            dateSet: formatDate(data.dateSet),
            deadline: data.deadline ? formatDate(data.deadline) : null, 
            done: data.done || false,
            executorId: data.executorId || null,
            executorName: executors.find(ex => ex.id === data.executorId)?.name || 'Не назначен'
        };
    } catch (error) {
        console.error('Ошибка при обновлении подзадачи:', error);
        showNotification(`Не удалось обновить подзадачу: ${error.message}`);
        throw error;
    }
}

async function deleteSubtask(subtaskId) {
    const url = `${BASE_URL}/subtasks/${subtaskId}`;
    console.log('Удаление подзадачи:', url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        console.log('Подзадача удалена:', subtaskId);
    } catch (error) {
        console.error('Ошибка при удалении подзадачи:', error);
        showNotification(`Не удалось удалить подзадачу: ${error.message}`);
        throw error;
    }
}

export { fetchSubtasks, syncSubtasks, createSubtask, updateSubtask, deleteSubtask };
