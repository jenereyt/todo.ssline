import { createTable, createInterface } from './interface.js';
import { fetchExecutors } from './executors.js';
import { fetchExecutorsOnTasks, assignExecutorToTask, removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory, fetchHistory } from './history.js';

export let tasks = [];
export let executors = [];
export let filters = {};
export let sortState = { field: null, ascending: true };
export let allProjects = [];
export const paginationState = {
    currentPage: 1,
    tasksPerPage: 20
};

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
    return new Date(localDate).toISOString();
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

        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color:rgb(158, 255, 231);
                    color: #333;
                    padding: 10px 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    z-index: 1000;
                }
                .notification.show {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

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

async function fetchTasks() {
    const url = 'http://servtodo.ssline.uz/tasks';
    console.log('Запрос задач:', url);
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
            history: []
        }));
        await syncExecutorsOnTasks();
        await syncFiles();
        await syncHistory();
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
    const url = 'http://servtodo.ssline.uz/files';
    console.log('Запрос файлов:', url);
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
        console.log('Полученные файлы:', data);
        return data.map(file => ({
            id: file.id,
            taskId: file.taskId,
            name: file.name,
            url: `http://servtodo.ssline.uz/files/${file.id}`
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
        const executorMap = new Map();
        relations.forEach(rel => {
            if (!executorMap.has(rel.taskId)) {
                executorMap.set(rel.taskId, []);
            }
            executorMap.get(rel.taskId).push(rel.executor.name);
        });
        tasks.forEach(task => {
            task.executors = executorMap.get(task.id) || [];
        });
        console.log('Исполнители синхронизированы:', tasks.map(t => ({ id: t.id, executors: t.executors })));
    } catch (error) {
        console.error('Ошибка синхронизации исполнителей:', error);
    }
}

async function syncHistory() {
    try {
        historyCache = await fetchHistory();
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
    }
}

async function updateTask(task) {
    const url = `http://servtodo.ssline.uz/tasks/${task.id}`;
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
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        const updatedTask = await response.json();
        console.log('Обновлённая задача:', updatedTask);
        return updatedTask;
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        throw error;
    }
}

function updateDerivedData() {
    allProjects = [...new Set(tasks.map(task => task.project))];
}

export function getAllExecutors() {
    console.log('Доступные исполнители:', executors);
    return executors.map(ex => ex.name).sort();
}

