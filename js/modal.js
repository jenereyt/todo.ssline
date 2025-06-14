import { tasks, executors, filters, sortState } from './app.js';
import { createTaskCards } from './interface.js';
import { fetchExecutorsOnTasks, assignExecutorToTask, removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory } from './history.js';
import { fetchExecutors } from './executors.js';
import { showNotification, showLoading, formatDate, formatCommentDate } from './utils.js';
import { createTask, fetchTasks, updateTask } from './tasks.js';
import { createSubtask, updateSubtask, deleteSubtask } from './subtasks.js';

function getDeadlineClass(deadline, statusOrDone) {
    if (typeof statusOrDone === 'string') {
        if (statusOrDone === 'Выполнено' || statusOrDone === 'Принято заказчиком') {
            return 'deadline-green';
        }
        if (statusOrDone === 'Аннулировано') {
            return 'deadline-gray';
        }
    } else if (statusOrDone === true) {
        return 'deadline-green';
    }
    if (!deadline) return '';
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 2) return 'deadline-red';
    if (daysLeft <= 7) return 'deadline-yellow';
    return '';
}

function getHistoryClass(change) {
    if (change.includes('комментарий')) return 'history-comment';
    if (change.includes('статус подзадачи')) return 'history-subtask-status';
    if (change.includes('статус')) return 'history-status';
    if (change.includes('исполнитель')) return 'history-executor';
    if (change.includes('описание подзадачи')) return 'history-subtask-description';
    if (change.includes('срок выполнения')) return 'history-deadline';
    if (change.includes('дата постановки')) return 'history-dateSet';
    if (change.includes('файл')) return 'history-file';
    if (change.includes('подзадач')) return 'history-subtask';
    if (change.includes('проект')) return 'history-project';
    return 'history-other';
}

