import { showNotification } from './utils.js';
import { customers, syncCustomers } from './app.js';

// Конфигурация API
const API_BASE_URL = 'https://servtodo.ssline.uz';
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

// Вспомогательная функция для обработки HTTP-ответов
async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    return response.json();
}

// Получение списка всех заказчиков
async function fetchCustomers() {
    const url = `${API_BASE_URL}/customers`;
    console.log('[API] Fetching customers from:', url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });

        const data = await handleResponse(response);
        console.log('[API] Customers received:', data);

        return data.map(customer => ({
            id: customer.id,
            name: customer.name,
            tasks: Array.isArray(customer.tasks) ? customer.tasks.map(task => ({
                id: task.id,
                project: task.project,
                theme: task.theme
            })) : []
        }));
    } catch (error) {
        console.error('[API] Failed to fetch customers:', error);
        showNotification(`Ошибка загрузки заказчиков: ${error.message}`);
        throw error;
    }
}

// Получение заказчика по ID
async function fetchCustomerById(customerId) {
    if (!customerId) {
        console.error('[API] Customer ID is required');
        throw new Error('ID заказчика не указан');
    }

    const url = `${API_BASE_URL}/customers/${customerId}`;
    console.log(`[API] Fetching customer #${customerId} from:`, url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });

        const data = await handleResponse(response);
        console.log(`[API] Customer #${customerId} received:`, data);

        return {
            id: data.id,
            name: data.name,
            tasks: Array.isArray(data.tasks) ? data.tasks.map(task => ({
                id: task.id,
                project: task.project,
                theme: task.theme
            })) : []
        };
    } catch (error) {
        console.error(`[API] Failed to fetch customer #${customerId}:`, error);
        showNotification(`Не удалось загрузить заказчика: ${error.message}`);
        throw error;
    }
}

// Создание нового заказчика
async function createCustomer(customerData) {
    if (!customerData?.name) {
        console.error('[API] Customer name is required');
        throw new Error('Имя заказчика не указано');
    }

    const url = `${API_BASE_URL}/customers`;
    const body = {
        name: customerData.name.trim()
    };

    console.log('[API] Creating new customer:', url, body);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(body)
        });

        const data = await handleResponse(response);
        console.log('[API] Customer created:', data);

        // Синхронизируем локальный список
        await syncCustomers();

        return {
            id: data.id,
            name: data.name,
            tasks: []
        };
    } catch (error) {
        console.error('[API] Failed to create customer:', error);
        showNotification(`Ошибка создания заказчика: ${error.message}`);
        throw error;
    }
}

// Обновление заказчика
async function updateCustomer(customerId, customerData) {
    if (!customerId) {
        console.error('[API] Customer ID is required');
        throw new Error('ID заказчика не указан');
    }

    if (!customerData?.name) {
        console.error('[API] Customer name is required');
        throw new Error('Имя заказчика не указано');
    }

    const url = `${API_BASE_URL}/customers/${customerId}`;
    const body = {
        name: customerData.name.trim()
    };

    console.log(`[API] Updating customer #${customerId}:`, url, body);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(body)
        });

        const data = await handleResponse(response);
        console.log(`[API] Customer #${customerId} updated:`, data);

        // Синхронизируем локальный список
        await syncCustomers();

        return {
            id: data.id,
            name: data.name,
            tasks: Array.isArray(data.tasks) ? data.tasks.map(task => ({
                id: task.id,
                project: task.project,
                theme: task.theme
            })) : []
        };
    } catch (error) {
        console.error(`[API] Failed to update customer #${customerId}:`, error);
        showNotification(`Ошибка обновления заказчика: ${error.message}`);
        throw error;
    }
}

// Удаление заказчика
async function deleteCustomer(customerId) {
    if (!customerId) {
        console.error('[API] Customer ID is required');
        throw new Error('ID заказчика не указан');
    }

    const url = `${API_BASE_URL}/customers/${customerId}`;
    console.log(`[API] Deleting customer #${customerId}:`, url);

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: DEFAULT_HEADERS
        });

        await handleResponse(response);
        console.log(`[API] Customer #${customerId} deleted`);

        // Синхронизируем локальный список
        await syncCustomers();
    } catch (error) {
        console.error(`[API] Failed to delete customer #${customerId}:`, error);
        showNotification(`Ошибка удаления заказчика: ${error.message}`);
        throw error;
    }
}

export { fetchCustomers, fetchCustomerById, createCustomer, updateCustomer, deleteCustomer };