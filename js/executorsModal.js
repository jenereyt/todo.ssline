import { tasks, getAllExecutors } from './app.js';

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

    function refreshExecutorsList(modal) {
        const allExecutors = getAllExecutors();
        const listContainer = modal.querySelector("#allExecutorsList");

        listContainer.innerHTML = allExecutors.map(executor => `
            <div class="executor-list-item" data-executor="${executor}">
                <span class="executor-name">${executor}</span>
                <div class="executor-actions">
                    <button class="delete-executor-btn" data-executor="${executor}">
                        <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                    </button>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики для кнопок удаления после обновления списка
        listContainer.querySelectorAll(".delete-executor-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const executor = e.currentTarget.dataset.executor;
                if (confirm(`Вы уверены, что хотите удалить исполнителя "${executor}"?`)) {
                    tasks.forEach(task => {
                        task.executors = task.executors.filter(ex => ex !== executor);
                    });
                    refreshExecutorsList(modal); // Обновляем список после удаления
                }
            });
        });
    }

    // Обработчик для редактирования имени исполнителя
    const listContainer = modal.querySelector("#allExecutorsList");
    listContainer.addEventListener("dblclick", (e) => {
        const span = e.target.closest(".executor-name");
        if (!span) return;

        e.stopPropagation();
        const currentName = span.textContent;
        const listItem = span.closest(".executor-list-item");

        const input = document.createElement("input");
        input.type = "text";
        input.className = "edit-executor-input";
        input.value = currentName;
        listItem.replaceChild(input, span);
        input.focus();

        input.addEventListener("blur", saveEdit, { once: true });
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") saveEdit();
        });

        function saveEdit() {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                const exists = getAllExecutors().filter(ex => ex !== currentName).includes(newName);
                if (!exists) {
                    tasks.forEach(task => {
                        task.executors = task.executors.map(ex => ex === currentName ? newName : ex);
                    });
                    refreshExecutorsList(modal);
                } else {
                    const newSpan = document.createElement("span");
                    newSpan.className = "executor-name";
                    newSpan.textContent = currentName;
                    listItem.replaceChild(newSpan, input);
                    // alert("Исполнитель с таким именем уже существует!");
                }
            } else {
                const newSpan = document.createElement("span");
                newSpan.className = "executor-name";
                newSpan.textContent = currentName;
                listItem.replaceChild(newSpan, input);
            }
        }
    });

    // Инициализируем список с обработчиками удаления
    refreshExecutorsList(modal);
}