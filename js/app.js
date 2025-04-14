import { createTable, createInterface } from './interface.js';
import { fetchExecutors } from './executors.js';
import { fetchExecutorsOnTasks, assignExecutorToTask, removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory, fetchHistory, updateHistory } from './history.js';

export let tasks = [];
export let executors = [];
export let filters = {};
export let sortState = { field: null, ascending: true };
export let allProjects = [];
export const paginationState = {
    currentPage: 1,
    tasksPerPage: 20
};

// Функция для преобразования ISO-даты в формат YYYY-MM-DD
function formatDate(isoDate) {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
}

// Функция для преобразования ISO-даты в формат DD.MM.YYYY для комментариев и истории
function formatCommentDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}

// Функция для преобразования YYYY-MM-DD в ISO-дату
function toISODate(localDate) {
    if (!localDate) return null;
    return new Date(localDate).toISOString();
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
            executors: [], // Будут заполнены из /executors-on-task
            files: task.files ? task.files.map(f => ({
                name: f.name,
                url: f.url
            })) : [],
            comments: task.comments ? task.comments.map(c => ({
                text: c.text,
                date: formatCommentDate(c.date)
            })) : [],
            history: [] // Будут заполнены из /history
        }));
        await syncExecutorsOnTasks();
        await syncHistory();
        updateDerivedData();
        return tasks;
    } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
        alert(`Не удалось загрузить задачи: ${error.message}`);
        return [];
    }
}

async function syncExecutorsOnTasks() {
    const relations = await fetchExecutorsOnTasks();
    tasks.forEach(task => {
        task.executors = relations
            .filter(rel => rel.taskId === task.id)
            .map(rel => rel.executor.name);
    });
}

async function syncHistory() {
    const historyRecords = await fetchHistory();
    tasks.forEach(task => {
        task.history = historyRecords
            .filter(record => record.taskId === task.id)
            .map(record => ({
                id: record.id,
                date: formatCommentDate(record.date),
                change: record.change,
                user: record.user
            }));
    });
}

async function updateTask(task) {
    const url = `http://servtodo.ssline.uz/tasks/${task.id}`;
    console.log('Обновление задачи:', task.id, url);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateSet: toISODate(task.dateSet),
                project: task.project,
                theme: task.theme,
                description: task.description,
                status: task.status,
                deadline: toISODate(task.deadline)
            })
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const updatedTask = await response.json();
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                dateSet: formatDate(updatedTask.dateSet),
                project: updatedTask.project,
                theme: updatedTask.theme,
                description: updatedTask.description,
                status: updatedTask.status,
                deadline: formatDate(updatedTask.deadline)
            };
        }
        return updatedTask;
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error);
        alert('Не удалось сохранить изменения на сервере.');
        throw error;
    }
}

function updateDerivedData() {
    allProjects = [...new Set(tasks.map(task => task.project))];
}

export function getAllExecutors() {
    return executors.map(ex => ex.name).sort();
}

