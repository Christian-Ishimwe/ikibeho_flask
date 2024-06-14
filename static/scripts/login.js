const subBtn = document.getElementById("subBtn");
subBtn.addEventListener("click", handleLogin);

async function handleLogin() {
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();
    subBtn.disabled = true;
    subBtn.innerText = "Loading...";

    try {
        const response = await fetch("http://localhost:5000/api/user/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            const errDiv = document.getElementById("error");
            errDiv.classList.remove("hidden");
            errDiv.innerText = data.message || "Invalid email or password";
            subBtn.disabled = false;
            subBtn.innerText = "Login";
            return;
        }

        const { token, role, id, username } = data;
        const current_user = { token, role, id, username };
        localStorage.setItem("user", JSON.stringify(current_user));

        const sessionResponse = await fetch("/login/sessions", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(current_user)
        });

        if (!sessionResponse.ok) {
            throw new Error('Failed to create session');
        }

        window.location.href = "/dashboard";
    } catch (err) {
        console.log(err.message);
    } finally {
        subBtn.disabled = false;
        subBtn.innerText = "Login";
    }
}
