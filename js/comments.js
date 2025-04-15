export async function createComment(taskId, text) {
    const url = 'http://servtodo.ssline.uz/comments';
    const date = new Date().toISOString();
    console.log('Создание комментария:', { taskId, text, date }, url);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                date,
                taskId
            })
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // { id, text, date, taskId, task }
    } catch (error) {
        console.error('Ошибка при создании комментария:', error);
        throw error;
    }
}

export async function fetchComments() {
    const url = 'http://servtodo.ssline.uz/comments';
    console.log('Запрос всех комментариев:', url);
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
        console.log('Полученные комментарии:', data);
        return data; // [{ id, text, date, taskId, task }, ...]
    } catch (error) {
        console.error('Ошибка при получении комментариев:', error);
        alert(`Не удалось загрузить комментарии: ${error.message}`);
        return [];
    }
}

export async function fetchCommentById(id) {
    const url = `http://servtodo.ssline.uz/comments/${id}`;
    console.log('Запрос комментария по ID:', id, url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Комментарий не найден');
            }
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // { id, text, date, taskId, task }
    } catch (error) {
        console.error('Ошибка при получении комментария:', error);
        throw error;
    }
}

export async function updateComment(id, taskId, text, date) {
    const url = `http://servtodo.ssline.uz/comments/${id}`;
    console.log('Обновление комментария:', { id, taskId, text, date }, url);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                date: date || new Date().toISOString(),
                taskId
            })
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Комментарий не найден');
            }
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // { id, text, date, taskId }
    } catch (error) {
        console.error('Ошибка при обновлении комментария:', error);
        throw error;
    }
}

export async function deleteComment(id) {
    const url = `http://servtodo.ssline.uz/comments/${id}`;
    console.log('Удаление комментария:', id, url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Комментарий не найден');
            }
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        return true; // Успешное удаление
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        throw error;
    }
}