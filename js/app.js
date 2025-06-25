import { createTaskCards, createInterface } from './interface.js';
import { fetchExecutors } from './executors.js';
import { fetchExecutorsOnTasks, assignExecutorToTask, removeExecutorFromTask } from './executorsOnTask.js';
import { createHistory, fetchHistory } from './history.js';
import { showNotification, showLoading } from './utils.js';
import { fetchTasks, createTask, updateTask, syncExecutorsOnTasks, syncFiles, syncHistory, updateDerivedData } from './tasks.js';
import { applyFilters, sortTasks, openEditModal } from './modal.js';

export let tasks = [];
export let executors = [];
export const customers = [];
export let filters = {};
export let sortState = { field: null, ascending: true };
export let allProjects = [];
export function getAllExecutors() {
    return executors.map(ex => ex.name).sort();
}
export async function syncCustomers() {
    const { fetchCustomers } = await import('./customers.js');
    const fetchedCustomers = await fetchCustomers();
    customers.length = 0;
    customers.push(...fetchedCustomers);
    console.log('Заказчики синхронизированы:', customers);
}
document.addEventListener("DOMContentLoaded", async () => {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";
    loadingOverlay.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loadingOverlay);

    try {
        executors = await fetchExecutors();
        console.log('Инициализация: Полученные исполнители:', executors);
        if (!executors.length) {
            showNotification('Не удалось загрузить список исполнителей');
        }
        createInterface();
        showNotification('Пожалуйста, укажите диапазон дат для загрузки задач');
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showNotification(`Не удалось загрузить данные: ${error.message}`);
    } finally {
        loadingOverlay.remove();
    }
});