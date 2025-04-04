export let tasks = [
    {
        id: 1,
        dateSet: "2025-03-25",
        project: "Afrosiyob paranda",
        theme: "Разработка UI",
        description: "Создать интерфейс главной страницы",
        status: "Выполнено", // Новое поле
        executors: ["Иван Иванов", "Пётр Сидоров"],
        files: [{ name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }],
        comments: [
            { text: "Дизайн утверждён заказчиком", date: "2025-03-25" },
            { text: "Добавлены новые шрифты", date: "2025-03-26" },
            { text: "Исправлены отступы на мобильной версии", date: "2025-03-26" }
        ]
    },
    {
        id: 2,
        dateSet: "2025-03-24",
        project: "Заказчик Beta",
        theme: "Исправление багов",
        description: "Пофиксить ошибку в авторизации",
        status: "Выполнено",
        executors: [],
        files: [{ name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }, { name: "project_alpha_ui_mockup.pdf", url: "https://example.com/files/project_alpha_ui_mockup.pdf" }]
    },
    { id: 3, dateSet: "2025-03-20", project: "Проект Gamma", theme: "Тестирование API", description: "Проверить все эндпоинты", completed: false, executors: ["Анна Смирнова"], dateCompleted: "", accepted: "Нет" },
    { id: 4, dateSet: "2025-03-22", project: "Заказчик Delta", theme: "Дизайн логотипа", description: "Разработать новый логотип компании", completed: true, executors: ["Мария Петрова", "Алексей Кузнецов"], dateCompleted: "2025-03-24", accepted: "Да" },
    { id: 5, dateSet: "2025-03-23", project: "Проект Epsilon", theme: "Оптимизация кода", description: "Ускорить загрузку страницы", completed: false, executors: ["Дмитрий Соколов", "Ольга Николаева"], dateCompleted: "", accepted: "Нет" },
    { id: 6, dateSet: "2025-03-26", project: "Проект Zeta", theme: "Аналитика", description: "Собрать данные по пользователям", completed: false, executors: ["Сергей Морозов"], dateCompleted: "", accepted: "Нет" },
    { id: 7, dateSet: "2025-03-27", project: "Заказчик Eta", theme: "Дизайн", description: "Обновить баннеры на сайте", completed: true, executors: ["Екатерина Иванова"], dateCompleted: "2025-03-28", accepted: "Да" },
    { id: 8, dateSet: "2025-03-28", project: "Проект Theta", theme: "Разработка", description: "Добавить фильтр в таблицу", completed: false, executors: ["Андрей Петров"], dateCompleted: "", accepted: "Нет" },
    { id: 9, dateSet: "2025-03-29", project: "Заказчик Iota", theme: "Тестирование", description: "Провести нагрузочное тестирование", completed: false, executors: ["Олег Сидоров"], dateCompleted: "", accepted: "Нет" },
    { id: 10, dateSet: "2025-03-30", project: "Проект Kappa", theme: "Оптимизация", description: "Уменьшить время ответа сервера", completed: true, executors: ["Наталья Козлова"], dateCompleted: "2025-03-31", accepted: "Да" },
    { id: 11, dateSet: "2025-04-01", project: "Проект Lambda", theme: "Интеграция", description: "Подключить API платежной системы", completed: false, executors: ["Владимир Соколов"], dateCompleted: "", accepted: "Нет" },
    { id: 12, dateSet: "2025-04-02", project: "Заказчик Mu", theme: "Дизайн", description: "Создать макет мобильного приложения", completed: true, executors: ["Елена Васильева"], dateCompleted: "2025-04-03", accepted: "Да" },
    { id: 13, dateSet: "2025-04-03", project: "Проект Nu", theme: "Разработка", description: "Реализовать авторизацию через OAuth", completed: false, executors: ["Игорь Николаев"], dateCompleted: "", accepted: "Нет" },
    { id: 14, dateSet: "2025-04-04", project: "Заказчик Xi", theme: "Тестирование", description: "Проверить совместимость с iOS", completed: false, executors: ["Татьяна Морозова"], dateCompleted: "", accepted: "Нет" },
    { id: 15, dateSet: "2025-04-05", project: "Проект Omicron", theme: "Оптимизация", description: "Сжать изображения на сайте", completed: true, executors: ["Павел Кузнецов"], dateCompleted: "2025-04-06", accepted: "Да" },
    { id: 16, dateSet: "2025-04-06", project: "Заказчик Pi", theme: "Аналитика", description: "Настроить Google Analytics", completed: false, executors: ["Юлия Соколова"], dateCompleted: "", accepted: "Нет" },
    { id: 17, dateSet: "2025-04-07", project: "Проект Rho", theme: "Разработка", description: "Добавить форму обратной связи", completed: true, executors: ["Максим Иванов"], dateCompleted: "2025-04-08", accepted: "Да" },
    { id: 18, dateSet: "2025-04-08", project: "Заказчик Sigma", theme: "Дизайн", description: "Обновить цветовую схему", completed: false, executors: ["Алина Петрова"], dateCompleted: "", accepted: "Нет" },
    { id: 19, dateSet: "2025-04-09", project: "Проект Tau", theme: "Тестирование", description: "Проверить кроссбраузерность", completed: false, executors: ["Константин Сидоров"], dateCompleted: "", accepted: "Нет" },
    { id: 20, dateSet: "2025-04-10", project: "Заказчик Upsilon", theme: "Интеграция", description: "Подключить CRM систему", completed: true, executors: ["Оксана Морозова"], dateCompleted: "2025-04-11", accepted: "Да" },
    { id: 21, dateSet: "2025-04-11", project: "Проект Phi", theme: "Разработка", description: "Создать админ-панель", completed: false, executors: ["Артём Кузнецов"], dateCompleted: "", accepted: "Нет" },
    { id: 22, dateSet: "2025-04-12", project: "Заказчик Chi", theme: "Оптимизация", description: "Ускорить загрузку видео", completed: false, executors: ["Евгений Соколов"], dateCompleted: "", accepted: "Нет" },
    { id: 23, dateSet: "2025-04-13", project: "Проект Psi", theme: "Дизайн", description: "Разработать иконки для меню", completed: true, executors: ["Светлана Иванова"], dateCompleted: "2025-04-14", accepted: "Да" },
    { id: 24, dateSet: "2025-04-14", project: "Заказчик Omega", theme: "Тестирование", description: "Проверить работу чата", completed: false, executors: ["Денис Петров"], dateCompleted: "", accepted: "Нет" },
    { id: 25, dateSet: "2025-04-15", project: "Проект Alpha-2", theme: "Разработка", description: "Добавить поиск по сайту", completed: true, executors: ["Иван Иванов"], dateCompleted: "2025-04-16", accepted: "Да" },
    { id: 26, dateSet: "2025-04-16", project: "Заказчик Beta-2", theme: "Аналитика", description: "Проанализировать конверсии", completed: false, executors: ["Анна Смирнова"], dateCompleted: "", accepted: "Нет" },
    { id: 27, dateSet: "2025-04-17", project: "Проект Gamma-2", theme: "Интеграция", description: "Подключить уведомления", completed: false, executors: ["Пётр Сидоров"], dateCompleted: "", accepted: "Нет" },
    { id: 28, dateSet: "2025-04-18", project: "Заказчик Delta-2", theme: "Дизайн", description: "Создать промо-страницу", completed: true, executors: ["Мария Петрова"], dateCompleted: "2025-04-19", accepted: "Да" },
    { id: 29, dateSet: "2025-04-19", project: "Проект Epsilon-2", theme: "Оптимизация", description: "Улучшить SEO", completed: false, executors: ["Дмитрий Соколов"], dateCompleted: "", accepted: "Нет" },
    { id: 30, dateSet: "2025-04-20", project: "Заказчик Zeta-2", theme: "Тестирование", description: "Проверить адаптивность", completed: true, executors: ["Ольга Николаева"], dateCompleted: "2025-04-21", accepted: "Да" }
];
// Объект для хранения фильтров и состояния сортировки
export let filters = {};
export let sortState = { field: null, ascending: true };

// Уникальный список всех проектов для рекомендаций
export let allProjects = [...new Set(tasks.map(task => task.project))];

export let currentPage = 1;
export let tasksPerPage = 20;