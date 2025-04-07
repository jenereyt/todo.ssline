import { tasks, getAllExecutors } from './app.js'; // Предполагается, что основной файл называется app.js

export function openGlobalExecutorModal() {
    const modal = document.createElement("div");
    modal.className = "modale";
    const allExecutors = getAllExecutors();

    modal.innerHTML = `
        <div class="modal-contente">
            <div class="modale-header">
                <h2>Управление исполнителями</h2>
                <button class="close-modal-btn" id="closeModalBtn">×</button>
            </div>
            <div class="add-executor-section">
                <h3>Добавить нового исполнителя</h3>
                <div class="input-with-clear">
                    <input type="text" id="newGlobalExecutor" placeholder="Имя исполнителя">
                    <button id="saveGlobalExecutor" class="action-btn">Добавить</button>
                </div>
            </div>
            <div class="all-executors-section">
                <h3>Список исполнителей</h3>
                <div class="executors-list" id="allExecutorsList">
                    ${allExecutors.map(executor => `
                        <div class="executor-list-item" data-executor="${executor}">
                            <span class="executor-name">${executor}</span>
                            <div class="executor-actions">
                                <button class="edit-executor-btn" data-executor="${executor}">
                                    <img src="./image/pencil.svg" alt="Редактировать" width="16" height="16" />
                                </button>
                                <button class="delete-executor-btn" data-executor="${executor}">
                                    <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.querySelector("#closeModalBtn").addEventListener("click", () => modal.remove());

    const input = modal.querySelector("#newGlobalExecutor");

    input.addEventListener("input", (e) => {
        // Убираем вывод предложений при наборе текста в модальном окне
    });

    modal.querySelector("#saveGlobalExecutor").addEventListener("click", () => {
        const newExecutor = input.value.trim();
        if (newExecutor) {
            const executorExists = getAllExecutors().includes(newExecutor);

            if (!executorExists) {
                tasks.push({
                    id: tasks.length + 1,
                    dateSet: new Date().toISOString().split("T")[0],
                    project: "Без проекта",
                    theme: "Без темы",
                    description: "Фиктивная задача для исполнителя",
                    status: "В процессе",
                    executors: [newExecutor],
                    comments: [],
                    files: []
                });
                refreshExecutorsList(modal);
                input.value = "";
            } else {
                alert("Исполнитель с таким именем уже существует!");
            }
        }
    });

    modal.querySelectorAll(".edit-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.currentTarget.dataset.executor;
            const listItem = btn.closest(".executor-list-item");
            const nameSpan = listItem.querySelector(".executor-name");

            const currentName = nameSpan.textContent;
            nameSpan.innerHTML = `<input type="text" class="edit-executor-input" value="${currentName}">`;
            const editInput = nameSpan.querySelector(".edit-executor-input");
            editInput.focus();

            editInput.addEventListener("blur", saveEdit);
            editInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") saveEdit();
            });

            function saveEdit() {
                const newName = editInput.value.trim();
                if (newName && newName !== currentName) {
                    const exists = getAllExecutors().filter(ex => ex !== currentName).includes(newName);

                    if (!exists) {
                        tasks.forEach(task => {
                            task.executors = task.executors.map(ex => ex === currentName ? newName : ex);
                        });
                        refreshExecutorsList(modal);
                    } else {
                        nameSpan.textContent = currentName;
                        return;
                    }
                } else if (newName === currentName || !newName) {
                    nameSpan.textContent = currentName;
                }
            }
        });
    });

    modal.querySelectorAll(".delete-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.currentTarget.dataset.executor;
            if (confirm(`Вы уверены, что хотите удалить исполнителя "${executor}"?`)) {
                tasks.forEach(task => {
                    task.executors = task.executors.filter(ex => ex !== executor);
                });
                refreshExecutorsList(modal);
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
                <button class="edit-executor-btn" data-executor="${executor}">
                    <img src="./image/pencil.svg" alt="Редактировать" width="16" height="16" />
                </button>
                <button class="delete-executor-btn" data-executor="${executor}">
                    <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                </button>
            </div>
        </div>
    `).join('');

    modal.querySelectorAll(".edit-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.currentTarget.dataset.executor;
            const listItem = btn.closest(".executor-list-item");
            const nameSpan = listItem.querySelector(".executor-name");

            const currentName = nameSpan.textContent;
            nameSpan.innerHTML = `<input type="text" class="edit-executor-input" value="${currentName}">`;
            const editInput = nameSpan.querySelector(".edit-executor-input");
            editInput.focus();

            editInput.addEventListener("blur", saveEdit);
            editInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") saveEdit();
            });

            function saveEdit() {
                const newName = editInput.value.trim();
                if (newName && newName !== currentName) {
                    const exists = getAllExecutors().filter(ex => ex !== currentName).includes(newName);

                    if (!exists) {
                        tasks.forEach(task => {
                            task.executors = task.executors.map(ex => ex === currentName ? newName : ex);
                        });
                        refreshExecutorsList(modal);
                    } else {
                        nameSpan.textContent = currentName;
                        return;
                    }
                } else if (newName === currentName || !newName) {
                    nameSpan.textContent = currentName;
                }
            }
        });
    });

    modal.querySelectorAll(".delete-executor-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const executor = e.currentTarget.dataset.executor;
            if (confirm(`Вы уверены, что хотите удалить исполнителя "${executor}"?`)) {
                tasks.forEach(task => {
                    task.executors = task.executors.filter(ex => ex !== executor);
                });
                refreshExecutorsList(modal);
            }
        });
    });
}