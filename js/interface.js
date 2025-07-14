import { tasks, executors, getAllExecutors, filters, sortState, allProjects, customers, syncCustomers } from './app.js';
import { showNotification, showLoading } from './utils.js';
import { applyFilters, openEditModal } from './modal.js';
import { fetchExecutors, createExecutor, updateExecutor, deleteExecutor } from './executors.js';
import { removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory } from './history.js';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from './customers.js';
import { fetchRegions, createRegion, updateRegion, deleteRegion } from './regions.js';

export function createTaskCards(taskList, statusFilter = 'all') {
    const tasksContainer = document.getElementById('tasks');
    if (!tasksContainer) {
        console.error('Элемент #tasks не найден');
        return;
    }
    const existingContainer = tasksContainer.querySelector('.task-cards-container');
    if (existingContainer) existingContainer.remove();

    const container = document.createElement('div');
    container.className = 'task-cards-container';

    // Фильтрация задач по статусу
    let filteredTasks = taskList;
    if (statusFilter !== 'all') {
        filteredTasks = taskList.filter(task => {
            if (statusFilter === 'accepted') return task.status === 'Принято';
            if (statusFilter === 'completed') return task.status === 'Выполнено';
            if (statusFilter === 'acceptedByCustomer') return task.status === 'Принято заказчиком';
            return true;
        });
    }

    filteredTasks.forEach(task => {
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

    tasksContainer.appendChild(container);
}

export function createInterface() {
    const appDiv = document.getElementById('app');
    if (!appDiv) {
        console.error('Элемент #app не найден в DOM');
        return;
    }

    appDiv.innerHTML = `
        <div class="sidebar collapsed" id="sidebar">
            <ul>
                <li data-tab="tasks" class="tasks active">Задачи</li>
                <li data-tab="employees">Сотрудники</li>
                <li data-tab="customers">Заказчики</li>
                <li data-tab="regions">Регионы</li>
            </ul>
        </div>
        <div class="app sidebar-collapsed">
            <button class="burger-menu-btn" id="burgerMenuBtn">
                <img src="./image/burger_menu.svg" alt="">
            </button>
            <div id="tasks" class="panel-content active">
                <div class="controls">
                    <div class="filters">
                        <div class="filter-group">
                            <div class="date-range">
                                <label>Период с: </label>
                                <input type="date" id="dateFrom">
                                <label>по: </label>
                                <input type="date" id="dateTo">
                            </div>
                        </div>
                        <div class="filter-group">
                            <div class="input-with-clear">
                                <input type="text" id="executorFilter" placeholder="По исполнителю">
                                <button class="clear-btn hidden" id="clearExecutor">×</button>
                            </div>
                            <div class="suggestions hidden" id="executorSuggestions"></div>
                        </div>
                        <div class="filter-group">
                            <div class="input-with-clear">
                                <input type="text" id="projectFilter" placeholder="По проекту">
                                <button class="clear-btn hidden" id="clearProject">×</button>
                            </div>
                            <div class="suggestions hidden" id="projectSuggestions"></div>
                        </div>
                        <div class="filter-group">
                            <div class="input-with-clear">
                                <input type="text" id="customerFilter" placeholder="По заказчику">
                                <button class="clear-btn hidden" id="clearCustomer">×</button>
                            </div>
                            <div class="suggestions hidden" id="customerSuggestions"></div>
                        </div>
                        <div class="filter-group">
                            <div class="sort-controls">
                                <label>Сортировать по:</label>
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
                    <button id="createTaskBtn"><img class="add-task" src="./image/add-task.svg" alt=""></button>
                </div>
                <hr class="divider">
                <div class="task-tabs">
                    <ul>
                        <li data-status="all" class="active">Все задачи</li>
                        <li data-status="accepted">Активные</li>
                        <li data-status="completed">Выполненные</li>
                        <li data-status="acceptedByCustomer">Принятые заказчиком</li>
                    </ul>
                </div>
                <div class="task-cards-container"></div>
            </div>
<div id="employees" class="panel-content">
    <h2>Сотрудники</h2>
    <div class="all-executors-section">
        <div class="executors-list" id="allExecutorsList">
            <div class="spinner" style="margin: 10px auto;"></div>
        </div>
    </div>
</div>
<div id="customers" class="panel-content">
    <h2>Заказчики</h2>
    <div class="add-customer-section">
       
    </div>
    <div class="all-customers-section">
        <div class="customers-list" id="allCustomersList">
            <div class="spinner" style="margin: 10px auto;"></div>
        </div>
    </div>
</div>
<div id="regions" class="panel-content">
    <h2>Регионы</h2>
    <div class="add-region-section">
    </div>
    <div class="all-regions-section">
        <div class="regions-list" id="allRegionsList">
            <div class="spinner" style="margin: 10px auto;"></div>
        </div>
    </div>
</div>
        </div>
    `;

    // Обработчик для бургер-меню
    const burgerBtn = document.getElementById('burgerMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const app = document.querySelector('.app');
    if (burgerBtn && sidebar && app) {
        burgerBtn.classList.remove('open');
        app.style.marginLeft = '50px';
        console.log('Инициализация: Классы .app:', app.classList.toString(),
            'margin-left:', window.getComputedStyle(app).marginLeft,
            'sidebar classes:', sidebar.classList.toString());

        burgerBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            app.classList.toggle('sidebar-collapsed');
            burgerBtn.classList.toggle('open');
            requestAnimationFrame(() => {
                app.style.marginLeft = sidebar.classList.contains('collapsed') ? '50px' : '250px';
            });
        });
    } else {
        console.error('Не найдены элементы для бургер-меню:', { burgerBtn, sidebar, app });
    }

    // Обработчик для вкладок
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            console.log('Клик по вкладке:', tabId);
            switchTab(tabId);
        });
    });

    function switchTab(tabId) {
        console.log('Вызов switchTab с tabId:', tabId);
        // Снимаем active с текущих вкладок
        document.querySelectorAll('.sidebar li').forEach(li => {
            li.classList.remove('active');
            if (li.dataset.tab === tabId) {
                li.classList.add('active');
            }
        });

        // Скрываем текущий контент и показываем новый
        document.querySelectorAll('.panel-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });

        // Инициализация вкладки
        try {
            if (tabId === 'tasks') {
                console.log('Инициализация вкладки tasks');
                initTasksTab();
            } else if (tabId === 'employees') {
                console.log('Инициализация вкладки employees');
                initEmployeesTab();
            } else if (tabId === 'customers') {
                console.log('Инициализация вкладки customers');
                initCustomersTab();
            } else if (tabId === 'regions') {
                console.log('Инициализация вкладки regions');
                initRegionsTab();
            }
        } catch (error) {
            console.error(`Ошибка при инициализации вкладки ${tabId}:`, error);
        }

        // Скрываем сайдбар на мобильных устройствах
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            app.classList.add('sidebar-collapsed');
            burgerBtn.classList.remove('open');
            requestAnimationFrame(() => {
                app.style.marginLeft = '50px';
                console.log('Переключение вкладки (мобильный): Классы .app:', app.classList.toString(),
                    'margin-left:', window.getComputedStyle(app).marginLeft,
                    'sidebar classes:', sidebar.classList.toString());
            });
        }
    }

    // Инициализация вкладки "Задачи" при загрузке
    try {
        switchTab('tasks');
    } catch (error) {
        console.error('Ошибка при инициализации вкладки задач:', error);
    }
}

