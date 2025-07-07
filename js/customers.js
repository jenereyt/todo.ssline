import { BASE_URL } from './config.js';
import { fetchRegions } from './regions.js';

async function handleResponse(response) {
    console.log('Статус ответа:', response.status, response.statusText);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
    }
    // Для статусов вроде 204 No Content возвращаем null
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

async function mapCustomer(customer) {
    const regions = await fetchRegions();
    const region = regions.find(r => r.id === parseInt(customer.regionId)) || { id: 0, region_name: 'Не указан' };
    return {
        id: customer.id,
        name: customer.name,
        region: region,
        inn: customer.inn || '',
        pinfl: customer.pinfl || '',
        contact_person: customer.contact_person || '',
        phone_number: customer.phone_number || ''
    };
}

export async function fetchCustomers() {
    const url = `${BASE_URL}/customers`;
    console.log('Запрос заказчиков:', url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await handleResponse(response);
        console.log('Полученные заказчики:', data);
        return await Promise.all(data.map(customer => mapCustomer(customer)));
    } catch (error) {
        console.error('Ошибка при получении заказчиков:', error);
        alert(`Не удалось загрузить список заказчиков: ${error.message}`);
        return [];
    }
}

export async function fetchCustomerById(customerId) {
    const url = `${BASE_URL}/customers/${customerId}`;
    console.log('Запрос заказчика по ID:', customerId, url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await handleResponse(response);
        console.log('Получен заказчик:', data);
        return await mapCustomer(data);
    } catch (error) {
        console.error('Ошибка при получении заказчика:', error);
        throw error;
    }
}

export async function createCustomer(customerData) {
    const url = `${BASE_URL}/customers`;
    const body = {
        name: customerData.name || 'Новый заказчик',
        regionId: customerData.region?.id?.toString() || '0',
        inn: customerData.inn || '000000000000',
        pinfl: customerData.pinfl || '00000000000000',
        contact_person: customerData.contact_person || 'Не указан',
        phone_number: customerData.phone_number || 'Не указан'
    };
    console.log('Создание заказчика:', url, 'Тело:', body);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await handleResponse(response);
        console.log('Создан заказчик:', data);
        return await mapCustomer(data);
    } catch (error) {
        console.error('Ошибка при создании заказчика:', error);
        throw error;
    }
}

export async function updateCustomer(customerId, customerData) {
    const url = `${BASE_URL}/customers/${customerId}`;
    const body = {
        name: customerData.name,
        regionId: customerData.region?.id?.toString() || '0',
        inn: customerData.inn || '',
        pinfl: customerData.pinfl || '',
        contact_person: customerData.contact_person || '',
        phone_number: customerData.phone_number || ''
    };
    console.log('Обновление заказчика:', customerId, url, 'Тело:', body);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await handleResponse(response);
        console.log('Обновлён заказчик:', data);
        return await mapCustomer(data);
    } catch (error) {
        console.error('Ошибка при обновлении заказчика:', error);
        throw error;
    }
}

export async function deleteCustomer(customerId) {
    const url = `${BASE_URL}/customers/${customerId}`;
    console.log('Удаление заказчика:', customerId, url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await handleResponse(response);
        console.log('Заказчик удалён:', customerId);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении заказчика:', error);
        throw error;
    }
}