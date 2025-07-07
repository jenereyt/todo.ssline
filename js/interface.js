import { openGlobalExecutorModal } from './executorsModal.js';
import { openGlobalCustomerModal } from './customersModal.js';
import { tasks, executors, getAllExecutors, filters, sortState, allProjects, customers, syncCustomers } from './app.js';
import { showNotification } from './utils.js';
import { applyFilters, openEditModal } from './modal.js';
import { openGlobalRegionModal } from './regionsModal.js';

export function createTaskCards(taskList) {
    const appDiv = document.getElementById('app');
    const existingContainer = appDiv.querySelector('.task-cards-container');
    if (existingContainer) existingContainer.remove();

    const container = document.createElement('div');
    container.className = 'task-cards-container';

    taskList.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';

        let deadlineClass = '';
        if (task.status === 'Выполнено' || task.status === 'Принято заказчиком') {
            deadlineClass = 'deadline-green';
        } else if (task.status === 'Аннулировано') {
            deadlineClass = 'deadline-gray';
        } else if (task.deadline) {
            const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 2) deadlineClass = 'deadline-red';
            else if (daysLeft <= 7) deadlineClass = 'deadline-yellow';
        }

        const subtaskCounts = { yellow: 0, red: 0, green: 0, total: 0 };
        if (task.subtasks && task.subtasks.length) {
            subtaskCounts.total = task.subtasks.length;
            task.subtasks.forEach(sub => {
                if (sub.done) {
                    subtaskCounts.green++;
                } else if (sub.deadline) {
                    const daysLeft = Math.ceil((new Date(sub.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    if (daysLeft <= 2) subtaskCounts.red++;
                    else if (daysLeft <= 7) subtaskCounts.yellow++;
                }
            });
        }

        const customerName = customers.find(c => c.id === task.customerId)?.name || 'Не указан';

        card.innerHTML = `
            <div class="task-field"><strong>№:</strong> ${task.id}</div>
            <div class="task-field"><strong>Проект/Заказчик:</strong> ${task.project || 'Без проекта'} / ${customerName}</div>
            <div class="task-field"><strong>Тема:</strong> ${task.theme || 'Нет темы'}</div>
            <div class="task-field"><strong>Описание:</strong> ${task.description || 'Нет описания'}</div>
            <div class="task-field"><strong>Дата постановки:</strong> ${task.dateSet || 'Не указана'}</div>
            <div class="task-field"><strong>Дедлайн:</strong> <span class="${deadlineClass}">${task.deadline || 'Не указан'}</span></div>
            <div class="task-field"><strong>Исполнители:</strong> ${task.executors.length ? task.executors.join(', ') : 'Не назначены'}</div>
            <div class="task-field"><strong>Статус:</strong> ${task.status || 'Не указан'}</div>
            <div class="subtask-indicators">
                ${subtaskCounts.total ? `<span class="subtask-circle gray">${subtaskCounts.total}</span>` : ''}
                ${subtaskCounts.yellow ? `<span class="subtask-circle yellow">${subtaskCounts.yellow}</span>` : ''}
                ${subtaskCounts.red ? `<span class="subtask-circle red">${subtaskCounts.red}</span>` : ''}
                ${subtaskCounts.green ? `<span class="subtask-circle green">${subtaskCounts.green}</span>` : ''}
            </div>
        `;
        card.addEventListener('click', () => openEditModal(task.id));
        container.appendChild(card);
    });

    appDiv.appendChild(container);
}

