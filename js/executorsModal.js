
import { executors, getAllExecutors, addExecutor, deleteExecutor, renameExecutor } from './app.js';

export function openGlobalExecutorModal() {
    const modal = document.createElement("div");
    modal.className = "modale";

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
                <div class="executors-list" id="allExecutorsList"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    function refreshExecutorsList() {
        const allExecutors = getAllExecutors();
        const listContainer = modal.querySelector("#allExecutorsList");
        listContainer.innerHTML = allExecutors.length ? allExecutors.map(executor => `
            <div class="executor-list-item" data-executor="${executor}">
                <span class="executor-name">${executor}</span>
                <div class="executor-actions">
                    <button class="delete-executor-btn" data-executor="${executor}">
                        <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                    </button>
                </div>
            </div>
        `).join('') : '<span>Нет исполнителей</span>';

        listContainer.querySelectorAll(".delete-executor-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const executor = e.currentTarget.dataset.executor;
                if (confirm(`Вы уверены, что хотите удалить исполнителя "${executor}"? Это удалит его из всех задач.`)) {
                    deleteExecutor(executor);
                    refreshExecutorsList();
                    applyFilters(); 
                }
            });
        });

        listContainer.querySelectorAll(".executor-name").forEach(span => {
            span.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                const currentName = span.textContent;
                const listItem = span.closest(".executor-list-item");

                const input = document.createElement("input");
                input.type = "text";
                input.className = "edit-executor-input";
                input.value = currentName;
                listItem.replaceChild(input, span);
                input.focus();

                function saveEdit() {
                    const newName = input.value.trim();
                    if (newName && newName !== currentName) {
                        if (renameExecutor(currentName, newName)) {
                            refreshExecutorsList();
                            applyFilters();
                        } else {
                        }
                    }
                    refreshExecutorsList();
                }

                input.addEventListener("blur", saveEdit, { once: true });
                input.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") saveEdit();
                });
            });
        });
    }

    refreshExecutorsList();

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.querySelector("#closeModalBtn").addEventListener("click", () => modal.remove());

    const input = modal.querySelector("#newGlobalExecutor");
    modal.querySelector("#saveGlobalExecutor").addEventListener("click", () => {
        const newExecutor = input.value.trim();
        if (newExecutor) {
            if (addExecutor(newExecutor)) {
                refreshExecutorsList();
                input.value = "";
            } else {
                alert("Исполнитель с таким именем уже существует!");
            }
        }
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            modal.querySelector("#saveGlobalExecutor").click();
        }
    });
}