async function initTasksTab() {
    if (!tasks || !Array.isArray(tasks)) {
        console.error('Переменная tasks не определена или не является массивом:', tasks);
        return;
    }

    // Инициализация текущего статуса фильтра
    filters.status = filters.status || 'all';
    applyFilters(); // Вызываем applyFilters, фильтрация по статусу будет ниже

    // Обработчик для табов
    const taskTabs = document.querySelectorAll('.task-tabs li');
    taskTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.dataset.status;
            console.log('Клик по табу задач:', status);
            taskTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filters.status = status;

            // Фильтрация задач по статусу перед вызовом applyFilters
            let statusFilteredTasks = tasks;
            if (filters.status !== 'all') {
                statusFilteredTasks = tasks.filter(task => {
                    if (filters.status === 'accepted') return task.status === 'Принято';
                    if (filters.status === 'completed') return task.status === 'Выполнено';
                    if (filters.status === 'acceptedByCustomer') return task.status === 'Принято заказчиком';
                    return true;
                });
            }

            // Обновляем карточки задач с учётом статуса
            createTaskCards(statusFilteredTasks, filters.status);
            try {
                applyFilters();
            } catch (error) {
                console.error('Ошибка при применении фильтров:', error);
            }
        });
    });

    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    if (dateFrom && dateTo) {
        dateFrom.value = filters.dateFrom || '';
        dateTo.value = filters.dateTo || '';
    } else {
        console.error('Не найдены элементы dateFrom или dateTo');
    }

    const sortFieldSelect = document.getElementById('sortField');
    const toggleSortDirection = document.getElementById('toggleSortDirection');
    if (sortFieldSelect) {
        sortFieldSelect.addEventListener('change', () => {
            const field = sortFieldSelect.value || null;
            sortState.field = field;
            try {
                applyFilters();
            } catch (error) {
                console.error('Ошибка при применении фильтров:', error);
            }
        });
    } else {
        console.error('Элемент #sortField не найден');
    }

    if (toggleSortDirection) {
        toggleSortDirection.addEventListener('click', () => {
            sortState.ascending = !sortState.ascending;
            toggleSortDirection.textContent = sortState.ascending ? '↑' : '↓';
            try {
                applyFilters();
            } catch (error) {
                console.error('Ошибка при применении фильтров:', error);
            }
        });
    } else {
        console.error('Элемент #toggleSortDirection не найден');
    }

    [dateFrom, dateTo].forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                if (dateTo.value && dateFrom.value && new Date(dateTo.value) < new Date(dateFrom.value)) {
                    showNotification('Дата окончания не может быть раньше даты начала');
                    dateTo.value = '';
                }
                filters.dateFrom = dateFrom.value;
                filters.dateTo = dateTo.value;
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            });
        }
    });

    const clearExecutorBtn = document.getElementById('clearExecutor');
    if (clearExecutorBtn) {
        clearExecutorBtn.addEventListener('click', () => {
            const executorFilter = document.getElementById('executorFilter');
            if (executorFilter) {
                executorFilter.value = '';
                filters.executors = '';
                clearExecutorBtn.classList.add('hidden');
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            }
        });
    }

    const clearProjectBtn = document.getElementById('clearProject');
    if (clearProjectBtn) {
        clearProjectBtn.addEventListener('click', () => {
            const projectFilter = document.getElementById('projectFilter');
            if (projectFilter) {
                projectFilter.value = '';
                filters.project = '';
                clearProjectBtn.classList.add('hidden');
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            }
        });
    }

    const clearCustomerBtn = document.getElementById('clearCustomer');
    if (clearCustomerBtn) {
        clearCustomerBtn.addEventListener('click', () => {
            const customerFilter = document.getElementById('customerFilter');
            if (customerFilter) {
                customerFilter.value = '';
                filters.customer = '';
                clearCustomerBtn.classList.add('hidden');
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            }
        });
    }

    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            Object.keys(filters).forEach(key => {
                if (key !== 'status') delete filters[key]; // Сохраняем status
            });
            document.getElementById('dateFrom').value = '';
            document.getElementById('dateTo').value = '';
            document.getElementById('executorFilter').value = '';
            document.getElementById('projectFilter').value = '';
            document.getElementById('customerFilter').value = '';
            clearExecutorBtn.classList.add('hidden');
            clearProjectBtn.classList.add('hidden');
            clearCustomerBtn.classList.add('hidden');
            sortState.field = null;
            sortState.ascending = true;
            sortFieldSelect.value = '';
            toggleSortDirection.textContent = '↑';
            try {
                applyFilters();
            } catch (error) {
                console.error('Ошибка при применении фильтров:', error);
            }
        });
    }

    const executorInput = document.getElementById('executorFilter');
    const executorSuggestions = document.getElementById('executorSuggestions');
    if (executorInput && executorSuggestions) {
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
                        try {
                            applyFilters();
                        } catch (error) {
                            console.error('Ошибка при применении фильтров:', error);
                        }
                    });
                    executorSuggestions.appendChild(div);
                });
            } else {
                executorSuggestions.classList.add('hidden');
                filters.executors = '';
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            }
        });
    }

    const projectInput = document.getElementById('projectFilter');
    const projectSuggestions = document.getElementById('projectSuggestions');
    if (projectInput && projectSuggestions) {
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
                        try {
                            applyFilters();
                        } catch (error) {
                            console.error('Ошибка при применении фильтров:', error);
                        }
                    });
                    projectSuggestions.appendChild(div);
                });
            } else {
                projectSuggestions.classList.add('hidden');
                filters.project = '';
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            }
        });
    }

    const customerInput = document.getElementById('customerFilter');
    const customerSuggestions = document.getElementById('customerSuggestions');
    if (customerInput && customerSuggestions) {
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
                        try {
                            applyFilters();
                        } catch (error) {
                            console.error('Ошибка при применении фильтров:', error);
                        }
                    });
                    customerSuggestions.appendChild(div);
                });
            } else {
                customerSuggestions.classList.add('hidden');
                filters.customer = '';
                try {
                    applyFilters();
                } catch (error) {
                    console.error('Ошибка при применении фильтров:', error);
                }
            }
        });
    }

    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => {
            try {
                openEditModal(null);
            } catch (error) {
                console.error('Ошибка при открытии модального окна:', error);
            }
        });
    }

    document.addEventListener('click', e => {
        if (executorInput && !executorInput.contains(e.target) && !executorSuggestions.contains(e.target)) {
            executorSuggestions.classList.add('hidden');
        }
        if (projectInput && !projectInput.contains(e.target) && !projectSuggestions.contains(e.target)) {
            projectSuggestions.classList.add('hidden');
        }
        if (customerInput && !customerInput.contains(e.target) && !customerSuggestions.contains(e.target)) {
            customerSuggestions.classList.add('hidden');
        }
    });

    try {
        syncCustomers().then(() => {
            applyFilters();
        }).catch(error => {
            console.error('Ошибка при синхронизации заказчиков:', error);
        });
    } catch (error) {
        console.error('Ошибка при вызове syncCustomers:', error);
    }
}

