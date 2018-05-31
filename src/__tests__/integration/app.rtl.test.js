import React from 'react';
import { render, Simulate, wait } from 'react-testing-library';

import App from '../../App';

import { priorities } from '../../TodoForm';

const getPriority = className => priorities.find(p => className.indexOf(p.toLowerCase()) > -1);

const getTodos = queryAllByTestId =>
	queryAllByTestId('TodoItem').map(n => ({
		text: n.querySelector('[data-testid=TodoItem-text]').textContent,
		priority: getPriority(n.querySelector('[data-testid=TodoItem-priority]').className)
	}));

test('entering a todo in form adds a todo', async () => {
	const { getByText, getByPlaceholderText, getByTestId, container } = render(<App />);

	// enter todo text in textbox
	getByPlaceholderText('Enter todo text').value = 'My new todo';

	// click Add
	Simulate.click(getByText('Add'));

	// wait for Todo to show up
	await wait(() => getByText('My new todo'));

	// make sure form is cleared
	expect(getByTestId('TodoForm-input').value).toEqual('');

	// make sure todo was added
	expect(getByText('My new todo')).toBeDefined();
});

test('clicking the delete button of a todo removes the todo', () => {
	const { queryByText, getByText, getByPlaceholderText, getByTestId, container } = render(<App />);

	// make sure 'Ride bike' is in the DOM
	expect(queryByText('Ride bike')).not.toBeNull();

	// click delete button on 'Ride bike'
	const deleteBtn = getByText('Ride bike').parentElement.querySelector('button');
	Simulate.click(deleteBtn);

	// make sure 'Ride bike' is not in the DOM
	expect(queryByText('Ride bike')).toBeNull();
});

test('can select a prority on a todo', async () => {
	const { getByText, queryAllByTestId, getByPlaceholderText, getByTestId, container } = render(<App />);

	const newTodoText = 'My new prioritized todo';

	// enter new todo
	getByPlaceholderText('Enter todo text').value = newTodoText;

	// change the priority to high
	Simulate.change(getByTestId('PrioritySelect'), { value: 'High' });

	// click add
	Simulate.click(getByText('Add'));

	// wait for Todo to show up
	await wait(() => getByText(newTodoText));

	const newTodo = getByText(newTodoText);
	expect(newTodo).toBeDefined();

	// make sure the new todo has the right priority
	expect(newTodo.parentElement.querySelector('.TodoItem-priority').className).toEqual(
		expect.stringContaining('TodoItem--high')
	);

	// make sure all the todos are in the right order and have the proper priority
	const todos = getTodos(queryAllByTestId);
	expect(todos).toMatchSnapshot();
	expect(todos[todos.length - 1]).toEqual({
		text: newTodoText,
		priority: 'High'
	});
});
