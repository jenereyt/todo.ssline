import { customers, syncCustomers } from './app.js';
import { showNotification, showLoading } from './utils.js';
import { createCustomer, updateCustomer, deleteCustomer } from './customers.js';

export function openGlobalCustomerModal() {
    syncCustomers().then(() => {
        const modal = document.createElement('div');
        modal.className = 'modal trello-style-modal customers-modal';
        modal.innerHTML = `
            <div class="modal-content trello-modal-content">
                <div class="modal-header">
                    <h2>Управление заказчиками</h2>
                    <button class="close-modal-btn" id="closeCustomerModalBtn">×</button>
                </div>
                <div class="modal-body">
                    <div class="customer-form">
                        <input type="text" id="customerName" placeholder="Название заказчика" required>
                        <button type="button" id="addCustomer">Добавить</button>
                    </div>
                    <div id="customerList" class="customer-list">
                        ${customers.map(customer => `
                            <div class="customer-item" data-id="${customer.id}">
                                <span class="customer-name">${customer.name}</span>
                                <input type="text" class="edit-customer-input hidden" value="${customer.name}">
                                <button class="delete-customer">Удалить</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        modal.querySelector('#closeCustomerModalBtn').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (!modal.querySelector('.modal-content').contains(e.target)) closeModal();
        });

        const addButton = modal.querySelector('#addCustomer');
        addButton.addEventListener('click', async () => {
            const nameInput = modal.querySelector('#customerName');
            const name = nameInput.value.trim();
            if (!name) {
                showNotification('Название заказчика обязательно');
                return;
            }
            showLoading(addButton, true);
            try {
                const newCustomer = await createCustomer({ name });
                const customerList = modal.querySelector('#customerList');
                const customerItem = document.createElement('div');
                customerItem.className = 'customer-item';
                customerItem.dataset.id = newCustomer.id;
                customerItem.innerHTML = `
                    <span class="customer-name">${newCustomer.name}</span>
                    <input type="text" class="edit-customer-input hidden" value="${newCustomer.name}">
                    <button class="delete-customer">Удалить</button>
                `;
                customerList.appendChild(customerItem);
                nameInput.value = '';
                showNotification('Заказчик добавлен');
            } catch (error) {
                showNotification(`Ошибка: ${error.message}`);
            } finally {
                showLoading(addButton, false);
            }
        });

        modal.querySelector('#customerName').addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addButton.click();
            }
        });

        modal.addEventListener('dblclick', e => {
            const customerName = e.target.closest('.customer-name');
            if (!customerName) return;
            const customerItem = customerName.closest('.customer-item');
            const editInput = customerItem.querySelector('.edit-customer-input');
            customerName.classList.add('hidden');
            editInput.classList.remove('hidden');
            editInput.focus();
            editInput.select();
        });

        modal.addEventListener('keypress', async e => {
            if (e.key !== 'Enter') return;
            const editInput = e.target.closest('.edit-customer-input');
            if (!editInput) return;
            e.preventDefault();
            const customerItem = editInput.closest('.customer-item');
            const customerId = parseInt(customerItem.dataset.id);
            const newName = editInput.value.trim();
            const customerName = customerItem.querySelector('.customer-name');
            if (!newName) {
                showNotification('Название заказчика обязательно');
                customerName.classList.remove('hidden');
                editInput.classList.add('hidden');
                return;
            }
            if (newName === customerName.textContent) {
                customerName.classList.remove('hidden');
                editInput.classList.add('hidden');
                return;
            }
            showLoading(customerItem, true);
            try {
                const updatedCustomer = await updateCustomer(customerId, { name: newName });
                customerName.textContent = updatedCustomer.name;
                editInput.value = updatedCustomer.name;
                customerName.classList.remove('hidden');
                editInput.classList.add('hidden');
                showNotification('Заказчик обновлен');
            } catch (error) {
                showNotification(`Ошибка: ${error.message}`);
                editInput.value = customerName.textContent;
            } finally {
                showLoading(customerItem, false);
            }
        });

        modal.addEventListener('click', async e => {
            const deleteBtn = e.target.closest('.delete-customer');
            if (!deleteBtn) return;
            const customerItem = deleteBtn.closest('.customer-item');
            const customerId = parseInt(customerItem.dataset.id);
            if (!confirm('Вы уверены, что хотите удалить заказчика?')) return;
            showLoading(deleteBtn, true);
            try {
                await deleteCustomer(customerId);
                customerItem.remove();
                showNotification('Заказчик удален');
            } catch (error) {
                showNotification(`Ошибка: ${error.message}`);
            } finally {
                showLoading(deleteBtn, false);
            }
        });

        modal.addEventListener('blur', e => {
            const editInput = e.target.closest('.edit-customer-input');
            if (!editInput) return;
            const customerItem = editInput.closest('.customer-item');
            const customerName = customerItem.querySelector('.customer-name');
            editInput.value = customerName.textContent;
            customerName.classList.remove('hidden');
            editInput.classList.add('hidden');
        }, true);
    });
}