async function initEmployeesTab() {
    let allExecutors = executors.length ? executors : await fetchExecutors().catch(error => {
        console.error('Ошибка при загрузке исполнителей:', error);
        showNotification('Не удалось загрузить исполнителей');
        return [];
    });
    const listContainer = document.querySelector('#allExecutorsList');
    if (!listContainer) {
        console.error('Элемент #allExecutorsList не найден');
        return;
    }

    function createExecutorCustomModal(executor = null) {
        const isEdit = !!executor;
        const modal = document.createElement('div');
        modal.className = 'customModal';
        modal.innerHTML = `
            <div class="customModal-content">
                <h2>${isEdit ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
                <form id="executorCustomForm">
                    <label>Имя сотрудника *</label>
                    <input type="text" id="modalExecutorName" value="${executor?.name || ''}" required>
                    <label>Номер телефона</label>
                    <input type="text" id="modalExecutorPhone" value="${executor?.phone_number || ''}" placeholder="Номер телефона (+998...)">
                    <div class="customModal-actions">
                        <button type="submit" class="action-btn" id="saveExecutorCustomModal">${isEdit ? 'Сохранить' : 'Добавить'}</button>
                        <button type="button" class="action-btn cancel-btn" id="cancelExecutorCustomModal">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Анимация открытия
        setTimeout(() => modal.classList.add('customModal-open'), 10);

        const form = modal.querySelector('#executorCustomForm');
        const nameInput = modal.querySelector('#modalExecutorName');
        const phoneInput = modal.querySelector('#modalExecutorPhone');
        const cancelButton = modal.querySelector('#cancelExecutorCustomModal');

        async function handleSave(e) {
            e.preventDefault();
            const newName = nameInput.value.trim();
            const newPhone = phoneInput.value.trim();

            console.log(`${isEdit ? 'Сохранение изменений' : 'Добавление'} сотрудника:`, { id: executor?.id, newName, newPhone });

            if (!newName) {
                showNotification('Имя сотрудника не может быть пустым');
                return;
            }
            try {
                executors.length = 0;
                executors.push(...(await fetchExecutors()));
                const nameConflict = executors.find(ex =>
                    ex.name.toLowerCase() === newName.toLowerCase() && (!isEdit || ex.id !== executor?.id)
                );
                const phoneConflict = newPhone && executors.find(ex =>
                    ex.phone_number === newPhone && (!isEdit || ex.id !== executor?.id)
                );
                if (nameConflict) {
                    showNotification('Сотрудник с таким именем уже существует');
                    return;
                }
                if (phoneConflict) {
                    showNotification('Сотрудник с таким номером телефона уже существует');
                    return;
                }
                if (isEdit) {
                    await updateExecutor(executor.id, { name: newName, phone_number: newPhone });
                    for (const task of tasks) {
                        if (task.executors.includes(executor.name)) {
                            task.executors = task.executors.map(ex => ex === executor.name ? newName : ex);
                            await createHistory(
                                task.id,
                                `Сотрудник изменён с "${executor.name}" на "${newName}"${newPhone ? ` (${newPhone})` : ''}`,
                                "Текущий пользователь"
                            );
                        }
                    }
                    showNotification(`Сотрудник "${newName}" обновлён`);
                } else {
                    await createExecutor({ name: newName, phone_number: newPhone });
                    showNotification(`Сотрудник "${newName}" добавлен`);
                }
                executors.length = 0;
                executors.push(...(await fetchExecutors()));
                await refreshExecutorsList();
                applyFilters();
                modal.classList.remove('customModal-open');
                setTimeout(() => document.body.removeChild(modal), 300);
            } catch (error) {
                console.error(`Ошибка при ${isEdit ? 'обновлении' : 'добавлении'} сотрудника:`, error);
                showNotification(`Не удалось ${isEdit ? 'обновить' : 'добавить'} сотрудника: ${error.message}`);
            }
        }

        form.addEventListener('submit', handleSave);
        cancelButton.addEventListener('click', () => {
            modal.classList.remove('customModal-open');
            setTimeout(() => document.body.removeChild(modal), 300);
        });
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('customModal-open');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });
        nameInput.focus();
    }

    async function refreshExecutorsList() {
        listContainer.innerHTML = `
            <div class="executors-header">
                <button class="action-btn" id="addExecutorBtn">Добавить сотрудника</button>
            </div>
            <table class="executors-table">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Телефон</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${allExecutors.length ? allExecutors.map(executor => `
                        <tr class="executor-list-item" data-executor="${executor.name}" data-id="${executor.id}">
                            <td><span class="executor-name">${executor.name}</span></td>
                            <td class="executor-phone">${executor.phone_number || 'Не указан'}</td>
                            <td class="executor-actions">
                                <button class="edit-executor-btn" data-id="${executor.id}">
                                    <img src="./image/pencil.svg" alt="Редактировать" width="16" height="16" />
                                </button>
                                <button class="delete-executor-btn" data-id="${executor.id}">
                                    <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                                </button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="3">Нет сотрудников</td></tr>'}
                </tbody>
            </table>
        `;

        listContainer.querySelector('#addExecutorBtn').addEventListener('click', () => createExecutorCustomModal());

        listContainer.querySelectorAll('.edit-executor-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const executor = allExecutors.find(ex => ex.id === parseInt(id));
                if (executor) {
                    createExecutorCustomModal(executor);
                } else {
                    console.error('Сотрудник не найден:', id);
                    showNotification('Ошибка: сотрудник не найден');
                }
            });
        });

        listContainer.querySelectorAll('.delete-executor-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const executorName = e.currentTarget.closest('.executor-list-item').dataset.executor;
                if (confirm(`Вы уверены, что хотите удалить сотрудника "${executorName}"? Это удалит его из всех задач и подзадач.`)) {
                    try {
                        for (const task of tasks) {
                            if (task.executors.includes(executorName)) {
                                await removeExecutorFromTask(task.id, id);
                                await createHistory(
                                    task.id,
                                    `Удалён сотрудник: "${executorName}"`,
                                    "Текущий пользователь"
                                );
                                task.executors = task.executors.filter(ex => ex !== executorName);
                            }
                            for (const subtask of task.subtasks) {
                                if (subtask.executorId === parseInt(id)) {
                                    if (typeof updateSubtask === 'function') {
                                        await updateSubtask(subtask.id, {
                                            ...subtask,
                                            taskId: task.id,
                                            executorId: null,
                                            executorName: 'Не назначен'
                                        });
                                        await createHistory(
                                            task.id,
                                            `Сотрудник "${executorName}" удалён из подзадачи "${subtask.description || 'без описания'}"`,
                                            "Текущий пользователь"
                                        );
                                        subtask.executorId = null;
                                        subtask.executorName = 'Не назначен';
                                    } else {
                                        console.warn('Функция updateSubtask не определена, пропускаем обновление подзадачи');
                                    }
                                }
                            }
                        }
                        await deleteExecutor(id);
                        executors.length = 0;
                        executors.push(...(await fetchExecutors()));
                        await refreshExecutorsList();
                        applyFilters();
                        showNotification(`Сотрудник "${executorName}" удалён`);
                    } catch (error) {
                        console.error('Ошибка при удалении сотрудника:', error);
                        showNotification(`Ошибка при удалении сотрудника: ${error.message}`);
                    }
                }
            });
        });
    }

    await refreshExecutorsList();
}

