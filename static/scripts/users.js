window.addEventListener("DOMContentLoaded", async () => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const users = await fetchUsers();
    renderUsers(users);

    async function fetchUsers() {
        const response = await fetch("https://api.ikibehofoundation.org.rw/api/user/all", {
            method: "get",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Invalid token");
        } else {
            const data = await response.json();
            return data;
        }
    }

    async function renderUsers(users) {
        const userCardsContainer = document.getElementById('user-cards');
        userCardsContainer.innerHTML = ''; // Clear previous cards
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'card bg-white shadow-md rounded-lg p-4';
           userCard.innerHTML = `
         <div class="card-body">
        <h5 class="card-title font-bold text-xl">${user.firstname + " " + user.lastname}</h5>
        <p class="card-text text-gray-700"><strong>Email:</strong> ${user.email}</p>
        <p class="card-text text-gray-700"><strong>Active:</strong> ${user.active}</p>
        <p class="card-text text-gray-700"><strong>Role:</strong> ${user.role}</p>
        <div class="flex justify-end space-x-4 mt-4">
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${user._id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#deleteModal-${user._id}">
                <i class="fas fa-trash-alt"></i>
            </button>
            ${user.active ? 
                `<button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#diactivateUser-${user._id}">
                    <i class="fas fa-ban"></i>
                </button>` 
                : 
                `<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#diactivateUser-${user._id}">
                    <i class="fas fa-check"></i>
                </button>`
            }
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="staticBackdrop-${user._id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit User</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form action="#" method="POST" class="space-y-6">
                        <div>
                            <label for="role-${user._id}" class="block text-sm font-medium text-gray-700">Role</label>
                            <select id="role-${user._id}" name="role" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                                <option value="superadmin" ${user.role === "superadmin" ? "selected" : ""}>Superadmin</option>
                            </select>
                        </div>
                        <div>
                            <label for="telephone-${user._id}" class="block text-sm font-medium text-gray-700">Telephone</label>
                            <input type="tel" id="telephone-${user._id}" name="telephone" value="${user.phone}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                            <label for="firstname-${user._id}" class="block text-sm font-medium text-gray-700">First Name</label>
                            <input type="text" id="firstname-${user._id}" name="firstname" value="${user.firstname}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                            <label for="lastname-${user._id}" class="block text-sm font-medium text-gray-700">Last Name</label>
                            <input type="text" id="lastname-${user._id}" name="lastname"  value="${user.lastname}"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>
                        <div>
                            <button type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal fade" id="deleteModal-${user._id}" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="deleteModalLabel">Delete Admin</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you need to delete this user?
                    <p><strong>Name: </strong>${user.firstname} ${user.lastname}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Deactivate Modal -->
    <div class="modal fade" id="diactivateUser-${user._id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Deactivate Admin</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you need to change the status of this user?
                    <p><strong>Active: </strong> ${user.active}</p>
                    <p><strong>Name: </strong> ${user.firstname} ${user.lastname}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-warning" onclick="toggleUserStatus('${user._id}', ${user.active})">Change</button>
                </div>
            </div>
        </div>
    </div>
`;

            userCardsContainer.appendChild(userCard);
        });
    }





    document.getElementById('addUserForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const newUser = {
            firstname: document.getElementById('firstname').value.trim(),
            lastname: document.getElementById('lastname').value.trim(),
            email: document.getElementById('email').value.trim(),
            role: document.getElementById('role').value,
            password: document.getElementById("password").value.trim(),
            phone: document.getElementById("phone").value.trim() || ""
        };

        try {
            const token = JSON.parse(localStorage.getItem("user")).token;
            const response = await fetch('https://api.ikibehofoundation.org.rw/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            const addedUser = await response.json();
            window.location.reload();
            // Update the user list by fetching users again
            const users = await fetchUsers();
            renderUsers(users);

        } catch (error) {
            console.error(error.message);
        }
    });
});



async function deleteUser(userId) {
    try {
        const token = JSON.parse(localStorage.getItem("user")).token;
        const response = await fetch(`https://api.ikibehofoundation.org.rw/api/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        window.location.reload()
        const users = await fetchUsers();
        renderUsers(users);

    } catch (error) {
        console.error(error.message);
    }
}

async function toggleUserStatus(userId, currentStatus) {
    
    try {
        const token = JSON.parse(localStorage.getItem("user")).token;
        let response=""
        if(currentStatus){
            response = await fetch(`https://api.ikibehofoundation.org.rw/api/user/diactivate/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: !currentStatus })
        });
        }else{
             response = await fetch(`https://api.ikibehofoundation.org.rw/api/user/activate/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        }
        
        if (!response.ok) {
            throw new Error('Failed to update user status');
        }
        window.location.reload()

    } catch (error) {
        console.error(error.message);
    }
}

async function fetchUsers() {
    const token = JSON.parse(localStorage.getItem("user")).token;
    const response = await fetch("https://api.ikibehofoundation.org.rw/api/user/all", {
        method: "get",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Invalid token");
    } else {
        const data = await response.json();
        return data;
    }
}
