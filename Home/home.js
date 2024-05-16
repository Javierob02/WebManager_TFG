document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("currentTable")) {
        showTable(localStorage.getItem("currentTable"));
    } else {
        showTable('Drivers');
    }

    const addButton = document.getElementById("addBTN");
    addButton.addEventListener("click", function() {
        showAddModal(checkActive());
    });
});

var jsonData = null;
var currentTable = "Drivers";

function logoutPage() {
    localStorage.setItem("ManagerUserId", "")
    localStorage.setItem("currentTable", "Drivers")
    window.location.href='../Login/login.html'
}

function showTable(tableName) {
    currentTable = tableName
    localStorage.setItem("currentTable", tableName)
    console.log("Mostrando tabla: " + tableName)

    var tables = document.querySelectorAll('table');
    var tabs = document.querySelectorAll('.tab');

    const Drivers = ["idDrivers", "Name", "Surname", "TeamName", "Number", "Photo", "Flag", "Points", "TotalPoints"];
    const Teams = ["idTeams", "Name", "Logo", "Car", "Driver1Name", "Driver1Photo", "Driver2Name", "Driver2Photo", "Points", "TotalPoints"];
    const Circuits = ["idCircuits", "Name", "Country", "Length", "Turns", "Photo", "Flag", "Date", "ExtraInfo"];
    const News = ["idNews", "Title", "Description", "Images", "date"];
    const ChatMessages = ["idChatMessages", "iduser", "Content", "Timestamp"];
    const ChatUsers = ["idChatUsers", "Username"];
    const Test = ["idTest", "Nombre", "Numero"];

    //API URL: localhost/F1API/api.php?table=<tablename>

    for (var i = 0; i < tables.length; i++) {
        tables[i].style.display = 'none';
        console.log(tables[i])
    }

    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    document.getElementById('table-' + tableName).style.display = 'table';
    document.querySelector('#' + tableName).classList.add('active');

    // Fetch data from API
    fetch('http://localhost:3000/api/getTables/' + tableName)
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            // Clear table body
            var table = document.getElementById('table-' + tableName);
            table.innerHTML = '';

            // Add table header
            var thead = table.createTHead();
            var row = thead.insertRow();
            for (var i = 0; i < eval(tableName).length; i++) {
                var th = document.createElement("th");
                th.innerHTML = eval(tableName)[i];
                row.appendChild(th);
            }
            var th = document.createElement("th");
            th.innerHTML = "Actions";
            row.appendChild(th);

            // Add table body
            var tbody = table.createTBody();
            var identifier = 1
            data.forEach(rowData => {
                var tr = tbody.insertRow();
                for (var i = 0; i < eval(tableName).length; i++) {
                    var cell = tr.insertCell();
                    cell.innerHTML = rowData[eval(tableName)[i]];
                }
                var cell = tr.insertCell();
                cell.innerHTML = `
                    <span class="edit-icon" onclick="editRow(${identifier})"></span>
                    <span class="delete-icon" onclick="deleteRow(${identifier})"></span>
                `;
                identifier += 1;
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteRow(id) {
    console.log("Delete row with ID: " + id);
    showDeleteModal(checkActive(), id)
}

function editRow(id) {
    console.log("Edit row with ID: " + id);
    showEditModal(checkActive(), id)
}



function showAddModal(tableName) {
    console.log("Mostrando modal: " + tableName);

    // Get the appropriate array of input names based on tableName
    const inputNames = {
        Drivers: ["idDrivers", "Name", "Surname", "TeamName", "Number", "Photo", "Flag", "Points", "TotalPoints"],
        Teams: ["idTeams", "Name", "Logo", "Car", "Driver1Name", "Driver1Photo", "Driver2Name", "Driver2Photo", "Points", "TotalPoints"],
        Circuits: ["idCircuits", "Name", "Country", "Length", "Turns", "Photo", "Flag", "Date", "ExtraInfo"],
        News: ["idNews", "Title", "Description", "Images", "date"],
        ChatMessages: ["idChatMessages", "iduser", "Content", "Timestamp"],
        ChatUsers: ["idChatUsers", "Username"],
        Test: ["idTest", "Nombre", "Numero"],
    };

    // Create the modal elements
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal"); // Add a CSS class for styling

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Add Row To: " + tableName;
    modalHeader.appendChild(modalTitle);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;"; // Close icon using character entity
    closeButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    // Create input fields for each item in the array
    const inputFields = [];
    var counter = 0;
    for (const name of inputNames[tableName]) {
        const label = document.createElement("label");
        label.textContent = name;



        if (name == "Description") {
            const textarea = document.createElement("textarea");
            textarea.name = name;   // Set textarea name
            textarea.id = name;     // Set textarea id
            textarea.style.width = "100%"; // Set initial width using CSS
            textarea.style.height = "150px"; // Set initial height using CSS

            inputFields.push([label, textarea]);
        } else {
            const input = document.createElement("input");
            input.type = "text"; // Adjust input type as needed (e.g., "number" for numeric values)
            input.name = name;
            input.id = name;

            if (counter != 0) {
                inputFields.push([label, input]);
            }
        }

        counter += 1;
    }

    // Append labels and inputs to the modal body
    for (const [label, input] of inputFields) {
        modalBody.appendChild(label);
        modalBody.appendChild(input);
    }

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalFooter.appendChild(cancelButton);

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    // Add functionality for the Add button based on your requirements (e.g., form submission, data processing)
    addButton.addEventListener("click", function() {
        addButton.disabled = true;
        addRecord(tableName)
        modalContainer.style.display = "none";
        modalContainer.remove();
        window.location.reload();
    });
    modalFooter.appendChild(addButton);

    // Assemble the modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    // Add the modal content to the container and make it visible
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    modalContainer.style.display = "block"; // Display the modal

    // Focus the first input field when the modal opens (optional)
    inputFields[0][1].focus();
}


function showEditModal(tableName, rowId) {
    console.log("Mostrando Edit modal: " + tableName);
    console.log("row selected: " + rowId)
    console.log(jsonData)

    // Get the appropriate array of input names based on tableName
    const inputNames = {
        Drivers: ["idDrivers", "Name", "Surname", "TeamName", "Number", "Photo", "Flag", "Points", "TotalPoints"],
        Teams: ["idTeams", "Name", "Logo", "Car", "Driver1Name", "Driver1Photo", "Driver2Name", "Driver2Photo", "Points", "TotalPoints"],
        Circuits: ["idCircuits", "Name", "Country", "Length", "Turns", "Photo", "Flag", "Date", "ExtraInfo"],
        News: ["idNews", "Title", "Description", "Images", "date"],
        ChatMessages: ["idChatMessages", "iduser", "Content", "Timestamp"],
        ChatUsers: ["idChatUsers", "Username"],
        Test: ["idTest", "Nombre", "Numero"],
    };

    // Create the modal elements
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal"); // Add a CSS class for styling

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h2");
    modalTitle.textContent = "Edit Row From: " + tableName;
    modalHeader.appendChild(modalTitle);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;"; // Close icon using character entity
    closeButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    // Create input fields for each item in the array
    var counter = 0;
    const inputFields = [];
    for (const name of inputNames[tableName]) {
        console.log(name)
        const label = document.createElement("label");
        label.textContent = name;

        if (name == "Description") {
            const textarea = document.createElement("textarea");
            textarea.name = name;   // Set textarea name
            textarea.id = name;     // Set textarea id
            textarea.value = jsonData[rowId-1][name]     // Set value of the textarea
            textarea.style.width = "100%"; // Set initial width using CSS
            textarea.style.height = "150px"; // Set initial height using CSS

            inputFields.push([label, textarea]);
        } else {
            const input = document.createElement("input");
            input.type = "text"; // Adjust input type as needed (e.g., "number" for numeric values)
            input.value = jsonData[rowId-1][name]     // Set value of the input
            input.name = name;
            input.id = name;

            if (counter == 0) {
                input.disabled = true;
            }

            inputFields.push([label, input]);
        }

        counter += 1;
    }

    // Append labels and inputs to the modal body
    for (const [label, input] of inputFields) {
        modalBody.appendChild(label);
        modalBody.appendChild(input);
    }

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalFooter.appendChild(cancelButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Confirm";
    // Add functionality for the Add button based on your requirements (e.g., form submission, data processing)
    editButton.addEventListener("click", function() {
        editButton.disabled = true;
        editRecord(tableName, getIdName(tableName), jsonData[rowId-1][getIdName(tableName)]);
        modalContainer.style.display = "none";
        modalContainer.remove();
        window.location.reload();
    });
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            editButton.disabled = true;
            editRecord(tableName, getIdName(tableName), jsonData[rowId-1][getIdName(tableName)]);
            modalContainer.style.display = "none";
            modalContainer.remove();
            window.location.reload();
        }
    }
    document.addEventListener("keypress", handleKeyPress);
    modalFooter.appendChild(editButton);

    // Assemble the modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    // Add the modal content to the container and make it visible
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    modalContainer.style.display = "block"; // Display the modal

    // Focus the first input field when the modal opens (optional)
    inputFields[0][1].focus();
}


function showDeleteModal(tableName, rowID) {
    console.log("Mostrando Delete modal: " + tableName);

    // Create the modal elements
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal"); // Add a CSS class for styling

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h2");
    modalTitle.id = "deleteTitle"
    modalTitle.textContent = "Delete Row From: " + tableName;
    modalHeader.appendChild(modalTitle);

    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;"; // Close icon using character entity
    closeButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalHeader.appendChild(closeButton);

    const modalBody = document.createElement("div");
    modalBody.id = "deleteBody"
    modalBody.classList.add("modal-body");

    // Create input fields for each item in the array
    const labelQuestion = document.createElement("label");
    labelQuestion.textContent = "Are you sure you want to delete this row?";
    const label1 = document.createElement("label");
    label1.id = "labelDelete";
    label1.textContent = "Table: " + tableName;
    const label2 = document.createElement("label");
    label2.id = "labelDelete";
    label2.textContent = "RowID: " + jsonData[rowID-1][getIdName(tableName)];

    modalBody.appendChild(labelQuestion);
    modalBody.appendChild(label1);
    modalBody.appendChild(label2);

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalFooter.appendChild(cancelButton);

    const deleteButton = document.createElement("button");
    deleteButton.id = "deleteButton"
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteButton.disabled = true;
        deleteRecord(tableName, jsonData[rowID-1][getIdName(tableName)]);
        modalContainer.style.display = "none";
        modalContainer.remove();
        window.location.reload();
    });
    // Add functionality for the Add button based on your requirements (e.g., form submission, data processing)
    deleteButton.addEventListener("click", function() {
        // Implement logic to handle form submission or data processing on Add click
    });
    modalFooter.appendChild(deleteButton);

    // Assemble the modal content
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    // Add the modal content to the container and make it visible
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    modalContainer.style.display = "block"; // Display the modal
    console.log(jsonData)
    console.log(jsonData[0])
}

