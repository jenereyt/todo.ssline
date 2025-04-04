// Объект для хранения фильтров и состояния сортировки
let filters = {};
let sortState = { field: null, ascending: true };

// Уникальный список всех проектов для рекомендаций
let allProjects = [...new Set(tasks.map(task => task.project))];

// Функция для получения актуального списка исполнителей
function getAllExecutors() {
    return [...new Set(tasks.flatMap(task => task.executors))];
}

let currentPage = 1;
let tasksPerPage = 20;

function createInterface() {
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

    // Установка даты начала текущего месяца
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedFirstDay = firstDayOfMonth.toISOString().split("T")[0]; // Формат YYYY-MM-DD
    const dateFrom = document.getElementById("dateFrom");
    dateFrom.value = formattedFirstDay; // Устанавливаем значение по умолчанию
    filters.dateFrom = formattedFirstDay; // Обновляем фильтр
    applyFilters(); // Применяем фильтры сразу после установки даты

    // Автоматическое применение фильтров по дате
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
        document.getElementById("dateFrom").value = formattedFirstDay; // Восстанавливаем начало месяца
        document.getElementById("dateTo").value = "";
        document.getElementById("executorFilter").value = "";
        document.getElementById("searchInput").value = "";
        sortState = { field: null, ascending: true };
        currentPage = 1;
        filters.dateFrom = formattedFirstDay; // Устанавливаем фильтр снова
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

function applyFilters() {
    filters.executors = document.getElementById("executorFilter").value;

    let filteredTasks = tasks.filter(task => {
        return (
            (!filters.executors || task.executors.some(ex => ex.toLowerCase().includes(filters.executors.toLowerCase()))) &&
            (!filters.dateFrom || task.dateSet >= filters.dateFrom) &&
            (!filters.dateTo || task.dateSet <= filters.dateTo)
        );
    });
    sortTasks(filteredTasks);
    currentPage = 1;
    createTable(filteredTasks);
}

function openGlobalExecutorModal() {
    const modal = document.createElement("div");
    modal.className = "modal";

    // Get all executors
    const allExecutors = getAllExecutors();

    modal.innerHTML = `
        <div class="modal-contente">
            <h2>Управление исполнителями</h2>
            
            <!-- Секция добавления нового исполнителя -->
            <div class="add-executor-section">
                <h3>Добавить нового исполнителя</h3>
                <div class="input-with-clear">
                    <input type="text" id="newGlobalExecutor" placeholder="Введите имя исполнителя">
                    <button id="saveGlobalExecutor" class="action-btn">Добавить</button>
                </div>
                <div class="suggestions" id="globalExecutorSuggestions"></div>
            </div>
            
            <!-- Секция списка всех исполнителей -->
            <div class="all-executors-section">
                <h3>Список исполнителей</h3>
                <div class="executors-list" id="allExecutorsList">
                    ${allExecutors.map(executor => `
                        <div class="executor-list-item" data-executor="${executor}">
                            <span class="executor-name">${executor}</span>
                            <div class="executor-actions">
                                <button class="edit-executor-btn" data-executor="${executor}">✏️</button>
                                <button class="delete-executor-btn" data-executor="${executor}">🗑️</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Модальное окно редактирования (скрыто по умолчанию) -->
            <div id="editExecutorPanel" class="edit-executor-panel hidden">
                <h3>Редактировать исполнителя</h3>
                <input type="text" id="editExecutorInput">
                <input type="hidden" id="originalExecutorName">
                <div class="modal-buttons">
                    <button id="saveEditExecutor">Сохранить</button>
                    <button id="cancelEditExecutor">Отмена</button>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button id="closeGlobalModal">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Обработчик добавления нового исполнителя
    const input = modal.querySelector("#newGlobalExecutor");
    const suggestions = modal.querySelector("#globalExecutorSuggestions");

    input.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        suggestions.innerHTML = "";
        if (value) {
            const matches = allExecutors.filter(ex => ex.toLowerCase().includes(value) && !tasks.some(t => t.executors.includes(ex)));
            matches.forEach(match => {
                const div = document.createElement("div");
                div.textContent = match;
                div.className = "suggestion-item";
                div.style.cursor = "pointer";
                div.addEventListener("click", () => {
                    input.value = match;
                    suggestions.innerHTML = "";
                });
                suggestions.appendChild(div);
            });
        }
    });

    // Сохранение нового исполнителя
    modal.querySelector("#saveGlobalExecutor").addEventListener("click", () => {
        const newExecutor = input.value.trim();
        if (newExecutor && !allExecutors.includes(newExecutor)) {
            // Добавляем фиктивную задачу, чтобы исполнитель попал в пул
            tasks.push({
                id: tasks.length + 1,
                dateSet: new Date().toISOString().split("T")[0],
                project: "Без проекта",
                theme: "Без темы",
                description: "Фиктивная задача для исполнителя",
                completed: false,
                executors: [newExecutor],
                dateCompleted: "",
                accepted: "Нет",
                comments: [],
                files: []
            });

            // Обновляем список исполнителей в модальном окне
            refreshExecutorsList(modal);
            input.value = "";
        }
    });

    // Обработчики кнопок редактирования
    modal.querySelectorAll(".edit-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.target.dataset.executor;
            const editPanel = modal.querySelector("#editExecutorPanel");
            const editInput = modal.querySelector("#editExecutorInput");
            const originalInput = modal.querySelector("#originalExecutorName");

            editInput.value = executor;
            originalInput.value = executor;
            editPanel.classList.remove("hidden");
        });
    });

    // Обработчики кнопок удаления
    modal.querySelectorAll(".delete-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.target.dataset.executor;
            if (confirm(`Вы уверены, что хотите удалить исполнителя "${executor}"?`)) {
                // Удаляем исполнителя из всех задач
                tasks.forEach(task => {
                    task.executors = task.executors.filter(ex => ex !== executor);
                });
                refreshExecutorsList(modal);
            }
        });
    });

    // Сохранение отредактированного исполнителя
    modal.querySelector("#saveEditExecutor").addEventListener("click", () => {
        const newName = modal.querySelector("#editExecutorInput").value.trim();
        const originalName = modal.querySelector("#originalExecutorName").value;

        if (newName && newName !== originalName && !allExecutors.includes(newName)) {
            // Заменяем имя исполнителя во всех задачах
            tasks.forEach(task => {
                task.executors = task.executors.map(ex => ex === originalName ? newName : ex);
            });

            modal.querySelector("#editExecutorPanel").classList.add("hidden");
            refreshExecutorsList(modal);
        }
    });

    // Отмена редактирования
    modal.querySelector("#cancelEditExecutor").addEventListener("click", () => {
        modal.querySelector("#editExecutorPanel").classList.add("hidden");
    });

    // Закрытие модального окна
    modal.querySelector("#closeGlobalModal").addEventListener("click", () => modal.remove());
}

