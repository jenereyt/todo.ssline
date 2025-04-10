export let tasks = [
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
        ],
        deadline: "2025-04-05"
    },
    {
        id: 2,
        dateSet: "2025-03-24",
        project: "Заказчик Beta",
        theme: "Исправление багов",
        description: "Пофиксить ошибку в авторизации",
        status: "Принято заказчиком",
        executors: ["Сайдуллаев Дамир"],
        files: [
            { name: "bug_fix_report.pdf", url: "https://example.com/files/bug_fix_report.pdf" },
            { name: "auth_test.pdf", url: "https://example.com/files/auth_test.pdf" }
        ],
        deadline: "2025-04-01"
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
        comments: [],
        deadline: "2025-04-10"
    },
    {
        id: 4,
        dateSet: "2025-03-22",
        project: "Заказчик Delta",
        theme: "Дизайн логотипа",
        description: "Разработать новый логотип компании",
        status: "Аннулировано",
        executors: ["Закиров Фаррух", "Бурханов Азим"],
        files: [],
        deadline: "2025-03-30"
    },
    {
        id: 5,
        dateSet: "2025-03-23",
        project: "Проект Epsilon",
        theme: "Оптимизация кода",
        description: "Ускорить загрузку страницы",
        status: "Возвращен",
        executors: ["Нурманов Анвар", "Нарзуллоев Тохир"],
        files: [],
        comments: [],
        deadline: "2025-04-07"
    },
    {
        id: 6,
        dateSet: "2025-03-26",
        project: "Проект Zeta",
        theme: "Аналитика",
        description: "Собрать данные по пользователям",
        status: "Принято",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: [],
        deadline: "2025-04-12"
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
        comments: [],
        deadline: "2025-04-03"
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
        comments: [],
        deadline: "2025-04-15"
    },
    {
        id: 9,
        dateSet: "2025-03-29",
        project: "Заказчик Iota",
        theme: "Тестирование",
        description: "Провести нагрузочное тестирование",
        status: "Возвращен",
        executors: ["Югай Дмитрий"],
        files: [],
        comments: [],
        deadline: "2025-04-10"
    },
    {
        id: 10,
        dateSet: "2025-03-30",
        project: "Проект Kappa",
        theme: "Оптимизация",
        description: "Уменьшить время ответа сервера",
        status: "Принято заказчиком",
        executors: ["Закиров Фаррух"],
        files: [],
        comments: [],
        deadline: "2025-04-08"
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
        comments: [],
        deadline: "2025-04-20"
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
        comments: [],
        deadline: "2025-04-10"
    },
    {
        id: 13,
        dateSet: "2025-04-03",
        project: "Проект Nu",
        theme: "Разработка",
        description: "Реализовать авторизацию через OAuth",
        status: "Принято",
        executors: ["Нарзуллоев Тохир"],
        files: [],
        comments: [],
        deadline: "2025-04-18"
    },
    {
        id: 14,
        dateSet: "2025-04-04",
        project: "Заказчик Xi",
        theme: "Тестирование",
        description: "Проверить совместимость с iOS",
        status: "Аннулировано",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: [],
        deadline: "2025-04-12"
    },
    {
        id: 15,
        dateSet: "2025-04-05",
        project: "Проект Omicron",
        theme: "Оптимизация",
        description: "Сжать изображения на сайте",
        status: "Принято заказчиком",
        executors: ["Храмов Дониш"],
        files: [],
        comments: [],
        deadline: "2025-04-15"
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
        comments: [],
        deadline: "2025-04-20"
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
        comments: [],
        deadline: "2025-04-14"
    },
    {
        id: 18,
        dateSet: "2025-04-08",
        project: "Заказчик Sigma",
        theme: "Дизайн",
        description: "Обновить цветовую схему",
        status: "Возвращен",
        executors: ["Закиров Фаррух"],
        files: [],
        comments: [],
        deadline: "2025-04-18"
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
        comments: [],
        deadline: "2025-04-25"
    },
    {
        id: 20,
        dateSet: "2025-04-10",
        project: "Заказчик Upsilon",
        theme: "Интеграция",
        description: "Подключить CRM систему",
        status: "Принято",
        executors: ["Нурманов Анвар"],
        files: [],
        comments: [],
        deadline: "2025-04-22"
    },
    {
        id: 21,
        dateSet: "2025-04-11",
        project: "Проект Phi",
        theme: "Разработка",
        description: "Создать админ-панель",
        status: "Выполнено",
        executors: ["Нарзуллоев Тохир"],
        files: [],
        comments: [],
        deadline: "2025-04-20"
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
        comments: [],
        deadline: "2025-04-30"
    },
    {
        id: 23,
        dateSet: "2025-04-13",
        project: "Проект Psi",
        theme: "Дизайн",
        description: "Разработать иконки для меню",
        status: "Принято заказчиком",
        executors: ["Храмов Дониш"],
        files: [],
        comments: [],
        deadline: "2025-04-20"
    },
    {
        id: 24,
        dateSet: "2025-04-14",
        project: "Заказчик Omega",
        theme: "Тестирование",
        description: "Проверить работу чата",
        status: "Аннулировано",
        executors: ["Сайдуллаев Дамир"],
        files: [],
        comments: [],
        deadline: "2025-04-25"
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
        comments: [],
        deadline: "2025-04-22"
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
        comments: [],
        deadline: "2025-05-01"
    },
    {
        id: 27,
        dateSet: "2025-04-17",
        project: "Проект Gamma-2",
        theme: "Интеграция",
        description: "Подключить уведомления",
        status: "Принято",
        executors: ["Бурханов Азим"],
        files: [],
        comments: [],
        deadline: "2025-04-28"
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
        comments: [],
        deadline: "2025-04-25"
    },
    {
        id: 29,
        dateSet: "2025-04-19",
        project: "Проект Epsilon-2",
        theme: "Оптимизация",
        description: "Улучшить SEO",
        status: "Возвращен",
        executors: ["Нарзуллоев Тохир"],
        files: [],
        comments: [],
        deadline: "2025-05-05"
    },
    {
        id: 30,
        dateSet: "2025-04-20",
        project: "Заказчик Zeta-2",
        theme: "Тестирование",
        description: "Проверить адаптивность",
        status: "Принято заказчиком",
        executors: ["Рустамов Жонибек"],
        files: [],
        comments: [],
        deadline: "2025-04-30"
    }
];
export let filters = {};
export let sortState = { field: null, ascending: true };
export let allProjects = [...new Set(tasks.map(task => task.project))];
export const paginationState = {
    currentPage: 1,
    tasksPerPage: 20
};
export function getAllExecutors() {
    // Собираем уникальных исполнителей из всех задач
    const executors = new Set();
    tasks.forEach(task => {
        task.executors.forEach(executor => {
            executors.add(executor);
        });
    });
    return Array.from(executors).sort();
}
import { createTable, createInterface } from './interface.js'

