import { tasks, filters, currentPage, createTable } from './table.js';
import { applyFilters } from './utils.js';
import { openGlobalExecutorModal } from './modal.js';


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

    // Автоматическое применение фильтров по дате
    let dateFrom = document.getElementById("dateFrom");
    let dateTo = document.getElementById("dateTo");
    [dateFrom, dateTo].forEach(input => {
        input.addEventListener("change", () => {
            filters.dateFrom = dateFrom.value;
            filters.dateTo = dateTo.value;
            applyFilters();
        });
    });

    // Кнопка очистки для исполнителя
    document.getElementById("clearExecutor").addEventListener("click", () => {
        document.getElementById("executorFilter").value = "";
        filters.executors = "";
        applyFilters();
    });

    // Сброс всех фильтров
    document.getElementById("resetFiltersBtn").addEventListener("click", () => {
        filters = {};
        document.getElementById("dateFrom").value = "";
        document.getElementById("dateTo").value = "";
        document.getElementById("executorFilter").value = "";
        document.getElementById("searchInput").value = "";
        sortState = { field: null, ascending: true };
        currentPage = 1;
        createTable(tasks);
    });

    // Поиск
    document.getElementById("searchBtn").addEventListener("click", () => {
        let searchTerm = document.getElementById("searchInput").value.toLowerCase();
        let filteredTasks = tasks.filter(task =>
            task.id.toString().includes(searchTerm) ||
            task.dateSet.toLowerCase().includes(searchTerm) ||
            task.project.toLowerCase().includes(searchTerm) ||
            task.theme.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            task.executors.some(ex => ex.toLowerCase().includes(searchTerm)) ||
            (task.dateCompleted && task.dateCompleted.toLowerCase().includes(searchTerm)) ||
            task.accepted.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        createTable(filteredTasks);
    });
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") document.getElementById("searchBtn").click();
    });

    // Автодополнение для исполнителя
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

    // Глобальная кнопка "Добавить исполнителя"
    document.getElementById("addGlobalExecutorBtn").addEventListener("click", () => {
        openGlobalExecutorModal();
    });

    // Закрытие предложений при клике вне
    document.addEventListener("click", (e) => {
        if (!executorInput.contains(e.target) && !executorSuggestions.contains(e.target)) {
            executorSuggestions.classList.add("hidden");
        }
    });
}

document.addEventListener("DOMContentLoaded", createInterface);