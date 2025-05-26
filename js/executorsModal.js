import { applyFilters, tasks, executors } from './app.js';
import { fetchExecutors, createExecutor, updateExecutor, deleteExecutor } from './executors.js';
import { removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory } from './history.js';

export function openGlobalExecutorModal() {
    const modal = document.createElement("div");
    modal.className = "modal trello-style-modal";

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Исполнители</h2>
                <button class="close-modal-btn" id="closeModalBtn">×</button>
            </div>
            <div class="add-executor-section">
                <h3>Добавить нового исполнителя</h3>
                <div class="input-with-clear">
                    <input type="text" id="newGlobalExecutorName" placeholder="Имя исполнителя">
                    <input type="text" id="newGlobalExecutorPhone" placeholder="Номер телефона (+998...)">
                    <button id="saveGlobalExecutor" class="action-btn">Добавить</button>
                </div>
            </div>
            <div class="all-executors-section">
                <h3>Список исполнителей</h3>
                <ul class="executors-list" id="allExecutorsList">
                    <div class="spinner" style="margin: 10px auto;"></div>
                </ul>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    async function refreshExecutorsList() {
        const listContainer = modal.querySelector("#allExecutorsList");
        const allExecutors = executors.length ? executors : await fetchExecutors();
        listContainer.innerHTML = allExecutors.length ? allExecutors.map(executor => `
            <li class="executor-list-item" data-executor="${executor.name}" data-id="${executor.id}">
                <span class="executor-name">${executor.name}${executor.phone_number ? ` (${executor.phone_number})` : ''}</span>
                <div class="executor-actions">
                    <button class="delete-executor-btn" data-id="${executor.id}">
                        <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                    </button>
                </div>
            </li>
        `).join('') : '<span>Нет исполнителей</span>';

        listContainer.querySelectorAll(".delete-executor-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.dataset.id;
                const executorName = e.currentTarget.closest('.executor-list-item').dataset.executor;
                if (confirm(`Вы уверены, что хотите удалить исполнителя "${executorName}"? Это удалит его из всех задач.`)) {
                    try {
                        for (const task of tasks) {
                            if (task.executors.includes(executorName)) {
                                await removeExecutorFromTask(task.id, id);
                                await createHistory(
                                    task.id,
                                    `Удалён исполнитель: "${executorName}"`,
                                    "Текущий пользователь"
                                );
                                task.executors = task.executors.filter(ex => ex !== executorName);
                            }
                        }
                        await deleteExecutor(id);
                        executors.length = 0;
                        executors.push(...(await fetchExecutors()));
                        await refreshExecutorsList();
                        applyFilters();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

        listContainer.querySelectorAll(".executor-name").forEach(span => {
            span.addEventListener("dblclick", async (e) => {
                e.stopPropagation();
                const currentName = span.textContent.split(' (')[0];
                const currentExecutor = allExecutors.find(ex => ex.name === currentName);
                const currentPhone = currentExecutor ? currentExecutor.phone_number : '';
                const id = span.closest('.executor-list-item').dataset.id;
                const listItem = span.closest(".executor-list-item");

                const editContainer = document.createElement("div");
                editContainer.className = "edit-executor-container";
                editContainer.innerHTML = `
                    <input type="text" class="edit-executor-input" value="${currentName}">
                    <input type="text" class="edit-executor-phone" value="${currentPhone}" placeholder="Номер телефона (+998...)">
                `;
                listItem.replaceChild(editContainer, span);
                const nameInput = editContainer.querySelector(".edit-executor-input");
                nameInput.focus();

                async function saveEdit() {
                    const newName = nameInput.value.trim();
                    const newPhone = editContainer.querySelector(".edit-executor-phone").value.trim();
                    if (newName && (newName !== currentName || newPhone !== currentPhone)) {
                        try {
                            const existingExecutor = executors.find(ex =>
                                (ex.name.toLowerCase() === newName.toLowerCase() ||
                                    (newPhone && ex.phone_number === newPhone)) &&
                                ex.id !== id
                            );
                            if (existingExecutor) {
                                alert('Исполнитель с таким именем или номером телефона уже существует');
                                await refreshExecutorsList();
                                return;
                            }
                            await updateExecutor(id, { name: newName, phone_number: newPhone });
                            for (const task of tasks) {
                                if (task.executors.includes(currentName)) {
                                    task.executors = task.executors.map(ex => ex === currentName ? newName : ex);
                                    await createHistory(
                                        task.id,
                                        `Исполнитель изменён с "${currentName}" на "${newName}"${newPhone ? ` (${newPhone})` : ''}`,
                                        "Текущий пользователь"
                                    );
                                }
                            }
                            executors.length = 0;
                            executors.push(...(await fetchExecutors()));
                            await refreshExecutorsList();
                            applyFilters();
                        } catch (error) {
                            alert(error.message);
                            await refreshExecutorsList();
                        }
                    } else {
                        await refreshExecutorsList();
                    }
                }

                nameInput.addEventListener("blur", saveEdit, { once: true });
                editContainer.querySelector(".edit-executor-phone").addEventListener("blur", saveEdit, { once: true });
                nameInput.addEventListener("keypress", async (e) => {
                    if (e.key === "Enter") await saveEdit();
                });
                editContainer.querySelector(".edit-executor-phone").addEventListener("keypress", async (e) => {
                    if (e.key === "Enter") await saveEdit();
                });
            });
        });
    }

    refreshExecutorsList();

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.querySelector("#closeModalBtn").addEventListener("click", () => modal.remove());

    const nameInput = modal.querySelector("#newGlobalExecutorName");
    const phoneInput = modal.querySelector("#newGlobalExecutorPhone");
    modal.querySelector("#saveGlobalExecutor").addEventListener("click", async () => {
        const newExecutorName = nameInput.value.trim();
        const newExecutorPhone = phoneInput.value.trim();
        if (newExecutorName) {
            try {
                const existingExecutor = executors.find(ex =>
                    ex.name.toLowerCase() === newExecutorName.toLowerCase() ||
                    (newExecutorPhone && ex.phone_number === newExecutorPhone)
                );
                if (existingExecutor) {
                    alert('Исполнитель с таким именем или номером телефона уже существует');
                    return;
                }
                await createExecutor({ name: newExecutorName, phone_number: newExecutorPhone });
                executors.length = 0;
                executors.push(...(await fetchExecutors()));
                await refreshExecutorsList();
                applyFilters();
                nameInput.value = "";
                phoneInput.value = "";
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert('Введите имя исполнителя');
        }
    });

    nameInput.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            modal.querySelector("#saveGlobalExecutor").click();
        }
    });
    phoneInput.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            modal.querySelector("#saveGlobalExecutor").click();
        }
    });
}