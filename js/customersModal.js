import { customers, syncCustomers } from './app.js';
import { createCustomer, updateCustomer, deleteCustomer } from './customers.js';
import { showNotification, showLoading } from './utils.js';
import { applyFilters } from './modal.js';
import { BASE_URL } from './config.js';
import { openGlobalRegionModal } from './regionsModal.js';

export async function openGlobalCustomerModal() {
    await syncCustomers();

    const modal = document.createElement('div');
    modal.className = 'modal trello-style-modal';
    modal.innerHTML = `
        <div class="modal-content wide-modal">
            <div class="modal-header">
                <h2>Заказчики</h2>
                <button class="close-modal-btn" id="closeModalBtn">×</button>
            </div>
            <div class="add-customer-section">
                <h3>Добавить нового заказчика</h3>
                <div class="input-with-clear">
                    <input type="text" id="customerName" placeholder="Название заказчика">
                    <select id="customerRegion">
                        <option value="">Выберите регион</option>
                    </select>
                    <input type="text" id="customerInn" placeholder="ИНН (12 цифр)">
                    <input type="text" id="customerPinfl" placeholder="ПИНФЛ (14 цифр)">
                    <input type="text" id="customerContactPerson" placeholder="Контактное лицо">
                    <input type="text" id="customerPhoneNumber" placeholder="Введите номер телефона">
                    <button class="action-btn" id="addCustomer">Добавить</button>
                </div>
            </div>
            <div class="all-customers-section">
                <h3>Список заказчиков</h3>
                <ul class="customers-list" id="allCustomersList">
                    <div class="spinner" style="margin: 10px auto;"></div>
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const nameInput = modal.querySelector('#customerName');
    const regionSelect = modal.querySelector('#customerRegion');
    const innInput = modal.querySelector('#customerInn');
    const pinflInput = modal.querySelector('#customerPinfl');
    const contactInput = modal.querySelector('#customerContactPerson');
    const phoneInput = modal.querySelector('#customerPhoneNumber');

    // Загрузка регионов
    const fetchRegions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/regions`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error('Не удалось загрузить регионы');
            const regions = await response.json();
            return regions;
        } catch (error) {
            console.error('Ошибка загрузки регионов:', error);
            showNotification('Не удалось загрузить регионы');
            return [];
        }
    };

    // Заполнение выпадающего списка регионов
    const populateRegionSelect = (selectElement, regions, selectedRegionId = '') => {
        selectElement.innerHTML = `
            <option value="">Выберите регион</option>
            ${regions.map(region => `<option value="${region.id}" ${region.id === selectedRegionId ? 'selected' : ''}>${region.region_name}</option>`).join('')}
        `;
    };

    // Загружаем регионы для секции добавления
    const regions = await fetchRegions();
    populateRegionSelect(regionSelect, regions);

    const refreshCustomersList = async () => {
        const listContainer = modal.querySelector('#allCustomersList');
        listContainer.innerHTML = customers.map(customer => `
            <li class="customer-list-item" data-id="${customer.id}">
                <div class="customer-info" data-id="${customer.id}">
                    <strong>${customer.name}</strong>
                    ${customer.region?.region_name ? `<p>Регион: ${customer.region.region_name}</p>` : ''}
                    ${customer.inn ? `<p>ИНН: ${customer.inn}</p>` : ''}
                    ${customer.pinfl ? `<p>ПИНФЛ: ${customer.pinfl}</p>` : ''}
                    ${customer.contact_person ? `<p>Контактное лицо: ${customer.contact_person}</p>` : ''}
                    ${customer.phone_number ? `<p>Телефон: ${customer.phone_number}</p>` : ''}
                </div>
                <div class="customer-actions">
                    <button class="delete-customer-btn" data-id="${customer.id}">
                        <img src="./image/trash.svg" alt="Удалить" width="16" height="16" />
                    </button>
                </div>
            </li>
        `).join('') || '<span>Нет заказчиков</span>';

        // Редактирование по двойному клику
        modal.querySelectorAll('.customer-info').forEach(infoDiv => {
            infoDiv.addEventListener('dblclick', async () => {
                const customerId = parseInt(infoDiv.dataset.id);
                const customer = customers.find(c => c.id === customerId);
                if (!customer) return;

                const editForm = document.createElement('div');
                editForm.className = 'edit-customer-form';
                editForm.dataset.customerId = customerId;
                editForm.innerHTML = `
                    <input type="text" id="editCustomerName" value="${customer.name}">
                    <select id="editCustomerRegion">
                        <option value="">Выберите регион</option>
                    </select>
                    <input type="text" id="editCustomerInn" value="${customer.inn || ''}" placeholder="ИНН (12 цифр)">
                    <input type="text" id="editCustomerPinfl" value="${customer.pinfl || ''}" placeholder="ПИНФЛ (14 цифр)">
                    <input type="text" id="editCustomerContactPerson" value="${customer.contact_person || ''}" placeholder="Контактное лицо">
                    <input type="text" id="editCustomerPhoneNumber" value="${customer.phone_number || ''}" placeholder="Введите номер телефона">
                    <button class="action-btn" id="saveCustomer">Сохранить</button>
                    <button class="action-btn cancel-btn" id="cancelEditCustomer">Отмена</button>
                `;
                const customerItem = infoDiv.closest('.customer-list-item');
                customerItem.replaceChild(editForm, infoDiv);

                const editRegionSelect = editForm.querySelector('#editCustomerRegion');
                const regions = await fetchRegions();
                populateRegionSelect(editRegionSelect, regions, customer.region?.id || '');

                const saveButton = editForm.querySelector('#saveCustomer');
                const cancelButton = editForm.querySelector('#cancelEditCustomer');
                const editNameInput = editForm.querySelector('#editCustomerName');
                const editInnInput = editForm.querySelector('#editCustomerInn');
                const editPinflInput = editForm.querySelector('#editCustomerPinfl');
                const editContactInput = editForm.querySelector('#editCustomerContactPerson');
                const editPhoneInput = editForm.querySelector('#editCustomerPhoneNumber');

                cancelButton.addEventListener('click', () => refreshCustomersList());

                saveButton.addEventListener('click', async () => {
                    const name = editNameInput.value.trim();
                    const regionId = editRegionSelect.value ? parseInt(editRegionSelect.value) : 0;
                    const region_name = editRegionSelect.selectedOptions[0]?.text || 'Не указан';
                    const inn = editInnInput.value.trim();
                    const pinfl = editPinflInput.value.trim();
                    const contact_person = editContactInput.value.trim();
                    const phone_number = editPhoneInput.value.trim();

                    if (!name) {
                        showNotification('Название заказчика обязательно');
                        return;
                    }
                    if (inn && !/^\d{12}$/.test(inn)) {
                        showNotification('ИНН должен содержать 12 цифр');
                        return;
                    }
                    if (pinfl && !/^\d{14}$/.test(pinfl)) {
                        showNotification('ПИНФЛ должен содержать 14 цифр');
                        return;
                    }

                    showLoading(saveButton, true);
                    try {
                        const oldCustomer = customers.find(c => c.id === customerId);
                        if (name.toLowerCase() !== oldCustomer.name.toLowerCase()) {
                            const existingCustomer = customers.find(c =>
                                c.name.toLowerCase() === name.toLowerCase() && c.id !== customerId
                            );
                            if (existingCustomer) {
                                showNotification('Заказчик с таким названием уже существует');
                                return;
                            }
                        }
                        await updateCustomer(customerId, {
                            name,
                            region: { id: regionId, region_name },
                            inn,
                            pinfl,
                            contact_person,
                            phone_number
                        });
                        await syncCustomers();
                        showNotification(`Заказчик "${name}" обновлён`);
                        refreshCustomersList();
                        applyFilters();
                    } catch (error) {
                        showNotification(`Ошибка: ${error.message}`);
                    } finally {
                        showLoading(saveButton, false);
                    }
                });

                // Сохранение по Enter на любом поле формы
                [editNameInput, editInnInput, editPinflInput, editContactInput, editPhoneInput].forEach(input => {
                    input.addEventListener('keypress', async e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            saveButton.click();
                        }
                    });
                });
            });
        });

        modal.querySelectorAll('.delete-customer-btn').forEach(btn => {
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                const customerId = parseInt(e.currentTarget.dataset.id);
                const customerName = e.currentTarget.closest('.customer-list-item').querySelector('.customer-info strong').textContent;
                if (confirm(`Вы уверены, что хотите удалить заказчика "${customerName}"?`)) {
                    showLoading(btn, true);
                    try {
                        await deleteCustomer(customerId);
                        await syncCustomers();
                        showNotification(`Заказчик "${customerName}" удалён`);
                        refreshCustomersList();
                        applyFilters();
                    } catch (error) {
                        showNotification(`Ошибка: ${error.message}`);
                    } finally {
                        showLoading(btn, false);
                    }
                }
            });
        });
    };

    await refreshCustomersList();

    modal.querySelector('#closeModalBtn').addEventListener('click', () => modal.remove());

    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });

    const addButton = modal.querySelector('#addCustomer');
    addButton.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const regionId = regionSelect.value ? parseInt(regionSelect.value) : 0;
        const region_name = regionSelect.selectedOptions[0]?.text || 'Не указан';
        const inn = innInput.value.trim();
        const pinfl = pinflInput.value.trim();
        const contact_person = contactInput.value.trim();
        const phone_number = phoneInput.value.trim();

        if (!name) {
            showNotification('Название заказчика обязательно');
            return;
        }
        if (inn && !/^\d{12}$/.test(inn)) {
            showNotification('ИНН должен содержать 12 цифр');
            return;
        }
        if (pinfl && !/^\d{14}$/.test(pinfl)) {
            showNotification('ПИНФЛ должен содержать 14 цифр');
            return;
        }

        showLoading(addButton, true);
        try {
            const existingCustomer = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
            if (existingCustomer) {
                showNotification('Заказчик с таким названием уже существует');
                return;
            }
            await createCustomer({
                name,
                region: { id: regionId, region_name },
                inn,
                pinfl,
                contact_person,
                phone_number
            });
            await syncCustomers();
            showNotification(`Заказчик "${name}" добавлен`);
            nameInput.value = '';
            regionSelect.value = '';
            innInput.value = '';
            pinflInput.value = '';
            contactInput.value = '';
            phoneInput.value = '';
            await refreshCustomersList();
            applyFilters();
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
    phoneInput.addEventListener('keypress', async e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addButton.click();
        }
    });
}