// Tools
function makeElement(element, classes, inner) {
    const el = document.createElement(element);
    el.className = classes;
    if(inner) el.innerText = inner;
    return el;
}

window.addEventListener('load', () => {
    const todoForm = document.querySelector('#todo-form');
    const todoContainer = document.querySelector('#todos-container .content');

    let todos = [];

    // API CALLERS
    async function getTodos(limit) {
        const url = `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`;

        try {
            const response = await fetch(url);
            if(response.ok) {
                const jsonResponse = await response.json();
                todos = jsonResponse;
                loadTodos(todoContainer);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    async function postTodo(todo) {
        const url = `https://jsonplaceholder.typicode.com/todos`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(todo),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if(response.ok) {
                const jsonResponse = await response.json();
                addTodo(jsonResponse);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    // 
    function loadTodos(container) {
        todoContainer.innerHTML = "";
        todos.forEach(({ id, title, completed }) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-4';
            col.dataset.completed = completed;
            const card = makeElement('div', 'todo-post card box-shadow border-0 rounded p-1 bg-dark text-white');
            const cardBody = makeElement('div', 'card-body');
            const cardTitle = makeElement('h5', 'card-title', title);
            const btns = makeElement('div', 'btns mt-4');

            const btnDone = makeElement('button', 'btn btn-success done-btn btn-shadow', 'Done');
            btnDone.addEventListener('click', () => handleDone(id));
            const btnUndone = makeElement('button', 'btn btn-warning undone-btn btn-shadow', 'Undone');
            btnUndone.addEventListener('click', () => handleUndone(id));
            const btnDelete = makeElement('button', 'btn btn-danger delete-btn btn-shadow ms-1', 'Delete');
            btnDelete.addEventListener('click', () => handleDelete(id));

            btns.append(btnDone, btnUndone, btnDelete);
            cardBody.append(cardTitle, btns);
            card.appendChild(cardBody);
            col.appendChild(card);
            container.appendChild(col);
        })
    }
    function addTodo(todo) {
        todos = [
            {
                ...todo,
                id: Date.now()
            },
            ...todos
        ]
        loadTodos(todoContainer);
    }

    // handlers

    function handleDone(id) {
        const _todo = todos.find(todo => todo.id === id);
        handleDelete(id);
        todos = [
            ...todos,
            {
                ..._todo,
                completed: true
            }
        ];
        loadTodos(todoContainer);
    }
    function handleUndone(id) {
        const _todo = todos.find(todo => todo.id === id);
        handleDelete(id);
        todos = [
            {
                ..._todo,
                completed: false
            },
            ...todos,
        ];
        loadTodos(todoContainer);
    }
    function handleDelete(id) {
        todos = todos.filter(todo => todo.id !== id)
        loadTodos(todoContainer);
    }
    function handleSubmit(e) {
        e.preventDefault();
        const input = e.target[0];
        const title = input.value;
        if (title) {
            input.classList.remove('is-invalid')
            postTodo({ title, completed: false });
            this.reset();
        } else {
            input.classList.add('is-invalid')
        }
    }

    todoForm.addEventListener('submit', handleSubmit);

    getTodos(10);
})