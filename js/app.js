import { createTaskCards, createInterface } from './interface.js';
import { fetchExecutors } from './executors.js';
import { fetchExecutorsOnTasks, assignExecutorToTask, removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory, fetchHistory } from './history.js';

export let tasks = [];
export let executors = [];
export let filters = {};
export let sortState = { field: null, ascending: true };
export let allProjects = [];

let historyCache = [];

function formatDate(isoDate) {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
}

function formatCommentDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function toISODate(localDate) {
    if (!localDate) return null;
    return new Date(localDate).toISOString().split('T')[0];
}

function showLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

function showNotification(message) {
    try {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Ошибка в showNotification:', error);
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
    const url = `https://servtodo.ssline.uz/tasks/${startDate}/${endDate}`;
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
        tasks = data.map(task => ({
            id: task.id,
            dateSet: formatDate(task.dateSet),
            project: task.project,
            theme: task.theme,
            description: task.description,
            status: task.status,
            deadline: formatDate(task.deadline),
            executors: [],
            files: [],
            history: [],
            subtasks: []
        }));
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
    const url = 'https://servtodo.ssline.uz/files';
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
            url: `https://servtodo.ssline.uz/files/${file.id}`
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

async function fetchSubtasks() {
    const url = 'https://servtodo.ssline.uz/subtasks';
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
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Полученные подзадачи:', data);
        return data.map(subtask => ({
            id: subtask.id,
            taskId: subtask.taskId,
            theme: subtask.description || '',
            subDateSet: formatDate(subtask.dateSet),
            subDeadline: formatDate(subtask.deadline),
            done: subtask.done || false
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
            theme: subtask.theme,
            subDateSet: subtask.subDateSet,
            subDeadline: subtask.subDeadline,
            done: subtask.done
        });
    });
    tasks.forEach(task => {
        task.subtasks = subtaskMap.get(task.id) || [];
    });
    console.log('Подзадачи синхронизированы:', tasks.map(t => ({ id: t.id, subtasks: t.subtasks })));
}

async function createSubtask(taskId, subtaskData) {
    const url = 'https://servtodo.ssline.uz/subtasks';
    const body = {
        taskId,
        description: subtaskData.theme || 'Новая подзадача',
        dateSet: toISODate(subtaskData.subDateSet) || new Date().toISOString().split('T')[0],
        deadline: subtaskData.subDeadline ? toISODate(subtaskData.subDeadline) : null,
        done: subtaskData.done || false
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
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Создана подзадача:', data);
        return {
            id: data.id,
            taskId: data.taskId,
            theme: data.description || '',
            subDateSet: formatDate(data.dateSet),
            subDeadline: formatDate(data.deadline),
            done: data.done || false
        };
    } catch (error) {
        console.error('Ошибка при создании подзадачи:', error);
        showNotification(`Не удалось создать подзадачу: ${error.message}`);
        throw error;
    }
}

async function updateSubtask(subtaskId, subtaskData) {
    const url = `https://servtodo.ssline.uz/subtasks/${subtaskId}`;
    const body = {
        taskId: subtaskData.taskId,
        description: subtaskData.theme || '',
        dateSet: toISODate(subtaskData.subDateSet) || null,
        deadline: subtaskData.subDeadline ? toISODate(subtaskData.subDeadline) : null,
        done: subtaskData.done || false
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
            theme: data.description || '',
            subDateSet: formatDate(data.dateSet),
            subDeadline: formatDate(data.deadline),
            done: data.done || false
        };
    } catch (error) {
        console.error('Ошибка при обновлении подзадачи:', error);
        showNotification(`Не удалось обновить подзадачу: ${error.message}`);
        throw error;
    }
}