function refreshExecutorsList(modal) {
    const allExecutors = getAllExecutors();
    const listContainer = modal.querySelector("#allExecutorsList");

    listContainer.innerHTML = allExecutors.map(executor => `
        <div class="executor-list-item" data-executor="${executor}">
            <span class="executor-name">${executor}</span>
            <div class="executor-actions">
                <button class="edit-executor-btn" data-executor="${executor}">✏️</button>
                <button class="delete-executor-btn" data-executor="${executor}">🗑️</button>
            </div>
        </div>
    `).join('');

    // Перепривязываем обработчики событий
    modal.querySelectorAll(".edit-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.target.dataset.executor;
            const editPanel = modal.querySelector("#editExecutorPanel");
            const editInput = modal.querySelector("#editExecutorInput");
            const originalInput = modal.querySelector("#originalExecutorName");

            editInput.value = executor;
            originalInput.value = executor;
            editPanel.classList.remove("hidden");
        });
    });

    modal.querySelectorAll(".delete-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.target.dataset.executor;
            if (confirm(`Вы уверены, что хотите удалить исполнителя "${executor}"?`)) {
                // Удаляем исполнителя из всех задач
                tasks.forEach(task => {
                    task.executors = task.executors.filter(ex => ex !== executor);
                });
                refreshExecutorsList(modal);
            }
        });
    });
}