export function applyFilters() {
    try {
        const executorFilter = document.getElementById("executorFilter")?.value.toLowerCase() || '';
        const projectFilter = document.getElementById("projectFilter")?.value.toLowerCase() || '';
        const dateFrom = document.getElementById("dateFrom")?.value || '';
        const dateTo = document.getElementById("dateTo")?.value || '';

        let filteredTasks = tasks.filter(task => {
            const matchesExecutors = !executorFilter || task.executors.some(ex => ex.toLowerCase().includes(executorFilter));
            const matchesProject = !projectFilter || (task.project && task.project.toLowerCase().includes(projectFilter));
            const matchesDateFrom = !dateFrom || task.dateSet >= dateFrom;
            const matchesDateTo = !dateTo || task.dateSet <= dateTo;

            return matchesExecutors && matchesProject && matchesDateFrom && matchesDateTo;
        });

        sortTasks(filteredTasks);
        console.log('Обновление таблицы с задачами:', filteredTasks);
        createTable(filteredTasks);
    } catch (error) {
        console.error('Ошибка в applyFilters:', error);
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
    const pendingHistory = [];

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <h2>${tempTask.project || "Без проекта"}</h2>
                <span class="date-set">Дата постановки: ${tempTask.dateSet || "Не указана"}</span>
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
                <button class="tab-btn" data-tab="extras">Дополнения к задаче</button>
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
                    <div class="section comment-section">
                        <h3>Комментарий</h3>
                        <div class="comment-wrapper">
                            <textarea id="newComment" placeholder="Введите комментарий"></textarea>
                        </div>
                        <button id="addComment">Добавить</button>
                    </div>
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
                <div class="tab-content hidden" id="extrasTab">
                    <div class="section">
                        <h3>Исполнители</h3>
                        <div id="executorList" class="executor-list"></div>
                    </div>
                    <div class="section">
                        <h3>Срок выполнения</h3>
                        <div class="editable-field">
                            <span id="deadlineDisplay">${tempTask.deadline || "Не указан"}</span>
                            <input type="date" id="editDeadline" value="${tempTask.deadline || ""}" class="hidden">
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
        if (change.includes('статус')) return 'history-status';
        if (change.includes('исполнитель')) return 'history-executor';
        if (change.includes('тема')) return 'history-theme';
        if (change.includes('описание')) return 'history-description';
        if (change.includes('срок выполнения')) return 'history-deadline';
        if (change.includes('файл')) return 'history-file';
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

    ["theme", "description", "deadline"].forEach(field => {
        const display = modal.querySelector(`#${field}Display`);
        const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);

        if (display && input) {
            display.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                display.classList.add("hidden");
                input.classList.remove("hidden");
                input.focus();
            });

            if (field === "deadline") {
                input.addEventListener("change", () => {
                    const oldValue = tempTask[field];
                    tempTask[field] = input.value;
                    display.textContent = tempTask[field] || "Не указан";
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                    if (oldValue !== tempTask[field]) {
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Срок выполнения изменён с "${oldValue || "не указан"}" на "${tempTask[field] || "не указан"}"`,
                            user: "Текущий пользователь"
                        });
                        updateHistoryList();
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
                    }
                });
            }
        }
    });

    const executorList = modal.querySelector("#executorList");
    async function updateExecutorList() {
        try {
            executorList.innerHTML = '';
            tempTask.executors.forEach(ex => {
                const executorItem = document.createElement("span");
                executorItem.className = "executor-item";
                executorItem.innerHTML = `
                    <span class="executor-name">${ex}</span>
                    <button class="remove-executor" data-executor="${ex}">×</button>
                `;
                executorList.appendChild(executorItem);
            });

            if (!tempTask.executors.length) {
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
                    const selectWrapper = document.createElement("span");
                    selectWrapper.className = "executor-item";
                    selectWrapper.innerHTML = `
                        <select id="addExecutorSelect">
                            <option value="">Выберите исполнителя</option>
                            ${getAllExecutors().filter(ex => !tempTask.executors.includes(ex)).map(ex => `
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
                });
            });

            executorList.querySelectorAll(".executor-name").forEach(span => {
                span.addEventListener("dblclick", (e) => {
                    e.stopPropagation();
                    const oldExecutorName = span.textContent;
                    const executorItem = span.parentElement;

                    const select = document.createElement("select");
                    select.innerHTML = `
                        <option value="">Выберите исполнителя</option>
                        ${getAllExecutors().filter(ex => !tempTask.executors.includes(ex) || ex === oldExecutorName).map(ex => `
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
                        }
                    });

                    select.addEventListener("blur", () => {
                        updateExecutorList();
                    });
                });
            });
        } catch (error) {
            console.error('Ошибка в updateExecutorList:', error);
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
        }
    }

    updateExecutorList();

    const addCommentBtn = modal.querySelector("#addComment");
    const newCommentTextarea = modal.querySelector("#newComment");

    if (addCommentBtn) {
        addCommentBtn.addEventListener("click", (e) => {
            e.stopPropagation();
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
            }
        });
    }

    const closeModal = () => {
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

                executors.length = 0;
                historyCache = [];
                executors = await fetchExecutors();
                await fetchTasks();
                applyFilters();

                console.log('Задача сохранена и синхронизирована:', tempTask);
                showNotification('Задача сохранена');
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                showNotification(`Не удалось сохранить задачу: ${error.message}`);
                executors = await fetchExecutors();
                await fetchTasks();
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
        await fetchTasks();
        createInterface();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showNotification(`Не удалось загрузить данные: ${error.message}`);
    } finally {
        loadingOverlay.remove();
    }
});