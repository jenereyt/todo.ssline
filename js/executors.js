import { BASE_URL } from './config.js';

export async function fetchExecutors() {
    const url = `${BASE_URL}/executors`;
    console.log('Запрос исполнителей:', url);
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
        console.log('Полученные исполнители:', data);
        return data.map(executor => ({
            id: executor.id,
            name: executor.name,
            phone_number: executor.phone_number || ''
        }));
    } catch (error) {
        console.error('Ошибка при получении исполнителей:', error);
        alert(`Не удалось загрузить список исполнителей: ${error.message}`);
        return [];
    }
}

export async function createExecutor(executorData) {
    const url = `${BASE_URL}/executors`;
    console.log('Создание исполнителя:', executorData, url);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: executorData.name,
                phone_number: executorData.phone_number || ''
            })
        });
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Исполнитель с таким именем или номером телефона уже существует');
            }
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Создан исполнитель:', data);
        return {
            id: data.id,
            name: data.name,
            phone_number: data.phone_number || ''
        };
    } catch (error) {
        console.error('Ошибка при создании исполнителя:', error);
        throw error;
    }
}

export async function updateExecutor(id, executorData) {
    const url = `${BASE_URL}/executors/${id}`;
    console.log('Обновление исполнителя:', id, executorData, url);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: executorData.name,
                phone_number: executorData.phone_number || ''
            })
        });
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Исполнитель с таким именем или номером телефона уже существует');
            }
            if (response.status === 404) {
                throw new Error('Исполнитель не найден');
            }
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Обновлён исполнитель:', data);
        return {
            id: data.id,
            name: data.name,
            phone_number: data.phone_number || ''
        };
    } catch (error) {
        console.error('Ошибка при обновлении исполнителя:', error);
        throw error;
    }
}

export async function deleteExecutor(id) {
    const url = `${BASE_URL}/executors/${id}`;
    console.log('Удаление исполнителя:', id, url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Исполнитель не найден');
            }
            const errorText = await response.text();
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        console.log('Исполнитель удалён:', id);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении исполнителя:', error);
        throw error;
    }
}