export function formatDate(isoDate) {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
}

export function formatCommentDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function toISODate(localDate) {
    if (!localDate || isNaN(new Date(localDate))) return null;
    return new Date(localDate).toISOString().split('T')[0];
}

export function showLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

export function showNotification(message) {
    try {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Ошибка в showNotification:', error);
    }
}