function updateExecutorList(task, modal) {
    const executorList = modal.querySelector("#executorList");
    const allExecutors = getAllExecutors();
    executorList.innerHTML = `
        ${task.executors.length ? task.executors.map(ex => `
            <div class="executor-item">
                <span>${ex}</span>
                <button class="remove-executor" data-executor="${ex}">×</button>
            </div>
        `).join('') : '<span>Не назначены</span>'}
        <select id="addExecutorSelect">
            <option value="">Добавить исполнителя</option>
            ${allExecutors.filter(ex => !task.executors.includes(ex)).map(ex => `
                <option value="${ex}">${ex}</option>
            `).join('')}
        </select>
    `;

    // Перепривязываем обработчики
    const addExecutorSelect = modal.querySelector("#addExecutorSelect");
    addExecutorSelect.addEventListener("change", (e) => {
        const newExecutor = e.target.value;
        if (newExecutor && !task.executors.includes(newExecutor)) {
            task.executors.push(newExecutor);
            updateExecutorList(task, modal);
        }
        e.target.value = "";
    });

    modal.querySelectorAll(".remove-executor").forEach(btn => {
        btn.addEventListener("click", () => {
            const executor = btn.dataset.executor;
            task.executors = task.executors.filter(ex => ex !== executor);
            updateExecutorList(task, modal);
        });
    });
}

function sortTasks(taskList) {
    if (!sortState.field) return;

    taskList.sort((a, b) => {
        let valA = a[sortState.field];
        let valB = b[sortState.field];

        if (sortState.field === "dateSet") {
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
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    });
}

function createTable(taskList) {
    const appDiv = document.getElementById("app");
    const existingTable = appDiv.querySelector("table");
    const existingPagination = appDiv.querySelector(".pagination");
    if (existingTable) existingTable.remove();
    if (existingPagination) existingPagination.remove();

    const totalPages = Math.ceil(taskList.length / tasksPerPage);
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
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
                <th data-sort="status">Статус</th> <!-- Обновлено -->
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
            <td>${task.status || "Не указан"}</td> <!-- Отображаем статус -->
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

function renderPagination(taskList, totalPages) {
    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Назад";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            createTable(taskList);
        }
    });
    paginationDiv.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.toggle("active", i === currentPage);
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            createTable(taskList);
        });
        paginationDiv.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Вперед";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            createTable(taskList);
        }
    });
    paginationDiv.appendChild(nextBtn);

    const appDiv = document.getElementById("app");
    appDiv.appendChild(paginationDiv);
}

function openEditModal(task) {
    const modal = document.createElement("div");
    modal.className = "modal trello-style-modal";

    if (!task.comments) task.comments = [];
    if (!task.files) task.files = [];

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <h2>${task.project}</h2>
                <span class="date-set">Дата постановки: ${task.dateSet}</span>
                <div class="header-actions">
                    <select id="statusSelect">
                        ${statuses.map(status => `
                            <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
                        `).join('')}
                    </select>
                    <button class="close-modal-btn" id="closeModalBtn">×</button>
                </div>
            </div>
            <div class="modal-body">
                <div class="main-content" id="mainContent">
                    <div class="field theme">
                        <h3>Тема</h3>
                        <div class="editable-field">
                            <span id="themeDisplay">${task.theme}</span>
                            <input type="text" id="editTheme" value="${task.theme}" class="hidden">
                            <button class="edit-btn" data-field="theme">✏️</button>
                        </div>
                    </div>
                    <div class="field description">
                        <h4>Описание</h4>
                        <div class="editable-field">
                            <span id="descriptionDisplay">${task.description}</span>
                            <textarea id="editDescription" class="hidden">${task.description}</textarea>
                            <button class="edit-btn" data-field="description">✏️</button>
                        </div>
                    </div>
                </div>
                <div class="sidebar">
                    <h3>Добавить в карточку</h3>
                    <button class="sidebar-btn" data-section="executors">Участники</button>
                    <button class="sidebar-btn" data-section="files">Вложения</button>
                    <button class="sidebar-btn" data-section="comments">Комментарии</button>
                </div>
            </div>
            <div class="modal-footer">
                <button id="saveBtn">Сохранить</button>
                <button id="closeBtn">Закрыть</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const mainContent = modal.querySelector("#mainContent");
    const statusSelect = modal.querySelector("#statusSelect");

    let previousStatus = task.status;
    statusSelect.addEventListener("change", () => {
        if (task.status !== statusSelect.value) {
            task.status = statusSelect.value;
        }
    });

    modal.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const field = btn.dataset.field;
            const display = modal.querySelector(`#${field}Display`);
            const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);
            display.classList.toggle("hidden");
            input.classList.toggle("hidden");
            btn.textContent = display.classList.contains("hidden") ? "💾" : "✏️";
            if (!display.classList.contains("hidden") && task[field] !== input.value) {
                task[field] = input.value;
                display.textContent = task[field];
            }
        });
    });

    modal.querySelectorAll(".sidebar-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const section = btn.dataset.section;
            const existingSection = mainContent.querySelector(`.field.${section}`);
            if (existingSection) {
                removeSection(section, modal);
                btn.classList.remove("active");
            } else {
                addSection(section, task, modal);
                btn.classList.add("active");
            }
        });
    });

    modal.addEventListener("click", (e) => {
        if (!modal.querySelector(".modal-content").contains(e.target)) {
            modal.remove();
        }
    });

    modal.querySelector("#closeModalBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        modal.remove();
    });

    modal.querySelector("#closeBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        modal.remove();
    });

    modal.querySelector("#saveBtn").addEventListener("click", () => {
        task.status = statusSelect.value;
        applyFilters();
        modal.remove();
    });
}