async function initCustomersTab() {
    let allCustomers = customers.length ? customers : await fetchCustomers().catch(error => {
        console.error('Ошибка при загрузке заказчиков:', error);
        showNotification('Не удалось загрузить заказчиков');
        return [];
    });
    const listContainer = document.querySelector('#allCustomersList');
    if (!listContainer) {
        console.error('Не найден элемент #allCustomersList');
        showNotification('Ошибка интерфейса заказчиков');
        return;
    }

    let regions = [];
    try {
        regions = await fetchRegions();
        console.log('Загруженные регионы:', regions);
    } catch (error) {
        console.error('Ошибка при загрузке регионов:', error);
        showNotification('Не удалось загрузить регионы');
    }

    function createCustomerCustomModal(customer = null) {
        const isEdit = !!customer;
        const modal = document.createElement('div');
        modal.className = 'customModal';
        modal.innerHTML = `
            <div class="customModal-content">
                <h2>${isEdit ? 'Редактировать заказчика' : 'Добавить заказчика'}</h2>
                <form id="customerCustomForm">
                    <label>Название компании *</label>
                    <input type="text" id="modalCustomerName" value="${customer?.name || ''}" required>
                    <label>Регион</label>
                    <select id="modalCustomerRegion">
                        <option value="">Выберите регион</option>
                        ${regions.map(region => `<option value="${region.id}" ${customer?.region?.id === region.id ? 'selected' : ''}>${region.region_name}</option>`).join('')}
                    </select>
                    <label>ИНН (12 цифр)</label>
                    <input type="text" id="modalCustomerTIN" value="${customer?.inn || ''}" placeholder="ИНН (12 цифр)">
                    <label>ПИНФЛ</label>
                    <input type="text" id="modalCustomerPINFL" value="${customer?.pinfl || ''}" placeholder="ПИНФЛ">
                    <label>Контактное лицо</label>
                    <input type="text" id="modalCustomerContactPerson" value="${customer?.contact_person || ''}" placeholder="Контактное лицо">
                    <label>Номер телефона</label>
                    <input type="text" id="modalCustomerPhone" value="${customer?.phone_number || ''}" placeholder="Номер телефона">
                    <div class="customModal-actions">
                        <button type="submit" class="action-btn" id="saveCustomerCustomModal">${isEdit ? 'Сохранить' : 'Добавить'}</button>
                        <button type="button" class="action-btn cancel-btn" id="cancelCustomerCustomModal">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Анимация открытия
        setTimeout(() => modal.classList.add('customModal-open'), 10);

        const form = modal.querySelector('#customerCustomForm');
        const nameInput = modal.querySelector('#modalCustomerName');
        const regionSelect = modal.querySelector('#modalCustomerRegion');
        const innInput = modal.querySelector('#modalCustomerTIN');
        const pinflInput = modal.querySelector('#modalCustomerPINFL');
        const contactInput = modal.querySelector('#modalCustomerContactPerson');
        const phoneInput = modal.querySelector('#modalCustomerPhone');
        const cancelButton = modal.querySelector('#cancelCustomerCustomModal');

        async function handleSave(e) {
            e.preventDefault();
            const newName = nameInput.value.trim();
            const newRegionId = regionSelect.value || "0";
            const newInn = innInput.value.trim() || "Не указано";
            const newPinfl = pinflInput.value.trim() || "Не указано";
            const newContact = contactInput.value.trim() || "Не указано";
            const newPhone = phoneInput.value.trim() || "Не указано";

            console.log(`${isEdit ? 'Сохранение изменений' : 'Добавление'} заказчика:`, { id: customer?.id, newName, newRegionId, newInn, newPinfl, newContact, newPhone });

            if (!newName) {
                showNotification('Название компании обязательно');
                return;
            }
            if (newInn !== "Не указано" && !/^\d{12}$/.test(newInn)) {
                showNotification('ИНН должен содержать 12 цифр');
                return;
            }
            try {
                customers.length = 0;
                customers.push(...(await fetchCustomers()));
                const nameConflict = customers.find(c =>
                    c.name.toLowerCase() === newName.toLowerCase() && (!isEdit || c.id !== customer?.id)
                );
                if (nameConflict) {
                    showNotification('Заказчик с таким названием уже существует');
                    return;
                }
                if (isEdit) {
                    await updateCustomer(customer.id, {
                        name: newName,
                        regionId: newRegionId,
                        inn: newInn,
                        pinfl: newPinfl,
                        contact_person: newContact,
                        phone_number: newPhone
                    });
                    showNotification(`Заказчик "${newName}" обновлён`);
                } else {
                    await createCustomer({
                        name: newName,
                        regionId: newRegionId,
                        inn: newInn,
                        pinfl: newPinfl,
                        contact_person: newContact,
                        phone_number: newPhone
                    });
                    showNotification(`Заказчик "${newName}" добавлен`);
                }
                customers.length = 0;
                customers.push(...(await fetchCustomers()));
                await refreshCustomersList();
                applyFilters();
                modal.classList.remove('customModal-open');
                setTimeout(() => document.body.removeChild(modal), 300);
            } catch (error) {
                console.error(`Ошибка при ${isEdit ? 'обновлении' : 'добавлении'} заказчика:`, error);
                showNotification(`Не удалось ${isEdit ? 'обновить' : 'добавить'} заказчика: ${error.message}`);
            }
        }

        form.addEventListener('submit', handleSave);
        cancelButton.addEventListener('click', () => {
            modal.classList.remove('customModal-open');
            setTimeout(() => document.body.removeChild(modal), 300);
        });
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('customModal-open');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });
        nameInput.focus();
    }

    async function refreshCustomersList() {
        listContainer.innerHTML = `
            <div class="customers-header">
                <button class="action-btn" id="addCustomerBtn">Добавить заказчика</button>
            </div>
            <table class="customers-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Регион</th>
                        <th>ИНН</th>
                        <th>ПИНФЛ</th>
                        <th>Контактное лицо</th>
                        <th>Телефон</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${allCustomers.length ? allCustomers.map(customer => `
                        <tr class="customer-list-item" data-customer="${customer.name}" data-id="${customer.id}">
                            <td><span class="customer-name">${customer.name}</span></td>
                            <td class="customer-region">${customer.region?.region_name || 'Не указан'}</td>
                            <td class="customer-inn">${customer.inn || 'Не указан'}</td>
                            <td class="customer-pinfl">${customer.pinfl || 'Не указан'}</td>
                            <td class="customer-contact">${customer.contact_person || 'Не указан'}</td>
                            <td class="customer-phone">${customer.phone_number || 'Не указан'}</td>
                            <td class="customer-actions">
                                <button class="edit-customer-btn" data-id="${customer.id}">
                                    <img src="./image/pencil.svg" alt="Редактировать" width="16" height="16" />
                                </button>
                                <button class="delete-customer-btn" data-id="${customer.id}">
                                    <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                                </button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="7">Нет заказчиков</td></tr>'}
                </tbody>
            </table>
        `;

        listContainer.querySelector('#addCustomerBtn').addEventListener('click', () => createCustomerCustomModal());

        listContainer.querySelectorAll('.edit-customer-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const customer = allCustomers.find(c => c.id === parseInt(id));
                if (customer) {
                    createCustomerCustomModal(customer);
                } else {
                    console.error('Заказчик не найден:', id);
                    showNotification('Ошибка: заказчик не найден');
                }
            });
        });

        listContainer.querySelectorAll('.delete-customer-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const customerName = e.currentTarget.closest('.customer-list-item').dataset.customer;
                if (confirm(`Вы уверены, что хотите удалить заказчика "${customerName}"?`)) {
                    try {
                        await deleteCustomer(id);
                        customers.length = 0;
                        customers.push(...(await fetchCustomers()));
                        await refreshCustomersList();
                        applyFilters();
                        showNotification(`Заказчик "${customerName}" удалён`);
                    } catch (error) {
                        console.error('Ошибка при удалении заказчика:', error);
                        showNotification(`Ошибка при удалении заказчика: ${error.message}`);
                    }
                }
            });
        });
    }

    await refreshCustomersList();
}

