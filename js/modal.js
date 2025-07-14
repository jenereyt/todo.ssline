import { tasks, executors, filters, sortState, customers } from './app.js';
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
    if (change.includes('заказчик')) return 'history-customer';
    return 'history-other';
}

export function applyFilters() {
    try {
        const executorFilter = document.getElementById('executorFilter')?.value?.toLowerCase() || '';
        const projectFilter = document.getElementById('projectFilter')?.value?.toLowerCase() || '';
        const customerFilter = document.getElementById('customerFilter')?.value?.toLowerCase() || '';
        const dateFrom = document.getElementById('dateFrom')?.value || '';
        const dateTo = document.getElementById('dateTo')?.value || '';

        if (!dateFrom || !dateTo) {
            tasks.length = 0;
            createTaskCards([]);
            showNotification('Пожалуйста, укажите диапазон дат для загрузки задач');
            return;
        }

        fetchTasks(dateFrom, dateTo)
            .then(() => {
                const filteredTasks = tasks.filter(task => {
                    const matchesExecutors = !executorFilter ||
                        (task.executors && task.executors.some(ex =>
                            ex && ex.toLowerCase().includes(executorFilter)));
                    const matchesProject = !projectFilter ||
                        (task.project && task.project.toLowerCase().includes(projectFilter));
                    const customer = customers.find(c => c.id === task.customerId);
                    const matchesCustomer = !customerFilter ||
                        (customer && customer.name && customer.name.toLowerCase().includes(customerFilter));
                    const matchesStatus = filters.status === 'all' ||
                        (filters.status === 'accepted' && (task.status === 'Принято' || task.status === 'OPEN')) ||
                        (filters.status === 'completed' && task.status === 'Выполнено') ||
                        (filters.status === 'acceptedByCustomer' && task.status === 'Принято заказчиком');
                    return matchesExecutors && matchesProject && matchesCustomer && matchesStatus;
                });

                sortTasks(filteredTasks);
                createTaskCards(filteredTasks);
            })
            .catch(error => {
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
    if (!sortState?.field || !taskList) return;

    taskList.sort((a, b) => {
        let valA = a[sortState.field];
        let valB = b[sortState.field];

        if (sortState.field === 'dateSet' || sortState.field === 'deadline') {
            valA = valA || '9999-12-31';
            valB = valB || '9999-12-31';
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (sortState.field === 'id') {
            return sortState.ascending ? valA - valB : valB - valA;
        } else if (sortState.field === 'executors') {
            valA = valA?.length ? valA.join(', ') : '';
            valB = valB?.length ? valB.join(', ') : '';
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (sortState.field === 'status') {
            valA = valA || 'Не указано';
            valB = valB || 'Не указано';
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            valA = valA || '';
            valB = valB || '';
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valB);
        }
    });
}

export function openEditModal(taskId) {
    console.log('Попытка открыть задачу с ID:', taskId, 'Тип:', typeof taskId);
    const task = taskId ? tasks.find(t => t.id === taskId) : {
        id: null,
        dateSet: formatDate(new Date()),
        project: '',
        customerId: null,
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

    const modal = document.createElement('div');
    modal.className = 'modal trello-style-modal';
    document.body.appendChild(modal);

    const tempTask = JSON.parse(JSON.stringify(task));
    tempTask.files = tempTask.files || [];
    tempTask.executors = tempTask.executors || [];
    tempTask.history = tempTask.history || [];
    tempTask.deadline = tempTask.deadline || '';
    tempTask.subtasks = tempTask.subtasks || [];
    const pendingHistory = [];
    const statuses = ['Принято', 'Выполнено', 'Принято заказчиком', 'Аннулировано'];

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <div class="editable-field">
                    <h2 id="projectDisplay">${tempTask.project || 'Без проекта'}</h2>
                    <input type="text" id="editProject" value="${tempTask.project || ''}" class="hidden">
                </div>
                <div class="editable-field">
                    <h3 id="customerDisplay">${customers.find(c => c.id === tempTask.customerId)?.name || 'Не указан'}</h3>
                    <select id="editCustomer" class="hidden">
                        <option value="">Не выбран</option>
                        ${customers.map(c => `<option value="${c.id}" ${tempTask.customerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="header-actions">
                    <span class="status-label">Статус:</span>
                    <select id="statusSelect">
                        ${statuses.map(status => `<option value="${status}" ${tempTask.status === status ? 'selected' : ''}>${status}</option>`).join('')}
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
                                        ${executors.map(ex => `<option value="${ex.id}" ${sub.executorId === ex.id ? 'selected' : ''}>${ex.name}</option>`).join('')}
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
                                <div class="history-item ${getHistoryClass(entry.change)}" data-id="${entry.id || 'temp-' + Math.random().toString(36).substr(2, 9)}">
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


    const setupTabs = () => {
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                modal.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                const tabId = `${btn.dataset.tab}Tab`;
                const tabContent = modal.querySelector(`#${tabId}`);
                if (tabContent) tabContent.classList.remove('hidden');
            });
        });
    };

    const setupEditableFields = () => {

        const fields = [
            { display: 'projectDisplay', input: 'editProject', prop: 'project', defaultText: 'Без проекта' },
            { display: 'themeDisplay', input: 'editTheme', prop: 'theme', defaultText: 'Нет темы' },
            { display: 'descriptionDisplay', input: 'editDescription', prop: 'description', defaultText: 'Нет описания' },
            { display: 'dateSetDisplay', input: 'editDateSet', prop: 'dateSet', defaultText: 'Не указана' },
            { display: 'deadlineDisplay', input: 'editDeadline', prop: 'deadline', defaultText: 'Не указан' }
        ];

        fields.forEach(({ display, input, prop, defaultText }) => {
            const displayEl = modal.querySelector(`#${display}`);
            const inputEl = modal.querySelector(`#${input}`);

            if (displayEl && inputEl) {
                displayEl.addEventListener('dblclick', () => {
                    displayEl.classList.add('hidden');
                    inputEl.classList.remove('hidden');
                    inputEl.focus();
                });

                const saveHandler = () => {
                    const oldValue = tempTask[prop];
                    const newValue = inputEl.value.trim();
                    tempTask[prop] = newValue;
                    displayEl.textContent = newValue || defaultText;
                    displayEl.classList.remove('hidden');
                    inputEl.classList.add('hidden');

                    if (oldValue !== newValue) {
                        const fieldNames = {
                            project: 'Проект',
                            theme: 'Тема',
                            description: 'Описание',
                            dateSet: 'Дата постановки',
                            deadline: 'Срок выполнения'
                        };
                        pendingHistory.push({
                            date: formatCommentDate(new Date()),
                            rawDate: new Date().toISOString(),
                            change: `${fieldNames[prop]} изменен${prop === 'description' ? 'о' : ''} с "${oldValue || 'не указан'}" на "${newValue || 'не указан'}"`,
                            user: 'Текущий пользователь'
                        });
                        updateHistoryList();
                    }
                };

                inputEl.addEventListener('keypress', e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveHandler();
                    }
                });

                inputEl.addEventListener('blur', saveHandler);
            }
        });

        const customerDisplay = modal.querySelector('#customerDisplay');
        const customerSelect = modal.querySelector('#editCustomer');

        if (customerDisplay && customerSelect) {
            customerDisplay.addEventListener('dblclick', () => {
                customerDisplay.classList.add('hidden');
                customerSelect.classList.remove('hidden');
                customerSelect.focus();
            });

            customerSelect.addEventListener('change', async () => {
                const oldCustomerId = tempTask.customerId;
                const newCustomerId = customerSelect.value ? parseInt(customerSelect.value) : null;

                if (oldCustomerId !== newCustomerId) {
                    const oldCustomerName = customers.find(c => c.id === oldCustomerId)?.name || 'Не указан';
                    const newCustomerName = customers.find(c => c.id === newCustomerId)?.name || 'Не указан';

                    tempTask.customerId = newCustomerId;
                    customerDisplay.textContent = newCustomerName;
                    customerDisplay.classList.remove('hidden');
                    customerSelect.classList.add('hidden');
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Заказчик изменён с "${oldCustomerName}" на "${newCustomerName}"`,
                        user: 'Текущий пользователь'
                    });

                    updateHistoryList();

                    try {
                        await updateTask({
                            ...tempTask,
                            customerId: newCustomerId
                        });

                        const taskIndex = tasks.findIndex(t => t.id === tempTask.id);
                        if (taskIndex !== -1) {
                            tasks[taskIndex].customerId = newCustomerId;
                        }

                        showNotification('Заказчик успешно изменён');
                    } catch (error) {
                        console.error('Ошибка при обновлении заказчика:', error);
                        showNotification('Ошибка при сохранении заказчика');
                        tempTask.customerId = oldCustomerId;
                        customerDisplay.textContent = oldCustomerName;
                    }
                }
            });
        }
    }

    const updateExecutorList = async () => {
        const executorList = modal.querySelector('#executorList');
        if (!executorList) return;

        executorList.innerHTML = '';

        if (tempTask.executors?.length) {
            tempTask.executors.forEach(executorName => {
                const executorItem = document.createElement('div');
                executorItem.className = 'executor-item';
                executorItem.innerHTML = `
                    <span class="executor-name">${executorName}</span>
                    <button class="delete-executor" data-executor="${executorName}">×</button>
                `;
                executorList.appendChild(executorItem);
            });
        } else {
            executorList.textContent = 'Не назначены';
        }

        const addButton = document.createElement('button');
        addButton.className = 'add-executor-btn';
        addButton.innerHTML = '+ Добавить исполнителя';
        executorList.appendChild(addButton);

        addButton.addEventListener('click', () => {
            const availableExecutors = executors
                .map(ex => ex.name)
                .filter(name => !tempTask.executors.includes(name));

            if (!availableExecutors.length) {
                showNotification('Нет доступных исполнителей для добавления');
                return;
            }

            const select = document.createElement('select');
            select.innerHTML = `
                <option value="">Выберите исполнителя</option>
                ${availableExecutors.map(name => `<option value="${name}">${name}</option>`).join('')}
            `;
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Добавить';
            confirmButton.classList.add('confirm-button'); 

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Отмена';
            cancelButton.classList.add('cancel-button'); 

            const container = document.createElement('div');
            container.className = 'executor-select-container';
            container.appendChild(select);
            container.appendChild(confirmButton);
            container.appendChild(cancelButton);

            executorList.removeChild(addButton);
            executorList.appendChild(container);

            confirmButton.addEventListener('click', () => {
                const selectedExecutor = select.value;
                if (selectedExecutor) {
                    tempTask.executors.push(selectedExecutor);
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Добавлен исполнитель: "${selectedExecutor}"`,
                        user: 'Текущий пользователь'
                    });
                    updateExecutorList();
                    updateHistoryList();
                }
            });

            cancelButton.addEventListener('click', () => {
                executorList.removeChild(container);
                executorList.appendChild(addButton);
            });
        });

        executorList.querySelectorAll('.delete-executor').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const executorName = btn.dataset.executor;
                tempTask.executors = tempTask.executors.filter(name => name !== executorName);
                pendingHistory.push({
                    date: formatCommentDate(new Date()),
                    rawDate: new Date().toISOString(),
                    change: `Удален исполнитель: "${executorName}"`,
                    user: 'Текущий пользователь'
                });
                updateExecutorList();
                updateHistoryList();
            });
        });
    };

    const updateSubtaskList = () => {
        const subtaskList = modal.querySelector('#subtaskList');
        if (!subtaskList) return;

        subtaskList.innerHTML = tempTask.subtasks.length ?
            tempTask.subtasks.map((subtask, index) => `
                <div class="subtask-item" data-id="${subtask.id}">
                    <input type="text" class="subtask-description" 
                           value="${subtask.description || ''}" 
                           placeholder="Описание подзадачи">
                    <input type="date" class="subtask-dateSet" 
                           value="${subtask.dateSet || ''}">
                    <input type="date" class="subtask-deadline ${getDeadlineClass(subtask.deadline, subtask.done)}" 
                           value="${subtask.deadline || ''}">
                    <select class="subtask-executor">
                        <option value="">Не назначен</option>
                        ${executors.map(executor => `
                            <option value="${executor.id}" 
                                    ${subtask.executorId === executor.id ? 'selected' : ''}>
                                ${executor.name}
                            </option>
                        `).join('')}
                    </select>
                    <input type="checkbox" class="subtask-done" 
                           ${subtask.done ? 'checked' : ''}>
                    <button class="remove-subtask" data-index="${index}" data-id="${subtask.id}">
                        <img src="./image/x_icon.svg" alt="Удалить">
                    </button>
                </div>
            `).join('') : '<p>Нет подзадач</p>';

        subtaskList.querySelectorAll('.subtask-item').forEach((item, index) => {
            const descriptionInput = item.querySelector('.subtask-description');
            const dateSetInput = item.querySelector('.subtask-dateSet');
            const deadlineInput = item.querySelector('.subtask-deadline');
            const executorSelect = item.querySelector('.subtask-executor');
            const doneCheckbox = item.querySelector('.subtask-done');
            const removeButton = item.querySelector('.remove-subtask');

            const subtaskId = parseInt(removeButton.dataset.id);
            const subtask = tempTask.subtasks[index];

            const updateSubtaskField = async (field, value, changeMessage) => {
                const oldValue = subtask[field];
                subtask[field] = value;

                try {
                    await updateSubtask(subtaskId, { ...subtask, taskId: tempTask.id });
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: changeMessage,
                        user: 'Текущий пользователь'
                    });
                    updateHistoryList();
                } catch (error) {
                    console.error('Ошибка обновления подзадачи:', error);
                    subtask[field] = oldValue;
                    updateSubtaskList();
                    showNotification('Ошибка при обновлении подзадачи');
                }
            };

            descriptionInput.addEventListener('change', () => {
                const newDescription = descriptionInput.value.trim();
                if (newDescription !== subtask.description) {
                    updateSubtaskField(
                        'description',
                        newDescription,
                        `Описание подзадачи ${index + 1} изменено с "${subtask.description || 'нет'}" на "${newDescription || 'нет'}"`
                    );
                }
            });

            dateSetInput.addEventListener('change', () => {
                const newDate = dateSetInput.value;
                if (newDate !== subtask.dateSet) {
                    updateSubtaskField(
                        'dateSet',
                        newDate,
                        `Дата постановки подзадачи ${index + 1} изменена с "${subtask.dateSet || 'нет'}" на "${newDate || 'нет'}"`
                    );
                }
            });

            deadlineInput.addEventListener('change', () => {
                const newDeadline = deadlineInput.value;
                if (newDeadline !== subtask.deadline) {
                    updateSubtaskField(
                        'deadline',
                        newDeadline,
                        `Срок выполнения подзадачи ${index + 1} изменен с "${subtask.deadline || 'нет'}" на "${newDeadline || 'нет'}"`
                    );
                }
            });

            executorSelect.addEventListener('change', () => {
                const newExecutorId = parseInt(executorSelect.value) || null;
                const newExecutorName = executors.find(e => e.id === newExecutorId)?.name || 'Не назначен';

                if (newExecutorId !== subtask.executorId) {
                    const oldExecutorName = executors.find(e => e.id === subtask.executorId)?.name || 'Не назначен';
                    subtask.executorId = newExecutorId;

                    updateSubtaskField(
                        'executorId',
                        newExecutorId,
                        `Исполнитель подзадачи ${index + 1} изменен с "${oldExecutorName}" на "${newExecutorName}"`
                    );
                }
            });

            doneCheckbox.addEventListener('change', () => {
                const newDone = doneCheckbox.checked;
                if (newDone !== subtask.done) {
                    updateSubtaskField(
                        'done',
                        newDone,
                        `Статус подзадачи ${index + 1} изменен на "${newDone ? 'выполнено' : 'не выполнено'}"`
                    );
                }
            });

            removeButton.addEventListener('click', async () => {
                try {
                    await deleteSubtask(subtaskId);
                    const removedSubtask = tempTask.subtasks.splice(index, 1)[0];
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Удалена подзадача: "${removedSubtask.description || 'без описания'}"`,
                        user: 'Текущий пользователь'
                    });
                    updateSubtaskList();
                    updateHistoryList();
                } catch (error) {
                    console.error('Ошибка удаления подзадачи:', error);
                    showNotification('Ошибка при удалении подзадачи');
                }
            });
        });
    };

    const updateHistoryList = () => {
        const historyList = modal.querySelector('#historyList');
        if (!historyList) return;

        const combinedHistory = [
            ...(tempTask.history || []),
            ...pendingHistory
        ].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

        historyList.innerHTML = combinedHistory.length ?
            combinedHistory.map(entry => `
                <div class="history-item ${getHistoryClass(entry.change)}" 
                     data-id="${entry.id || 'temp-' + Math.random().toString(36).substr(2, 9)}">
                    <span class="history-date">${entry.date}</span>
                    <span class="history-change">${entry.change}</span>
                    <span class="history-user">${entry.user}</span>
                </div>
            `).join('') : 'Нет истории изменений';
    };

    const setupCommentField = () => {
        const commentField = modal.querySelector('#newComment');
        if (!commentField) return;

        commentField.addEventListener('keypress', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const commentText = commentField.value.trim();
                if (commentText) {
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Добавлен комментарий: "${commentText}"`,
                        user: 'Текущий пользователь'
                    });
                    commentField.value = '';
                    updateHistoryList();
                }
            }
        });
    };

    const setupAddSubtaskButton = () => {
        const addButton = modal.querySelector('#addSubtaskBtn');
        if (!addButton) return;

        addButton.addEventListener('click', async () => {
            try {
                const newSubtask = {
                    taskId: tempTask.id,
                    description: 'Новая подзадача',
                    dateSet: formatDate(new Date()),
                    deadline: '',
                    done: false,
                    executorId: null
                };

                const createdSubtask = await createSubtask(tempTask.id, newSubtask);
                tempTask.subtasks.push(createdSubtask);

                pendingHistory.push({
                    date: formatCommentDate(new Date()),
                    rawDate: new Date().toISOString(),
                    change: `Добавлена подзадача: "${createdSubtask.description}"`,
                    user: 'Текущий пользователь'
                });

                updateSubtaskList();
                updateHistoryList();
            } catch (error) {
                console.error('Ошибка добавления подзадачи:', error);
                showNotification('Не удалось добавить подзадачу');
            }
        });
    };

    const setupSaveButton = () => {
        const saveButton = modal.querySelector('#saveBtn');
        if (!saveButton) return;

        saveButton.addEventListener('click', async () => {
            showLoading(saveButton, true);

            try {
                const statusSelect = modal.querySelector('#statusSelect');
                if (statusSelect && tempTask.status !== statusSelect.value) {
                    const oldStatus = tempTask.status;
                    tempTask.status = statusSelect.value;
                    pendingHistory.push({
                        date: formatCommentDate(new Date()),
                        rawDate: new Date().toISOString(),
                        change: `Статус изменён с "${oldStatus}" на "${tempTask.status}"`,
                        user: 'Текущий пользователь'
                    });
                }

                let updatedTask;
                if (!tempTask.id) {
                    updatedTask = await createTask(tempTask);
                    tempTask.id = updatedTask.id;
                    tasks.push(updatedTask);
                    showNotification('Новая задача успешно создана');
                } else {
                    updatedTask = await updateTask(tempTask);

                    const taskIndex = tasks.findIndex(t => t.id === tempTask.id);
                    if (taskIndex !== -1) {
                        tasks[taskIndex] = { ...updatedTask };
                    }
                    showNotification('Задача успешно обновлена');
                }

                if (pendingHistory.length > 0) {
                    await Promise.all(
                        pendingHistory.map(entry =>
                            createHistory(tempTask.id, entry.change, entry.user)
                        )
                    );
                }

                const originalExecutors = task.executors || [];
                const currentExecutors = tempTask.executors || [];

                const addedExecutors = currentExecutors.filter(
                    ex => !originalExecutors.includes(ex)
                );
                const removedExecutors = originalExecutors.filter(
                    ex => !currentExecutors.includes(ex)
                );

                await Promise.all([
                    ...removedExecutors.map(async executorName => {
                        const executor = executors.find(ex => ex.name === executorName);
                        if (executor) {
                            await removeExecutorFromTask(tempTask.id, executor.id);
                        }
                    }),
                    ...addedExecutors.map(async executorName => {
                        const executor = executors.find(ex => ex.name === executorName);
                        if (executor) {
                            await assignExecutorToTask(
                                tempTask.id,
                                executor.id,
                                {
                                    id: tempTask.id,
                                    project: tempTask.project,
                                    theme: tempTask.theme
                                },
                                {
                                    id: executor.id,
                                    name: executor.name
                                }
                            );
                        }
                    })
                ]);
                try {
                    const freshExecutors = await fetchExecutors();
                    executors.length = 0;
                    executors.push(...freshExecutors);

                    if (filters.dateFrom && filters.dateTo) {
                        await fetchTasks(filters.dateFrom, filters.dateTo);
                    }
                } catch (error) {
                    console.error('Ошибка при обновлении данных:', error);
                }

                applyFilters();
                createTaskCards(tasks.filter(t =>
                    (!filters.dateFrom || t.dateSet >= filters.dateFrom) &&
                    (!filters.dateTo || t.dateSet <= filters.dateTo)
                ));

                modal.remove();

            } catch (error) {
                console.error('Ошибка сохранения задачи:', error);
                showNotification(`Ошибка сохранения: ${error.message || 'Неизвестная ошибка'}`);
            } finally {
                showLoading(saveButton, false);
            }
        });
    };

    const setupCloseButton = () => {
        const closeButton = modal.querySelector('#closeBtn');
        const closeModalBtn = modal.querySelector('#closeModalBtn');

        const closeHandler = () => {
            if (pendingHistory.length || JSON.stringify(tempTask) !== JSON.stringify(task)) {
                showNotification('Изменения не сохранены');
            }
            modal.remove();
        };

        if (closeButton) closeButton.addEventListener('click', closeHandler);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeHandler);

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                closeHandler();
            }
        });
    };

    setupTabs();
    setupEditableFields();
    updateExecutorList();
    updateSubtaskList();
    updateHistoryList();
    setupCommentField();
    setupAddSubtaskButton();
    setupSaveButton();
    setupCloseButton();
}