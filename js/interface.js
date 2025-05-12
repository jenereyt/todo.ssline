import { openGlobalExecutorModal } from './executorsModal.js';
import { tasks, executors, getAllExecutors, filters, sortState, allProjects, openEditModal, applyFilters, paginationState } from './app.js';

export function createTable(taskList) {
    const appDiv = document.getElementById("app");
    const existingTable = appDiv.querySelector("table");
    const existingPagination = appDiv.querySelector(".pagination");
    if (existingTable) existingTable.remove();
    if (existingPagination) existingPagination.remove();

    const totalPages = Math.ceil(taskList.length / paginationState.tasksPerPage);
    const startIndex = (paginationState.currentPage - 1) * paginationState.tasksPerPage;
    const endIndex = startIndex + paginationState.tasksPerPage;
    const paginatedTasks = taskList.slice(startIndex, endIndex);

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th data-sort="id">№</th>
                <th data-sort="dateSet">Дата постановки</th>
                <th data-sort="project">Проект/Заказчик</th>
                <th data-sort="theme">Тема</th>
                <th data-sort="description">Описание</th>
                <th data-sort="executors">Исполнители</th>
                <th data-sort="deadline">Дедлайн</th>
                <th data-sort="status">Статус</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    paginatedTasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.dateSet || "Не указана"}</td>
            <td>${task.project || "Без проекта"}</td>
            <td>${task.theme || "Нет темы"}</td>
            <td>${task.description || "Нет описания"}</td>
            <td>${task.executors.length ? task.executors.join(", ") : "Не назначены"}</td>
            <td>${task.deadline || "Не указан"}</td>
            <td>${task.status || "Не указан"}</td>
        `;
        row.addEventListener("click", () => openEditModal(task.id)); // Исправлено: передаём task.id
        tbody.appendChild(row);
    });

    table.querySelectorAll("th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            const field = th.dataset.sort;
            table.querySelectorAll("th").forEach(header => header.innerHTML = header.innerHTML.replace(" ↑", "").replace(" ↓", ""));
            if (sortState.field === field) {
                sortState.ascending = !sortState.ascending;
            } else {
                sortState.field = field;
                sortState.ascending = true;
            }
            th.innerHTML += sortState.ascending ? " ↑" : " ↓";
            applyFilters();
        });
    });

    appDiv.appendChild(table);
    renderPagination(taskList, totalPages);
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
                        <input type="text" id="executorFilter" placeholder="Введите имя исполнителя">
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
                <button id="resetFiltersBtn"><img src="./image/trash.svg" alt="Сбросить"></button>
            </div>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Поиск по задачам...">
                <button id="searchBtn"><img src="./image/search.svg" alt="Поиск" width="16" height="16"></button>
            </div>
            <button id="addGlobalExecutorBtn">Управление исполнителями</button>
        </div>
    `;
    createTable(tasks);

    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    dateFrom.value = '';
    dateTo.value = '';
    filters.dateFrom = '';
    filters.dateTo = '';
    applyFilters();

    [dateFrom, dateTo].forEach(input => {
        input.addEventListener('change', () => {
            filters.dateFrom = dateFrom.value;
            filters.dateTo = dateTo.value;
            applyFilters();
        });
    });

    // Остальной код остаётся без изменений
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

    document.getElementById('resetFiltersBtn').addEventListener('click', () => {
        Object.keys(filters).forEach(key => delete filters[key]);
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('executorFilter').value = '';
        document.getElementById('projectFilter').value = '';
        document.getElementById('searchInput').value = '';
        clearExecutorBtn.classList.add('hidden');
        clearProjectBtn.classList.add('hidden');
        sortState.field = null;
        sortState.ascending = true;
        paginationState.currentPage = 1;
        applyFilters();
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredTasks = tasks.filter(
            task =>
                task.id.toString().includes(searchTerm) ||
                (task.dateSet || '').toLowerCase().includes(searchTerm) ||
                (task.project || '').toLowerCase().includes(searchTerm) ||
                (task.theme || '').toLowerCase().includes(searchTerm) ||
                (task.description || '').toLowerCase().includes(searchTerm) ||
                task.executors.some(ex => ex.toLowerCase().includes(searchTerm)) ||
                (task.status || '').toLowerCase().includes(searchTerm)
        );
        paginationState.currentPage = 1;
        createTable(filteredTasks);
    });

    document.getElementById('searchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') document.getElementById('searchBtn').click();
    });

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

    document.getElementById('addGlobalExecutorBtn').addEventListener('click', () => {
        openGlobalExecutorModal();
    });

    document.addEventListener('click', e => {
        if (!executorInput.contains(e.target) && !executorSuggestions.contains(e.target)) {
            executorSuggestions.classList.add('hidden');
        }
        if (!projectInput.contains(e.target) && !projectSuggestions.contains(e.target)) {
            projectSuggestions.classList.add('hidden');
        }
    });
}
//l
export function renderPagination(taskList, totalPages) {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Назад";
    prevBtn.disabled = paginationState.currentPage === 1;
    prevBtn.addEventListener("click", () => {
        if (paginationState.currentPage > 1) {
            paginationState.currentPage--;
            createTable(taskList);
        }
    });
    paginationDiv.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.toggle("active", i === paginationState.currentPage);
        pageBtn.addEventListener("click", () => {
            paginationState.currentPage = i;
            createTable(taskList);
        });
        paginationDiv.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Вперед";
    nextBtn.disabled = paginationState.currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        if (paginationState.currentPage < totalPages) {
            paginationState.currentPage++;
            createTable(taskList);
        }
    });
    paginationDiv.appendChild(nextBtn);

    const appDiv = document.getElementById("app");
    appDiv.appendChild(paginationDiv);
}
