import { tasks, createTable } from './table.js';
import { getAllExecutors } from './utils.js';
import { applyFilters } from './utils.js'; // Добавляем импорт applyFilters
import { filters, sortState } from './data.js'; // Добавляем импорт filters и sortState

export function openGlobalExecutorModal() {
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

export function openEditModal(task) {
    const modal = document.createElement("div");
    modal.className = "modal";

    if (!task.comments) task.comments = [];
    if (!task.files) task.files = [];

    const statuses = ["Принято", "Выполнено", "Принято заказчиком", "Аннулировано", "Возвращен"];

    modal.innerHTML = `
          <div class="modal-content full-task-modal">
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
                <button id="openExtraModalBtn">История</button>
            </div>
        </div>
        <button class="close-modal-btn" id="closeModalBtn">×</button>
    </div>
            <div class="task-details">
                <div class="field theme">
                    <label>Тема:</label>
                    <div class="editable-field">
                        <span id="themeDisplay">${task.theme}</span>
                        <input type="text" id="editTheme" value="${task.theme}" class="hidden">
                        <button class="edit-btn" data-field="theme">✏️</button>
                    </div>
                </div>
                <div class="field">
                    <label>Описание:</label>
                    <div class="editable-field">
                        <span id="descriptionDisplay">${task.description}</span>
                        <textarea id="editDescription" class="hidden">${task.description}</textarea>
                        <button class="edit-btn" data-field="description">✏️</button>
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
        ${getAllExecutors()
                .filter(ex => !task.executors.includes(ex)) // Фильтруем уже назначенных
                .sort((a, b) => a.localeCompare(b)) // Сортируем в алфавитном порядке
                .map(exec => `
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

export function updateExecutorList(task, modal) {
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

export function updateCommentList(task, modal) {
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

export function refreshExecutorsList(modal) {
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