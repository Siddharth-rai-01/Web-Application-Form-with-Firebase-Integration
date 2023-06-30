import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {getDatabase, ref, set, onValue, push, remove} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

window.addEventListener("DOMContentLoaded", () => {
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCJYGW3JDgKa9q_LQfXkJHIUswiKBguJmc",
      authDomain: "fire9db-153d5.firebaseapp.com",
      databaseURL: "https://fire9db-153d5-default-rtdb.firebaseio.com",
      projectId: "fire9db-153d5",
      storageBucket: "fire9db-153d5.appspot.com",
      messagingSenderId: "434735356285",
      appId: "1:434735356285:web:9f68674f6c55a0acd79414"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase();
    const form = document.getElementById("myForm");
    const successmessage = document.getElementById("successMessage");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        // Get Input values
        const name = form.name.value;
        const email = form.email.value;
        const message = form.message.value;

        // Save the data in database
        // const userData = db.ref("userData").push();
        const userDataRef = push(ref(database,"userData/"));
        const newUserDataKey = userDataRef.key;
        set(userDataRef, {
                name:name,
                email:email,
                message: message
        },
        (error) => {
            if(error) {
            console.log("Error Saving Data:"+ error);
            }
            else{
                successmessage.classList.remove("hidden");
                setTimeout(() => {
                    successmessage.classList.add("hidden");
                }, 3000);
            }
        });
        form.reset();
    });
    const tableBody = document.querySelector("#dataTable tbody");

    onValue(ref(database, "userData"), (snapshot) => {
        tableBody.innerHTML ="";
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const userId = childSnapshot.key;

            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.textContent = user.name;

            const emailCell = document.createElement("td");
            emailCell.textContent = user.email;

            const messageCell = document.createElement("td");
            messageCell.textContent = user.message;

            const updateCell = document.createElement("td");
            const updateButton = document.createElement("button");
            updateButton.textContent="Update";
            updateButton.addEventListener("click", () => {
                openUpdateModal(userId, user);
            });
            updateCell.appendChild(updateButton);

            const deleteCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent="Delete";
            deleteButton.addEventListener("click", () => {
                // database.ref("userData/" + userId).remove();
                remove(ref(database, "userData/" + userId));
            });
            deleteCell.appendChild(deleteButton);

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(messageCell);
            row.appendChild(updateCell);
            row.appendChild(deleteCell);

            tableBody.appendChild(row);
        });
    });

    // Update Details
    const updateModal =document.getElementById("updatedetails");
    const closeUpdateModal = document.querySelector("#updateModal, .close");
    const updateForm = document.getElementById("updateForm");

    function openUpdateModal(userId, user) {
        updateForm.reset();
        document.getElementById("updateUserId").value = userId;
        document.getElementById("updateName").value = user.name;
        document.getElementById("updateEmail").value = user.email;
        document.getElementById("updateMessage").value = user.message;
        updateModal.style.display="block";
    }
    closeUpdateModal.addEventListener("click", () => {
        updateModal.style.display="none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === updateModal) {
            updateModal.style.display ="none";
        }
    });

    updateForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get Uploaded Values
        const userId = document.getElementById("updateUserId").value;
        const updatedName = document.getElementById("updateName").value;
        const updatedEmail = document.getElementById("updateEmail").value;
        const updatedMessage = document.getElementById("updateMessage").value;

        // Updata data in database
        const userref = database.ref("userData/" + userId);
        userref.update({
            name: updatedName,
            email: updatedEmail,
            message: updatedMessage
        });
        // Close Update Modal
        updateModal.style.display = "none";
    })


});
