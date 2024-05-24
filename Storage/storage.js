document.addEventListener("DOMContentLoaded", function () {
    //--------- START AUTH CHECK ---------
    const cookies = document.cookie.split('; ');
    const userIdCookie = cookies.find(cookie => cookie.startsWith('ManagerUserId='));
    const contentElement = document.getElementById('content');
    document.body.style.display = 'none'; // Initially hide the content

    if (userIdCookie) {
        // If the session cookie is found, show the content
        document.body.style.display = 'block';
    } else {
        // If there is no session cookie, redirect to the login page
        window.location.href = "../Login/login.html";
    }
    //--------- END AUTH CHECK ---------



    if (localStorage.getItem("currentTableStorage")) {
        showTable(localStorage.getItem("currentTableStorage"));
    } else {
        showTable('test');
    }

    const addButton = document.getElementById("addBTN");
    addButton.addEventListener("click", function() {
        showAddModal(checkActive());
    });






    fetch('http://localhost:3000/api/getImage/test/giphy.gif')
        .then(response => response.json())
        .then(data => {
            var theURL = data.imageUrl
            console.log(data.imageUrl)


        })
        .catch(error => console.error('Error:', error));
});


var jsonData = null;
var currentTableStorage = "test";

function logoutPage() {
    document.cookie = `ManagerUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
                        cell.innerHTML = `<a href="#" onclick="showViewModal(checkActive(), '${fileName}')" style="color: #f52904">${rowData[responseTitles[i]]}</a>`;
                    } else if (responseTitles[i] == "size") {
                        cell.innerHTML = formatBytes(rowData[responseTitles[i]]);
                    } else {
                        cell.innerHTML = rowData[responseTitles[i]];
                    }

                }
                var cell = tr.insertCell();
                cell.innerHTML = `
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
    showEditModal(checkActive(), file)
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
        deleteButton.disabled = true;
        fetch('http://localhost:3000/api/deleteFile/' + tableName + '/' + file, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                //File was deleted
                modalContainer.style.display = "none";
                modalContainer.remove();
                window.location.reload();
            })
            .catch(error => console.error('Error:', error));
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

