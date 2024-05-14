document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("currentTableStorage")) {
        showTable(localStorage.getItem("currentTableStorage"));
    } else {
        showTable('test');
    }

    const addButton = document.getElementById("addBTN");
    addButton.addEventListener("click", function() {
        showAddModal(checkActive());
    });
});


var jsonData = null;
var currentTableStorage = "test";

function logoutPage() {
    localStorage.setItem("ManagerUserId", "")
    localStorage.setItem("currentTable", "Drivers")
    localStorage.setItem("currentTableStorage", "cars")
    window.location.href='../Login/login.html'
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


function showTable(tableName) {
    currentTable = tableName
    localStorage.setItem("currentTableStorage", tableName)
    console.log("Mostrando tabla: " + tableName)

    var tables = document.querySelectorAll('table');
    var tabs = document.querySelectorAll('.tab');

    const tableHeader = ["File Name", "Size", "Type"];
    const responseTitles = ["fileName", "size", "type"];

    //API URL: http://localhost:3000/api/getCollectionList/<tablename>

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
    fetch('http://localhost:3000/api/getCollectionList/' + tableName)
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            // Clear table body
            var table = document.getElementById('table-' + tableName);
            table.innerHTML = '';

            // Add table header
            var thead = table.createTHead();
            var row = thead.insertRow();
            for (var i = 0; i < tableHeader.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = tableHeader[i];
                row.appendChild(th);
            }
            var th = document.createElement("th");
            th.innerHTML = "Actions";
            row.appendChild(th);

            // Add table body
            var tbody = table.createTBody();
            var identifier = 1
            let shifter = data.shift();
            data.forEach(rowData => {
                var fileName = rowData["fileName"]
                var tr = tbody.insertRow();
                for (var i = 0; i < responseTitles.length; i++) {
                    var cell = tr.insertCell();

                    if (responseTitles[i] == "fileName") {
                        cell.innerHTML = `<a href="#" onclick="viewFile('${fileName}')" style="color: #f52904">${rowData[responseTitles[i]]}</a>`;
                    } else if (responseTitles[i] == "size") {
                        cell.innerHTML = formatBytes(rowData[responseTitles[i]]);
                    } else {
                        cell.innerHTML = rowData[responseTitles[i]];
                    }

                }
                var cell = tr.insertCell();
                cell.innerHTML = `
                    <span class="edit-icon" onclick="editRow('${fileName}')"></span>
                    <span class="delete-icon" onclick="deleteRow('${fileName}')"></span>
                `;
                identifier += 1;
            });
        })
        .catch(error => console.error('Error:', error));
}

function deleteRow(file) {
    console.log("Delete row with ID: " + file);
    showDeleteModal(checkActive(), file)
}

function editRow(file) {
    console.log("Edit row with ID: " + file);
    //showEditModal(checkActive(), id)
}

function viewFile(file) {
    console.log("Viewing file: " + file);
    //showEditModal(checkActive(), id)
}

function formatBytes(bytes) {
    if (bytes < 1024) {
        return bytes + " Bytes";
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
}




// ---------------------- MODALS ----------------------

function showDeleteModal(tableName, file) {
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
    modalTitle.textContent = "Delete " + file + " From Collection: " + tableName;
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
    labelQuestion.textContent = "Are you sure you want to delete this file?";
    const label1 = document.createElement("label");
    label1.id = "labelDelete";
    label1.innerHTML = `Collection: <b>${tableName}</b>`;
    const label2 = document.createElement("label");
    label2.id = "labelDelete";
    label2.innerHTML = `File Name: <b>${file}</b>`;


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
        //deleteRecord(tableName, jsonData[file-1][getIdName(tableName)]);
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