function addSection(section, task, modal) {
    const mainContent = modal.querySelector("#mainContent");
    const sectionDiv = document.createElement("div");
    sectionDiv.className = `field ${section}`;

    switch (section) {
        case "executors":
            sectionDiv.innerHTML = `
                <h3>Участники</h3>
                <div id="executorList" class="executor-list" style="display: flex; align-items: center; gap: 5px;">
                    ${task.executors.length ? task.executors.map(ex => `
                        <span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">
                            ${ex}
                            <button class="edit-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                            <button class="remove-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer;">×</button>
                        </span>
                    `).join('') : '<span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">Не назначены</span>'}
                    <button class="add-executor-btn" style="border: none; cursor: pointer; font-size: 16px;"><img class="imagin" src="./plus.svg" alt=""></button>
                </div>
            `;
            break;
        case "files":
            sectionDiv.innerHTML = `
                <h3>Вложения</h3>
                <div id="fileList">
                    ${task.files.length ? task.files.map(file => `
                        <div class="file-item">
                            <a href="${file.url}" target="_blank">${file.name}</a>
                        </div>
                    `).join('') : 'Нет файлов'}
                </div>
            `;
            break;
        case "comments":
            sectionDiv.innerHTML = `
                <h3>Комментарии</h3>
                <div id="commentList">
                    ${task.comments.map((comment, index) => `
                        <div class="comment-item" data-index="${index}">
                            ${comment.text} <small>(${comment.date})</small>
                            <button class="remove-comment" data-index="${index}">×</button>
                        </div>
                    `).join('')}
                </div>
                <textarea id="newComment" placeholder="Напишите комментарий..."></textarea>
                <button id="addComment">Добавить</button>
            `;
            break;
    }

    mainContent.appendChild(sectionDiv);
    bindEventListeners(section, task, modal);
}

function removeSection(section, modal) {
    const mainContent = modal.querySelector("#mainContent");
    const sectionDiv = mainContent.querySelector(`.field.${section}`);
    if (sectionDiv) {
        const currentHeight = sectionDiv.offsetHeight + 'px';
        sectionDiv.style.height = currentHeight;

        sectionDiv.classList.add("removing");

        requestAnimationFrame(() => {
            sectionDiv.style.height = '0';
            sectionDiv.style.opacity = '0';
        });

        setTimeout(() => {
            sectionDiv.remove();
            console.log(`Section "${section}" removed after animation`);
        }, 300);
    } else {
        console.log(`Section "${section}" not found`);
    }
}