async function deleteSubtask(subtaskId) {
    const url = `https://servtodo.ssline.uz/subtasks/${subtaskId}`;
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
        historyCache = await fetchHistory();
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
    const url = `https://servtodo.ssline.uz/tasks/${task.id}`;
    const body = {
        dateSet: toISODate(task.dateSet),
        project: task.project,
        theme: task.theme,
        description: task.description,
        status: task.status,
        deadline: toISODate(task.deadline)
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
    allProjects = [...new Set(tasks.map(task => task.project))];
}

export function getAllExecutors() {
    console.log('Доступные исполнители:', executors);
    if (!executors.length) {
        console.warn('Список исполнителей пуст');
    }
    return executors.map(ex => ex.name).sort();
}

export function applyFilters() {
    try {
        const executorFilter = document.getElementById("executorFilter")?.value.toLowerCase() || '';
        const projectFilter = document.getElementById("projectFilter")?.value.toLowerCase() || '';
        const dateFrom = document.getElementById("dateFrom")?.value || '';
        const dateTo = document.getElementById("dateTo")?.value || '';

        if (!dateFrom || !dateTo) {
            tasks = [];
            createTaskCards([]);
            showNotification('Пожалуйста, укажите диапазон дат для загрузки задач');
            return;
        }

        fetchTasks(dateFrom, dateTo).then(() => {
            let filteredTasks = tasks.filter(task => {
                const matchesExecutors = !executorFilter || task.executors.some(ex => ex.toLowerCase().includes(executorFilter));
                const matchesProject = !projectFilter || (task.project && task.project.toLowerCase().includes(projectFilter));
                return matchesExecutors && matchesProject;
            });

            sortTasks(filteredTasks);
            console.log('Обновление таблицы с задачами:', filteredTasks);
            createTaskCards(filteredTasks);
        }).catch(error => {
            console.error('Ошибка при применении фильтров:', error);
            showNotification('Ошибка при загрузке задач');
            tasks = [];
            createTaskCards([]);
        });
    } catch (error) {
        console.error('Ошибка в applyFilters:', error);
        showNotification('Ошибка при применении фильтров');
        tasks = [];
        createTaskCards([]);
    }
}

export function sortTasks(taskList) {
    if (!sortState.field) return;

    taskList.sort((a, b) => {
        let valA = a[sortState.field];
        let valB = b[sortState.field];

        if (sortState.field === "dateSet" || sortState.field === "deadline") {
            valA = valA || "9999-12-31";
            valB = valB || "9999-12-31";
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (sortState.field === "id") {
            return sortState.ascending ? valA - valB : valB - valA;
        } else if (sortState.field === "executors") {
            valA = valA.length ? valA.join(", ") : "";
            valB = valB.length ? valB.join(", ") : "";
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (sortState.field === "status") {
            valA = valA || "Не указан";
            valB = valB || "Не указан";
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            valA = valA || "";
            valB = valB || "";
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    });
}

export function openEditModal(taskId) {
    console.log('Попытка открыть задачу с ID:', taskId, 'Тип:', typeof taskId);
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error('Задача не найдена:', taskId);
        console.log('Текущий массив tasks:', tasks);
        showNotification('Задача не найдена');
        return;
    }
    console.log('Открытие модалки для задачи:', task);

    const modal = document.createElement("div");
    modal.className = "modal trello-style-modal";

    const tempTask = JSON.parse(JSON.stringify(task));
    tempTask.files = tempTask.files || [];
    tempTask.executors = tempTask.executors || [];
    tempTask.history = tempTask.history || [];
    tempTask.deadline = tempTask.deadline || "";
    tempTask.subtasks = tempTask.subtasks || [];
    const pendingHistory = [];

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <h2>${tempTask.project || "Без проекта"}</h2>
                <div class="header-actions">
                    <span class="status-label">Статус:</span>
                    <select id="statusSelect">
                        ${statuses.map(status => `
                            <option value="${status}" ${tempTask.status === status ? 'selected' : ''}>${status}</option>
                        `).join('')}
                    </select>
                    <button class="close-modal-btn" id="closeModalBtn">×</button>
                </div>
            </div>
            <div class="modal-tabs">
                <button class="tab-btn active" data-tab="info">Информация о задаче</button>
                <button class="tab-btn" data-tab="extras">Исполнители</button>
                <button class="tab-btn" data-tab="subtasks">Подзадачи</button>
                <button class="tab-btn" data-tab="investments">Вложения</button>
                <button class="tab-btn" data-tab="history">История</button>
            </div>
            <div class="modal-body">
                <div class="tab-content" id="infoTab">
                    <div class="section">
                        <h3>Тема</h3>
                        <div class="editable-field">
                            <span id="themeDisplay">${tempTask.theme || "Нет темы"}</span>
                            <input type="text" id="editTheme" value="${tempTask.theme || ""}" class="hidden">
                        </div>
                    </div>
                    <div class="section">
                        <h3>Описание</h3>
                        <div class="editable-field">
                            <span id="descriptionDisplay">${tempTask.description || "Нет описания"}</span>
                            <textarea id="editDescription" class="hidden">${tempTask.description || ""}</textarea>
                        </div>
                    </div>
                    <div class="section">
                        <h3>Дата постановки</h3>
                        <div class="editable-field">
                            <span id="dateSetDisplay">${tempTask.dateSet || "Не указана"}</span>
                            <input type="date" id="editDateSet" value="${tempTask.dateSet || ""}" class="hidden">
                        </div>
                    </div>
                    <div class="section">
                        <h3>Срок выполнения</h3>
                        <div class="editable-field">
                            <span id="deadlineDisplay">${tempTask.deadline || "Не указан"}</span>
                            <input type="date" id="editDeadline" value="${tempTask.deadline || ""}" class="hidden">
                        </div>
                    </div>
                    <div class="section comment-section">
                        <h3>Комментарий</h3>
                        <div class="comment-wrapper">
                            <textarea id="newComment" placeholder="Введите комментарий и нажмите Enter"></textarea>
                        </div>
                    </div>
                </div>
                <div class="tab-content hidden" id="extrasTab">
                    <div class="section">
                        <h3>Исполнители</h3>
                        <div id="executorList" class="executor-list"></div>
                    </div>
                </div>
                <div class="tab-content hidden" id="subtasksTab">
                    <div class="section">
                        <h3>Подзадачи</h3>
                        <div id="subtaskList">
                            ${tempTask.subtasks.length ? tempTask.subtasks.map((sub, index) => `
                                <div class="subtask-item" data-id="${sub.id}">
                                    <input type="text" class="subtask-theme" value="${sub.theme || ''}" placeholder="Тема подзадачи">
                                    <input type="date" class="subtask-dateSet" value="${sub.subDateSet || ''}">
                                    <input type="date" class="subtask-deadline" value="${sub.subDeadline || ''}">
                                    <input type="checkbox" class="subtask-done" ${sub.done ? 'checked' : ''}>
                                    <button class="remove-subtask" data-index="${index}" data-id="${sub.id}">×</button>
                                </div>
                            `).join('') : '<p>Нет подзадач</p>'}
                        </div>
                        <button id="addSubtaskBtn">Добавить подзадачу</button>
                    </div>
                </div>
                <div class="tab-content hidden" id="investmentsTab">
                    <div class="section">
                        <h3>Вложения</h3>
                        <div id="fileList">
                            ${tempTask.files.length ? tempTask.files.map(file => `
                                <div class="file-item">
                                    <a href="${file.url}" target="_blank">${file.name}</a>
                                </div>
                            `).join("") : "Нет файлов"}
                        </div>
                    </div>
                </div>
                <div class="tab-content hidden" id="historyTab">
                    <div class="section">
                        <h3>История</h3>
                        <div id="historyList">
                            ${tempTask.history.length ? tempTask.history.map((entry) => `
                                <div class="history-item ${getHistoryClass(entry.change)}" data-id="${entry.id || 'temp-' + Math.random()}">
                                    <span class="history-date">${entry.date}</span>
                                    <span class="history-change">${entry.change}</span>
                                    <span class="history-user">${entry.user}</span>
                                </div>
                            `).join("") : "Нет истории изменений"}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="saveBtn">Сохранить</button>
                <button id="closeBtn">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    function getHistoryClass(change) {
        if (change.includes('комментарий')) return 'history-comment';
        if (change.includes('статус подзадачи')) return 'history-subtask-status';
        if (change.includes('статус')) return 'history-status';
        if (change.includes('исполнитель')) return 'history-executor';
        if (change.includes('тема')) return 'history-theme';
        if (change.includes('описание')) return 'history-description';
        if (change.includes('срок выполнения')) return 'history-deadline';
        if (change.includes('дата постановки')) return 'history-dateSet';
        if (change.includes('файл')) return 'history-file';
        if (change.includes('подзадач')) return 'history-subtask';
        return 'history-other';
    }

    modal.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            modal.querySelectorAll(".tab-content").forEach(content => content.classList.add("hidden"));
            modal.querySelector(`#${btn.dataset.tab}Tab`).classList.remove("hidden");
        });
    });

    ["theme", "description", "deadline", "dateSet"].forEach(field => {
        const display = modal.querySelector(`#${field}Display`);
        const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);

        if (display && input) {
            display.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                display.classList.add("hidden");
                input.classList.remove("hidden");
                input.focus();
            });

            if (field === "deadline" || field === "dateSet") {
                const saveDate = () => {
                    const oldValue = tempTask[field];
                    tempTask[field] = input.value;
                    display.textContent = tempTask[field] || "Не указан";
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                    if (oldValue !== tempTask[field]) {
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `${field === "deadline" ? "Срок выполнения" : "Дата постановки"} изменён${field === "deadline" ? "" : "а"} с "${oldValue || "не указан"}" на "${tempTask[field] || "не указан"}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
                        showNotification(`${field === "deadline" ? "Срок выполнения" : "Дата постановки"} обновлён${field === "deadline" ? "" : "а"}`);
                    }
                };

                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        saveDate();
                    }
                });

                input.addEventListener("blur", (e) => {
                    if (!modal.contains(e.relatedTarget) || e.relatedTarget !== input) {
                        saveDate();
                    }
                });
            } else {
                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const oldValue = tempTask[field];
                        tempTask[field] = input.value.trim();
                        display.textContent = tempTask[field] || (field === "theme" ? "Нет темы" : "Нет описания");
                        display.classList.remove("hidden");
                        input.classList.add("hidden");
                        if (oldValue !== tempTask[field]) {
                            pendingHistory.push({
                                date: formatCommentDate(new Date()),
                                rawDate: new Date().toISOString(),
                                change: `${field === "theme" ? "Тема" : "Описание"} изменено с "${oldValue || "не указано"}" на "${tempTask[field] || "не указано"}"`,
                                user: "Текущий пользователь"
                            });
                            updateHistoryList();
                            showNotification(`${field === "theme" ? "Тема" : "Описание"} обновлено`);
                        }
                    }
                });

                input.addEventListener("blur", () => {
                    const oldValue = tempTask[field];
                    tempTask[field] = input.value.trim();
                    display.textContent = tempTask[field] || (field === "theme" ? "Нет темы" : "Нет описания");
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                    if (oldValue !== tempTask[field]) {
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `${field === "theme" ? "Тема" : "Описание"} изменено с "${oldValue || "не указано"}" на "${tempTask[field] || "не указано"}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
                        showNotification(`${field === "theme" ? "Тема" : "Описание"} обновлено`);
                    }
                });
            }
        }
    });

    async function updateSubtaskList() {
        const subtaskList = modal.querySelector("#subtaskList");
        subtaskList.innerHTML = tempTask.subtasks.length ? tempTask.subtasks.map((sub, index) => `
            <div class="subtask-item" data-id="${sub.id}">
                <input type="text" class="subtask-theme" value="${sub.theme || ''}" placeholder="Тема подзадачи">
                <input type="date" class="subtask-dateSet" value="${sub.subDateSet || ''}">
                <input type="date" class="subtask-deadline" value="${sub.subDeadline || ''}">
                <input type="checkbox" class="subtask-done" ${sub.done ? 'checked' : ''}>
                <button class="remove-subtask" data-index="${index}" data-id="${sub.id}">×</button>
            </div>
        `).join('') : '<p>Нет подзадач</p>';

        subtaskList.querySelectorAll('.subtask-item').forEach(item => {
            const index = parseInt(item.querySelector('.remove-subtask').dataset.index);
            const subtaskId = item.querySelector('.remove-subtask').dataset.id;
            const themeInput = item.querySelector('.subtask-theme');
            const dateSetInput = item.querySelector('.subtask-dateSet');
            const deadlineInput = item.querySelector('.subtask-deadline');
            const doneInput = item.querySelector('.subtask-done');

            themeInput.addEventListener('change', async () => {
                const oldTheme = tempTask.subtasks[index].theme;
                tempTask.subtasks[index].theme = themeInput.value.trim();
                if (oldTheme !== tempTask.subtasks[index].theme) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Тема подзадачи ${index + 1} изменена с "${oldTheme || "не указано"}" на "${tempTask.subtasks[index].theme || "не указано"}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
                        showNotification('Тема подзадачи обновлена');
                    } catch (error) {
                        tempTask.subtasks[index].theme = oldTheme;
                        updateSubtaskList();
                    }
                }
            });

            dateSetInput.addEventListener('change', async () => {
                const oldDateSet = tempTask.subtasks[index].subDateSet;
                tempTask.subtasks[index].subDateSet = dateSetInput.value;
                if (oldDateSet !== tempTask.subtasks[index].subDateSet) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Дата постановки подзадачи ${index + 1} изменена с "${oldDateSet || "не указана"}" на "${tempTask.subtasks[index].subDateSet || "не указана"}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
                        showNotification('Дата постановки подзадачи обновлена');
                    } catch (error) {
                        tempTask.subtasks[index].subDateSet = oldDateSet;
                        updateSubtaskList();
                    }
                }
            });

            deadlineInput.addEventListener('change', async () => {
                const oldDeadline = tempTask.subtasks[index].subDeadline;
                tempTask.subtasks[index].subDeadline = deadlineInput.value;
                if (oldDeadline !== tempTask.subtasks[index].subDeadline) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Дедлайн подзадачи ${index + 1} изменён с "${oldDeadline || "не указан"}" на "${tempTask.subtasks[index].subDeadline || "не указан"}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
                        showNotification('Дедлайн подзадачи обновлён');
                    } catch (error) {
                        tempTask.subtasks[index].subDeadline = oldDeadline;
                        updateSubtaskList();
                    }
                }
            });

            doneInput.addEventListener('change', async () => {
                const oldDone = tempTask.subtasks[index].done;
                tempTask.subtasks[index].done = doneInput.checked;
                if (oldDone !== tempTask.subtasks[index].done) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Статус подзадачи ${index + 1} изменён с "${oldDone ? 'выполнена' : 'не выполнена'}" на "${tempTask.subtasks[index].done ? 'выполнена' : 'не выполнена'}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
                        showNotification('Статус подзадачи обновлён');
                    } catch (error) {
                        tempTask.subtasks[index].done = oldDone;
                        doneInput.checked = oldDone;
                        updateSubtaskList();
                    }
                }
            });
        });

        subtaskList.querySelectorAll('.remove-subtask').forEach(btn => {
            btn.addEventListener('click', async () => {
                const index = parseInt(btn.dataset.index);
                const subtaskId = btn.dataset.id;
                const removedSubtask = tempTask.subtasks[index];
                try {
                    await deleteSubtask(subtaskId);
                    tempTask.subtasks.splice(index, 1);
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Удалена подзадача: "${removedSubtask.theme || "без темы"}"`,
                        user: "Текущий пользователь"
                    });
                    updateHistoryList();
                    updateSubtaskList();
                    showNotification('Подзадача удалена');
                } catch (error) {
                    updateSubtaskList();
                }
            });
        });
    }

    async function updateExecutorList() {
        try {
            const executorList = modal.querySelector("#executorList");
            executorList.innerHTML = '';
            console.log('Обновление списка исполнителей в модалке:', tempTask.executors);
            if (tempTask.executors.length) {
                tempTask.executors.forEach(ex => {
                    const executorItem = document.createElement("span");
                    executorItem.className = "executor-item";
                    executorItem.innerHTML = `
                        <span class="executor-name">${ex}</span>
                        <button class="remove-executor" data-executor="${ex}">×</button>
                    `;
                    executorList.appendChild(executorItem);
                });
            } else {
                const noExecutors = document.createElement("span");
                noExecutors.textContent = "Не назначены";
                executorList.appendChild(noExecutors);
            }

            const addButton = document.createElement("button");
            addButton.className = "add-executor-btn";
            addButton.innerHTML = `<img src="./image/plus.svg" style="width: 16px; height: 16px;">`;
            executorList.appendChild(addButton);

            addButton.addEventListener("click", (e) => {
                e.stopPropagation();
                if (!executorList.querySelector("#addExecutorSelect")) {
                    const availableExecutors = getAllExecutors().filter(ex => !tempTask.executors.includes(ex));
                    console.log('Доступные исполнители для добавления:', availableExecutors);
                    if (!availableExecutors.length) {
                        showNotification('Нет доступных исполнителей для добавления');
                        return;
                    }
                    const selectWrapper = document.createElement("span");
                    selectWrapper.className = "executor-item";
                    selectWrapper.innerHTML = `
                        <select id="addExecutorSelect">
                            <option value="">Выберите исполнителя</option>
                            ${availableExecutors.map(ex => `
                                <option value="${ex}">${ex}</option>
                            `).join("")}
                        </select>
                        <button class="cancel-add-executor">×</button>
                    `;
                    executorList.replaceChild(selectWrapper, addButton);

                    const addExecutorSelect = selectWrapper.querySelector("#addExecutorSelect");
                    addExecutorSelect.addEventListener("change", (e) => {
                        e.stopPropagation();
                        const executorName = addExecutorSelect.value;
                        if (executorName && !tempTask.executors.includes(executorName)) {
                            tempTask.executors.push(executorName);
                            pendingHistory.push({
                                date: formatCommentDate(new Date()),
                                rawDate: new Date().toISOString(),
                                change: `Добавлен исполнитель: "${executorName}"`,
                                user: "Текущий пользователь"
                            });
                            updateHistoryList();
                            updateExecutorList();
                            showNotification(`Исполнитель "${executorName}" добавлен`);
                        }
                    });

                    selectWrapper.querySelector(".cancel-add-executor").addEventListener("click", (e) => {
                        e.stopPropagation();
                        executorList.replaceChild(addButton, selectWrapper);
                    });
                }
            });

            executorList.querySelectorAll(".remove-executor").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const executorName = btn.dataset.executor;
                    tempTask.executors = tempTask.executors.filter(ex => ex !== executorName);
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Удалён исполнитель: "${executorName}"`,
                        user: "Текущий пользователь"
                    });
                    updateHistoryList();
                    updateExecutorList();
                    showNotification(`Исполнитель "${executorName}" удалён`);
                });
            });

            executorList.querySelectorAll(".executor-name").forEach(span => {
                span.addEventListener("dblclick", (e) => {
                    e.stopPropagation();
                    const oldExecutorName = span.textContent;
                    const executorItem = span.parentElement;

                    const availableExecutors = getAllExecutors().filter(ex => !tempTask.executors.includes(ex) || ex === oldExecutorName);
                    if (!availableExecutors.length) {
                        showNotification('Нет доступных исполнителей для замены');
                        return;
                    }

                    const select = document.createElement("select");
                    select.innerHTML = `
                        <option value="">Выберите исполнителя</option>
                        ${availableExecutors.map(ex => `
                            <option value="${ex}" ${ex === oldExecutorName ? 'selected' : ''}>${ex}</option>
                        `).join("")}
                    `;
                    executorItem.replaceChild(select, span);
                    select.focus();

                    select.addEventListener("change", (e) => {
                        e.stopPropagation();
                        const newExecutorName = select.value;
                        if (newExecutorName && newExecutorName !== oldExecutorName && !tempTask.executors.includes(newExecutorName)) {
                            const index = tempTask.executors.indexOf(oldExecutorName);
                            tempTask.executors[index] = newExecutorName;
                            pendingHistory.push({
                                date: formatCommentDate(new Date()),
                                rawDate: new Date().toISOString(),
                                change: `Исполнитель изменён с "${oldExecutorName}" на "${newExecutorName}"`,
                                user: "Текущий пользователь"
                            });
                            updateHistoryList();
                            updateExecutorList();
                            showNotification(`Исполнитель изменён на "${newExecutorName}"`);
                        }
                    });

                    select.addEventListener("blur", () => {
                        updateExecutorList();
                    });
                });
            });
        } catch (error) {
            console.error('Ошибка в updateExecutorList:', error);
            showNotification('Ошибка при обновлении списка исполнителей');
        }
    }

    async function updateHistoryList() {
        try {
            const historyList = modal.querySelector("#historyList");
            const combinedHistory = [
                ...tempTask.history,
                ...pendingHistory
            ].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
            historyList.innerHTML = combinedHistory.length ? combinedHistory.map((entry) => `
                <div class="history-item ${getHistoryClass(entry.change)}" data-id="${entry.id || 'temp-' + Math.random()}">
                    <span class="history-date">${entry.date}</span>
                    <span class="history-change">${entry.change}</span>
                    <span class="history-user">${entry.user}</span>
                </div>
            `).join("") : "Нет истории изменений";
        } catch (error) {
            console.error('Ошибка в updateHistoryList:', error);
            showNotification('Ошибка при обновлении истории');
        }
    }

    updateExecutorList();
    updateSubtaskList();

    modal.querySelector('#addSubtaskBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const newSubtask = {
                taskId: tempTask.id,
                theme: 'Новая подзадача',
                subDateSet: formatDate(new Date()),
                subDeadline: '',
                done: false
            };
            const createdSubtask = await createSubtask(tempTask.id, newSubtask);
            tempTask.subtasks.push(createdSubtask);
            pendingHistory.push({
                date: formatCommentDate(new Date()),
                rawDate: new Date().toISOString(),
                change: `Добавлена новая подзадача: "${createdSubtask.theme || "без темы"}"`,
                user: "Текущий пользователь"
            });
            updateHistoryList();
            updateSubtaskList();
            showNotification('Подзадача добавлена');
        } catch (error) {
            console.error('Ошибка при добавлении подзадачи:', error);
            showNotification('Не удалось добавить подзадачу');
        }
    });

    const newCommentTextarea = modal.querySelector("#newComment");
    if (newCommentTextarea) {
        newCommentTextarea.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const commentText = newCommentTextarea.value.trim();
                if (commentText) {
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Добавлен комментарий: "${commentText}"`,
                        user: "Текущий пользователь"
                    });
                    updateHistoryList();
                    newCommentTextarea.value = "";
                    showNotification('Комментарий добавлен');
                }
            }
        });
    }

    const closeModal = () => {
        if (pendingHistory.length || JSON.stringify(tempTask) !== JSON.stringify(task)) {
            showNotification('Изменения сохранены локально');
        }
        modal.remove();
    };

    modal.querySelector("#closeModalBtn").addEventListener("click", closeModal);
    modal.querySelector("#closeBtn").addEventListener("click", closeModal);

    modal.querySelector("#saveBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        showLoading(modal.querySelector("#saveBtn"), true);
        modal.remove();

        setTimeout(async () => {
            try {
                const newStatus = modal.querySelector("#statusSelect").value;
                if (tempTask.status !== newStatus) {
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Статус изменён с "${tempTask.status}" на "${newStatus}"`,
                        user: "Текущий пользователь"
                    });
                    tempTask.status = newStatus;
                    showNotification(`Статус изменён на "${newStatus}"`);
                }

                await updateTask(tempTask);

                await Promise.all(pendingHistory.map(entry =>
                    createHistory(tempTask.id, entry.change, entry.user)
                ));

                const originalExecutors = task.executors || [];
                const addedExecutors = tempTask.executors.filter(ex => !originalExecutors.includes(ex));
                const removedExecutors = originalExecutors.filter(ex => !tempTask.executors.includes(ex));

                console.log('Добавленные исполнители:', addedExecutors);
                console.log('Удалённые исполнители:', removedExecutors);

                await Promise.all([
                    ...removedExecutors.map(async executorName => {
                        const executor = executors.find(ex => ex.name === executorName);
                        if (executor) {
                            console.log('Удаление исполнителя:', executorName, 'ID:', executor.id);
                            await removeExecutorFromTask(tempTask.id, executor.id);
                        } else {
                            console.warn('Исполнитель не найден в executors:', executorName);
                        }
                    }),
                    ...addedExecutors.map(async executorName => {
                        const executor = executors.find(ex => ex.name === executorName);
                        if (executor) {
                            console.log('Добавление исполнителя:', executorName, 'ID:', executor.id);
                            await assignExecutorToTask(
                                tempTask.id,
                                executor.id,
                                { id: tempTask.id, project: tempTask.project, theme: tempTask.theme },
                                { id: executor.id, name: executor.name }
                            );
                        } else {
                            console.warn('Исполнитель не найден в executors:', executorName);
                        }
                    })
                ]);

                const taskIndex = tasks.findIndex(t => t.id === tempTask.id);
                if (taskIndex !== -1) {
                    tasks[taskIndex] = { ...tempTask };
                }

                executors.length = 0;
                historyCache = [];
                executors = await fetchExecutors();
                console.log('Исполнители после сохранения:', executors);
                if (filters.dateFrom && filters.dateTo) {
                    await fetchTasks(filters.dateFrom, filters.dateTo);
                } else {
                    tasks = [];
                    showNotification('Диапазон дат не указан, задачи не загружены');
                }
                applyFilters();

                console.log('Задача сохранена и синхронизирована:', tempTask);
                showNotification('Задача сохранена');
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                showNotification(`Не удалось сохранить задачу: ${error.message}`);
                executors = await fetchExecutors();
                console.log('Исполнители после ошибки сохранения:', executors);
                if (filters.dateFrom && filters.dateTo) {
                    await fetchTasks(filters.dateFrom, filters.dateTo);
                } else {
                    tasks = [];
                    showNotification('Диапазон дат не указан, задачи не загружены');
                }
                applyFilters();
            } finally {
                showLoading(modal.querySelector("#saveBtn"), false);
            }
        }, 0);
    });

    modal.addEventListener("click", (e) => {
        if (!modal.querySelector(".modal-content").contains(e.target)) {
            closeModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";
    loadingOverlay.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loadingOverlay);

    try {
        executors = await fetchExecutors();
        console.log('Инициализация: Полученные исполнители:', executors);
        if (!executors.length) {
            showNotification('Не удалось загрузить список исполнителей');
        }
        createInterface();
        showNotification('Пожалуйста, укажите диапазон дат для загрузки задач');
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showNotification(`Не удалось загрузить данные: ${error.message}`);
    } finally {
        loadingOverlay.remove();
    }
});