async function initRegionsTab() {
    let regions = [];
    try {
        regions = await fetchRegions();
    } catch (error) {
        console.error('Ошибка при загрузке регионов:', error);
        showNotification('Не удалось загрузить регионы');
    }
    const listContainer = document.querySelector('#allRegionsList');
    if (!listContainer) {
        console.error('Элемент #allRegionsList не найден');
        return;
    }

    function createRegionCustomModal(region = null) {
        const isEdit = !!region;
        const modal = document.createElement('div');
        modal.className = 'customModal';
        modal.innerHTML = `
            <div class="customModal-content">
                <h2>${isEdit ? 'Редактировать регион' : 'Добавить регион'}</h2>
                <form id="regionCustomForm">
                    <label>Название региона *</label>
                    <input type="text" id="modalRegionName" value="${region?.region_name || ''}" required>
                    <div class="customModal-actions">
                        <button type="submit" class="action-btn" id="saveRegionCustomModal">${isEdit ? 'Сохранить' : 'Добавить'}</button>
                        <button type="button" class="action-btn cancel-btn" id="cancelRegionCustomModal">Отмена</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Анимация открытия
        setTimeout(() => modal.classList.add('customModal-open'), 10);

        const form = modal.querySelector('#regionCustomForm');
        const nameInput = modal.querySelector('#modalRegionName');
        const cancelButton = modal.querySelector('#cancelRegionCustomModal');

        async function handleSave(e) {
            e.preventDefault();
            const newName = nameInput.value.trim();

            console.log(`${isEdit ? 'Сохранение изменений' : 'Добавление'} региона:`, { id: region?.id, newName });

            if (!newName) {
                showNotification('Название региона обязательно');
                return;
            }
            try {
                regions.length = 0;
                regions.push(...(await fetchRegions()));
                const existingRegion = regions.find(r =>
                    r.region_name.toLowerCase() === newName.toLowerCase() && (!isEdit || r.id !== region?.id)
                );
                if (existingRegion) {
                    showNotification('Регион с таким названием уже существует');
                    return;
                }
                if (isEdit) {
                    await updateRegion(region.id, { region_name: newName });
                    showNotification(`Регион "${newName}" обновлён`);
                } else {
                    await createRegion({ region_name: newName });
                    showNotification(`Регион "${newName}" добавлен`);
                }
                regions.length = 0;
                regions.push(...(await fetchRegions()));
                await refreshRegionsList();
                modal.classList.remove('customModal-open');
                setTimeout(() => document.body.removeChild(modal), 300);
            } catch (error) {
                console.error(`Ошибка при ${isEdit ? 'обновлении' : 'добавлении'} региона:`, error);
                showNotification(`Не удалось ${isEdit ? 'обновить' : 'добавить'} регион: ${error.message}`);
            }
        }

        form.addEventListener('submit', handleSave);
        cancelButton.addEventListener('click', () => {
            modal.classList.remove('customModal-open');
            setTimeout(() => document.body.removeChild(modal), 300);
        });
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('customModal-open');
                setTimeout(() => document.body.removeChild(modal), 300);
            }
        });
        nameInput.focus();
    }

    async function refreshRegionsList() {
        listContainer.innerHTML = `
            <div class="regions-header">
                <button class="action-btn" id="addRegionBtn">Добавить регион</button>
            </div>
            <table class="regions-table">
                <thead>
                    <tr>
                        <th>Название региона</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${regions.length ? regions.map(region => `
                        <tr class="region-list-item" data-id="${region.id}">
                            <td><span class="region-name">${region.region_name}</span></td>
                            <td class="region-actions">
                                <button class="edit-region-btn" data-id="${region.id}">
                                    <img src="./image/pencil.svg" alt="Редактировать" width="16" height="16" />
                                </button>
                                <button class="delete-region-btn" data-id="${region.id}">
                                    <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                                </button>
                            </td>
                        </tr>
                    `).join('') : '<tr><td colspan="2">Нет регионов</td></tr>'}
                </tbody>
            </table>
        `;

        listContainer.querySelector('#addRegionBtn').addEventListener('click', () => createRegionCustomModal());

        listContainer.querySelectorAll('.edit-region-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const region = regions.find(r => r.id === parseInt(id));
                if (region) {
                    createRegionCustomModal(region);
                } else {
                    console.error('Регион не найден:', id);
                    showNotification('Ошибка: регион не найден');
                }
            });
        });

        listContainer.querySelectorAll('.delete-region-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const regionName = e.currentTarget.closest('.region-list-item').querySelector('.region-name').textContent;
                if (confirm(`Вы уверены, что хотите удалить регион "${regionName}"?`)) {
                    try {
                        await deleteRegion(id);
                        regions.length = 0;
                        regions.push(...(await fetchRegions()));
                        showNotification(`Регион "${regionName}" удалён`);
                        await refreshRegionsList();
                    } catch (error) {
                        console.error('Ошибка при удалении региона:', error);
                        showNotification(`Ошибка: ${error.message}`);
                    }
                }
            });
        });
    }

    await refreshRegionsList();
}