function updateSection(section, task, modal) {
    const mainContent = modal.querySelector("#mainContent");
    const sectionDiv = mainContent.querySelector(`.field.${section}`);
    if (!sectionDiv) return;

    switch (section) {
        case "executors":
            sectionDiv.innerHTML = `
                <h3>Участники</h3>
                <div id="executorList" class="executor-list" style="display: flex; align-items: center; gap: 5px;">
                    ${task.executors.length ? task.executors.map(ex => `
                        <span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">
                            ${ex}
                            <button class="edit-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                            <button class="remove-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer;">×</button>
                        </span>
                    `).join('') : '<span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">Не назначены</span>'}
                    <button class="add-executor-btn" style="border: none; cursor: pointer; font-size: 16px;"><img class="imagin" src="./plus.svg" alt=""></button>
                </div>
            `;
            break;
        case "comments":
            sectionDiv.innerHTML = `
                <h3>Комментарии</h3>
                <div id="commentList">
                    ${task.comments.map((comment, index) => `
                        <div class="comment-item" data-index="${index}">
                            ${comment.text} <small>(${comment.date})</small>
                            <button class="remove-comment" data-index="${index}">×</button>
                        </div>
                    `).join('')}
                </div>
                <textarea id="newComment" placeholder="Напишите комментарий..."></textarea>
                <button id="addComment">Добавить</button>
            `;
            break;
    }

    bindEventListeners(section, task, modal);
}

function bindEventListeners(section, task, modal) {
    const mainContent = modal.querySelector("#mainContent");

    if (section === "executors") {
        const executorList = mainContent.querySelector("#executorList");
        if (!executorList) return;

        executorList.querySelectorAll(".remove-executor").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const executor = btn.dataset.executor;
                task.executors = task.executors.filter(ex => ex !== executor);
                updateSection("executors", task, modal);
            });
        });

        executorList.querySelectorAll(".edit-executor").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const oldExecutor = btn.dataset.executor;
                const executorItem = btn.parentElement;
                const originalContent = executorItem.innerHTML;

                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="">Выберите...</option>
                    ${getAllExecutors().filter(ex => !task.executors.includes(ex) || ex === oldExecutor).map(ex => `
                        <option value="${ex}" ${ex === oldExecutor ? 'selected' : ''}>${ex}</option>
                    `).join('')}
                `;
                const revertBtn = document.createElement("button");
                revertBtn.textContent = "⟲";
                revertBtn.className = "revert-btn";

                executorItem.innerHTML = '';
                executorItem.appendChild(select);
                executorItem.appendChild(revertBtn);

                select.addEventListener("change", (e) => {
                    e.stopPropagation();
                    const newExecutor = select.value;
                    if (newExecutor && newExecutor !== oldExecutor) {
                        const index = task.executors.indexOf(oldExecutor);
                        if (index !== -1) {
                            task.executors[index] = newExecutor;
                        }
                        updateSection("executors", task, modal);
                    }
                });

                revertBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    executorItem.innerHTML = originalContent;
                    bindEventListeners("executors", task, modal);
                });
            });
        });

        const addBtn = executorList.querySelector(".add-executor-btn");
        if (addBtn) {
            addBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const existingSelect = executorList.querySelector(".executor-select-container");
                if (existingSelect) return;

                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="">Выберите...</option>
                    ${getAllExecutors().filter(ex => !task.executors.includes(ex)).map(ex => `
                        <option value="${ex}">${ex}</option>
                    `).join('')}
                `;
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "×";
                removeBtn.className = "remove-select-btn";

                const container = document.createElement("div");
                container.className = "executor-select-container";
                container.appendChild(select);
                container.appendChild(removeBtn);

                executorList.insertBefore(container, addBtn);

                select.addEventListener("change", (e) => {
                    e.stopPropagation();
                    const newExecutor = select.value;
                    if (newExecutor) {
                        task.executors.push(newExecutor);
                        updateSection("executors", task, modal);
                    }
                });

                removeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    container.remove();
                });
            });
        }
    }

    if (section === "comments") {
        const commentSection = mainContent.querySelector(".field.comments");
        if (!commentSection) return;

        const addCommentBtn = commentSection.querySelector("#addComment");
        if (addCommentBtn) {
            addCommentBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const commentText = commentSection.querySelector("#newComment").value.trim();
                if (commentText) {
                    task.comments.push({
                        text: commentText,
                        date: new Date().toLocaleDateString()
                    });
                    updateSection("comments", task, modal);
                }
            });
        }

        const commentList = commentSection.querySelector("#commentList");
        if (commentList) {
            commentList.querySelectorAll(".remove-comment").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    task.comments.splice(index, 1);
                    updateSection("comments", task, modal);
                });
            });
        }
    }
}

