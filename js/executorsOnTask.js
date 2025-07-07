import { BASE_URL } from './config.js';

export async function assignExecutorToTask(taskId, executorId, task, executor) {
    const url = `${BASE_URL}/executors-on-tasks`;
    console.log('Назначение исполнителя:', { taskId, executorId }, url);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskId,
                executorId,
                task: {
                    id: task.id,
                    project: task.project,
                    theme: task.theme
                },
                executor: {
                    id: executor.id,
                    name: executor.name
                }
            })
        });
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Исполнитель уже назначен на задачу');
            }
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // { taskId, executorId, task, executor }
    } catch (error) {
        console.error('Ошибка при назначении исполнителя:', error);
        throw error;
    }
}

export async function fetchExecutorsOnTasks() {
    const url = `${BASE_URL}/executors-on-tasks`;
    console.log('Запрос связей исполнителей и задач:', url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Полученные связи:', data);
        return data; // [{ taskId, executorId, task, executor }, ...]
    } catch (error) {
        console.error('Ошибка при получении связей:', error);
        alert(`Не удалось загрузить связи исполнителей и задач: ${error.message}`);
        return [];
    }
}

export async function removeExecutorFromTask(taskId, executorId) {
    const url = `${BASE_URL}/executors-on-tasks/${taskId}/${executorId}`;
    console.log('Удаление исполнителя из задачи:', { taskId, executorId }, url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Связь не найдена');
            }
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        return true; // Успешное удаление
    } catch (error) {
        console.error('Ошибка при удалении исполнителя из задачи:', error);
        throw error;
    }
}   