export function applyFilters() {
    const executorFilter = document.getElementById("executorFilter").value.toLowerCase();
    const projectFilter = document.getElementById("projectFilter").value.toLowerCase();
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    let filteredTasks = tasks.filter(task => {
        const matchesExecutors = !executorFilter || task.executors.some(ex => ex.toLowerCase().includes(executorFilter));
        const matchesProject = !projectFilter || (task.project && task.project.toLowerCase().includes(projectFilter));
        const matchesDateFrom = !dateFrom || task.dateSet >= dateFrom;
        const matchesDateTo = !dateTo || task.dateSet <= dateTo;

        return matchesExecutors && matchesProject && matchesDateFrom && matchesDateTo;
    });

    sortTasks(filteredTasks);
    paginationState.currentPage = 1;
    createTable(filteredTasks);
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
            return sortState.ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    });
}

export function renderPagination(taskList, totalPages) {
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

export function openEditModal(task) {
    const modal = document.createElement("div");
    modal.className = "modal trello-style-modal";

    task.comments = task.comments || [];
    task.files = task.files || [];
    task.executors = task.executors || [];
    task.history = task.history || [];
    task.deadline = task.deadline || "";

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    // Получаем последний комментарий
    const lastComment = task.comments.length ? task.comments[task.comments.length - 1] : null;
    const lastCommentText = lastComment ? lastComment.text : "";

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <h2>${task.project || "Без проекта"}</h2>
                <span class="date-set">Дата постановки: ${task.dateSet || "Не указана"}</span>
                <div class="header-actions">
                    <span class="status-label">Статус:</span>
                    <select id="statusSelect">
                        ${statuses.map(status => `
                            <option value="${status}" ${task.status === status ? 'selected' : ''}>${status}</option>
                        `).join('')}
                    </select>
                    <button class="close-modal-btn" id="closeModalBtn">×</button>
                </div>
            </div>
            <div class="modal-tabs">
                <button class="tab-btn active" data-tab="info">Информация о задаче</button>
                <button class="tab-btn" data-tab="extras">Дополнения к задаче</button>
                <button class="tab-btn" data-tab="history">История</button>
            </div>
            <div class="modal-body">
                <div class="tab-content" id="infoTab">
                    <div class="section">
                        <h3>Тема</h3>
                        <div class="editable-field">
                            <span id="themeDisplay">${task.theme || "Нет темы"}</span>
                            <input type="text" id="editTheme" value="${task.theme || ""}" class="hidden">
                        </div>
                    </div>
                    <div class="section">
                        <h3>Описание</h3>
                        <div class="editable-field">
                            <span id="descriptionDisplay">${task.description || "Нет описания"}</span>
                            <textarea id="editDescription" class="hidden">${task.description || ""}</textarea>
                        </div>
                    </div>
                    <div class="section comment-section">
                        <h3>Комментарий</h3>
                        <div class="comment-wrapper">
                            <textarea id="newComment" placeholder=""></textarea>
                            <span id="lastCommentOverlay" class="last-comment-overlay">${lastCommentText || "Нет последнего комментария"}</span>
                        </div>
                        <button id="addComment">Добавить</button>
                    </div>
                    <div class="section">
                        <h3>Вложения</h3>
                        <div id="fileList">
                            ${task.files.length ? task.files.map(file => `
                                <div class="file-item">
                                    <a href="${file.url}" target="_blank">${file.name}</a>
                                </div>
                            `).join("") : "Нет файлов"}
                        </div>
                    </div>
                </div>
                <div class="tab-content hidden" id="extrasTab">
                    <div class="section">
                        <h3>Исполнители</h3>
                        <div id="executorList" class="executor-list"></div>
                    </div>
                    <div class="section">
                        <h3>Дедлайн</h3>
                        <div class="editable-field">
                            <span id="deadlineDisplay">${task.deadline || "Не указан"}</span>
                            <input type="date" id="editDeadline" value="${task.deadline || ""}" class="hidden">
                        </div>
                    </div>
                </div>
                <div class="tab-content hidden" id="historyTab">
                    <div class="section">
                        <h3>История</h3>
                        <div id="historyList">
                            ${task.history.length ? task.history.map((entry) => `
                                <div class="history-item">
                                    <span class="history-date">${entry.date}</span>
                                    <span class="history-change">${entry.change}</span>
                                    <span class="history-user">${entry.user}</span>
                                </div>
                            `).join("") : "Нет истории изменений"}
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

    const originalTask = JSON.parse(JSON.stringify(task));

    // Переключение вкладок
    modal.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            modal.querySelectorAll(".tab-content").forEach(content => content.classList.add("hidden"));
            modal.querySelector(`#${btn.dataset.tab}Tab`).classList.remove("hidden");
        });
    });

    // Редактирование темы, описания и дедлайна
    ["theme", "description", "deadline"].forEach(field => {
        const display = modal.querySelector(`#${field}Display`);
        const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);

        if (display && input) {
            display.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                display.classList.add("hidden");
                input.classList.remove("hidden");
                input.focus();
            });

            if (field === "deadline") {
                input.addEventListener("change", () => {
                    task[field] = input.value;
                    display.textContent = task[field] || "Не указан";
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                });
            } else {
                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        task[field] = input.value;
                        display.textContent = task[field] || (field === "theme" ? "Нет темы" : "Нет описания");
                        display.classList.remove("hidden");
                        input.classList.add("hidden");
                    }
                });
            }

            input.addEventListener("blur", () => {
                if (field !== "deadline") {
                    input.value = task[field] || "";
                }
                display.classList.remove("hidden");
                input.classList.add("hidden");
            });
        }
    });

    // Исполнители
    const executorList = modal.querySelector("#executorList");
    function updateExecutorList() {
        executorList.innerHTML = '';
        task.executors.forEach(ex => {
            const executorItem = document.createElement("span");
            executorItem.className = "executor-item";
            executorItem.innerHTML = `
                <span class="executor-name">${ex}</span>
                <button class="remove-executor" data-executor="${ex}">×</button>
            `;
            executorList.appendChild(executorItem);
        });

        if (!task.executors.length) {
            const noExecutors = document.createElement("span");
            noExecutors.textContent = "Не назначены";
            executorList.appendChild(noExecutors);
        }

        const addButton = document.createElement("button");
        addButton.className = "add-executor-btn";
        addButton.innerHTML = `<img src="./image/plus.svg" style="width: 16px; height: 16px;">`;
        executorList.appendChild(addButton);

        addButton.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!executorList.querySelector("#addExecutorSelect")) {
                const selectWrapper = document.createElement("span");
                selectWrapper.className = "executor-item";
                selectWrapper.innerHTML = `
                    <select id="addExecutorSelect">
                        <option value="">Выберите исполнителя</option>
                        ${getAllExecutors().filter(ex => !task.executors.includes(ex)).map(ex => `
                            <option value="${ex}">${ex}</option>
                        `).join("")}
                    </select>
                    <button class="cancel-add-executor">×</button>
                `;
                executorList.replaceChild(selectWrapper, addButton);

                const addExecutorSelect = selectWrapper.querySelector("#addExecutorSelect");
                addExecutorSelect.addEventListener("change", (e) => {
                    e.stopPropagation();
                    const newExecutor = addExecutorSelect.value;
                    if (newExecutor && !task.executors.includes(newExecutor)) {
                        task.executors.push(newExecutor);
                        updateExecutorList();
                    }
                });

                selectWrapper.querySelector(".cancel-add-executor").addEventListener("click", (e) => {
                    e.stopPropagation();
                    executorList.replaceChild(addButton, selectWrapper);
                });
            }
        });

        executorList.querySelectorAll(".remove-executor").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const executor = btn.dataset.executor;
                task.executors = task.executors.filter(ex => ex !== executor);
                updateExecutorList();
            });
        });

        executorList.querySelectorAll(".executor-name").forEach(span => {
            span.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                const oldExecutor = span.textContent;
                const executorItem = span.parentElement;

                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="">Выберите исполнителя</option>
                    ${getAllExecutors().filter(ex => !task.executors.includes(ex) || ex === oldExecutor).map(ex => `
                        <option value="${ex}" ${ex === oldExecutor ? 'selected' : ''}>${ex}</option>
                    `).join("")}
                `;
                executorItem.replaceChild(select, span);
                select.focus();

                select.addEventListener("change", (e) => {
                    e.stopPropagation();
                    const newExecutor = select.value;
                    if (newExecutor && newExecutor !== oldExecutor && !task.executors.includes(newExecutor)) {
                        const index = task.executors.indexOf(oldExecutor);
                        task.executors[index] = newExecutor;
                    }
                    updateExecutorList();
                });

                select.addEventListener("blur", () => {
                    updateExecutorList();
                });
            });
        });
    }
    updateExecutorList();

    // Комментарии
    const addCommentBtn = modal.querySelector("#addComment");
    const newCommentTextarea = modal.querySelector("#newComment");
    const lastCommentOverlay = modal.querySelector("#lastCommentOverlay");

    // Прячем overlay, если есть текст в textarea
    newCommentTextarea.addEventListener("input", () => {
        lastCommentOverlay.style.display = newCommentTextarea.value.trim() ? "none" : "block";
    });

    if (addCommentBtn) {
        addCommentBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const commentText = newCommentTextarea.value.trim();
            if (commentText) {
                const newComment = {
                    text: commentText,
                    date: new Date().toLocaleDateString()
                };
                // Добавляем новый комментарий в массив и сразу в историю
                task.comments.push(newComment);
                task.history.push({
                    date: newComment.date,
                    change: `Добавлен комментарий: "${newComment.text}"`,
                    user: "Текущий пользователь"
                });
                // Обновляем overlay с новым последним комментарием
                lastCommentOverlay.textContent = newComment.text;
                lastCommentOverlay.style.display = "block";
                newCommentTextarea.value = ""; // Очищаем textarea
                // Обновляем историю
                modal.querySelector("#historyList").innerHTML = task.history.length ?
                    task.history.map((entry) => `
                        <div class="history-item">
                            <span class="history-date">${entry.date}</span>
                            <span class="history-change">${entry.change}</span>
                            <span class="history-user">${entry.user}</span>
                        </div>
                    `).join("") : "Нет истории изменений";
            }
        });
    }

    // Закрытие и сохранение
    const closeModal = () => {
        Object.assign(task, originalTask);
        modal.remove();
    };

    modal.querySelector("#closeModalBtn").addEventListener("click", closeModal);
    modal.querySelector("#closeBtn").addEventListener("click", closeModal);

    modal.querySelector("#saveBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        const newStatus = modal.querySelector("#statusSelect").value;
        if (task.status !== newStatus) {
            task.history.push({
                date: new Date().toLocaleDateString(),
                change: `Статус изменен с "${task.status}" на "${newStatus}"`,
                user: "Текущий пользователь"
            });
            task.status = newStatus;
        }
        applyFilters();
        modal.remove();
    });

    modal.addEventListener("click", (e) => {
        if (!modal.querySelector(".modal-content").contains(e.target)) closeModal();
    });
}

export function bindEventListeners(section, task, modal) {
    const content = modal.querySelector(`.accordion-header[data-section="${section}"]`).nextElementSibling;

    if (section === "theme" || section === "description") {
        const editBtn = content.querySelector(`.edit-btn[data-field="${section}"]`);
        if (editBtn) {
            editBtn.addEventListener("click", () => {
                const display = content.querySelector(`#${section}Display`);
                const input = content.querySelector(`#edit${section.charAt(0).toUpperCase() + section.slice(1)}`);
                display.classList.toggle("hidden");
                input.classList.toggle("hidden");
                editBtn.textContent = display.classList.contains("hidden") ? "💾" : "✏️";
                if (!display.classList.contains("hidden")) {
                    task[section] = input.value;
                    display.textContent = task[section] || `Нет ${section === "theme" ? "темы" : "описания"}`;
                }
            });
        }
    }

    if (section === "executors") {
        const executorList = content.querySelector("#executorList");
        executorList.querySelectorAll(".remove-executor").forEach(btn => {
            btn.addEventListener("click", () => {
                const executor = btn.dataset.executor;
                task.executors = task.executors.filter(ex => ex !== executor);
                addSection("executors", task, modal);
            });
        });

        const addExecutorSelect = content.querySelector("#addExecutorSelect");
        if (addExecutorSelect) {
            addExecutorSelect.addEventListener("change", () => {
                const newExecutor = addExecutorSelect.value;
                if (newExecutor && !task.executors.includes(newExecutor)) {
                    task.executors.push(newExecutor);
                    addSection("executors", task, modal);
                }
                addExecutorSelect.value = "";
            });
        }
    }

    if (section === "comments") {
        const addCommentBtn = content.querySelector("#addComment");
        if (addCommentBtn) {
            addCommentBtn.addEventListener("click", () => {
                const commentText = content.querySelector("#newComment").value.trim();
                if (commentText) {
                    task.comments.push({
                        text: commentText,
                        date: new Date().toLocaleDateString()
                    });
                    addSection("comments", task, modal);
                }
            });
        }

        content.querySelectorAll(".remove-comment").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.dataset.index);
                task.comments.splice(index, 1);
                addSection("comments", task, modal);
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", createInterface);