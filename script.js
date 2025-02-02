let currentEditIndex = -1;  // Track the index of the password being edited

function maskPassword(pass) {
    let str = "";
    for (let index = 0; index < pass.length; index++) {
        str += "*";
    }
    return str;
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter((e) => e.website !== website);
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Successfully deleted ${website}'s password`);
    showPasswords();
};

// Show passwords in the table
const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");
    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = "No Data To Show";
    } else {
        tb.innerHTML = `
            <tr>
                <th>Website</th>
                <th>URL</th>
                <th>Username</th>
                <th>Password</th>
                <th>Delete</th>
                <th>Edit</th>
            </tr>`;
        let arr = JSON.parse(data);
        let str = "";
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            str += `<tr>
                <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="12" height="12"></td>
                <td>${element.url} <img onclick="copyText('${element.url}')" src="./copy.svg" alt="Copy Button" width="12" height="12"></td>
                <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="12" height="12"></td>
                <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="12" height="12"></td>
                <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
                <td><button class="btnsm" onclick="editPassword(${index})">Edit</button></td>
            </tr>`;
        }
        tb.innerHTML = tb.innerHTML + str;
    }
    clearForm();
};

// Edit the password by populating the form
const editPassword = (index) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    const passwordData = arr[index];
    
    // Set form fields to the selected password data
    document.getElementById("website").value = passwordData.website;
    document.getElementById("url").value = passwordData.url;
    document.getElementById("username").value = passwordData.username;
    document.getElementById("password").value = passwordData.password;
    
    // Set the current edit index
    currentEditIndex = index;
};

// Clear form fields
const clearForm = () => {
    website.value = "";
    url.value = "";
    username.value = "";
    password.value = "";
    currentEditIndex = -1;
};

console.log("Working");
showPasswords();

// Form submission logic (Add or Edit)
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Clicked....");
    console.log(username.value, password.value);
    
    let passwords = localStorage.getItem("passwords");
    let newPasswordData = {
        website: website.value,
        url: url.value,
        username: username.value,
        password: password.value,
    };

    if (passwords == null) {
        let json = [];
        json.push(newPasswordData);
        alert("Password Saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    } else {
        let json = JSON.parse(localStorage.getItem("passwords"));

        if (currentEditIndex === -1) {
            json.push(newPasswordData);  // Add new password
            alert("Password Saved");
        } else {
            json[currentEditIndex] = newPasswordData;  // Update existing password
            alert("Password Updated");
        }

        localStorage.setItem("passwords", JSON.stringify(json));
    }

    showPasswords();
});
