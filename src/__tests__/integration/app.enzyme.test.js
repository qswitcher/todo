import React from 'react';
import { mount } from 'enzyme';

import App from '../../App';
import { wrap } from 'module';

import { priorities } from '../../TodoForm';

const getPriority = wr => priorities.find(p => wr.hasClass(`TodoItem--${p.toLowerCase()}`));

const getTodos = wrapper =>
  wrapper.find("[data-testid='TodoItem']").map(wr => ({
    text: wr.find("[data-testid='TodoItem-text']").text(),
    priority: getPriority(wr.find("[data-testid='TodoItem-priority']"))
  }));

let wrapper;
beforeEach(() => {
  wrapper = mount(<App />);
});

const wait = (wrapper, predicate, timeout = 10) => {
  return new Promise((resolve, reject) => {
    if (predicate(wrapper)) {
      return resolve(true);
    }
    setTimeout(() => {
      wrapper.update();
      return predicate(wrapper) ? resolve(true) : reject(new Error('Timeout expired'));
    }, timeout);
  });
};

test('entering a todo in form adds a todo', async () => {
  // enter todo text in textbox
  wrapper.find('.TodoForm-input').instance().value = 'My new todo';

  // click Add
  wrapper.find('.TodoForm-button').simulate('click');

  // wait for Todo to show up
  await wait(wrapper, w =>
    w
      .find('.TodoItem')
      .at(3)
      .exists()
  );

  // make sure form is cleared
  expect(wrapper.find('.TodoForm-input').instance().value).toEqual('');

  // make sure todo was added
  const newText = wrapper
    .find('.TodoItem')
    .at(3)
    .find('.TodoItem-text')
    .text();
  expect(newText).toEqual('My new todo');
});

test('clicking the delete button of a todo removes the todo', () => {
  expect(wrapper.find('.TodoItem').length).toEqual(3);

  // make sure 'Ride bike' is in the DOM
  expect(wrapper.contains('Ride bike')).toBeTruthy();

  // click delete button on 'Ride bike'
  wrapper
    .find('.TodoItem')
    .at(1)
    .find('button')
    .simulate('click');

  // make sure 'Ride bike' is not in the DOM
  expect(wrapper.contains('Ride bike')).toBeFalsy();
});

test('can select a prority on a todo', async () => {
  const newTodoText = 'My new todo';

  // enter new todo
  wrapper.find('.TodoForm-input').instance().value = newTodoText;

  // change the priority to high
  wrapper.find('.TodoForm select').simulate('change', { value: 'High' });

  // click add
  wrapper.find('.TodoForm-button').simulate('click');

  // wait for Todo to show up
  await wait(wrapper, w =>
    w
      .find('.TodoItem')
      .at(3)
      .exists()
  );

  const newTodo = wrapper.find('.TodoItem').at(wrapper.find('.TodoItem').length - 1);
  const newText = newTodo.find('.TodoItem-text').text();

  expect(newText).toEqual(newTodoText);

  // make sure the new todo has the right priority
  const newPriority = newTodo.find('.TodoItem-priority');
  expect(newPriority.hasClass('TodoItem--high')).toBeTruthy();

  // make sure all the todos are in the right order and have the proper priority
  const todos = getTodos(wrapper);
  expect(todos).toMatchSnapshot();
  expect(todos[todos.length - 1]).toEqual({
    text: newTodoText,
    priority: 'High'
  });
});
