    document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("username").innerText= JSON.parse(localStorage.getItem("user")).username
    const blogsLength = await getBlogs();
    const donationLength= await getDonations();
    const contactsLength= await getContacts() 
    console.log(blogsLength);
    document.getElementById("contactsLength").innerText=contactsLength
    document.getElementById("blogsLength").innerText = blogsLength;
    document.getElementById("donationLength").innerText=donationLength
    const data = {
        labels: ['Admins', 'Blogs', 'Donations', 'Contacts'],
        datasets: [{
            label: 'Statistics',
            data: [3, blogsLength, donationLength, contactsLength],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
});
const token= JSON.parse(localStorage.getItem("user")).token
async function getBlogs() {
    try {
        const response = await fetch("https://api.ikibehofoundation.org.rw/api/blogs");
        if (!response.ok) {
            throw new Error("There was an error fetching data!");
        }
        const data = await response.json();
        const blogsLength = data.blogs.length || 0;
        return blogsLength;
    } catch (error) {

        console.log(error);
        return 0
    }
}

async function getDonations() {
    try {
        const response = await fetch("https://api.ikibehofoundation.org.rw/api/donations/all", {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("There was an error fetching data!");
        }
        const data = await response.json();
        const donationLength = data.length;
        console.log(donationLength);
        return donationLength;
    } catch (error) {
        console.log(error);
        return 0

    }
}

async function getContacts() {
    try {
        const response = await fetch("https://api.ikibehofoundation.org.rw/api/contacts/all", {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("There was an error fetching data!");
        }
        const data = await response.json();
        const contactsLength = data.length;
        console.log(contactsLength);
        return contactsLength;
    } catch (error) {
        console.log(error);
        return 0

    }
}


 
