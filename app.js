let tasks = [
    {
        id: 1,
        dateSet: "2025-03-25",
        project: "Afrosiyob paranda",
        theme: "Разработка UI",
        description: "Создать интерфейс главной страницы",
        status: "Выполнено", // Новое поле
        executors: ["Иван Иванов", "Пётр Сидоров"],
        files: [{ name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }],
        comments: [
            { text: "Дизайн утверждён заказчиком", date: "2025-03-25" },
            { text: "Добавлены новые шрифты", date: "2025-03-26" },
            { text: "Исправлены отступы на мобильной версии", date: "2025-03-26" }
        ]
    },
    {
        id: 2,
        dateSet: "2025-03-24",
        project: "Заказчик Beta",
        theme: "Исправление багов",
        description: "Пофиксить ошибку в авторизации",
        status: "Выполнено",
        executors: [],
        files: [{ name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }, { name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }]
    },
    { id: 3, dateSet: "2025-03-20", project: "Проект Gamma", theme: "Тестирование API", description: "Проверить все эндпоинты", completed: false, executors: ["Анна Смирнова"], dateCompleted: "", accepted: "Нет" },
    { id: 4, dateSet: "2025-03-22", project: "Заказчик Delta", theme: "Дизайн логотипа", description: "Разработать новый логотип компании", completed: true, executors: ["Мария Петрова", "Алексей Кузнецов"], dateCompleted: "2025-03-24", accepted: "Да" },
    { id: 5, dateSet: "2025-03-23", project: "Проект Epsilon", theme: "Оптимизация кода", description: "Ускорить загрузку страницы", completed: false, executors: ["Дмитрий Соколов", "Ольга Николаева"], dateCompleted: "", accepted: "Нет" },
    { id: 6, dateSet: "2025-03-26", project: "Проект Zeta", theme: "Аналитика", description: "Собрать данные по пользователям", completed: false, executors: ["Сергей Морозов"], dateCompleted: "", accepted: "Нет" },
    { id: 7, dateSet: "2025-03-27", project: "Заказчик Eta", theme: "Дизайн", description: "Обновить баннеры на сайте", completed: true, executors: ["Екатерина Иванова"], dateCompleted: "2025-03-28", accepted: "Да" },
    { id: 8, dateSet: "2025-03-28", project: "Проект Theta", theme: "Разработка", description: "Добавить фильтр в таблицу", completed: false, executors: ["Андрей Петров"], dateCompleted: "", accepted: "Нет" },
    { id: 9, dateSet: "2025-03-29", project: "Заказчик Iota", theme: "Тестирование", description: "Провести нагрузочное тестирование", completed: false, executors: ["Олег Сидоров"], dateCompleted: "", accepted: "Нет" },
    { id: 10, dateSet: "2025-03-30", project: "Проект Kappa", theme: "Оптимизация", description: "Уменьшить время ответа сервера", completed: true, executors: ["Наталья Козлова"], dateCompleted: "2025-03-31", accepted: "Да" },
    { id: 11, dateSet: "2025-04-01", project: "Проект Lambda", theme: "Интеграция", description: "Подключить API платежной системы", completed: false, executors: ["Владимир Соколов"], dateCompleted: "", accepted: "Нет" },
    { id: 12, dateSet: "2025-04-02", project: "Заказчик Mu", theme: "Дизайн", description: "Создать макет мобильного приложения", completed: true, executors: ["Елена Васильева"], dateCompleted: "2025-04-03", accepted: "Да" },
    { id: 13, dateSet: "2025-04-03", project: "Проект Nu", theme: "Разработка", description: "Реализовать авторизацию через OAuth", completed: false, executors: ["Игорь Николаев"], dateCompleted: "", accepted: "Нет" },
    { id: 14, dateSet: "2025-04-04", project: "Заказчик Xi", theme: "Тестирование", description: "Проверить совместимость с iOS", completed: false, executors: ["Татьяна Морозова"], dateCompleted: "", accepted: "Нет" },
    { id: 15, dateSet: "2025-04-05", project: "Проект Omicron", theme: "Оптимизация", description: "Сжать изображения на сайте", completed: true, executors: ["Павел Кузнецов"], dateCompleted: "2025-04-06", accepted: "Да" },
    { id: 16, dateSet: "2025-04-06", project: "Заказчик Pi", theme: "Аналитика", description: "Настроить Google Analytics", completed: false, executors: ["Юлия Соколова"], dateCompleted: "", accepted: "Нет" },
    { id: 17, dateSet: "2025-04-07", project: "Проект Rho", theme: "Разработка", description: "Добавить форму обратной связи", completed: true, executors: ["Максим Иванов"], dateCompleted: "2025-04-08", accepted: "Да" },
    { id: 18, dateSet: "2025-04-08", project: "Заказчик Sigma", theme: "Дизайн", description: "Обновить цветовую схему", completed: false, executors: ["Алина Петрова"], dateCompleted: "", accepted: "Нет" },
    { id: 19, dateSet: "2025-04-09", project: "Проект Tau", theme: "Тестирование", description: "Проверить кроссбраузерность", completed: false, executors: ["Константин Сидоров"], dateCompleted: "", accepted: "Нет" },
    { id: 20, dateSet: "2025-04-10", project: "Заказчик Upsilon", theme: "Интеграция", description: "Подключить CRM систему", completed: true, executors: ["Оксана Морозова"], dateCompleted: "2025-04-11", accepted: "Да" },
    { id: 21, dateSet: "2025-04-11", project: "Проект Phi", theme: "Разработка", description: "Создать админ-панель", completed: false, executors: ["Артём Кузнецов"], dateCompleted: "", accepted: "Нет" },
    { id: 22, dateSet: "2025-04-12", project: "Заказчик Chi", theme: "Оптимизация", description: "Ускорить загрузку видео", completed: false, executors: ["Евгений Соколов"], dateCompleted: "", accepted: "Нет" },
    { id: 23, dateSet: "2025-04-13", project: "Проект Psi", theme: "Дизайн", description: "Разработать иконки для меню", completed: true, executors: ["Светлана Иванова"], dateCompleted: "2025-04-14", accepted: "Да" },
    { id: 24, dateSet: "2025-04-14", project: "Заказчик Omega", theme: "Тестирование", description: "Проверить работу чата", completed: false, executors: ["Денис Петров"], dateCompleted: "", accepted: "Нет" },
    { id: 25, dateSet: "2025-04-15", project: "Проект Alpha-2", theme: "Разработка", description: "Добавить поиск по сайту", completed: true, executors: ["Иван Иванов"], dateCompleted: "2025-04-16", accepted: "Да" },
    { id: 26, dateSet: "2025-04-16", project: "Заказчик Beta-2", theme: "Аналитика", description: "Проанализировать конверсии", completed: false, executors: ["Анна Смирнова"], dateCompleted: "", accepted: "Нет" },
    { id: 27, dateSet: "2025-04-17", project: "Проект Gamma-2", theme: "Интеграция", description: "Подключить уведомления", completed: false, executors: ["Пётр Сидоров"], dateCompleted: "", accepted: "Нет" },
    { id: 28, dateSet: "2025-04-18", project: "Заказчик Delta-2", theme: "Дизайн", description: "Создать промо-страницу", completed: true, executors: ["Мария Петрова"], dateCompleted: "2025-04-19", accepted: "Да" },
    { id: 29, dateSet: "2025-04-19", project: "Проект Epsilon-2", theme: "Оптимизация", description: "Улучшить SEO", completed: false, executors: ["Дмитрий Соколов"], dateCompleted: "", accepted: "Нет" },
    { id: 30, dateSet: "2025-04-20", project: "Заказчик Zeta-2", theme: "Тестирование", description: "Проверить адаптивность", completed: true, executors: ["Ольга Николаева"], dateCompleted: "2025-04-21", accepted: "Да" }
];
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
    modal.className = "modal";

    if (!task.comments) task.comments = [];
    if (!task.files) task.files = [];

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    modal.innerHTML = `
        <div class="modal-content full-task-modal">
            <button class="close-modal-btn" id="closeModalBtn">×</button>
            <div class="modal-header">
                <h2>Задача #${task.id}</h2>
                <span>От: ${task.dateSet}</span>
                <span>Проект: ${task.project}</span>
                <div class="header-details">
                    <div class="status-toggle">
                        <select id="statusSelect">
                            ${statuses.map(status => `
                                <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
                            `).join('')}
                        </select>
                        <button id="openExtraModalBtn" style="margin-left: 10px;">+</button>
                    </div>
                </div>
            </div>
            <div class="task-details">
                <div class="field theme">
                    <label>Тема:</label>
                    <div class="editable-field">
                        <span id="themeDisplay">${task.theme}</span>
                        <button class="edit-btn" data-field="theme">✏️</button>
                        <input type="text" id="editTheme" value="${task.theme}" class="hidden">
                    </div>
                </div>
                <div class="field">
                    <label>Описание:</label>
                    <div class="editable-field">
                        <span id="descriptionDisplay">${task.description}</span>
                        <button class="edit-btn" data-field="description">✏️</button>
                        <textarea id="editDescription" class="hidden">${task.description}</textarea>
                    </div>
                </div>
                <div class="field">
                    <label>Исполнители:</label>
                    <div id="executorList" class="executor-list" style="display: flex; align-items: center; gap: 5px;">
                        ${task.executors.length ? task.executors.map(ex => `
                            <span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">
                                ${ex}
                                <button class="edit-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                                <button class="remove-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer;">×</button>
                            </span>
                        `).join('') : '<span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">Не назначены</span>'}
                        <button class="add-executor-btn" style="border: none; cursor: pointer; font-size: 16px;">+</button>
                    </div>
                </div>
                <div class="field comments">
                    <label>Комментарии:</label>
                    <div id="commentList">
                        ${task.comments.map((comment, index) => `
                            <div class="comment-item">
                                ${comment.text} 
                                <small>(${comment.date})</small>
                                <button class="remove-comment" data-index="${index}">×</button>
                            </div>
                        `).join('')}
                    </div>
                    <textarea id="newComment" placeholder="Новый комментарий"></textarea>
                    <button id="addComment">Добавить комментарий</button>
                </div>
                <div class="field files">
                    <label>Прикрепленные файлы:</label>
                    <div id="fileList">
                        ${task.files.length ? task.files.map(file => `
                            <div class="file-item">
                                <a href="${file.url}" target="_blank">${file.name}</a>
                            </div>
                        `).join('') : 'Нет файлов'}
                    </div>
                </div>
            </div>
            <div class="modal-buttons">
                <button id="saveBtn">Сохранить</button>
                <button id="closeBtn">Закрыть</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Обновление статуса при выборе
    const statusSelect = modal.querySelector("#statusSelect");
    statusSelect.addEventListener("change", () => {
        task.status = statusSelect.value;
    });

    // Кнопка для будущей модалки
    modal.querySelector("#openExtraModalBtn").addEventListener("click", (e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        alert("Здесь будет открываться новая модалка в будущем!");
    });

    // Закрытие по клику вне модалки
    modal.addEventListener("click", function (event) {
        if (!modal.querySelector(".modal-content").contains(event.target)) {
            modal.remove();
        }
    });

    // Редактирование темы и описания
    modal.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Предотвращаем всплытие
            const field = btn.dataset.field;
            const display = modal.querySelector(`#${field}Display`);
            const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);

            display.classList.toggle("hidden");
            input.classList.toggle("hidden");
            btn.textContent = display.classList.contains("hidden") ? "💾" : "✏️";

            if (!display.classList.contains("hidden")) {
                task[field] = input.value;
                display.textContent = task[field];
            }
        });
    });

    // Удаление исполнителей с исправлением бага
    const removeExecutorHandler = (btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Предотвращаем всплытие до modal
            const executor = btn.dataset.executor;
            task.executors = task.executors.filter(ex => ex !== executor);
            btn.parentElement.remove();
            if (!task.executors.length) {
                const executorList = modal.querySelector("#executorList");
                const noExecutorsSpan = document.createElement("span");
                noExecutorsSpan.className = "executor-item";
                noExecutorsSpan.style.cssText = "padding: 2px 5px; background: #f0f0f0; border-radius: 3px;";
                noExecutorsSpan.textContent = "Не назначены";
                executorList.insertBefore(noExecutorsSpan, executorList.querySelector(".add-executor-btn"));
            }
        });
    };
    modal.querySelectorAll(".remove-executor").forEach(removeExecutorHandler);

    // Редактирование исполнителей
    const editExecutorHandler = (btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Предотвращаем всплытие
            const oldExecutor = btn.dataset.executor;
            const executorItem = btn.parentElement;
            const originalContent = executorItem.innerHTML;

            const select = document.createElement("select");
            select.className = "executor-select";
            select.innerHTML = `
                <option value="">Выберите...</option>
                ${getAllExecutors().filter(ex => !task.executors.includes(ex) || ex === oldExecutor).map(exec => `
                    <option value="${exec}" ${exec === oldExecutor ? 'selected' : ''}>${exec}</option>
                `).join('')}
            `;

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "⟲";
            cancelBtn.style.cssText = "border: none; background: #4a90e2; cursor: pointer; margin-left: 5px;";
            cancelBtn.title = "Отменить";

            executorItem.innerHTML = '';
            executorItem.appendChild(select);
            executorItem.appendChild(cancelBtn);

            select.addEventListener("change", (e) => {
                e.stopPropagation(); // Предотвращаем всплытие
                const newExecutor = e.target.value;
                if (newExecutor && newExecutor !== oldExecutor) {
                    const index = task.executors.indexOf(oldExecutor);
                    if (index !== -1) {
                        task.executors[index] = newExecutor;
                    }
                    executorItem.innerHTML = `
                        ${newExecutor}
                        <button class="edit-executor" data-executor="${newExecutor}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                        <button class="remove-executor" data-executor="${newExecutor}" style="border: none; background: none; cursor: pointer;">×</button>
                    `;
                    editExecutorHandler(executorItem.querySelector(".edit-executor"));
                    removeExecutorHandler(executorItem.querySelector(".remove-executor"));
                }
            });

            cancelBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Предотвращаем всплытие
                executorItem.innerHTML = originalContent;
                editExecutorHandler(executorItem.querySelector(".edit-executor"));
                removeExecutorHandler(executorItem.querySelector(".remove-executor"));
            });
        });
    };
    modal.querySelectorAll(".edit-executor").forEach(editExecutorHandler);

    // Добавление нового исполнителя с кнопкой удаления
    const addExecutorBtn = modal.querySelector(".add-executor-btn");
    addExecutorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const executorList = modal.querySelector("#executorList");
        const existingSelect = executorList.querySelector("select");
        if (existingSelect) return;

        const noExecutorsSpan = executorList.querySelector("span.executor-item");
        if (noExecutorsSpan && noExecutorsSpan.textContent === "Не назначены") {
            noExecutorsSpan.remove();
        }

        const select = document.createElement("select");
        select.className = "executor-select";
        select.innerHTML = `
        <option value="">Выберите...</option>
        ${getAllExecutors().filter(ex => !task.executors.includes(ex)).map(exec => `
            <option value="${exec}">${exec}</option>
        `).join('')}
    `;

        const removeSelectBtn = document.createElement("button");
        removeSelectBtn.textContent = "×";

        const container = document.createElement("div");
        container.style.cssText = "display: flex; align-items: center; gap: 5px;";
        container.appendChild(select);
        container.appendChild(removeSelectBtn);

        executorList.insertBefore(container, addExecutorBtn);

        select.addEventListener("change", (e) => {
            e.stopPropagation();
            const selectedExecutor = e.target.value;
            if (selectedExecutor) {
                task.executors.push(selectedExecutor);
                const span = document.createElement("span");
                span.className = "executor-item";
                span.style.cssText = "padding: 2px 5px; background: #f0f0f0; border-radius: 3px;";
                span.innerHTML = `
                ${selectedExecutor}
                <button class="edit-executor" data-executor="${selectedExecutor}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                <button class="remove-executor" data-executor="${selectedExecutor}" style="border: none; background: none; cursor: pointer;">×</button>
            `;
                executorList.insertBefore(span, addExecutorBtn);
                container.remove();
                editExecutorHandler(span.querySelector(".edit-executor"));
                removeExecutorHandler(span.querySelector(".remove-executor"));
            }
        });

        removeSelectBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            container.remove();
            if (!task.executors.length) {
                const noExecutorsSpan = document.createElement("span");
                noExecutorsSpan.className = "executor-item";
                noExecutorsSpan.style.cssText = "padding: 2px 5px; background: #f0f0f0; border-radius: 3px;";
                noExecutorsSpan.textContent = "Не назначены";
                executorList.insertBefore(noExecutorsSpan, addExecutorBtn);
            }
        });
    });

    // Обработчики для комментариев
    modal.querySelector("#addComment").addEventListener("click", (e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        const commentText = modal.querySelector("#newComment").value.trim();
        if (commentText) {
            task.comments.push({
                text: commentText,
                date: new Date().toLocaleDateString()
            });
            updateCommentList(task, modal);
        }
    });

    updateCommentList(task, modal);

    // Сохранение изменений
    modal.querySelector("#saveBtn").addEventListener("click", (e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        task.status = statusSelect.value;
        applyFilters();
        modal.remove();
    });

    modal.querySelector("#closeBtn").addEventListener("click", (e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        modal.remove();
    });
    modal.querySelector("#closeModalBtn").addEventListener("click", (e) => {
        e.stopPropagation(); // Предотвращаем всплытие
        modal.remove();
    });
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


