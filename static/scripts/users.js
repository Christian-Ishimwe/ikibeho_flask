window.addEventListener("DOMContentLoaded", async()=>{
    const token=JSON.parse(localStorage.getItem("user")).token
    const users= await fethUsers()
    renderUsers(users)


async function fethUsers(){
    const response= await fetch("http://localhost:5000/api/user/all", {
        method: "get",
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error("Invalid token")
    }else{
        const data= await response.json()
        return data
    }
}

async function renderUsers(users){

    
    const userCardsContainer = document.getElementById('user-cards');
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
                            <button class="btn btn-primary"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger" onclick="diactivateUser"><i class="fas fa-trash-alt"></i></button>
                           <button class="btn ${user.active ? 'btn-warning' : 'btn-success'}" onclick=diactivateUser>
                            <i class="fas ${user.active ? 'fa-ban' : 'fa-check'}"></i>
                            </button>

                            <button class="btn btn-success"><i class="fas fa-thumbs-up"></i></button>
                        </div>
                    </div>
                `;
// (user_id=${String(user._id)})

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
        phone:document.getElementById("phone").value.trim() || ""
    };

    try {
        const token = JSON.parse(localStorage.getItem("user")).token;
        const response = await fetch('http://localhost:5000/api/user/register', {
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
        $('#addUserModal').modal('hide');

        // Update the user list by fetching users again
        const users = await fethUsers();
        renderUsers(users);

    } catch (error) {
        console.error(error.message);
    }
});


})
