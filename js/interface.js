// В interface.js
import { openGlobalExecutorModal, refreshExecutorsList } from './executorsModal.js';
import { tasks, getAllExecutors, filters, sortState, allProjects, openEditModal, bindEventListeners, applyFilters, paginationState } from './app.js'; // Обновленный импорт

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
            <td>${task.dateSet}</td>
            <td>${task.project}</td>
            <td>${task.theme}</td>
            <td>${task.description}</td>
            <td>${task.executors.length ? task.executors.join(", ") : "Не назначены"}</td>
            <td>${task.status || "Не указан"}</td>
        `;
        row.addEventListener("click", () => openEditModal(task));
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
    let appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <div class="controls">
            <div class="filters">
                <div class="filter-group">
                    <label>Диапазон дат:</label>
                    <div class="date-range">
                        <input type="date" id="dateFrom" placeholder="С">
                        <input type="date" id="dateTo" placeholder="По">
                    </div>
                </div>
                <div class="filter-group">
                    <label>Исполнитель:</label>
                    <div class="input-with-clear">
                        <input type="text" id="executorFilter" placeholder="Введите исполнителя...">
                        <button class="clear-btn" id="clearExecutor">×</button>
                    </div>
                    <div id="executorSuggestions" class="suggestions hidden"></div>
                </div>
                <button id="resetFiltersBtn">Сбросить все</button>
            </div>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Поиск по таблице...">
                <button id="searchBtn">🔍</button>
                <button id="addGlobalExecutorBtn">Исполнители</button>
            </div>
        </div>
    `;
    createTable(tasks);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedFirstDay = firstDayOfMonth.toISOString().split("T")[0];
    const dateFrom = document.getElementById("dateFrom");
    dateFrom.value = formattedFirstDay;
    filters.dateFrom = formattedFirstDay;
    applyFilters();

    let dateTo = document.getElementById("dateTo");
    [dateFrom, dateTo].forEach(input => {
        input.addEventListener("change", () => {
            filters.dateFrom = dateFrom.value;
            filters.dateTo = dateTo.value;
            applyFilters();
        });
    });

    document.getElementById("clearExecutor").addEventListener("click", () => {
        document.getElementById("executorFilter").value = "";
        filters.executors = "";
        applyFilters();
    });

    document.getElementById("resetFiltersBtn").addEventListener("click", () => {
        Object.keys(filters).forEach(key => delete filters[key]);  // Очистка всех свойств
        document.getElementById("dateFrom").value = formattedFirstDay;
        document.getElementById("dateTo").value = "";
        document.getElementById("executorFilter").value = "";
        document.getElementById("searchInput").value = "";
        sortState.field = null;
        sortState.ascending = true;
        paginationState.currentPage = 1;
        filters.dateFrom = formattedFirstDay;
        applyFilters();
    });

    document.getElementById("searchBtn").addEventListener("click", () => {
        let searchTerm = document.getElementById("searchInput").value.toLowerCase();
        let filteredTasks = tasks.filter(task =>
            task.id.toString().includes(searchTerm) ||
            task.dateSet.toLowerCase().includes(searchTerm) ||
            task.project.toLowerCase().includes(searchTerm) ||
            task.theme.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            task.executors.some(ex => ex.toLowerCase().includes(searchTerm)) ||
            task.status.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        createTable(filteredTasks);
    });
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") document.getElementById("searchBtn").click();
    });

    const executorInput = document.getElementById("executorFilter");
    const executorSuggestions = document.getElementById("executorSuggestions");
    executorInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        executorSuggestions.innerHTML = "";
        if (value) {
            executorSuggestions.classList.remove("hidden");
            const allExecutors = getAllExecutors();
            const matches = allExecutors.filter(ex => ex.toLowerCase().includes(value));
            matches.forEach(match => {
                const div = document.createElement("div");
                div.textContent = match;
                div.className = "suggestion-item";
                div.style.cursor = "pointer";
                div.addEventListener("click", () => {
                    executorInput.value = match;
                    filters.executors = match;
                    executorSuggestions.classList.add("hidden");
                    applyFilters();
                });
                executorSuggestions.appendChild(div);
            });
        } else {
            executorSuggestions.classList.add("hidden");
            filters.executors = "";
            applyFilters();
        }
    });

    document.getElementById("addGlobalExecutorBtn").addEventListener("click", () => {
        openGlobalExecutorModal();
    });

    document.addEventListener("click", (e) => {
        if (!executorInput.contains(e.target) && !executorSuggestions.contains(e.target)) {
            executorSuggestions.classList.add("hidden");
        }
    });
}
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