document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const token = JSON.parse(localStorage.getItem("user")).token;
    const form = event.target;

    // Ensure CKEditor updates the textarea
    for (let instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
    }

    const formData = new FormData(form);

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerText = 'Submitting...';

    try {
        const response = await fetch('http://localhost:5000/api/blogs/add', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await response.json();
        alert('Post created successfully');
        console.log(data);

        // Clear the form
        form.reset();
        for (let instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].setData('');
        }

    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        alert('There was an error creating the post: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = 'Submit';
    }
});
