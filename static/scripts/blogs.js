window.addEventListener("DOMContentLoaded", async ()=>{
    await initialize()
})

async function fetchBlogs() {
    try {
        const response = await fetch("https://api.ikibehofoundation.org.rw/api/blogs");
        if (!response.ok) {
            throw new Error("Network Error");
        } else {
            const data = await response.json();
            return data.blogs;
        }
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

async function initialize() {
            const blogs = await fetchBlogs();
            renderCards(blogs);
}
function renderCards(blogs) {
            const cardsContainer = document.getElementById('cardsContainer');
            cardsContainer.innerHTML = ''; // Clear any existing cards

            blogs.forEach(blog => {
                const card = document.createElement('div');
                card.className = 'bg-white p-6 rounded-lg shadow-md';

                card.innerHTML = `
                    <img src="${blog.imageUrls[0]}" alt="Blog Image" class="w-full h-48 object-cover rounded-t-lg">
                    <div class="mt-4">
                        <h2 class="text-xl font-bold">${blog.title}</h2>
                        <p class="text-gray-600">${new Date(blog.createdAt).toLocaleDateString()}</p>
                        <div class="flex justify-end space-x-2 mt-4">
                            <a href="/blogs/edit_id?${blog._id}" class="bg-blue-500 text-white px-4 py-2 rounded" onclick="editBlog('${blog._id}')">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteBlog('${blog._id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <a  href="/blogs/blog_id?${blog._id}" class="bg-green-500 text-white px-4 py-2 rounded" >
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>



                `;

                cardsContainer.appendChild(card);
            });
        }

function editBlog(blogId) {
            console.log(`Edit blog with ID: ${blogId}`);
}

function deleteBlog(blogId) {
    const token= JSON.parse(localStorage.getItem("user")).token
    const permission= window.confirm("Are you sure you need to delete this blog?")
        if (permission){
            try{
                fetch(`https://api.ikibehofoundation.org.rw/api/blogs/${blogId}`, {
                    method: "delete",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }).then(response=>{
                    if(!response.ok){
                        throw  new Error("Internal Error")
                    }
                    return response.json()
                }).then(  data=>{
                  window.location.reload()
                })  
            }catch(err){
                console.log(err)
            }
        }
    }

        function viewBlog(blogId) {
            console.log(`View blog with ID: ${blogId}`);
        }
