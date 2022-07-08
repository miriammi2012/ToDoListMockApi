const BASE_API_URL = "https://5be08ad4f2ef840013994bce.mockapi.io";

// Define HTTP headers and specify content type
const HTTP_REQ_HEADERS = new Headers({
  "Content-Type": "application/json"
});

// page element where data will be inserted
const todoListTable = document.getElementById("todoList");

// Get JSON array of todo items
// Async call
async function getTodos() {
  // url of the API endpoint for the get request
  const url = `${BASE_API_URL}/todo`;

  // array for response data
  let data = [];

  // build the request, including headers etc.
  // note get method
  let request = {
    method: "get",
    headers: HTTP_REQ_HEADERS,
    mode: "cors",
    cache: "default"
  };

  // Try catch
  try {
    // Call fetch and await the respose
    // Initally returns a promise
    // fetch data from API url using request
    let response = await fetch(url, request);
    data = await response.json();
  } catch (err) {
    console.log(err);
  }

  // clear existing - otherwise items will be repeated
  //todoListTable.innerHTML = "";

  // Generate table rows for each todo item
  // Use map to iterate through json data
  // add a row to the tableRows array for each one
  let tableRows = data.map(todo => {
    return `
      <tr>
          <td>${todo.id}</td>
          <td>${todo.createdDate}</td>
          <td>${todo.name}</td>
          <td>${todo.status}</td>
          <td><button id="${todo.id}" 
              class="btn btn-default btn-xs">
              <span class="glyphicon glyphicon-trash"></span>
              </button>
          </td>
      </tr>`;
  });

  todoListTable.innerHTML = tableRows.join("");

  // Add event listeners for delete buttons
  // 1. Get array of buttons
  let delButtons = todoListTable.getElementsByTagName("button");

  // 2. Assign a 'click' event listener to each button
  // the calaculate function will be called when a button is clicked
  for (let i = 0; i < delButtons.length; i++) {
    delButtons[i].addEventListener("click", deleteTodo);
  }
}

// POST a new todo
// note the method and headers must be set
async function addTodo() {
  // url of the API endpoint
  let url = `${BASE_API_URL}/todo`;

  // Read the task name fron input field
  let newTaskName = document.getElementById("name").value;

  // very basic validation
  if (newTaskName === "") {
    console.log("no data to add");
    return false;
  }

  // The request body: the data to be saved (as json)
  let reqBody = JSON.stringify({
    createdDate: Date().toString(),
    name: newTaskName, // the new task name
    status: "pending"
  });

  // put everything together in the request
  // note method, headers, and body
  let request = {
    method: "post",
    headers: HTTP_REQ_HEADERS,
    mode: "cors",
    cache: "default",
    body: reqBody
  };

  // Send request via fetch api to url of API
  // Get reponse back (as JS Promise)

  let response = await fetch(url, request);

  if (response.ok) {
    // Log the status - view in the console
    // View browser console for details
    console.log("response from post request -", response);

    // reload the data (to add new item)
    getTodos();
  } else {
    // error
    console.log("error adding todo: " + response);
  }
  return false;
}

// Delete a todo by id
// note the method and headers must be set
async function deleteTodo() {
  let id = this.id;
  console.log(`deleting ${id}`);

  // the url to send this request
  const url = `${BASE_API_URL}/todo/${id}`;

  // put everything together in the request
  // note the method
  const request = {
    method: "delete",
    headers: HTTP_REQ_HEADERS,
    mode: "cors",
    cache: "default"
  };

  // Send request via fetch to API url
  const response = await fetch(url, request);

  if (response.ok) {
    // Log the status - view in the console
    // View browser console for details
    console.log(`ToDo item with id ${id} was deleted`);

    // reload the data (to add new item)
    getTodos();
  } else {
    // error
    console.log(`error deleteing todo with id ${id}`);
  }
}

// set up add item button
document.getElementById("btnAdd").addEventListener("click", addTodo);

// Load data
getTodos();
