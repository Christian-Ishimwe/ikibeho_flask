
const token=JSON.parse(localStorage.getItem("user")).token
const getProfile = async () => {

    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        document.getElementById('profile-name').textContent = data.name;
        document.getElementById('profile-email').textContent = data.email;
        document.getElementById('phone').value = data.phone;
        document.getElementById('blog-count').textContent = data.blogCount;
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }
getProfile()

async function updatePhone() {
    const phone = document.getElementById('phone').value;
    const response = await fetch('http://localhost:5000/api/user/update-phone', {
      method: 'put',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: phone })
    });

    if (await response.ok) {
      alert('Phone number updated successfully');
      console.log(response.json())
    } else {
      const errorData = await response.json();
      alert(`Failed to update phone number: ${errorData.message}`);
    }
  }

async function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }


    const response = await fetch('http://localhost:5000/api/user/changepassword', {
      method: 'put',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    if (response.ok) {
        console.log(response.json())
      alert('Password changed successfully');
      document.getElementById('change-password-form').reset();
    } else {
      const errorData = await response.json();
      alert(`Failed to change password: ${errorData.message}`);
    }
  }
