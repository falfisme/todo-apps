const todos = []
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
	const submitForm = document.getElementById('form'); // submit dari tag form, bukan dari tag button
	submitForm.addEventListener('submit', function(e) {
		e.preventDefault();
		addTodo();
	})
})

function addTodo() {
	const textTodo = document.getElementById('title').value;
	const timestamp = document.getElementById('date').value;
	const generateID = generateId();
	const todoObject = generateTodoObject(generateID, textTodo, timestamp, false);
	//console.log(todoObject);
	todos.push(todoObject);

	// awal render ke view, pake event
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId(){
	return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted){
	return {
		id, 
		task, 
		timestamp, 
		isCompleted
	}
}

document.addEventListener(RENDER_EVENT, function(){

	const uncompletedTODOList = document.getElementById('todos');
	uncompletedTODOList.innerHTML = "" // dikosongin terus biar klo ada lagi ditambah

	const completedTODOList = document.getElementById('completed-todos');
	completedTODOList.innerHTML = ""

	for(const todoItem of todos){
		const todoElement = makeTodo(todoItem);
		if(!todoItem.isCompleted){
			uncompletedTODOList.append(todoElement);
		}else{
			completedTODOList.append(todoElement);
		}
		
	}
})


function makeTodo(todoObject){
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.task;

        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = todoObject.timestamp;

        const textContainer = document.createElement('div');
        textContainer.classList.add('inner'); // tambah kelas ke div
        textContainer.append(textTitle, textTimestamp); // tambah h2 dan p ke text container div ini

        const container = document.createElement('div'); // bikin div lagi untuk container kotak
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);

        if(todoObject.isCompleted){
        	const undoButton = document.createElement('button');
        	undoButton.classList.add('undo-button');

        	undoButton.addEventListener('click', function () {
        		undoTaskFormCompleted(todoObject.id)
        	});

        	const trashButton = document.createElement('button');
        	trashButton.classList.add('trash-button');

        	trashButton.addEventListener('click', function () {
        		removeTaskFormCompleted(todoObject.id);
        	});

        	undoButton.addEventListener('click', function(){
        		undoTaskFormCompleted(todoObject.id);
        	})

        	container.append(undoButton, trashButton);

        } else {
        	const checkButton = document.createElement('button');
        	checkButton.classList.add('check-button');

        	checkButton.addEventListener('click', function () {
        		addTaskToComplete(todoObject.id);
        	});

        	container.append(checkButton);
        }

        return container;
}

function addTaskToComplete(todoId){
	const todoTarget = findTodo(todoId);

	if (todoTarget == null) return;

	todoTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
}
 
function findTodo(todoId) {
	for(const todoItem of todos){
		if(todoItem.id === todoId){
			return todoItem;
		}
	}
	return null;
}

function removeTaskFormCompleted(todoId){
	const todoTarget = findTodoIndex(todoId);

	if(todoTarget === -1) return;

	todos.splice(todoTarget, 1);
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFormCompleted(todoId) {
	const todoTarget = findTodo(todoId);

	if (todoTarget == null) return;

	todoTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
	for (const index in todos){
		if (todos[index].id === todoId){
			return index;
		}
	}
	return -1
}