export function applyFilters() {
    try {
        const executorFilter = document.getElementById("executorFilter")?.value.toLowerCase() || '';
        const projectFilter = document.getElementById("projectFilter")?.value.toLowerCase() || '';
        const dateFrom = document.getElementById("dateFrom")?.value || '';
        const dateTo = document.getElementById("dateTo")?.value || '';

        if (!dateFrom || !dateTo) {
            tasks.length = 0;
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
            tasks.length = 0;
            createTaskCards([]);
        });
    } catch (error) {
        console.error('Ошибка в applyFilters:', error);
        showNotification('Ошибка при применении фильтров');
        tasks.length = 0;
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
    const task = taskId ? tasks.find(t => t.id === taskId) : {
        id: null,
        dateSet: formatDate(new Date()),
        project: '',
        theme: '',
        description: '',
        status: 'OPEN',
        deadline: '',
        executors: [],
        files: [],
        history: [],
        subtasks: []
    };
    if (!task && taskId) {
        console.error('Задача не найдена:', taskId);
        showNotification('Задача не найдена');
        return;
    }
    console.log('Открытие модалки для задачи:', task);

    const modal = document.createElement('div');
    modal.className = 'modal trello-style-modal';

    const tempTask = JSON.parse(JSON.stringify(task));
    tempTask.files = tempTask.files || [];
    tempTask.executors = tempTask.executors || [];
    tempTask.history = tempTask.history || [];
    tempTask.deadline = tempTask.deadline || '';
    tempTask.subtasks = tempTask.subtasks || [];
    const pendingHistory = [];

    const statuses = ['Принято', 'Выполнено', 'Принято заказчиком', 'Аннулировано', 'Возвращен'];

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <div class="editable-field">
                    <h2 id="projectDisplay">${tempTask.project || 'Без проекта'}</h2>
                    <input type="text" id="editProject" value="${tempTask.project || ''}" class="hidden">
                </div>
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
                            <span id="themeDisplay">${tempTask.theme || 'Нет темы'}</span>
                            <input type="text" id="editTheme" value="${tempTask.theme || ''}" class="hidden">
                        </div>
                    </div>
                    <div class="section">
                        <h3>Описание</h3>
                        <div class="editable-field">
                            <span id="descriptionDisplay">${tempTask.description || 'Нет описания'}</span>
                            <textarea id="editDescription" class="hidden">${tempTask.description || ''}</textarea>
                        </div>
                    </div>
                    <div class="section">
                        <h3>Дата постановки</h3>
                        <div class="editable-field">
                            <span id="dateSetDisplay">${tempTask.dateSet || 'Не указана'}</span>
                            <input type="date" id="editDateSet" value="${tempTask.dateSet || ''}" class="hidden">
                        </div>
                    </div>
                    <div class="section">
                        <h3>Срок выполнения</h3>
                        <div class="editable-field">
                            <span id="deadlineDisplay" class="${getDeadlineClass(tempTask.deadline, tempTask.status)}">${tempTask.deadline || 'Не указан'}</span>
                            <input type="date" id="editDeadline" value="${tempTask.deadline || ''}" class="hidden">
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
                                    <input type="text" class="subtask-description" value="${sub.description || ''}" placeholder="Описание подзадачи">
                                    <input type="date" class="subtask-dateSet" value="${sub.dateSet || ''}">
                                    <input type="date" class="subtask-deadline ${getDeadlineClass(sub.deadline, sub.done)}" value="${sub.deadline || ''}">
                                    <select class="subtask-executor">
                                        <option value="">Не назначен</option>
                                        ${executors.map(ex => `
                                            <option value="${ex.id}" ${sub.executorId === ex.id ? 'selected' : ''}>${ex.name}</option>
                                        `).join('')}
                                    </select>
                                    <input type="checkbox" class="subtask-done" ${sub.done ? 'checked' : ''}>
                                    <button class="remove-subtask" data-index="${index}" data-id="${sub.id}"><img src="./image/x_icon.svg" alt="Удалить"></button>
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
                            `).join('') : 'Нет файлов'}
                        </div>
                    </div>
                </div>
                <div class="tab-content hidden" id="historyTab">
                    <div class="section">
                        <h3>История</h3>
                        <div id="historyList">
                            ${tempTask.history.length ? tempTask.history.map(entry => `
                                <div class="history-item ${getHistoryClass(entry.change)}" data-id="${entry.id || 'temp-' + Math.random()}">
                                    <span class="history-date">${entry.date}</span>
                                    <span class="history-change">${entry.change}</span>
                                    <span class="history-user">${entry.user}</span>
                                </div>
                            `).join('') : 'Нет истории изменений'}
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

    // Переключение вкладок
    modal.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            modal.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
            modal.querySelector(`#${btn.dataset.tab}Tab`).classList.remove('hidden');
        });
    });

    // Редактирование проекта
    const projectDisplay = modal.querySelector('#projectDisplay');
    const projectInput = modal.querySelector('#editProject');

    if (projectDisplay && projectInput) {
        projectDisplay.addEventListener('dblclick', e => {
            e.stopPropagation();
            projectDisplay.classList.add('hidden');
            projectInput.classList.remove('hidden');
            projectInput.focus();
        });

        projectInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const oldValue = tempTask.project;
                tempTask.project = projectInput.value.trim();
                projectDisplay.textContent = tempTask.project || 'Без проекта';
                projectDisplay.classList.remove('hidden');
                projectInput.classList.add('hidden');
                if (oldValue !== tempTask.project) {
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Проект изменён с "${oldValue || 'не указан'}" на "${tempTask.project || 'не указан'}"`,
                        user: 'Текущий пользователь'
                    });
                    updateHistoryList();
                    showNotification('Проект обновлён');
                }
            }
        });

        projectInput.addEventListener('blur', () => {
            const oldValue = tempTask.project;
            tempTask.project = projectInput.value.trim();
            projectDisplay.textContent = tempTask.project || 'Без проекта';
            projectDisplay.classList.remove('hidden');
            projectInput.classList.add('hidden');
            if (oldValue !== tempTask.project) {
                pendingHistory.push({
                    date: formatCommentDate(new Date()),
                    rawDate: new Date().toISOString(),
                    change: `Проект изменён с "${oldValue || 'не указан'}" на "${tempTask.project || 'не указан'}"`,
                    user: 'Текущий пользователь'
                });
                updateHistoryList();
                showNotification('Проект обновлён');
            }
        });
    }

    // Редактирование остальных полей
    ['theme', 'description', 'deadline', 'dateSet'].forEach(field => {
        const display = modal.querySelector(`#${field}Display`);
        const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);

        if (display && input) {
            display.addEventListener('dblclick', e => {
                e.stopPropagation();
                display.classList.add('hidden');
                input.classList.remove('hidden');
                input.focus();
            });

            if (field === 'deadline' || field === 'dateSet') {
                const saveDate = () => {
                    const oldValue = tempTask[field];
                    tempTask[field] = input.value;
                    display.textContent = tempTask[field] || 'Не указан';
                    display.classList.remove('hidden');
                    input.classList.add('hidden');
                    if (oldValue !== tempTask[field]) {
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `${field === 'deadline' ? 'Срок выполнения' : 'Дата постановки'} изменён${field === 'deadline' ? '' : 'а'} с "${oldValue || 'не указан'}" на "${tempTask[field] || 'не указан'}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                        showNotification(`${field === 'deadline' ? 'Срок выполнения' : 'Дата постановки'} обновлён${field === 'deadline' ? '' : 'а'}`);
                    }
                };

                input.addEventListener('keypress', e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveDate();
                    }
                });

                input.addEventListener('blur', e => {
                    if (!modal.contains(e.relatedTarget) || e.relatedTarget !== input) {
                        saveDate();
                    }
                });
            } else {
                input.addEventListener('keypress', e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const oldValue = tempTask[field];
                        tempTask[field] = input.value.trim();
                        display.textContent = tempTask[field] || (field === 'theme' ? 'Нет темы' : 'Нет описания');
                        display.classList.remove('hidden');
                        input.classList.add('hidden');
                        if (oldValue !== tempTask[field]) {
                            pendingHistory.push({
                                date: formatCommentDate(new Date()),
                                rawDate: new Date().toISOString(),
                                change: `${field === 'theme' ? 'Тема' : 'Описание'} изменено с "${oldValue || 'не указано'}" на "${tempTask[field] || 'не указано'}"`,
                                user: 'Текущий пользователь'
                            });
                            updateHistoryList();
                            showNotification(`${field === 'theme' ? 'Тема' : 'Описание'} обновлено`);
                        }
                    }
                });

                input.addEventListener('blur', () => {
                    const oldValue = tempTask[field];
                    tempTask[field] = input.value.trim();
                    display.textContent = tempTask[field] || (field === 'theme' ? 'Нет темы' : 'Нет описания');
                    display.classList.remove('hidden');
                    input.classList.add('hidden');
                    if (oldValue !== tempTask[field]) {
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `${field === 'theme' ? 'Тема' : 'Описание'} изменено с "${oldValue || 'не указано'}" на "${tempTask[field] || 'не указано'}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                        showNotification(`${field === 'theme' ? 'Тема' : 'Описание'} обновлено`);
                    }
                });
            }
        }
    });

    // Обновление списка подзадач
    async function updateSubtaskList() {
        const subtaskList = modal.querySelector('#subtaskList');
        subtaskList.innerHTML = tempTask.subtasks.length ? tempTask.subtasks.map((sub, index) => `
            <div class="subtask-item" data-id="${sub.id}">
                <input type="text" class="subtask-description" value="${sub.description || ''}" placeholder="Описание подзадачи">
                <input type="date" class="subtask-dateSet" value="${sub.dateSet || ''}">
                <input type="date" class="subtask-deadline ${getDeadlineClass(sub.deadline, sub.done)}" value="${sub.deadline || ''}">
                <select class="subtask-executor">
                    <option value="">Не назначен</option>
                    ${executors.map(ex => `
                        <option value="${ex.id}" ${sub.executorId === ex.id ? 'selected' : ''}>${ex.name}</option>
                    `).join('')}
                </select>
                <input type="checkbox" class="subtask-done" ${sub.done ? 'checked' : ''}>
                <button class="remove-subtask" data-index="${index}" data-id="${sub.id}"><img src="./image/x_icon.svg" alt="Удалить"></button>
            </div>
        `).join('') : '<p>Нет подзадач</p>';

        subtaskList.querySelectorAll('.subtask-item').forEach(item => {
            const index = parseInt(item.querySelector('.remove-subtask').dataset.index);
            const subtaskId = item.querySelector('.remove-subtask').dataset.id;
            const descriptionInput = item.querySelector('.subtask-description');
            const dateSetInput = item.querySelector('.subtask-dateSet');
            const deadlineInput = item.querySelector('.subtask-deadline');
            const executorSelect = item.querySelector('.subtask-executor');
            const doneInput = item.querySelector('.subtask-done');

            descriptionInput.addEventListener('change', async () => {
                const oldDescription = tempTask.subtasks[index].description;
                tempTask.subtasks[index].description = descriptionInput.value.trim();
                if (oldDescription !== tempTask.subtasks[index].description) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Описание подзадачи ${index + 1} изменено с "${oldDescription || 'не указано'}" на "${tempTask.subtasks[index].description || 'не указано'}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                        showNotification('Описание подзадачи обновлено');
                    } catch (error) {
                        tempTask.subtasks[index].description = oldDescription;
                        updateSubtaskList();
                    }
                }
            });

            dateSetInput.addEventListener('change', async () => {
                const oldDateSet = tempTask.subtasks[index].dateSet;
                tempTask.subtasks[index].dateSet = dateSetInput.value;
                if (oldDateSet !== tempTask.subtasks[index].dateSet) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Дата постановки подзадачи ${index + 1} изменена с "${oldDateSet || 'не указана'}" на "${tempTask.subtasks[index].dateSet || 'не указана'}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                        showNotification('Дата постановки подзадачи обновлена');
                    } catch (error) {
                        tempTask.subtasks[index].dateSet = oldDateSet;
                        updateSubtaskList();
                    }
                }
            });

            deadlineInput.addEventListener('change', async () => {
                const oldDeadline = tempTask.subtasks[index].deadline;
                tempTask.subtasks[index].deadline = deadlineInput.value;
                if (oldDeadline !== tempTask.subtasks[index].deadline) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Дедлайн подзадачи ${index + 1} изменён с "${oldDeadline || 'не указан'}" на "${tempTask.subtasks[index].deadline || 'не указан'}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                        showNotification('Дедлайн подзадачи обновлён');
                    } catch (error) {
                        tempTask.subtasks[index].deadline = oldDeadline;
                        updateSubtaskList();
                    }
                }
            });

            executorSelect.addEventListener('change', async () => {
                const oldExecutorId = tempTask.subtasks[index].executorId;
                const newExecutorId = executorSelect.value ? parseInt(executorSelect.value) : null;
                tempTask.subtasks[index].executorId = newExecutorId;
                tempTask.subtasks[index].executorName = executors.find(ex => ex.id === newExecutorId)?.name || 'Не назначен';
                if (oldExecutorId !== newExecutorId) {
                    try {
                        await updateSubtask(subtaskId, { ...tempTask.subtasks[index], taskId: tempTask.id });
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `Исполнитель подзадачи ${index + 1} изменён с "${executors.find(ex => ex.id === oldExecutorId)?.name || 'не назначен'}" на "${tempTask.subtasks[index].executorName}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                        showNotification('Исполнитель подзадачи обновлён');
                    } catch (error) {
                        tempTask.subtasks[index].executorId = oldExecutorId;
                        tempTask.subtasks[index].executorName = executors.find(ex => ex.id === oldExecutorId)?.name || 'Не назначен';
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
                            user: 'Текущий пользователь'
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
                        change: `Удалена подзадача: "${removedSubtask.description || 'без описания'}"`,
                        user: 'Текущий пользователь'
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

    // Обновление списка исполнителей
    async function updateExecutorList() {
        try {
            const executorList = modal.querySelector('#executorList');
            executorList.innerHTML = '';
            console.log('Обновление списка исполнителей в модалке:', tempTask.executors);
            if (tempTask.executors.length) {
                tempTask.executors.forEach(ex => {
                    const executorItem = document.createElement('span');
                    executorItem.className = 'executor-item';
                    executorItem.innerHTML = `
                        <span class="executor-name">${ex}</span>
                        <button class="remove-executor" data-executor="${ex}">×</button>
                    `;
                    executorList.appendChild(executorItem);
                });
            } else {
                const noExecutors = document.createElement('span');
                noExecutors.textContent = 'Не назначены';
                executorList.appendChild(noExecutors);
            }

            const addButton = document.createElement('button');
            addButton.className = 'add-executor-btn';
            addButton.innerHTML = `<img src="./image/plus.svg" style="width: 16px; height: 16px;" alt="Добавить">`;
            executorList.appendChild(addButton);

            addButton.addEventListener('click', e => {
                e.stopPropagation();
                if (!executorList.querySelector('#addExecutorSelect')) {
                    const availableExecutors = executors.map(ex => ex.name).filter(ex => !tempTask.executors.includes(ex)).sort();
                    console.log('Доступные исполнители для добавления:', availableExecutors);
                    if (!availableExecutors.length) {
                        showNotification('Нет доступных исполнителей для добавления');
                        return;
                    }
                    const selectWrapper = document.createElement('span');
                    selectWrapper.className = 'executor-item';
                    selectWrapper.innerHTML = `
                        <select id="addExecutorSelect">
                            <option value="">Выберите исполнителя</option>
                            ${availableExecutors.map(ex => `
                                <option value="${ex}">${ex}</option>
                            `).join('')}
                        </select>
                        <button class="cancel-add-executor">×</button>
                    `;
                    executorList.replaceChild(selectWrapper, addButton);

                    const addExecutorSelect = selectWrapper.querySelector('#addExecutorSelect');
                    addExecutorSelect.addEventListener('change', e => {
                        e.stopPropagation();
                        const executorName = addExecutorSelect.value;
                        if (executorName && !tempTask.executors.includes(executorName)) {
                            tempTask.executors.push(executorName);
                            pendingHistory.push({
                                date: formatCommentDate(new Date()),
                                rawDate: new Date().toISOString(),
                                change: `Добавлен исполнитель: "${executorName}"`,
                                user: 'Текущий пользователь'
                            });
                            updateHistoryList();
                            updateExecutorList();
                            showNotification(`Исполнитель "${executorName}" добавлен`);
                        }
                    });

                    selectWrapper.querySelector('.cancel-add-executor').addEventListener('click', e => {
                        e.stopPropagation();
                        executorList.replaceChild(addButton, selectWrapper);
                    });
                }
            });

            executorList.querySelectorAll('.remove-executor').forEach(btn => {
                btn.addEventListener('click', e => {
                    e.stopPropagation();
                    const executorName = btn.dataset.executor;
                    tempTask.executors = tempTask.executors.filter(ex => ex !== executorName);
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Удалён исполнитель: "${executorName}"`,
                        user: 'Текущий пользователь'
                    });
                    updateHistoryList();
                    updateExecutorList();
                    showNotification(`Исполнитель "${executorName}" удалён`);
                });
            });

            executorList.querySelectorAll('.executor-name').forEach(span => {
                span.addEventListener('dblclick', e => {
                    e.stopPropagation();
                    const oldExecutorName = span.textContent;
                    const executorItem = span.parentElement;

                    const availableExecutors = executors.map(ex => ex.name).filter(ex => !tempTask.executors.includes(ex) || ex === oldExecutorName).sort();
                    if (!availableExecutors.length) {
                        showNotification('Нет доступных исполнителей для замены');
                        return;
                    }

                    const select = document.createElement('select');
                    select.innerHTML = `
                        <option value="">Выберите исполнителя</option>
                        ${availableExecutors.map(ex => `
                            <option value="${ex}" ${ex === oldExecutorName ? 'selected' : ''}>${ex}</option>
                        `).join('')}
                    `;
                    executorItem.replaceChild(select, span);
                    select.focus();

                    select.addEventListener('change', e => {
                        e.stopPropagation();
                        const newExecutorName = select.value;
                        if (newExecutorName && newExecutorName !== oldExecutorName && !tempTask.executors.includes(newExecutorName)) {
                            const index = tempTask.executors.indexOf(oldExecutorName);
                            tempTask.executors[index] = newExecutorName;
                            pendingHistory.push({
                                date: formatCommentDate(new Date()),
                                rawDate: new Date().toISOString(),
                                change: `Исполнитель изменён с "${oldExecutorName}" на "${newExecutorName}"`,
                                user: 'Текущий пользователь'
                            });
                            updateHistoryList();
                            updateExecutorList();
                            showNotification(`Исполнитель изменён на "${newExecutorName}"`);
                        }
                    });

                    select.addEventListener('blur', () => {
                        updateExecutorList();
                    });
                });
            });
        } catch (error) {
            console.error('Ошибка в updateExecutorList:', error);
            showNotification('Ошибка при обновлении списка исполнителей');
        }
    }

    // Обновление списка истории
    async function updateHistoryList() {
        try {
            const historyList = modal.querySelector('#historyList');
            const combinedHistory = [
                ...tempTask.history,
                ...pendingHistory
            ].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
            historyList.innerHTML = combinedHistory.length ? combinedHistory.map(entry => `
                <div class="history-item ${getHistoryClass(entry.change)}" data-id="${entry.id || 'temp-' + Math.random()}">
                    <span class="history-date">${entry.date}</span>
                    <span class="history-change">${entry.change}</span>
                    <span class="history-user">${entry.user}</span>
                </div>
            `).join('') : 'Нет истории изменений';
        } catch (error) {
            console.error('Ошибка в updateHistoryList:', error);
            showNotification('Ошибка при обновлении истории');
        }
    }

    updateExecutorList();
    updateSubtaskList();

    // Добавление подзадачи
    modal.querySelector('#addSubtaskBtn').addEventListener('click', async e => {
        e.preventDefault();
        try {
            const newSubtask = {
                taskId: tempTask.id,
                description: 'Новая подзадача',
                dateSet: formatDate(new Date()),
                deadline: null, // Explicitly set to null to avoid invalid dates
                done: false,
                executorId: null,
                executorName: 'Не назначен'
            };
            const createdSubtask = await createSubtask(tempTask.id, newSubtask);
            tempTask.subtasks.push(createdSubtask);
            pendingHistory.push({
                date: formatCommentDate(new Date()),
                rawDate: new Date().toISOString(),
                change: `Добавлена новая подзадача: "${createdSubtask.description || 'без описания'}"`,
                user: 'Текущий пользователь'
            });
            updateHistoryList();
            updateSubtaskList();
            showNotification('Подзадача добавлена');
        } catch (error) {
            console.error('Ошибка при добавлении подзадачи:', error);
            showNotification('Не удалось добавить подзадачу');
        }
    });

    // Добавление комментария
    const newCommentTextarea = modal.querySelector('#newComment');
    if (newCommentTextarea) {
        newCommentTextarea.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const commentText = newCommentTextarea.value.trim();
                if (commentText) {
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Добавлен комментарий: "${commentText}"`,
                        user: 'Текущий пользователь'
                    });
                    updateHistoryList();
                    newCommentTextarea.value = '';
                    showNotification('Комментарий добавлен');
                }
            }
        });
    }

    // Закрытие модального окна
    const closeModal = () => {
        if (pendingHistory.length || JSON.stringify(tempTask) !== JSON.stringify(task)) {
            showNotification('Изменения сохранены локально');
        }
        modal.remove();
    };

    modal.querySelector('#closeModalBtn').addEventListener('click', closeModal);
    modal.querySelector('#closeBtn').addEventListener('click', closeModal);

    // Сохранение изменений
    modal.querySelector('#saveBtn').addEventListener('click', e => {
        e.stopPropagation();
        showLoading(modal.querySelector('#saveBtn'), true);
        modal.remove();

        setTimeout(async () => {
            try {
                const newStatus = modal.querySelector('#statusSelect').value;
                if (tempTask.status !== newStatus) {
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Статус изменён с "${tempTask.status}" на "${newStatus}"`,
                        user: 'Текущий пользователь'
                    });
                    tempTask.status = newStatus;
                    showNotification(`Статус изменён на "${newStatus}"`);
                }

                let updatedTask;
                if (!tempTask.id) {
                    updatedTask = await createTask(tempTask);
                    tempTask.id = updatedTask.id;
                    tasks.push(tempTask);
                } else {
                    updatedTask = await updateTask(tempTask);
                    const taskIndex = tasks.findIndex(t => t.id === tempTask.id);
                    if (taskIndex !== -1) {
                        tasks[taskIndex] = { ...tempTask };
                    }
                }

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
                executors.push(...await fetchExecutors());
                console.log('Исполнители после сохранения:', executors);
                if (filters.dateFrom && filters.dateTo) {
                    await fetchTasks(filters.dateFrom, filters.dateTo);
                } else {
                    tasks.length = 0;
                    showNotification('Диапазон дат не указан, задачи не загружены');
                }
                applyFilters();

                console.log('Задача сохранена и синхронизирована:', tempTask);
                showNotification(tempTask.id ? 'Задача сохранена' : 'Задача создана');
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                showNotification(`Не удалось сохранить задачу: ${error.message}`);
                executors.length = 0;
                executors.push(...await fetchExecutors());
                console.log('Исполнители после ошибки сохранения:', executors);
                if (filters.dateFrom && filters.dateTo) {
                    await fetchTasks(filters.dateFrom, filters.dateTo);
                } else {
                    tasks.length = 0;
                    showNotification('Диапазон дат не указан, задачи не загружены');
                }
                applyFilters();
            } finally {
                showLoading(modal.querySelector('#saveBtn'), false);
            }
        }, 0);
    });

    modal.addEventListener('click', e => {
        if (!modal.querySelector('.modal-content').contains(e.target)) {
            closeModal();
        }
    });
}