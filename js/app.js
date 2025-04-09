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
// import { openGlobalExecutorModal, refreshExecutorsList } from './executorsModal.js';
import { createTable, createInterface, } from './interface.js'

export function applyFilters() {
    filters.executors = document.getElementById("executorFilter").value;

    let filteredTasks = tasks.filter(task => {
        return (
            (!filters.executors || task.executors.some(ex => ex.toLowerCase().includes(filters.executors.toLowerCase()))) &&
            (!filters.dateFrom || task.dateSet >= filters.dateFrom) &&
            (!filters.dateTo || task.dateSet <= filters.dateTo)
        );
    });
    sortTasks(filteredTasks);
    paginationState.currentPage = 1; // Обновлено: используем paginationState
    createTable(filteredTasks);
}

export function sortTasks(taskList) {
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

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    modal.innerHTML = `
        <div class="modal-content trello-modal-content">
            <div class="modal-header">
                <h2>${task.project || "Без проекта"}</h2>
                <span class="date-set">Дата постановки: ${task.dateSet || "Не указана"}</span>
                <div class="header-actions">
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
                            <button class="edit-btn" data-field="theme"><img src="./image/pencil.svg"></button>
                        </div>
                    </div>
                    <div class="section">
                        <h3>Описание</h3>
                        <div class="editable-field">
                            <span id="descriptionDisplay">${task.description || "Нет описания"}</span>
                            <textarea id="editDescription" class="hidden">${task.description || ""}</textarea>
                            <button class="edit-btn" data-field="description"><img src="./image/pencil.svg"></button>
                        </div>
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
                        <h3>Комментарии</h3>
                        <div id="commentList"></div>
                        <textarea id="newComment" placeholder="Напишите комментарий..."></textarea>
                        <button id="addComment">Добавить</button>
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

    // Редактирование темы и описания
    ["theme", "description"].forEach(field => {
        const editBtn = modal.querySelector(`.edit-btn[data-field="${field}"]`);
        const display = modal.querySelector(`#${field}Display`);
        const input = modal.querySelector(`#edit${field.charAt(0).toUpperCase() + field.slice(1)}`);

        if (editBtn && display && input) {
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const isEditing = display.classList.contains("hidden");
                if (isEditing) {
                    task[field] = input.value;
                    display.textContent = task[field] || (field === "theme" ? "Нет темы" : "Нет описания");
                    display.classList.remove("hidden");
                    input.classList.add("hidden");
                    editBtn.innerHTML = '<img src="./image/pencil.svg">';
                } else {
                    display.classList.add("hidden");
                    input.classList.remove("hidden");
                    input.focus();
                    editBtn.innerHTML = '<img src="./image/save.svg">';
                }
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
                <button class="edit-executor" data-executor="${ex}"><img src="./image/pencil.svg""></button>
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

        // Обработчик кнопки добавления
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

        // Привязка событий для удаления
        executorList.querySelectorAll(".remove-executor").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const executor = btn.dataset.executor;
                task.executors = task.executors.filter(ex => ex !== executor);
                updateExecutorList();
            });
        });

        // Привязка событий для редактирования
        executorList.querySelectorAll(".edit-executor").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const oldExecutor = btn.dataset.executor;
                const executorItem = btn.parentElement;
                const executorNameSpan = executorItem.querySelector(".executor-name");

                const select = document.createElement("select");
                select.innerHTML = `
                    <option value="">Выберите исполнителя</option>
                    ${getAllExecutors().filter(ex => !task.executors.includes(ex) || ex === oldExecutor).map(ex => `
                        <option value="${ex}" ${ex === oldExecutor ? 'selected' : ''}>${ex}</option>
                    `).join("")}
                `;
                executorItem.replaceChild(select, executorNameSpan);
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
    const commentList = modal.querySelector("#commentList");

    function updateCommentList() {
        commentList.innerHTML = task.comments.length ? task.comments.map((comment, index) => `
            <div class="comment-item" data-index="${index}">
                ${comment.text} <small>(${comment.date})</small>
                <button class="remove-comment" data-index="${index}">×</button>
            </div>
        `).join("") : "Нет комментариев";

        commentList.querySelectorAll(".remove-comment").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                task.comments.splice(index, 1);
                updateCommentList();
            });
        });
    }

    const addCommentBtn = modal.querySelector("#addComment");
    if (addCommentBtn) {
        addCommentBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const commentText = modal.querySelector("#newComment").value.trim();
            if (commentText) {
                task.comments.push({
                    text: commentText,
                    date: new Date().toLocaleDateString()
                });
                updateCommentList();
                modal.querySelector("#newComment").value = "";
            }
        });
    }

    updateCommentList();

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