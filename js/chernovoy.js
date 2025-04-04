let tasks = [
    {
        id: 1,
        dateSet: "2025-03-25",
        project: "Afrosiyob paranda",
        theme: "Разработка UI",
        description: "Создать интерфейс главной страницы",
        status: "Выполнено",
        executors: ["Рустамов Жонибек", "Храмов Дониш"],
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
        executors: ["Сайдуллаев Дамир"],
        files: [{ name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }, { name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }]
    },
    {
        id: 3,
        dateSet: "2025-03-20",
        project: "Проект Gamma",
        theme: "Тестирование API",
        description: "Проверить все эндпоинты",
        status: "В процессе",
        executors: ["Югай Дмитрий"],
        files: [],
        comments: []
    },
    {
        id: 4,
        dateSet: "2025-03-22",
        project: "Заказчик Delta",
        theme: "Дизайн логотипа",
        description: "Разработать новый логотип компании",
        status: "Выполнено",
        executors: ["Закиров Фаррух", "Бурханов Азим"],
        files: [],
        comments: []
    },
    {
        id: 5,
        dateSet: "2025-03-23",
        project: "Проект Epsilon",
        theme: "Оптимизация кода",
        description: "Ускорить загрузку страницы",
        status: "В процессе",
        executors: ["Нурманов Анвар", "Нарзуллоев Тохир"],
        files: [],
        comments: []
    },
    {
        id: 6,
        dateSet: "2025-03-26",
        project: "Проект Zeta",
        theme: "Аналитика",
        description: "Собрать данные по пользователям",
        status: "В процессе",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: []
    },
    {
        id: 7,
        dateSet: "2025-03-27",
        project: "Заказчик Eta",
        theme: "Дизайн",
        description: "Обновить баннеры на сайте",
        status: "Выполнено",
        executors: ["Храмов Дониш"],
        files: [],
        comments: []
    },
    {
        id: 8,
        dateSet: "2025-03-28",
        project: "Проект Theta",
        theme: "Разработка",
        description: "Добавить фильтр в таблицу",
        status: "В процессе",
        executors: ["Сайдуллаев Дамир"],
        files: [],
        comments: []
    },
    {
        id: 9,
        dateSet: "2025-03-29",
        project: "Заказчик Iota",
        theme: "Тестирование",
        description: "Провести нагрузочное тестирование",
        status: "В процессе",
        executors: ["Югай Дмитрий"],
        files: [],
        comments: []
    },
    {
        id: 10,
        dateSet: "2025-03-30",
        project: "Проект Kappa",
        theme: "Оптимизация",
        description: "Уменьшить время ответа сервера",
        status: "Выполнено",
        executors: ["Закиров Фаррух"],
        files: [],
        comments: []
    },
    {
        id: 11,
        dateSet: "2025-04-01",
        project: "Проект Lambda",
        theme: "Интеграция",
        description: "Подключить API платежной системы",
        status: "В процессе",
        executors: ["Бурханов Азим"],
        files: [],
        comments: []
    },
    {
        id: 12,
        dateSet: "2025-04-02",
        project: "Заказчик Mu",
        theme: "Дизайн",
        description: "Создать макет мобильного приложения",
        status: "Выполнено",
        executors: ["Нурманов Анвар"],
        files: [],
        comments: []
    },
    {
        id: 13,
        dateSet: "2025-04-03",
        project: "Проект Nu",
        theme: "Разработка",
        description: "Реализовать авторизацию через OAuth",
        status: "В процессе",
        executors: ["Нарзуллоев Тохир"],
        files: [],
        comments: []
    },
    {
        id: 14,
        dateSet: "2025-04-04",
        project: "Заказчик Xi",
        theme: "Тестирование",
        description: "Проверить совместимость с iOS",
        status: "В процессе",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: []
    },
    {
        id: 15,
        dateSet: "2025-04-05",
        project: "Проект Omicron",
        theme: "Оптимизация",
        description: "Сжать изображения на сайте",
        status: "Выполнено",
        executors: ["Храмов Дониш"],
        files: [],
        comments: []
    },
    {
        id: 16,
        dateSet: "2025-04-06",
        project: "Заказчик Pi",
        theme: "Аналитика",
        description: "Настроить Google Analytics",
        status: "В процессе",
        executors: ["Сайдуллаев Дамир"],
        files: [],
        comments: []
    },
    {
        id: 17,
        dateSet: "2025-04-07",
        project: "Проект Rho",
        theme: "Разработка",
        description: "Добавить форму обратной связи",
        status: "Выполнено",
        executors: ["Югай Дмитрий"],
        files: [],
        comments: []
    },
    {
        id: 18,
        dateSet: "2025-04-08",
        project: "Заказчик Sigma",
        theme: "Дизайн",
        description: "Обновить цветовую схему",
        status: "В процессе",
        executors: ["Закиров Фаррух"],
        files: [],
        comments: []
    },
    {
        id: 19,
        dateSet: "2025-04-09",
        project: "Проект Tau",
        theme: "Тестирование",
        description: "Проверить кроссбраузерность",
        status: "В процессе",
        executors: ["Бурханов Азим"],
        files: [],
        comments: []
    },
    {
        id: 20,
        dateSet: "2025-04-10",
        project: "Заказчик Upsilon",
        theme: "Интеграция",
        description: "Подключить CRM систему",
        status: "Выполнено",
        executors: ["Нурманов Анвар"],
        files: [],
        comments: []
    },
    {
        id: 21,
        dateSet: "2025-04-11",
        project: "Проект Phi",
        theme: "Разработка",
        description: "Создать админ-панель",
        status: "В процессе",
        executors: ["Нарзуллоев Тохир"],
        files: [],
        comments: []
    },
    {
        id: 22,
        dateSet: "2025-04-12",
        project: "Заказчик Chi",
        theme: "Оптимизация",
        description: "Ускорить загрузку видео",
        status: "В процессе",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: []
    },
    {
        id: 23,
        dateSet: "2025-04-13",
        project: "Проект Psi",
        theme: "Дизайн",
        description: "Разработать иконки для меню",
        status: "Выполнено",
        executors: ["Храмов Дониш"],
        files: [],
        comments: []
    },
    {
        id: 24,
        dateSet: "2025-04-14",
        project: "Заказчик Omega",
        theme: "Тестирование",
        description: "Проверить работу чата",
        status: "В процессе",
        executors: ["Сайдуллаев Дамир"],
        files: [],
        comments: []
    },
    {
        id: 25,
        dateSet: "2025-04-15",
        project: "Проект Alpha-2",
        theme: "Разработка",
        description: "Добавить поиск по сайту",
        status: "Выполнено",
        executors: ["Югай Дмитрий"],
        files: [],
        comments: []
    },
    {
        id: 26,
        dateSet: "2025-04-16",
        project: "Заказчик Beta-2",
        theme: "Аналитика",
        description: "Проанализировать конверсии",
        status: "В процессе",
        executors: ["Закиров Фаррух"],
        files: [],
        comments: []
    },
    {
        id: 27,
        dateSet: "2025-04-17",
        project: "Проект Gamma-2",
        theme: "Интеграция",
        description: "Подключить уведомления",
        status: "В процессе",
        executors: ["Бурханов Азим"],
        files: [],
        comments: []
    },
    {
        id: 28,
        dateSet: "2025-04-18",
        project: "Заказчик Delta-2",
        theme: "Дизайн",
        description: "Создать промо-страницу",
        status: "Выполнено",
        executors: ["Нурманов Анвар"],
        files: [],
        comments: []
    },
    {
        id: 29,
        dateSet: "2025-04-19",
        project: "Проект Epsilon-2",
        theme: "Оптимизация",
        description: "Улучшить SEO",
        status: "В процессе",
        executors: ["Нарзуллоев Тохир"],
        files: [],
        comments: []
    },
    {
        id: 30,
        dateSet: "2025-04-20",
        project: "Заказчик Zeta-2",
        theme: "Тестирование",
        description: "Проверить адаптивность",
        status: "Выполнено",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: []
    }
];
// Модуль состояния приложения
const StateManager = {
    filters: {},
    sortState: { field: null, ascending: true },
    currentPage: 1,
    tasksPerPage: 20,

    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
    },

    setSort(field) {
        if (this.sortState.field === field) {
            this.sortState.ascending = !this.sortState.ascending;
        } else {
            this.sortState.field = field;
            this.sortState.ascending = true;
        }
    },

    getFilteredTasks(tasks) {
        return tasks.filter(task => {
            const matchesExecutor = !this.filters.executors || task.executors.some(ex => ex.toLowerCase().includes(this.filters.executors.toLowerCase()));
            const matchesDateFrom = !this.filters.dateFrom || task.dateSet >= this.filters.dateFrom;
            const matchesDateTo = !this.filters.dateTo || task.dateSet <= this.filters.dateTo;
            return matchesExecutor && matchesDateFrom && matchesDateTo;
        });
    },

    sortTasks(taskList) {
        if (!this.sortState.field) return taskList;

        return taskList.sort((a, b) => {
            let valA = a[this.sortState.field] || '';
            let valB = b[this.sortState.field] || '';

            if (this.sortState.field === "dateSet") {
                valA = valA || "9999-12-31";
                valB = valB || "9999-12-31";
                return this.sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else if (this.sortState.field === "id") {
                return this.sortState.ascending ? valA - valB : valB - valA;
            } else if (this.sortState.field === "executors") {
                valA = valA.length ? valA.join(", ") : "";
                valB = valB.length ? valB.join(", ") : "";
                return this.sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                return this.sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
        });
    },

    getAllExecutors() {
        return [...new Set(tasks.flatMap(task => task.executors || []))];
    }
};

// Модуль рендеринга и событий
const Renderer = {
    createInterface() {
        const appDiv = document.getElementById("app");
        appDiv.innerHTML = `
            <div class="controls">
                <div class="filters">
                    <div class="filter-group">
                        <label>Диапазон дат:</label>
                        <div class="date-range">
                            <input type="date" id="dateFrom">
                            <input type="date" id="dateTo">
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

        this.setupEventListeners();
        this.renderTable(tasks);
    },

    setupEventListeners() {
        const dateFrom = document.getElementById("dateFrom");
        const dateTo = document.getElementById("dateTo");
        const executorFilter = document.getElementById("executorFilter");
        const executorSuggestions = document.getElementById("executorSuggestions");
        const clearExecutor = document.getElementById("clearExecutor");
        const resetFiltersBtn = document.getElementById("resetFiltersBtn");
        const searchBtn = document.getElementById("searchBtn");
        const searchInput = document.getElementById("searchInput");
        const addGlobalExecutorBtn = document.getElementById("addGlobalExecutorBtn");

        // Установка начальной даты
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        dateFrom.value = firstDayOfMonth.toISOString().split("T")[0];
        StateManager.updateFilters({ dateFrom: dateFrom.value });

        [dateFrom, dateTo].forEach(input => {
            input.addEventListener("change", () => {
                StateManager.updateFilters({ dateFrom: dateFrom.value, dateTo: dateTo.value });
                this.renderTable(tasks);
            });
        });

        clearExecutor.addEventListener("click", () => {
            executorFilter.value = "";
            StateManager.updateFilters({ executors: "" });
            this.renderTable(tasks);
        });

        resetFiltersBtn.addEventListener("click", () => {
            StateManager.filters = {};
            StateManager.sortState = { field: null, ascending: true };
            StateManager.currentPage = 1;
            dateFrom.value = firstDayOfMonth.toISOString().split("T")[0];
            dateTo.value = "";
            executorFilter.value = "";
            searchInput.value = "";
            StateManager.updateFilters({ dateFrom: dateFrom.value });
            this.renderTable(tasks);
        });

        searchBtn.addEventListener("click", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredTasks = tasks.filter(task =>
                task.id.toString().includes(searchTerm) ||
                task.dateSet.toLowerCase().includes(searchTerm) ||
                task.project.toLowerCase().includes(searchTerm) ||
                task.theme.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm) ||
                (task.executors && task.executors.some(ex => ex.toLowerCase().includes(searchTerm))) ||
                (task.status && task.status.toLowerCase().includes(searchTerm))
            );
            StateManager.currentPage = 1;
            this.renderTable(filteredTasks);
        });

        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") searchBtn.click();
        });

        executorFilter.addEventListener("input", (e) => {
            const value = e.target.value.toLowerCase();
            executorSuggestions.innerHTML = "";
            if (value) {
                executorSuggestions.classList.remove("hidden");
                const allExecutors = StateManager.getAllExecutors();
                const matches = allExecutors.filter(ex => ex.toLowerCase().includes(value));
                matches.forEach(match => {
                    const div = document.createElement("div");
                    div.textContent = match;
                    div.className = "suggestion-item";
                    div.style.cursor = "pointer";
                    div.addEventListener("click", () => {
                        executorFilter.value = match;
                        StateManager.updateFilters({ executors: match });
                        executorSuggestions.classList.add("hidden");
                        this.renderTable(tasks);
                    });
                    executorSuggestions.appendChild(div);
                });
            } else {
                executorSuggestions.classList.add("hidden");
                StateManager.updateFilters({ executors: "" });
                this.renderTable(tasks);
            }
        });

        addGlobalExecutorBtn.addEventListener("click", this.openGlobalExecutorModal);

        document.addEventListener("click", (e) => {
            if (!executorFilter.contains(e.target) && !executorSuggestions.contains(e.target)) {
                executorSuggestions.classList.add("hidden");
            }
        });
    },

    renderTable(taskList) {
        const appDiv = document.getElementById("app");
        const existingTable = appDiv.querySelector("table");
        const existingPagination = appDiv.querySelector(".pagination");

        if (existingTable) existingTable.remove();
        if (existingPagination) existingPagination.remove();

        const filteredTasks = StateManager.getFilteredTasks(taskList);
        const sortedTasks = StateManager.sortTasks(filteredTasks);
        const totalPages = Math.ceil(sortedTasks.length / StateManager.tasksPerPage);
        const startIndex = (StateManager.currentPage - 1) * StateManager.tasksPerPage;
        const endIndex = startIndex + StateManager.tasksPerPage;
        const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

        appDiv.appendChild(this.createTableElement(paginatedTasks));
        appDiv.appendChild(this.createPagination(sortedTasks, totalPages));
    },

    createTableElement(tasks) {
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>${['id', 'dateSet', 'project', 'theme', 'description', 'executors', 'status']
                .map(field => `<th data-sort="${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</th>`).join('')}</tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector("tbody");
        const fragment = document.createDocumentFragment();

        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.dataset.id = task.id;
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.dateSet}</td>
                <td>${task.project}</td>
                <td>${task.theme}</td>
                <td>${task.description}</td>
                <td>${(task.executors || []).join(", ") || "Не назначены"}</td>
                <td>${task.status || "Не указан"}</td>
            `;
            fragment.appendChild(row);
        });

        tbody.appendChild(fragment);

        table.querySelectorAll("th[data-sort]").forEach(th => {
            th.addEventListener("click", () => {
                StateManager.setSort(th.dataset.sort);
                this.renderTable(tasks);
            });
        });

        table.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            if (row) {
                const taskId = row.dataset.id;
                const task = tasks.find(t => t.id === parseInt(taskId));
                if (task) this.openEditModal(task);
            }
        });

        return table;
    },

    createPagination(taskList, totalPages) {
        const pagination = document.createElement("div");
        pagination.className = "pagination";

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Назад";
        prevBtn.disabled = StateManager.currentPage === 1;
        prevBtn.addEventListener("click", () => {
            if (StateManager.currentPage > 1) {
                StateManager.currentPage--;
                this.renderTable(taskList);
            }
        });

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Вперед";
        nextBtn.disabled = StateManager.currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (StateManager.currentPage < totalPages) {
                StateManager.currentPage++;
                this.renderTable(taskList);
            }
        });

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.toggle("active", i === StateManager.currentPage);
            pageBtn.addEventListener("click", () => {
                StateManager.currentPage = i;
                this.renderTable(taskList);
            });
            pagination.appendChild(pageBtn);
        }

        pagination.insertBefore(prevBtn, pagination.firstChild);
        pagination.appendChild(nextBtn);

        return pagination;
    },

    openEditModal(task) {
        if (!task.comments) task.comments = [];
        if (!task.files) task.files = [];

        const modal = document.createElement("div");
        modal.className = "modal trello-style-modal";

        const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${task.project}</h2>
                    <span class="date-set">Дата постановки: ${task.dateSet}</span>
                    <div class="header-actions">
                        <select id="statusSelect">${statuses.map(status => `<option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>`).join('')}</select>
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
                        ${["Участники", "Вложения", "Комментарии"].map(section => `<button class="sidebar-btn" data-section="${section}">${section.charAt(0).toUpperCase() + section.slice(1)}</button>`).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn">Сохранить</button>
                    <button id="closeBtn">Закрыть</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        this.bindModalEvents(task, modal);
    },

    bindModalEvents(task, modal) {
        const mainContent = modal.querySelector("#mainContent");
        const statusSelect = modal.querySelector("#statusSelect");
        const closeModalBtn = modal.querySelector("#closeModalBtn");
        const closeBtn = modal.querySelector("#closeBtn");
        const saveBtn = modal.querySelector("#saveBtn");

        statusSelect.addEventListener("change", () => task.status = statusSelect.value);

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
                    this.removeSection(section, mainContent);
                    btn.classList.remove("active");
                } else {
                    this.addSection(section, task, mainContent);
                    btn.classList.add("active");
                }
            });
        });

        [closeModalBtn, closeBtn].forEach(btn => btn.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.remove();
        }));

        saveBtn.addEventListener("click", () => {
            task.status = statusSelect.value;
            this.renderTable(tasks);
            modal.remove();
        });

        modal.addEventListener("click", (e) => {
            if (!modal.querySelector(".modal-content").contains(e.target)) modal.remove();
        });
    },

    addSection(section, task, container) {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = `field ${section}`;

        switch (section) {
            case "executors":
                sectionDiv.innerHTML = `
                    <h3>Участники</h3>
                    <div id="executorList" class="executor-list" style="display: flex; align-items: center; gap: 5px;">
                        ${(task.executors || []).map(ex => `
                            <span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">
                                ${ex}
                                <button class="edit-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer; margin-left: 5px;">✏️</button>
                                <button class="remove-executor" data-executor="${ex}" style="border: none; background: none; cursor: pointer;">×</button>
                            </span>
                        `).join('') || '<span class="executor-item" style="padding: 2px 5px; background: #f0f0f0; border-radius: 3px;">Не назначены</span>'}
                        <button class="add-executor-btn" style="border: none; cursor: pointer; font-size: 16px;">+</button>
                    </div>
                `;
                break;
            case "files":
                sectionDiv.innerHTML = `
                    <h3>Вложения</h3>
                    <div id="fileList">${(task.files || []).map(file => `
                        <div class="file-item"><a href="${file.url}" target="_blank">${file.name}</a></div>
                    `).join('') || 'Нет файлов'}</div>
                `;
                break;
            case "comments":
                sectionDiv.innerHTML = `
                    <h3>Комментарии</h3>
                    <div id="commentList">${(task.comments || []).map((comment, index) => `
                        <div class="comment-item" data-index="${index}">
                            ${comment.text} <small>(${comment.date})</small>
                            <button class="remove-comment" data-index="${index}">×</button>
                        </div>
                    `).join('')}</div>
                    <textarea id="newComment" placeholder="Напишите комментарий..."></textarea>
                    <button id="addComment">Добавить</button>
                `;
                break;
        }

        container.appendChild(sectionDiv);
        this.bindSectionEvents(section, task, sectionDiv);
    },

    removeSection(section, container) {
        const sectionDiv = container.querySelector(`.field.${section}`);
        if (sectionDiv) {
            sectionDiv.style.transition = "all 0.3s ease-out";
            sectionDiv.style.height = sectionDiv.offsetHeight + 'px';
            sectionDiv.classList.add("removing");

            requestAnimationFrame(() => {
                sectionDiv.style.height = '0';
                sectionDiv.style.opacity = '0';
            });

            setTimeout(() => sectionDiv.remove(), 300);
        }
    },

    bindSectionEvents(section, task, element) {
        if (section === "executors") {
            element.querySelectorAll(".remove-executor").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    task.executors = task.executors.filter(ex => ex !== btn.dataset.executor);
                    this.updateSection("executors", task, element.parentElement);
                });
            });

            element.querySelectorAll(".edit-executor").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const oldExecutor = btn.dataset.executor;
                    const parent = btn.parentElement;
                    const original = parent.innerHTML;

                    const select = document.createElement("select");
                    select.innerHTML = `<option value="">Выберите...</option>${StateManager.getAllExecutors().filter(ex => !task.executors.includes(ex) || ex === oldExecutor).map(ex => `<option value="${ex}" ${ex === oldExecutor ? 'selected' : ''}>${ex}</option>`).join('')}`;
                    const revert = document.createElement("button");
                    revert.textContent = "⟲";
                    revert.className = "revert-btn";

                    parent.innerHTML = '';
                    parent.appendChild(select);
                    parent.appendChild(revert);

                    select.addEventListener("change", (e) => {
                        e.stopPropagation();
                        const newExecutor = e.target.value;
                        if (newExecutor && newExecutor !== oldExecutor) {
                            const index = task.executors.indexOf(oldExecutor);
                            if (index !== -1) task.executors[index] = newExecutor;
                            this.updateSection("executors", task, element.parentElement);
                        }
                    });

                    revert.addEventListener("click", (e) => {
                        e.stopPropagation();
                        parent.innerHTML = original;
                        this.bindSectionEvents("executors", task, element);
                    });
                });
            });

            const addBtn = element.querySelector(".add-executor-btn");
            if (addBtn) {
                addBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const existing = element.querySelector(".executor-select-container");
                    if (existing) return;

                    const select = document.createElement("select");
                    select.innerHTML = `<option value="">Выберите...</option>${StateManager.getAllExecutors().filter(ex => !task.executors.includes(ex)).map(ex => `<option value="${ex}">${ex}</option>`).join('')}`;
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "×";
                    removeBtn.className = "remove-select-btn";

                    const container = document.createElement("div");
                    container.className = "executor-select-container";
                    container.appendChild(select);
                    container.appendChild(removeBtn);

                    element.insertBefore(container, addBtn);

                    select.addEventListener("change", (e) => {
                        e.stopPropagation();
                        const newExecutor = e.target.value;
                        if (newExecutor) {
                            task.executors.push(newExecutor);
                            this.updateSection("executors", task, element.parentElement);
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
            const addCommentBtn = element.querySelector("#addComment");
            if (addCommentBtn) {
                addCommentBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const commentText = element.querySelector("#newComment").value.trim();
                    if (commentText) {
                        task.comments.push({ text: commentText, date: new Date().toLocaleDateString() });
                        this.updateSection("comments", task, element.parentElement);
                    }
                });
            }

            element.querySelectorAll(".remove-comment").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    task.comments.splice(index, 1);
                    this.updateSection("comments", task, element.parentElement);
                });
            });
        }
    },

    updateSection(section, task, container) {
        const existing = container.querySelector(`.field.${section}`);
        if (existing) {
            this.removeSection(section, container);
            this.addSection(section, task, container);
        }
    },

    openGlobalExecutorModal() {
        const modal = document.createElement("div");
        modal.className = "modal";

        const allExecutors = StateManager.getAllExecutors();

        modal.innerHTML = `
            <div class="modal-content">
                <h2>Управление исполнителями</h2>
                <div class="add-executor-section">
                    <h3>Добавить нового исполнителя</h3>
                    <div class="input-with-clear">
                        <input type="text" id="newGlobalExecutor" placeholder="Введите имя исполнителя">
                        <button id="saveGlobalExecutor" class="action-btn">Добавить</button>
                    </div>
                    <div id="globalExecutorSuggestions" class="suggestions"></div>
                </div>
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

        this.bindGlobalModalEvents(modal, allExecutors);
    },

    bindGlobalModalEvents(modal, allExecutors) {
        const input = modal.querySelector("#newGlobalExecutor");
        const suggestions = modal.querySelector("#globalExecutorSuggestions");
        const saveBtn = modal.querySelector("#saveGlobalExecutor");
        const closeBtn = modal.querySelector("#closeGlobalModal");
        const executorList = modal.querySelector("#allExecutorsList");
        const editPanel = modal.querySelector("#editExecutorPanel");
        const editInput = modal.querySelector("#editExecutorInput");
        const originalInput = modal.querySelector("#originalExecutorName");
        const saveEditBtn = modal.querySelector("#saveEditExecutor");
        const cancelEditBtn = modal.querySelector("#cancelEditExecutor");

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

        saveBtn.addEventListener("click", () => {
            const newExecutor = input.value.trim();
            if (newExecutor && !allExecutors.includes(newExecutor)) {
                tasks.push({
                    id: tasks.length + 1,
                    dateSet: new Date().toISOString().split("T")[0],
                    project: "Без проекта",
                    theme: "Без темы",
                    description: "Фиктивная задача для исполнителя",
                    status: "В процессе",
                    executors: [newExecutor],
                    files: [],
                    comments: []
                });
                this.updateGlobalExecutorList(modal);
                input.value = "";
            }
        });

        modal.querySelectorAll(".edit-executor-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const executor = e.target.dataset.executor;
                editInput.value = executor;
                originalInput.value = executor;
                editPanel.classList.remove("hidden");
            });
        });

        modal.querySelectorAll(".delete-executor-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                if (confirm(`Вы уверены, что хотите удалить исполнителя "${e.target.dataset.executor}"?`)) {
                    const executor = e.target.dataset.executor;
                    tasks.forEach(task => task.executors = task.executors.filter(ex => ex !== executor));
                    this.updateGlobalExecutorList(modal);
                }
            });
        });

        saveEditBtn.addEventListener("click", () => {
            const newName = editInput.value.trim();
            const originalName = originalInput.value;
            if (newName && newName !== originalName && !allExecutors.includes(newName)) {
                tasks.forEach(task => task.executors = task.executors.map(ex => ex === originalName ? newName : ex));
                editPanel.classList.add("hidden");
                this.updateGlobalExecutorList(modal);
            }
        });

        cancelEditBtn.addEventListener("click", () => editPanel.classList.add("hidden"));

        closeBtn.addEventListener("click", () => modal.remove());
    },

    updateGlobalExecutorList(modal) {
        const allExecutors = StateManager.getAllExecutors();
        const list = modal.querySelector("#allExecutorsList");
        list.innerHTML = allExecutors.map(executor => `
            <div class="executor-list-item" data-executor="${executor}">
                <span class="executor-name">${executor}</span>
                <div class="executor-actions">
                    <button class="edit-executor-btn" data-executor="${executor}">✏️</button>
                    <button class="delete-executor-btn" data-executor="${executor}">🗑️</button>
                </div>
            </div>
        `).join('');
        this.bindGlobalModalEvents(modal, allExecutors);
    }
};

// Инициализация
document.addEventListener("DOMContentLoaded", () => Renderer.createInterface());