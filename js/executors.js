export async function fetchExecutors() {
    const url = 'http://servtodo.ssline.uz/executors';
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
        return data; // [{ id, name }, ...]
    } catch (error) {
        console.error('Ошибка при получении исполнителей:', error);
        alert(`Не удалось загрузить список исполнителей: ${error.message}`);
        return [];
    }
}

export async function createExecutor(name) {
    const url = 'http://servtodo.ssline.uz/executors';
    console.log('Создание исполнителя:', name, url);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Исполнитель с таким именем уже существует');
            }
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при создании исполнителя:', error);
        throw error;
    }
}

export async function updateExecutor(id, name) {
    const url = `http://servtodo.ssline.uz/executors/${id}`;
    console.log('Обновление исполнителя:', id, name, url);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Исполнитель с таким именем уже существует');
            }
            if (response.status === 404) {
                throw new Error('Исполнитель не найден');
            }
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении исполнителя:', error);
        throw error;
    }
}

export async function deleteExecutor(id) {
    const url = `http://servtodo.ssline.uz/executors/${id}`;
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
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Ошибка при удалении исполнителя:', error);
        throw error;
    }
}