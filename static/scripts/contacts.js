  const token = JSON.parse(localStorage.getItem("user")).token;

  async function fetchMessages() {
    try {
      const response = await fetch('https://api.ikibehofoundation.org.rw/api/contacts/all', {
        headers: {
          "Authorization": token
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const messages = await response.json();
      return messages;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  }

  // Function to render the messages list
  async function renderMessages() {
    const messages = await fetchMessages();
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';
    messages.forEach((msg, index) => {
      const row = document.createElement('tr');
      row.className = 'cursor-pointer';
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${msg.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${msg.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">${(new Date(msg.created_at)).toDateString()}</td>
        <td class="px-6 py-4 whitespace-nowrap">${msg.readed ? 'Read' : 'Unread'}</td>
      `;
      row.addEventListener('click', () => showMessageDetails(messages, index));
      messageList.appendChild(row);
    });

    // Update overview section
    document.getElementById('totalMessages').innerText = messages.length;
    document.getElementById('unreadMessages').innerText = messages.filter(msg => !msg.readed).length;
    document.getElementById('recentMessages').innerText = messages.filter(msg => new Date(msg.created_at) >= new Date(new Date().setDate(new Date().getDate() - 7))).length;
  }

  // Function to show message details
  

function showMessageDetails(messages, index) {
  const msg = messages[index];
  document.getElementById('detailsName').innerText = `Name: ${msg.name}`;
  document.getElementById('detailsEmail').innerText = `Email: ${msg.email}`;
  document.getElementById('detailsDate').innerText = `Date: ${(new Date(msg.created_at)).toDateString()}`;
  document.getElementById('detailsMessage').innerText = `Message: ${msg.message}`;
  document.getElementById('markAsReadButton').innerHTML = msg.readed ? '<i class="ri-mail-unread-line"></i>' : '<i class="ri-mail-check-line"></i>';

  // Attach event handlers for buttons
  document.getElementById('replyButton').onclick = () => showReplyForm(msg._id);
  document.getElementById('markAsReadButton').onclick = async () => {
    try {
      const response = await fetch(`https://api.ikibehofoundation.org.rw/api/contacts/all/${msg._id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        msg.readed = !msg.readed;
        renderMessages();
        showMessageDetails(messages, index);
      } else {
        console.error('Failed to update message read status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  document.getElementById('deleteButton').onclick = async () => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`https://api.ikibehofoundation.org.rw/api/contacts/all/${msg._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (response.ok) {
          renderMessages();
          clearMessageDetails();
        } else {
          console.error('Failed to delete message');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
}

function showReplyForm(messageId) {
  const replyForm = document.getElementById('replyForm');
  replyForm.style.display = 'block';
  document.getElementById('sendReplyButton').onclick = async () => {
    const replyText = document.getElementById('replyText').value;
    if (replyText) {
      try {
        const response = await fetch(`https://api.ikibehofoundation.org.rw/api/contacts/reply/${messageId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reply: replyText })
        });
        if (response.ok) {
          replyForm.style.display = 'none';
          renderMessages();
          clearMessageDetails();
        } else {
          console.error('Failed to send reply');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
}


  function clearMessageDetails() {
    document.getElementById('detailsName').innerText = 'Name: -';
    document.getElementById('detailsEmail').innerText = 'Email: -';
    document.getElementById('detailsDate').innerText = 'Date: -';
    document.getElementById('detailsMessage').innerText = 'Message: -';
  }

  // Function to filter messages based on search input
  document.getElementById('search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredMessages = messages.filter(msg => msg.name.toLowerCase().includes(searchTerm) || msg.email.toLowerCase().includes(searchTerm));
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';
    filteredMessages.forEach((msg, index) => {
      const row = document.createElement('tr');
      row.className = 'cursor-pointer';
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${msg.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${msg.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">${(new Date(msg.created_at)).toDateString()}</td>
        <td class="px-6 py-4 whitespace-nowrap">${msg.read ? 'Read' : 'Unread'}</td>
      `;
      row.addEventListener('click', () => showMessageDetails(filteredMessages, index));
      messageList.appendChild(row);
    });
  });

  // Initialize
  renderMessages();
