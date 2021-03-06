const baseUrl = 'http://localhost:8080/todos'

export const loadTodos = () => {
    return fetch(baseUrl)
        .then(res => res.json())
}

export const createTodo = (newTodo) => {
    return fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)

    }).then(res => res.json())
}

export const saveTodo = (updatedTodo) => {
    return fetch(`${baseUrl}/${updatedTodo.id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
    }).then(res => res.json())
}

export const destroyTodo = (id) => {
    return fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}