export function applyFilters() {
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
    paginationState.currentPage = 1;
    createTable(filteredTasks);
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

export function openEditModal(task) {
    const modal = document.createElement("div");
    modal.className = "modal trello-style-modal";

    task.comments = task.comments || [];
    task.files = task.files || [];
    task.executors = task.executors || [];
    task.history = task.history || [];
    task.deadline = task.deadline || "";

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];
    const lastComment = task.comments.length ? task.comments[task.comments.length - 1] : null;
    const lastCommentText = lastComment ? lastComment.text : "";

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <h2>${task.project || "Без проекта"}</h2>
                <span class="date-set">Дата постановки: ${task.dateSet || "Не указана"}</span>
                <div class="header-actions">
                    <span class="status-label">Статус:</span>
                    <select id="statusSelect">
                        ${statuses.map(status => `
                            <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
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
                            <span id="themeDisplay">${task.theme || "Нет темы"}</span>
                            <input type="text" id="editTheme" value="${task.theme || ""}" class="hidden">
                        </div>
                    </div>
                    <div class="section">
                        <h3>Описание</h3>
                        <div class="editable-field">
                            <span id="descriptionDisplay">${task.description || "Нет описания"}</span>
                            <textarea id="editDescription" class="hidden">${task.description || ""}</textarea>
                        </div>
                    </div>
                    <div class="section comment-section">
                        <h3>Комментарий</h3>
                        <div class="comment-wrapper">
                            <textarea id="newComment" placeholder=""></textarea>
                            <span id="lastCommentOverlay" class="last-comment-overlay">${lastCommentText || "Нет последнего комментария"}</span>
                        </div>
                        <button id="addComment">Добавить</button>
                    </div>
                    <div class="section">
                        <h3>Вложения</h3>
                        <div id="fileList">
                            ${task.files.length ? task.files.map(file => `
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
                            <span id="deadlineDisplay">${task.deadline || "Не указан"}</span>
                            <input type="date" id="editDeadline" value="${task.deadline || ""}" class="hidden">
                        </div>
                    </div>
                </div>
                <div class="tab-content hidden" id="historyTab">
                    <div class="section">
                        <h3>История</h3>
                        <div id="historyList">
                            ${task.history.length ? task.history.map((entry) => `
                                <div class="history-item" data-id="${entry.id}">
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

    const originalTask = JSON.parse(JSON.stringify(task));
    const originalExecutors = [...task.executors];

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
            display.addEventListener("dblclick", async (e) => {
                e.stopPropagation();
                display.classList.add("hidden");
                input.classList.remove("hidden");
                input.focus();
            });

            if (field === "deadline") {
                input.addEventListener("change", async () => {
                    const oldValue = task[field];
                    task[field] = input.value;
                    display.textContent = task[field] || "Не указан";
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                    if (oldValue !== task[field]) {
                        try {
                            await createHistory(
                                task.id,
                                `${field === "deadline" ? "Срок выполнения" : field} изменён с "${oldValue || "не указан"}" на "${task[field] || "не указан"}"`,
                                "Текущий пользователь"
                            );
                            await syncHistory();
                            updateHistoryList();
                        } catch (error) {
                            alert(`Не удалось записать изменение в историю: ${error.message}`);
                        }
                    }
                });
            } else {
                input.addEventListener("keypress", async (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const oldValue = task[field];
                        task[field] = input.value.trim();
                        display.textContent = task[field] || (field === "theme" ? "Нет темы" : "Нет описания");
                        display.classList.remove("hidden");
                        input.classList.add("hidden");
                        if (oldValue !== task[field]) {
                            try {
                                await createHistory(
                                    task.id,
                                    `${field === "theme" ? "Тема" : "Описание"} изменено с "${oldValue || "не указано"}" на "${task[field] || "не указано"}"`,
                                    "Текущий пользователь"
                                );
                                await syncHistory();
                                updateHistoryList();
                            } catch (error) {
                                alert(`Не удалось записать изменение в историю: ${error.message}`);
                            }
                        }
                    }
                });
            }

            input.addEventListener("blur", async () => {
                if (field !== "deadline") {
                    const oldValue = task[field];
                    task[field] = input.value.trim();
                    display.textContent = task[field] || (field === "theme" ? "Нет темы" : "Нет описания");
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                    if (oldValue !== task[field]) {
                        try {
                            await createHistory(
                                task.id,
                                `${field === "theme" ? "Тема" : "Описание"} изменено с "${oldValue || "не указано"}" на "${task[field] || "не указано"}"`,
                                "Текущий пользователь"
                            );
                            await syncHistory();
                            updateHistoryList();
                        } catch (error) {
                            alert(`Не удалось записать изменение в историю: ${error.message}`);
                        }
                    }
                }
            });
        }
    });

    const executorList = modal.querySelector("#executorList");
    async function updateExecutorList() {
        executorList.innerHTML = '';
        task.executors.forEach(ex => {
            const executorItem = document.createElement("span");
            executorItem.className = "executor-item";
            executorItem.innerHTML = `
                <span class="executor-name">${ex}</span>
                <button class="remove-executor" data-executor="${ex}">×</button>
            `;
            executorList.appendChild(executorItem);
        });

        if (!task.executors.length) {
            const noExecutors = document.createElement("span");
            noExecutors.textContent = "Не назначены";
            executorList.appendChild(noExecutors);
        }

        const addButton = document.createElement("button");
        addButton.className = "add-executor-btn";
        addButton.innerHTML = `<img src="./image/plus.svg" style="width: 16px; height: 16px;">`;
        executorList.appendChild(addButton);

        addButton.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!executorList.querySelector("#addExecutorSelect")) {
                const selectWrapper = document.createElement("span");
                selectWrapper.className = "executor-item";
                selectWrapper.innerHTML = `
                    <select id="addExecutorSelect">
                        <option value="">Выберите исполнителя</option>
                        ${getAllExecutors().filter(ex => !task.executors.includes(ex)).map(ex => `
                            <option value="${ex}">${ex}</option>
                        `).join("")}
                    </select>
                    <button class="cancel-add-executor">×</button>
                `;
                executorList.replaceChild(selectWrapper, addButton);

                const addExecutorSelect = selectWrapper.querySelector("#addExecutorSelect");
                addExecutorSelect.addEventListener("change", async (e) => {
                    e.stopPropagation();
                    const executorName = addExecutorSelect.value;
                    if (executorName && !task.executors.includes(executorName)) {
                        try {
                            const executor = executors.find(ex => ex.name === executorName);
                            if (!executor) throw new Error('Исполнитель не найден');
                            await assignExecutorToTask(
                                task.id,
                                executor.id,
                                { id: task.id, project: task.project, theme: task.theme },
                                { id: executor.id, name: executor.name }
                            );
                            task.executors.push(executorName);
                            await createHistory(
                                task.id,
                                `Добавлен исполнитель: "${executorName}"`,
                                "Текущий пользователь"
                            );
                            await syncHistory();
                            updateHistoryList();
                            await updateExecutorList();
                        } catch (error) {
                            alert(`Не удалось добавить исполнителя: ${error.message}`);
                        }
                    }
                });

                selectWrapper.querySelector(".cancel-add-executor").addEventListener("click", (e) => {
                    e.stopPropagation();
                    executorList.replaceChild(addButton, selectWrapper);
                });
            }
        });

        executorList.querySelectorAll(".remove-executor").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const executorName = btn.dataset.executor;
                try {
                    const executor = executors.find(ex => ex.name === executorName);
                    if (!executor) throw new Error('Исполнитель не найден');
                    await removeExecutorFromTask(task.id, executor.id);
                    task.executors = task.executors.filter(ex => ex !== executorName);
                    await createHistory(
                        task.id,
                        `Удалён исполнитель: "${executorName}"`,
                        "Текущий пользователь"
                    );
                    await syncHistory();
                    updateHistoryList();
                    await updateExecutorList();
                } catch (error) {
                    alert(`Не удалось удалить исполнителя: ${error.message}`);
                }
            });
        });

        executorList.querySelectorAll(".executor-name").forEach(span => {
            span.addEventListener("dblclick", async (e) => {
                e.stopPropagation();
                const oldExecutorName = span.textContent;
                const executorItem = span.parentElement;

                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="">Выберите исполнителя</option>
                    ${getAllExecutors().filter(ex => !task.executors.includes(ex) || ex === oldExecutorName).map(ex => `
                        <option value="${ex}" ${ex === oldExecutorName ? 'selected' : ''}>${ex}</option>
                    `).join("")}
                `;
                executorItem.replaceChild(select, span);
                select.focus();

                select.addEventListener("change", async (e) => {
                    e.stopPropagation();
                    const newExecutorName = select.value;
                    if (newExecutorName && newExecutorName !== oldExecutorName && !task.executors.includes(newExecutorName)) {
                        try {
                            const oldExecutor = executors.find(ex => ex.name === oldExecutorName);
                            const newExecutor = executors.find(ex => ex.name === newExecutorName);
                            if (!oldExecutor || !newExecutor) throw new Error('Исполнитель не найден');
                            await removeExecutorFromTask(task.id, oldExecutor.id);
                            await assignExecutorToTask(
                                task.id,
                                newExecutor.id,
                                { id: task.id, project: task.project, theme: task.theme },
                                { id: newExecutor.id, name: newExecutor.name }
                            );
                            const index = task.executors.indexOf(oldExecutorName);
                            task.executors[index] = newExecutorName;
                            await createHistory(
                                task.id,
                                `Исполнитель изменён с "${oldExecutorName}" на "${newExecutorName}"`,
                                "Текущий пользователь"
                            );
                            await syncHistory();
                            updateHistoryList();
                            await updateExecutorList();
                        } catch (error) {
                            alert(`Не удалось изменить исполнителя: ${error.message}`);
                        }
                    }
                });

                select.addEventListener("blur", () => {
                    updateExecutorList();
                });
            });
        });
    }
    updateExecutorList();

    const historyList = modal.querySelector("#historyList");
    function updateHistoryList() {
        historyList.innerHTML = task.history.length ? task.history.map((entry) => `
            <div class="history-item" data-id="${entry.id}">
                <span class="history-date">${entry.date}</span>
                <span class="history-change">${entry.change}</span>
                <span class="history-user">${entry.user}</span>
            </div>
        `).join("") : "Нет истории изменений";

        historyList.querySelectorAll(".history-item").forEach(item => {
            item.addEventListener("dblclick", async (e) => {
                e.stopPropagation();
                const id = item.dataset.id;
                const historyEntry = task.history.find(h => h.id == id);
                if (!historyEntry) return;

                const changeSpan = item.querySelector(".history-change");
                const userSpan = item.querySelector(".history-user");

                const changeInput = document.createElement("input");
                changeInput.type = "text";
                changeInput.value = historyEntry.change;
                changeInput.className = "edit-history-input";

                const userInput = document.createElement("input");
                userInput.type = "text";
                userInput.value = historyEntry.user;
                userInput.className = "edit-history-input";

                item.replaceChild(changeInput, changeSpan);
                item.replaceChild(userInput, userSpan);
                changeInput.focus();

                async function saveEdit() {
                    const newChange = changeInput.value.trim();
                    const newUser = userInput.value.trim();
                    if (newChange && newUser && (newChange !== historyEntry.change || newUser !== historyEntry.user)) {
                        try {
                            await updateHistory(id, task.id, newChange, newUser);
                            await syncHistory();
                            updateHistoryList();
                        } catch (error) {
                            alert(`Не удалось обновить запись истории: ${error.message}`);
                        }
                    } else {
                        updateHistoryList();
                    }
                }

                changeInput.addEventListener("blur", saveEdit, { once: true });
                userInput.addEventListener("blur", saveEdit, { once: true });
                changeInput.addEventListener("keypress", async (e) => {
                    if (e.key === "Enter") await saveEdit();
                });
                userInput.addEventListener("keypress", async (e) => {
                    if (e.key === "Enter") await saveEdit();
                });
            });
        });
    }
    updateHistoryList();

    const addCommentBtn = modal.querySelector("#addComment");
    const newCommentTextarea = modal.querySelector("#newComment");
    const lastCommentOverlay = modal.querySelector("#lastCommentOverlay");

    newCommentTextarea.addEventListener("input", () => {
        lastCommentOverlay.style.display = newCommentTextarea.value.trim() ? "none" : "block";
    });

    if (addCommentBtn) {
        addCommentBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const commentText = newCommentTextarea.value.trim();
            if (commentText) {
                const newComment = {
                    text: commentText,
                    date: formatCommentDate(new Date().toISOString())
                };
                task.comments.push(newComment);
                try {
                    await createHistory(
                        task.id,
                        `Добавлен комментарий: "${newComment.text}"`,
                        "Текущий пользователь"
                    );
                    await syncHistory();
                    updateHistoryList();
                    lastCommentOverlay.textContent = newComment.text;
                    lastCommentOverlay.style.display = "block";
                    newCommentTextarea.value = "";
                } catch (error) {
                    alert(`Не удалось записать комментарий в историю: ${error.message}`);
                }
            }
        });
    }

    const closeModal = () => {
        Object.assign(task, originalTask);
        task.executors = [...originalExecutors];
        modal.remove();
    };

    modal.querySelector("#closeModalBtn").addEventListener("click", closeModal);
    modal.querySelector("#closeBtn").addEventListener("click", closeModal);

    modal.querySelector("#saveBtn").addEventListener("click", async (e) => {
        e.stopPropagation();
        const newStatus = modal.querySelector("#statusSelect").value;
        if (task.status !== newStatus) {
            try {
                await createHistory(
                    task.id,
                    `Статус изменён с "${task.status}" на "${newStatus}"`,
                    "Текущий пользователь"
                );
                task.status = newStatus;
                await syncHistory();
                updateHistoryList();
            } catch (error) {
                alert(`Не удалось записать изменение статуса в историю: ${error.message}`);
            }
        }
        task.executors = task.executors.filter(ex => getAllExecutors().includes(ex));
        try {
            await updateTask(task);
            applyFilters();
            modal.remove();
        } catch (error) {
            // Ошибка уже обработана в updateTask
        }
    });

    modal.addEventListener("click", (e) => {
        if (!modal.querySelector(".modal-content").contains(e.target)) closeModal();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    executors = await fetchExecutors();
    await fetchTasks();
    createInterface();
});