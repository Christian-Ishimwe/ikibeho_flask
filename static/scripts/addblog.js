document.getElementById('postForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const token= JSON.parse(localStorage.getItem("user")).token
            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch('http://localhost:5000/api/blogs/add', {
                    method: 'POST',
                    body: formData,
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                alert('Post created successfully');
                console.log(data);

                // Clear the form
                form.reset();
                CKEDITOR.instances.content.setData('');

            } catch (error) {
                console.error('There was a problem with your fetch operation:', error);
                alert('There was an error creating the post');
            }
    })