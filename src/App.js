import React, { Component } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [
        { text: 'Walk the Dog', priority: 'High' },
        { text: 'Ride bike', priority: 'Low' },
        { text: 'Get a haircut', priority: 'Med' }
      ]
    };
  }

  addTodo = todo => {
    const todos = this.state.todos;
    // simulate an AJAX request
    setTimeout(() => {
      this.setState({ todos: todos.concat(todo) });
    }, 0);
  };

  deleteTodo = value => {
    const todos = this.state.todos;
    const index = todos.indexOf(value);
    if (index > -1) {
      this.setState({ todos: todos.filter((item, i) => i !== index) });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Todos</h1>
        </header>
        <div className="App-body">
          <TodoForm addTodo={this.addTodo} />
          <TodoList todos={this.state.todos} deleteTodo={this.deleteTodo} />
        </div>
      </div>
    );
  }
}

export default App;
