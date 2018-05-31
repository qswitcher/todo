import React, { Component } from 'react';
import TodoItem from './TodoItem';

class TodoList extends Component {
	render() {
		const { todos, deleteTodo } = this.props;
		return todos.map((todo, i) => <TodoItem deleteTodo={deleteTodo} key={i} todo={todo} />);
	}
}

export default TodoList;
