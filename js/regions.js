import { BASE_URL } from './config.js';
import { showNotification } from './utils.js';

async function handleResponse(response) {
    console.log('Статус ответа:', response.status, response.statusText);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response.json();
}

export async function fetchRegions() {
    const url = `${BASE_URL}/regions`;
    console.log('Запрос регионов:', url);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await handleResponse(response);
        console.log('Полученные регионы:', data);
        return data.map(region => ({
            id: region.id,
            region_name: region.region_name
        }));
    } catch (error) {
        console.error('Ошибка при получении регионов:', error);
        showNotification(`Не удалось загрузить регионы: ${error.message}`);
        return [];
    }
}

export async function createRegion(regionData) {
    const url = `${BASE_URL}/regions`;
    const body = {
        region_name: regionData.region_name || 'Новый регион'
    };
    console.log('Создание региона:', url, 'Тело:', body);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await handleResponse(response);
        console.log('Создан регион:', data);
        return {
            id: data.id,
            region_name: data.region_name
        };
    } catch (error) {
        console.error('Ошибка при создании региона:', error);
        showNotification(`Не удалось создать регион: ${error.message}`);
        throw error;
    }
}

export async function updateRegion(regionId, regionData) {
    const url = `${BASE_URL}/regions/${regionId}`;
    const body = {
        region_name: regionData.region_name
    };
    console.log('Обновление региона:', regionId, url, 'Тело:', body);
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await handleResponse(response);
        console.log('Обновлён регион:', data);
        return {
            id: data.id,
            region_name: data.region_name
        };
    } catch (error) {
        console.error('Ошибка при обновлении региона:', error);
        showNotification(`Не удалось обновить регион: ${error.message}`);
        throw error;
    }
}

export async function deleteRegion(regionId) {
    const url = `${BASE_URL}/regions/${regionId}`;
    console.log('Удаление региона:', regionId, url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await handleResponse(response);
        console.log('Регион удалён:', regionId);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении региона:', error);
        showNotification(`Не удалось удалить регион: ${error.message}`);
        throw error;
    }
}