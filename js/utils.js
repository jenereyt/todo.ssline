import { currentPage } from './data.js'; // Добавляем импорт currentPage

export function getAllExecutors(tasks) {
    return [...new Set(tasks.flatMap(task => task.executors))];
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
    currentPage = 1;
    createTable(filteredTasks);
}