function showEditModal(tableName, file) {
    console.log("Mostrando View modal: " + tableName);

    // Create the modal elements
    const modalContainer= document.createElement("div");
    modalContainer.classList.add("modal"); // Add a CSS class for styling

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h2");
    modalTitle.innerHTML = "Modify Media Name"
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

    const lastDotIndex = file.lastIndexOf('.');
    const fileName = file.substring(0, lastDotIndex);
    const extension = file.substring(lastDotIndex);


    const labelExtension = document.createElement("label");
    labelExtension.textContent = name;
    labelExtension.textContent = "File Extension: " + extension

    const labelName = document.createElement("label");
    labelName.textContent = name;
    labelName.style.marginTop = "15px"
    labelName.textContent = "File Name:"

    const inputName = document.createElement("input");
    inputName.type = "text"; // Adjust input type as needed (e.g., "number" for numeric values)
    inputName.value = fileName  //Set current file name
    inputName.name = name;
    inputName.id = "fileName";

    modalBody.appendChild(labelExtension)
    modalBody.appendChild(labelName)
    modalBody.appendChild(inputName)

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalFooter.appendChild(cancelButton);

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    // Add functionality for the Add button based on your requirements (e.g., form submission, data processing)
    confirmButton.addEventListener("click", function() {
        confirmButton.disabled = true;

        fetch('http://localhost:3000/api/getImage/' + tableName + '/' + file)
            .then(response => response.json())
            .then(data => {
                var fileUrl = data.imageUrl;

                fetch('http://localhost:3000/api/deleteFile/' + tableName + '/' + file, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(data => {

                        getFileBlob(fileUrl)
                            .then(blob => {
                                var formData = new FormData();
                                formData.append('file', blob, inputName.value + extension);

                                // Send POST request to upload the file
                                fetch('http://localhost:3000/api/uploadFile/' + tableName, {
                                    method: 'POST',
                                    body: formData
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Failed to upload file');
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        console.log('File uploaded successfully:', data);
                                        modalContainer.style.display = "none";
                                        modalContainer.remove();
                                        window.location.reload();
                                    })
                                    .catch(error => {
                                        console.error('Error uploading file:', error);
                                        // Handle the error as needed
                                    });
                            })
                            .catch(error => {
                                console.error('Error fetching file content:', error);
                                // Handle the error as needed
                            });



                    })
                    .catch(error => console.error('Error:', error));

            })
            .catch(error => console.error('Error:', error));


    });
    modalFooter.appendChild(confirmButton);

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

function showViewModal(tableName, file) {
    console.log("Mostrando View modal: " + tableName);

    // Create the modal elements
    const modalContainer= document.createElement("div");
    modalContainer.classList.add("modal"); // Add a CSS class for styling

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h2");
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
    const fileIMG = document.createElement("img");
    const fileVIDEO = document.createElement("video");
    const loadingAnimation = document.createElement("img");
    loadingAnimation.src = "./LoadingTransparent.gif"; // Path to your loading gif

    // Initially show the loading animation
    loadingAnimation.style.display = 'block';
    modalBody.appendChild(loadingAnimation);

    fetch('http://localhost:3000/api/getImage/' + tableName + '/' + file)
        .then(response => response.json())
        .then(data => {
            // Hide loading animation
            loadingAnimation.style.display = 'none';

            if (data.imageType.includes("image/")) {    //Image
                fileIMG.src = data.imageUrl;
                modalBody.appendChild(fileIMG);
            } else if (data.imageType.includes("video/")) { //video
                fileVIDEO.src = data.imageUrl;
                fileVIDEO.controls = true;
                modalBody.appendChild(fileVIDEO);
            } else {
                //Ignore
            }
        })
        .catch(error => console.error('Error:', error));


    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", function() {
        modalContainer.style.display = "none";
        modalContainer.remove();
    });
    modalFooter.appendChild(cancelButton);

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

function showAddModal(tableName) {
    console.log("Mostrando View modal: " + tableName);

    // Create the modal elements
    const modalContainer= document.createElement("div");
    modalContainer.classList.add("modal"); // Add a CSS class for styling

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h2");
    modalTitle.innerHTML = "Add Media"
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

    // Create a file input element
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'file-input';
    fileInput.alt = 'Select a Media';
    fileInput.accept = 'image/*, video/*';
    fileInput.multiple = false;

    // Add an event listener to handle file selection
    var selectedFile = null; // Use files[0] for single file selection
    fileInput.addEventListener('change', function(event) {
        // Access the selected file(s)
        selectedFile = event.target.files[0]; // Use files[0] for single file selection

        // Check if the selected file is an image
        if (selectedFile.type.includes('image')) {
            // Create an image element
            var imgElement = document.createElement('img');
            imgElement.src = URL.createObjectURL(selectedFile);
            imgElement.style.maxWidth = '100%'; // Ensure image fits within modal-body
            imgElement.style.display = 'block'; // Make sure image is displayed as a block element
            // Clear modal body before appending new content
            modalBody.innerHTML = '';
            // Append image to modal body
            modalBody.appendChild(imgElement);
        }
        // Check if the selected file is a video
        else if (selectedFile.type.includes('video')) {
            // Create a video element
            var videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(selectedFile);
            videoElement.controls = true;
            videoElement.style.maxWidth = '100%'; // Ensure video fits within modal-body
            videoElement.style.display = 'block'; // Make sure video is displayed as a block element
            // Clear modal body before appending new content
            modalBody.innerHTML = '';
            // Append video to modal body
            modalBody.appendChild(videoElement);
        }
        // Hide file input
        fileInput.style.display = 'none';
        fileInput.disabled = true;
    });

    // Append the file input element to the modal body
    modalBody.appendChild(fileInput);

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
    addButton.id = "AddMediaBTN"
    // Add functionality for the Add button based on your requirements (e.g., form submission, data processing)
    addButton.addEventListener("click", function() {
        if (selectedFile != null) {
            var formData = new FormData();
            formData.append('file', selectedFile, selectedFile.name);

            fetch('http://localhost:3000/api/uploadFile/' + tableName, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to upload file');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('File uploaded successfully:', data);
                    modalContainer.style.display = "none";
                    modalContainer.remove();
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    // Handle the error as needed
                });
        }
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
    console.log(jsonData)
    console.log(jsonData[0])
}

async function getFileBlob(fileURL) {
    const response = await fetch(fileURL);

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    return await response.blob();
}

