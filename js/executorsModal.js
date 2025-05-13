import { applyFilters, tasks, executors } from './app.js';
import { fetchExecutors, createExecutor, updateExecutor, deleteExecutor } from './executors.js';
import { removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory } from './history.js';

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
                <div class="executors-list" id="allExecutorsList">
                    <div class="spinner" style="margin: 10px auto;"></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    async function refreshExecutorsList() {
        const listContainer = modal.querySelector("#allExecutorsList");
        // Используем глобальный executors вместо fetchExecutors
        const allExecutors = executors.length ? executors : await fetchExecutors();
        listContainer.innerHTML = allExecutors.length ? allExecutors.map(executor => `
            <div class="executor-list-item" data-executor="${executor.name}" data-id="${executor.id}">
                <span class="executor-name">${executor.name}</span>
                <div class="executor-actions">
                    <button class="delete-executor-btn" data-id="${executor.id}">
                        <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                    </button>
                </div>
            </div>
        `).join('') : '<span>Нет исполнителей</span>';

        listContainer.querySelectorAll(".delete-executor-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.currentTarget.dataset.id;
                const executorName = e.currentTarget.closest('.executor-list-item').dataset.executor;
                if (confirm(`Вы уверены, что хотите удалить исполнителя "${executorName}"? Это удалит его из всех задач.`)) {
                    try {
                        // Удаляем связи с задачами
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
                        // Обновляем глобальный массив
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
                const currentName = span.textContent;
                const id = span.closest('.executor-list-item').dataset.id;
                const listItem = span.closest(".executor-list-item");

                const input = document.createElement("input");
                input.type = "text";
                input.className = "edit-executor-input";
                input.value = currentName;
                listItem.replaceChild(input, span);
                input.focus();

                async function saveEdit() {
                    const newName = input.value.trim();
                    if (newName && newName !== currentName) {
                        try {
                            // Проверяем, нет ли уже такого имени
                            const existingExecutor = executors.find(ex => ex.name.toLowerCase() === newName.toLowerCase());
                            if (existingExecutor) {
                                // alert('Исполнитель с таким именем уже существует');
                                await refreshExecutorsList();
                                return;
                            }
                            await updateExecutor(id, newName);
                            // Обновляем задачи локально и добавляем в историю
                            for (const task of tasks) {
                                if (task.executors.includes(currentName)) {
                                    task.executors = task.executors.map(ex => ex === currentName ? newName : ex);
                                    await createHistory(
                                        task.id,
                                        `Исполнитель изменён с "${currentName}" на "${newName}"`,
                                        "Текущий пользователь"
                                    );
                                }
                            }
                            // Обновляем глобальный массив
                            executors.length = 0;
                            executors.push(...(await fetchExecutors()));
                            await refreshExecutorsList();
                            applyFilters();
                        } catch (error) {
                            alert(error.message);
                        }
                    } else {
                        await refreshExecutorsList();
                    }
                }

                input.addEventListener("blur", saveEdit, { once: true });
                input.addEventListener("keypress", async (e) => {
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

    const input = modal.querySelector("#newGlobalExecutor");
    modal.querySelector("#saveGlobalExecutor").addEventListener("click", async () => {
        const newExecutor = input.value.trim();
        if (newExecutor) {
            try {
                // Проверяем, нет ли уже такого имени
                const existingExecutor = executors.find(ex => ex.name.toLowerCase() === newExecutor.toLowerCase());
                if (existingExecutor) {
                    alert('Исполнитель с таким именем уже существует');
                    return;
                }
                await createExecutor(newExecutor);
                // Обновляем глобальный массив
                executors.length = 0;
                executors.push(...(await fetchExecutors()));
                await refreshExecutorsList();
                applyFilters();
                input.value = "";
            } catch (error) {
                alert(error.message);
            }
        }
    });

    input.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            modal.querySelector("#saveGlobalExecutor").click();
        }
    });
}