// Функция для обновления основного контента
function updateMainContent(section, task, modal, hide = false) {
    const mainContent = modal.querySelector("#mainContent");
    let contentHTML = `
        <div class="field theme">
            <h3>Тема</h3>
            <div class="editable-field">
                <span id="themeDisplay">${task.theme}</span>
                <input type="text" id="editTheme" value="${task.theme}" class="hidden">
                <button class="edit-btn" data-field="theme">✏️</button>
            </div>
        </div>
        <div class="field description">
            <h4>Описание</h4>
            <div class="editable-field">
                <span id="descriptionDisplay">${task.description}</span>
                <textarea id="editDescription" class="hidden">${task.description}</textarea>
                <button class="edit-btn" data-field="description">✏️</button>
            </div>
        </div>
    `;

    if (!hide) {
        switch (section) {
            case "executors":
                contentHTML += `
                    <div class="field executors">
                        <h3>Участники</h3>
                        <div id="executorList" class="executor-list" style="display: flex; align-items: center; gap: 5px;">
                            ${task.executors.length ? task.executors.map(ex => `
                                <span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">
                                    ${ex}
                                    <button class="edit-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                                    <button class="remove-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer;">×</button>
                                </span>
                            `).join('') : '<span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">Не назначены</span>'}
                            <button class="add-executor-btn" style="border: none; cursor: pointer; font-size: 16px;"><img class="imagin" src="./plus.svg" alt=""></button>
                        </div>
                    </div>
                `;
                break;
            case "files":
                contentHTML += `
                    <div class="field files">
                        <h3>Вложения</h3>
                        <div id="fileList">
                            ${task.files.length ? task.files.map(file => `
                                <div class="file-item">
                                    <a href="${file.url}" target="_blank">${file.name}</a>
                                </div>
                            `).join('') : 'Нет файлов'}
                        </div>
                    </div>
                `;
                break;
            case "comments":
                contentHTML += `
                    <div class="field comments">
                        <h3>Комментарии</h3>
                        <div id="commentList">
                            ${task.comments.map((comment, index) => `
                                <div class="comment-item">
                                    ${comment.text} <small>(${comment.date})</small>
                                    <button class="remove-comment" data-index="${index}">×</button>
                                </div>
                            `).join('')}
                        </div>
                        <textarea id="newComment" placeholder="Напишите коммента Xкомментарий..."></textarea>
                        <button id="addComment">Добавить</button>
                    </div>
                `;
                break;
            case "history":
                contentHTML += `
                    <div class="field history">
                        <h3>История</h3>
                        <div id="historyList">
                            ${task.history.length ? task.history.map(entry => `
                                <div class="history-item">
                                    <span>${entry.action}</span>
                                    <small>(${entry.date} - ${entry.user})</small>
                                </div>
                            `).join('') : 'Нет записей'}
                        </div>
                    </div>
                `;
                break;
        }
    }

    mainContent.innerHTML = contentHTML;

    // Привязка обработчиков событий
    bindEventListeners(section, task, modal);
}

function updateCommentList(task, modal) {
    const commentList = modal.querySelector("#commentList");
    commentList.innerHTML = task.comments.map((comment, index) => `
        <div class="comment-item">
            ${comment.text} 
            <small>(${comment.date})</small>
            <button class="remove-comment" data-index="${index}">×</button>
        </div>
    `).join('');
    modal.querySelector("#newComment").value = "";

    // Привязываем обработчики к кнопкам удаления
    modal.querySelectorAll(".remove-comment").forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation(); // Останавливаем всплытие события
            const index = parseInt(btn.dataset.index);
            if (index >= 0 && index < task.comments.length) {
                task.comments.splice(index, 1); // Удаляем комментарий
                updateCommentList(task, modal); // Обновляем список
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", createInterface);