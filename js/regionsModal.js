import { showNotification, showLoading } from './utils.js';
import { fetchRegions, createRegion, updateRegion, deleteRegion } from './regions.js';

let regions = [];

async function syncRegions() {
    regions = await fetchRegions();
}

export async function openGlobalRegionModal() {
    await syncRegions();

    const modal = document.createElement('div');
    modal.className = 'modal trello-style-modal';
    modal.innerHTML = `
        <div class="modal-content wide-modal">
            <div class="modal-header">
                <h2>Регионы</h2>
                <button class="close-modal-btn" id="closeModalBtn">×</button>
            </div>
            <div class="add-region-section">
                <h3>Добавить новый регион</h3>
                <div class="input-with-clear">
                    <input type="text" id="regionName" placeholder="Название региона">
                    <button class="action-btn" id="addRegion">Добавить</button>
                </div>
            </div>
            <div class="all-regions-section">
                <h3>Список регионов</h3>
                <ul class="regions-list" id="allRegionsList">
                    <div class="spinner" style="margin: 10px auto;"></div>
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const nameInput = modal.querySelector('#regionName');

    const refreshRegionsList = async () => {
        const listContainer = modal.querySelector('#allRegionsList');
        listContainer.innerHTML = regions.map(region => `
            <li class="region-list-item" data-id="${region.id}">
                <span class="region-name" data-id="${region.id}">${region.region_name}</span>
                <div class="region-actions">
                    <button class="delete-region-btn" data-id="${region.id}">
                        <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                    </button>
                </div>
            </li>
        `).join('') || '<span>Нет регионов</span>';

        // Редактирование по двойному клику
        modal.querySelectorAll('.region-name').forEach(nameSpan => {
            nameSpan.addEventListener('dblclick', async () => {
                const regionId = parseInt(nameSpan.dataset.id);
                const region = regions.find(r => r.id === regionId);
                if (!region) return;

                const editForm = document.createElement('div');
                editForm.className = 'edit-region-form';
                editForm.dataset.regionId = regionId;
                editForm.innerHTML = `
                    <input type="text" id="editRegionName" value="${region.region_name}">
                    <button class="action-btn" id="saveRegion">Сохранить</button>
                    <button class="action-btn cancel-btn" id="cancelEditRegion">Отмена</button>
                `;
                const regionItem = nameSpan.closest('.region-list-item');
                regionItem.replaceChild(editForm, nameSpan);

                const saveButton = editForm.querySelector('#saveRegion');
                const cancelButton = editForm.querySelector('#cancelEditRegion');
                const editNameInput = editForm.querySelector('#editRegionName');

                cancelButton.addEventListener('click', () => refreshRegionsList());

                saveButton.addEventListener('click', async () => {
                    const name = editNameInput.value.trim();
                    if (!name) {
                        showNotification('Название региона обязательно');
                        return;
                    }
                    showLoading(saveButton, true);
                    try {
                        const existingRegion = regions.find(r =>
                            r.region_name.toLowerCase() === name.toLowerCase() && r.id !== regionId
                        );
                        if (existingRegion) {
                            showNotification('Регион с таким названием уже существует');
                            return;
                        }
                        await updateRegion(regionId, { region_name: name });
                        await syncRegions();
                        showNotification(`Регион "${name}" обновлён`);
                        refreshRegionsList();
                    } catch (error) {
                        showNotification(`Ошибка: ${error.message}`);
                    } finally {
                        showLoading(saveButton, false);
                    }
                });

                // Сохранение по Enter
                editNameInput.addEventListener('keypress', async e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveButton.click();
                    }
                });
            });
        });

        modal.querySelectorAll('.delete-region-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const regionId = parseInt(e.currentTarget.dataset.id);
                const regionName = e.currentTarget.closest('.region-list-item').querySelector('.region-name').textContent;
                if (confirm(`Вы уверены, что хотите удалить регион "${regionName}"?`)) {
                    showLoading(btn, true);
                    try {
                        await deleteRegion(regionId);
                        await syncRegions();
                        showNotification(`Регион "${regionName}" удалён`);
                        refreshRegionsList();
                    } catch (error) {
                        showNotification(`Ошибка: ${error.message}`);
                    } finally {
                        showLoading(btn, false);
                    }
                }
            });
        });
    };

    await refreshRegionsList();

    modal.querySelector('#closeModalBtn').addEventListener('click', () => modal.remove());

    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });

    const addButton = modal.querySelector('#addRegion');
    addButton.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if (!name) {
            showNotification('Название региона обязательно');
            return;
        }
        showLoading(addButton, true);
        try {
            const existingRegion = regions.find(r => r.region_name.toLowerCase() === name.toLowerCase());
            if (existingRegion) {
                showNotification('Регион с таким названием уже существует');
                return;
            }
            await createRegion({ region_name: name });
            await syncRegions();
            showNotification(`Регион "${name}" добавлен`);
            nameInput.value = '';
            await refreshRegionsList();
        } catch (error) {
            showNotification(`Ошибка: ${error.message}`);
        } finally {
            showLoading(addButton, false);
        }
    });

    nameInput.addEventListener('keypress', async e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addButton.click();
        }
    });
}