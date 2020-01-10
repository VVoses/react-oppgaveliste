import React, { Component } from "react";
import PropTypes from "prop-types";

import logo from "./logo.svg";
import "./App.css";
import { TodoForm, TodoList, Footer } from "./components/todo";
import {
  addTodo,
  generateId,
  findById,
  toggleTodo,
  updateTodos,
  removeTodo,
  filterTodos
} from "./lib/todoHelpers";
import { pipe, partial } from "./lib/utils";
import {
  loadTodos,
  createTodo,
  saveTodo,
  destroyTodo
} from "./lib/todoService";

class App extends Component {
  state = {
    todos: [],
    currentTodo: ""
  };

  static contextTypes = {
    route: PropTypes.string
  };

  componentDidMount() {
    loadTodos().then(todos => this.setState({ todos }));
  }

  handleToggle = id => {
    const getToggledTodo = pipe(findById, toggleTodo);
    const updated = getToggledTodo(id, this.state.todos);
    const getUpdatedTodos = partial(updateTodos, this.state.todos); // => (id, list) => updateTodos(this.state.todos, (toggleTodo(findById(id, list))))
    const updatedTodos = getUpdatedTodos(updated);
    this.setState({ todos: updatedTodos });
    saveTodo(updated).then(() => this.showTempMessage("Oppgaven er oppdatert"));
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const newId = generateId();
    const newTodo = {
      id: newId,
      name: this.state.currentTodo,
      isComplete: false
    };
    const updatedTodos = addTodo(this.state.todos, newTodo);
    this.setState({
      todos: updatedTodos,
      currentTodo: "",
      errorMessage: ""
    });
    createTodo(newTodo).then(() =>
      this.showTempMessage("Oppgaven er lagt til")
    );
  };

  showTempMessage = msg => {
    this.setState({ message: msg });
    setTimeout(() => this.setState({ message: "" }), 2500);
  };

  showTempErrorMessage = msg => {
    this.setState({ errorMessage: msg });
    setTimeout(() => this.setState({ errorMessage: "" }), 2500);
  };

  handleEmptySubmit = evt => {
    evt.preventDefault();
    this.showTempErrorMessage("Vennligst skriv inn en oppgave");
  };

  handleInputChange = evt => {
    this.setState({
      currentTodo: evt.target.value
    });
  };

  handleRemove = (id, evt) => {
    evt.preventDefault();
    const updatedTodos = removeTodo(id, this.state.todos);
    this.setState({ todos: updatedTodos });
    destroyTodo(id).then(() => this.showTempMessage("Oppgaven er slettet"));
  };

  render() {
    const submitHandler = this.state.currentTodo
      ? this.handleSubmit
      : this.handleEmptySubmit;
    const displayTodos = filterTodos(this.state.todos, this.context.route);
    return (
      <div className="App">
        <header className="App-header">
          <div className="Logo">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="Info-box">
            <h2 className = "Header-text">React Oppgaveliste</h2>
            <div className="messages">
              {this.state.errorMessage && !this.state.message && (
                <span className="error">{this.state.errorMessage}</span>
              )}
              {this.state.message && (
                <span className="success">{this.state.message}</span>
              )}
            </div>
          </div>
        </header>

        <div className="Todo-App">
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}
          />
          <TodoList
            handleToggle={this.handleToggle}
            todos={displayTodos}
            handleRemove={this.handleRemove}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