export function createInterface() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="controls">
            <div class="filters">
                <div class="filter-group">
                    <label>Дата постановки</label>
                    <div class="date-range">
                        <input type="date" id="dateFrom">
                        <input type="date" id="dateTo">
                    </div>
                </div>
                <div class="filter-group">
                    <label for="executorFilter">Исполнитель</label>
                    <div class="input-with-clear">
                        <input type="text" id="executorFilter" placeholder="Введите исполнителя">
                        <button class="clear-btn hidden" id="clearExecutor">×</button>
                    </div>
                    <div class="suggestions hidden" id="executorSuggestions"></div>
                </div>
                <div class="filter-group">
                    <label for="projectFilter">Проект</label>
                    <div class="input-with-clear">
                        <input type="text" id="projectFilter" placeholder="Введите проект">
                        <button class="clear-btn hidden" id="clearProject">×</button>
                    </div>
                    <div class="suggestions hidden" id="projectSuggestions"></div>
                </div>
                <div class="filter-group">
                    <label for="customerFilter">Заказчик</label>
                    <div class="input-with-clear">
                        <input type="text" id="customerFilter" placeholder="Введите заказчика">
                        <button class="clear-btn hidden" id="clearCustomer">×</button>
                    </div>
                    <div class="suggestions hidden" id="customerSuggestions"></div>
                </div>
                <div class="filter-group">
                    <label>Сортировать по:</label>
                    <div class="sort-controls">
                        <select id="sortField">
                            <option value="" ${!sortState.field ? 'selected' : ''}>Без сортировки</option>
                            <option value="dateSet" ${sortState.field === 'dateSet' ? 'selected' : ''}>Дата постановки</option>
                            <option value="project" ${sortState.field === 'project' ? 'selected' : ''}>Проект/Заказчик</option>
                            <option value="deadline" ${sortState.field === 'deadline' ? 'selected' : ''}>Дедлайн</option>
                            <option value="theme" ${sortState.field === 'theme' ? 'selected' : ''}>Тема</option>
                            <option value="description" ${sortState.field === 'description' ? 'selected' : ''}>Описание</option>
                            <option value="executors" ${sortState.field === 'executors' ? 'selected' : ''}>Исполнители</option>
                            <option value="status" ${sortState.field === 'status' ? 'selected' : ''}>Статус</option>
                        </select>
                        <button id="toggleSortDirection">${sortState.ascending ? '↑' : '↓'}</button>
                    </div>
                </div>
                <button id="resetFiltersBtn"><img src="./image/X.svg" alt="Сбросить"></button>
            </div>
          <button id="addGlobalExecutorBtn"><img class="guest_img" src="./image/guest.svg" alt=""></button>
         <button id="addGlobalCustomerBtn">Заказчики</button>
        <button id="addGlobalRegionBtn"><img class="map_img" src="./image/world.svg" alt=""></button>
       <button id="createTaskBtn">Создать задачу</button>
        </div>
    `;
    createTaskCards(tasks);

    document.getElementById('addGlobalRegionBtn').addEventListener('click', () => {
        openGlobalRegionModal();
    });

    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    dateFrom.value = '';
    dateTo.value = '';
    filters.dateFrom = '';
    filters.dateTo = '';
    applyFilters();

    const sortFieldSelect = document.getElementById('sortField');
    const toggleSortDirection = document.getElementById('toggleSortDirection');

    if (sortFieldSelect) {
        sortFieldSelect.addEventListener('change', () => {
            const field = sortFieldSelect.value || null;
            sortState.field = field;
            applyFilters();
        });
    }

    if (toggleSortDirection) {
        toggleSortDirection.addEventListener('click', () => {
            sortState.ascending = !sortState.ascending;
            toggleSortDirection.textContent = sortState.ascending ? '↑' : '↓';
            applyFilters();
        });
    }

    [dateFrom, dateTo].forEach(input => {
        input.addEventListener('change', () => {
            if (dateTo.value && dateFrom.value && new Date(dateTo.value) < new Date(dateFrom.value)) {
                showNotification('Дата окончания не может быть раньше даты начала');
                dateTo.value = '';
            }
            filters.dateFrom = dateFrom.value;
            filters.dateTo = dateTo.value;
            applyFilters();
        });
    });

    const clearExecutorBtn = document.getElementById('clearExecutor');
    clearExecutorBtn.addEventListener('click', () => {
        document.getElementById('executorFilter').value = '';
        filters.executors = '';
        clearExecutorBtn.classList.add('hidden');
        applyFilters();
    });

    const clearProjectBtn = document.getElementById('clearProject');
    clearProjectBtn.addEventListener('click', () => {
        document.getElementById('projectFilter').value = '';
        filters.project = '';
        clearProjectBtn.classList.add('hidden');
        applyFilters();
    });

    const clearCustomerBtn = document.getElementById('clearCustomer');
    clearCustomerBtn.addEventListener('click', () => {
        document.getElementById('customerFilter').value = '';
        filters.customer = '';
        clearCustomerBtn.classList.add('hidden');
        applyFilters();
    });

    document.getElementById('resetFiltersBtn').addEventListener('click', () => {
        Object.keys(filters).forEach(key => delete filters[key]);
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('executorFilter').value = '';
        document.getElementById('projectFilter').value = '';
        document.getElementById('customerFilter').value = '';
        document.getElementById('searchInput').value = '';
        clearExecutorBtn.classList.add('hidden');
        clearProjectBtn.classList.add('hidden');
        clearCustomerBtn.classList.add('hidden');
        sortState.field = null;
        sortState.ascending = true;
        sortFieldSelect.value = '';
        toggleSortDirection.textContent = '↑';
        applyFilters();
    });

    // document.getElementById('searchBtn').addEventListener('click', () => {
    //     const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    //     const filteredTasks = tasks.filter(
    //         task => {
    //             const customerName = customers.find(c => c.id === task.customerId)?.name || '';
    //             return task.id.toString().includes(searchTerm) ||
    //                 (task.dateSet || '').toLowerCase().includes(searchTerm) ||
    //                 (task.deadline || '').toLowerCase().includes(searchTerm) ||
    //                 (task.project || '').toLowerCase().includes(searchTerm) ||
    //                 customerName.toLowerCase().includes(searchTerm) ||
    //                 (task.theme || '').toLowerCase().includes(searchTerm) ||
    //                 (task.description || '').toLowerCase().includes(searchTerm) ||
    //                 task.executors.some(ex => ex.toLowerCase().includes(searchTerm)) ||
    //                 (task.status || '').toLowerCase().includes(searchTerm);
    //         }
    //     );
    //     createTaskCards(filteredTasks);
    // });

    // document.getElementById('searchInput').addEventListener('keypress', e => {
    //     if (e.key === 'Enter') document.getElementById('searchBtn').click();
    // });

    const executorInput = document.getElementById('executorFilter');
    const executorSuggestions = document.getElementById('executorSuggestions');
    executorInput.addEventListener('input', e => {
        const value = e.target.value.toLowerCase();
        executorSuggestions.innerHTML = '';
        clearExecutorBtn.classList.toggle('hidden', !value);
        if (value) {
            executorSuggestions.classList.remove('hidden');
            const allExecutors = getAllExecutors();
            const matches = allExecutors.filter(ex => ex.toLowerCase().includes(value));
            matches.forEach(match => {
                const div = document.createElement('div');
                div.textContent = match;
                div.className = 'suggestion-item';
                div.style.cursor = 'pointer';
                div.addEventListener('click', () => {
                    executorInput.value = match;
                    filters.executors = match;
                    executorSuggestions.classList.add('hidden');
                    applyFilters();
                });
                executorSuggestions.appendChild(div);
            });
        } else {
            executorSuggestions.classList.add('hidden');
            filters.executors = '';
            applyFilters();
        }
    });

    const projectInput = document.getElementById('projectFilter');
    const projectSuggestions = document.getElementById('projectSuggestions');
    projectInput.addEventListener('input', e => {
        const value = e.target.value.toLowerCase();
        projectSuggestions.innerHTML = '';
        clearProjectBtn.classList.toggle('hidden', !value);
        if (value) {
            projectSuggestions.classList.remove('hidden');
            const matches = allProjects.filter(p => p.toLowerCase().includes(value));
            matches.forEach(match => {
                const div = document.createElement('div');
                div.textContent = match;
                div.className = 'suggestion-item';
                div.style.cursor = 'pointer';
                div.addEventListener('click', () => {
                    projectInput.value = match;
                    filters.project = match;
                    projectSuggestions.classList.add('hidden');
                    applyFilters();
                });
                projectSuggestions.appendChild(div);
            });
        } else {
            projectSuggestions.classList.add('hidden');
            filters.project = '';
            applyFilters();
        }
    });

    const customerInput = document.getElementById('customerFilter');
    const customerSuggestions = document.getElementById('customerSuggestions');
    customerInput.addEventListener('input', e => {
        const value = e.target.value.toLowerCase();
        customerSuggestions.innerHTML = '';
        clearCustomerBtn.classList.toggle('hidden', !value);
        if (value) {
            customerSuggestions.classList.remove('hidden');
            const matches = customers.map(c => c.name).filter(c => c.toLowerCase().includes(value));
            matches.forEach(match => {
                const div = document.createElement('div');
                div.textContent = match;
                div.className = 'suggestion-item';
                div.style.cursor = 'pointer';
                div.addEventListener('click', () => {
                    customerInput.value = match;
                    filters.customer = match;
                    customerSuggestions.classList.add('hidden');
                    applyFilters();
                });
                customerSuggestions.appendChild(div);
            });
        } else {
            customerSuggestions.classList.add('hidden');
            filters.customer = '';
            applyFilters();
        }
    });

    document.getElementById('addGlobalExecutorBtn').addEventListener('click', () => {
        openGlobalExecutorModal();
    });

    document.getElementById('addGlobalCustomerBtn').addEventListener('click', () => {
        openGlobalCustomerModal();
    });

    document.getElementById('createTaskBtn').addEventListener('click', () => {
        openEditModal(null);
    });

    document.addEventListener('click', e => {
        if (!executorInput.contains(e.target) && !executorSuggestions.contains(e.target)) {
            executorSuggestions.classList.add('hidden');
        }
        if (!projectInput.contains(e.target) && !projectSuggestions.contains(e.target)) {
            projectSuggestions.classList.add('hidden');
        }
        if (!customerInput.contains(e.target) && !customerSuggestions.contains(e.target)) {
            customerSuggestions.classList.add('hidden');
        }
    });

    syncCustomers().then(() => applyFilters());
}