function checkActive() {
    const allTabs = document.querySelectorAll(".tab");
    for (const tab of allTabs) {
        if (tab.classList.contains("active")) {
            return tab.id; // Return the ID of the tab with the "active" class
        }
    }
    return null;
}

async function deleteRecord(tableName, rowId) {
    console.log("DELETING")
    try {
        const response = await fetch(`http://localhost:3000/api/deleteRecord/${tableName}/${getIdName(tableName)}/${rowId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

function getAddModelData(tableName) {
    var columnNames = getColumnNames(tableName);
    var modelJSON = {};

    for (var i = 0; i < columnNames.length; i++) {
        var columnName = columnNames[i];
        // Assuming you have elements with IDs corresponding to column names
        var element = document.getElementById(columnName);
        if (element) {
            modelJSON[columnName] = element.value;
        } else {
            throw new Error("Element with ID " + columnName + " not found.");
        }
    }

    return modelJSON;
}

function getEditModelData(tableName) {
    var columnNames = getAllColumnNames(tableName);
    var modelJSON = {};

    for (var i = 0; i < columnNames.length; i++) {
        var columnName = columnNames[i];
        // Assuming you have elements with IDs corresponding to column names
        var element = document.getElementById(columnName);
        if (element) {
            modelJSON[columnName] = element.value;
        } else {
            throw new Error("Element with ID " + columnName + " not found.");
        }
    }

    return modelJSON;
}

async function addRecord(tableName) {
    try {
        const response = await fetch(`http://localhost:3000/api/addRecord/${tableName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getAddModelData(tableName))
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

async function editRecord(tableName, idName, rowId) {
    console.log(getAddModelData(tableName));
    console.log("Table: " + tableName);
    console.log("IdName: " + idName);
    console.log("IdRow: " + rowId);
    try {
        const response = await fetch(`http://localhost:3000/api/updateTable/${tableName}/${idName}/${rowId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getAddModelData(tableName))
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
}

function getIdName(tableName) {
    switch (tableName) {
        case "Drivers":
            return "idDrivers";
        case "Teams":
            return "idTeams";
        case "Circuits":
            return "idCircuits";
        case "News":
            return "idNews";
        case "ChatUsers":
            return "idChatUsers";
        case "ChatMessages":
            return "idChatMessages";
        case "Test":
            return "idTest";
        default:
            throw new Error("Invalid table name");
    }
}

function getAllColumnNames(tableName) {
    switch (tableName) {
        case "Drivers":
            return ["idDrivers", "Name", "Surname", "TeamName", "Number", "Photo", "Flag", "Points", "TotalPoints"];
        case "Teams":
            return ["idTeams", "Name", "Logo", "Car", "Driver1Name", "Driver1Photo", "Driver2Name", "Driver2Photo", "Points", "TotalPoints"];
        case "Circuits":
            return ["idCircuits", "Name", "Country", "Length", "Turns", "Photo", "Flag", "Date", "ExtraInfo"];
        case "News":
            return ["idNews", "Title", "Description", "Images", "date"];
        case "ChatUsers":
            return ["idChatUsers", "Username"];
        case "ChatMessages":
            return ["idChatMessages", "iduser", "Content", "Timestamp"];
        case "Test":
            return ["idTest", "Nombre", "Numero"];
        default:
            throw new Error("Invalid table name");
    }
}

function getColumnNames(tableName) {
    switch (tableName) {
        case "Drivers":
            return ["Name", "Surname", "TeamName", "Number", "Photo", "Flag", "Points", "TotalPoints"];
        case "Teams":
            return ["Name", "Logo", "Car", "Driver1Name", "Driver1Photo", "Driver2Name", "Driver2Photo", "Points", "TotalPoints"];
        case "Circuits":
            return ["Name", "Country", "Length", "Turns", "Photo", "Flag", "Date", "ExtraInfo"];
        case "News":
            return ["Title", "Description", "Images", "date"];
        case "ChatUsers":
            return ["Username"];
        case "ChatMessages":
            return ["iduser", "Content", "Timestamp"];
        case "Test":
            return ["Nombre", "Numero"];
        default:
            throw new Error("Invalid table name");
    }
}






