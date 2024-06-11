const subBtn= document.getElementById("subBtn")
subBtn.addEventListener("click", handleLogin)

function handleLogin(){
    const password= document.getElementById("password").value.trim()
    const email= document.getElementById("email").value.trim()
    subBtn.disabled=true
    subBtn.innerText="Loading..."
    fetch("http://localhost:5000/api/user/login", {
        headers: {
           "Content-Type" : "application/json" 
        },
        method: "POST",
        body: JSON.stringify({email, password})
    }).then(response=>{
        if(!response.ok){
            console.log(response)
             const errDiv = document.getElementById("error");
            errDiv.classList.remove("hidden");
            errDiv.innerText = "Invalid email or password";
        }
        return response.json()
    }).then(data=>{
        const token = data.token
        const role= data.role
        const id=  data.id
        const current_user= {token, role,id}
        localStorage.setItem("user", JSON.stringify(current_user))
        fetch("/login/sessions",{
            headers:{
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(current_user)
        })
         window.location.href = "/dashboard";

    }).catch(err=>{
        console.log(err.message);
    })
    subBtn.disabled=false
    subBtn.innerText="Login"
}

