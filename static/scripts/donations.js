  const token = JSON.parse(localStorage.getItem("user")).token; // Replace with the actual token

  async function fetchDonations() {
    try {
      const response = await fetch('http://localhost:5000/api/donations/all', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const donations = await response.json();

      // Update Overview Section
      document.getElementById('total-donations').innerText = donations.length;

      let totalAmount = 0;
      let volunteersCount = 0;
      let upcomingVisits = 0;

      donations.forEach(donation => {
        if (donation.type === 'donation') {
          totalAmount += donation.details.amount;
        } else if (donation.type === 'volunteer') {
          volunteersCount++;
        } else if (donation.type === 'visit') {
          upcomingVisits++;
        }
      });

      document.getElementById('total-amount-donated').innerText = `$${totalAmount}`;
      document.getElementById('total-volunteers').innerText = volunteersCount;
      document.getElementById('upcoming-visits').innerText = upcomingVisits;

      // Populate Recent Donations Table
      const tableBody = document.getElementById('donations-table-body');
      tableBody.innerHTML = '';

      donations.forEach(donation => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${donation.details.name}</td>
          <td>${donation.type}</td>
          <td>${donation.type === 'donation' ? `$${donation.details.amount}` : 'N/A'}</td>
          <td>${new Date(donation.date).toLocaleDateString()}</td>
          <td>${donation.delivered ? 'Yes' : 'No'}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="viewDonation('${donation._id}')"><i class="ri-eye-line"></i></button>
            <button class="btn btn-warning btn-sm" onclick="openEditModal('${donation._id}')"><i class="ri-edit-line"></i></button>
            <button class="btn btn-danger btn-sm" onclick="deleteDonation('${donation._id}')"><i class="ri-delete-bin-line"></i></button>
          </td>
        `;

        tableBody.appendChild(row);
      });

      // Update Donations Chart
      const ctx = document.getElementById('donationsChart').getContext('2d');
      const donationsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Cash', 'Volunteer', 'Visit'],
          datasets: [{
            label: 'Donations',
            data: [
              donations.filter(d => d.type === 'donation').length,
              donations.filter(d => d.type === 'volunteer').length,
              donations.filter(d => d.type === 'visit').length
            ],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)']
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  }

  async function viewDonation(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const donation = await response.json();

      const donationDetails = document.getElementById('donation-details');
      donationDetails.innerHTML = `
        <p><strong>Name:</strong> ${donation.details.name}</p>
        <p><strong>Type:</strong> ${donation.type}</p>
        <p><strong>Amount:</strong> ${donation.type === 'donation' ? `$${donation.details.amount}` : 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(donation.date).toLocaleDateString()}</p>
        <p><strong>Delivered:</strong> ${donation.delivered ? 'Yes' : 'No'}</p>
      `;

      openModal();
    } catch (error) {
      console.error('Error viewing donation:', error);
    }
  }

  function openModal() {
    document.getElementById('donationModal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('donationModal').classList.add('hidden');
  }

  function openEditModal(id) {
    document.getElementById('edit-donation-id').value = id;
    // Fetch and populate the current donation details
    fetchDonationDetails(id);
    document.getElementById('editDonationModal').classList.remove('hidden');
  }

  function closeEditModal() {
    document.getElementById('editDonationModal').classList.add('hidden');
  }

  async function fetchDonationDetails(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const donation = await response.json();

      document.getElementById('edit-donation-name').value = donation.details.name;
      document.getElementById('edit-donation-type').value = donation.type;
      if (donation.type === 'donation') {
        document.getElementById('edit-donation-amount-container').classList.remove('hidden');
        document.getElementById('edit-donation-amount').value = donation.details.amount;
      } else {
        document.getElementById('edit-donation-amount-container').classList.add('hidden');
      }
      document.getElementById('edit-donation-delivered').value = donation.delivered.toString();
    } catch (error) {
      console.error('Error fetching donation details:', error);
    }
  }

  async function saveDonation() {
    const id = document.getElementById('edit-donation-id').value;
    const name = document.getElementById('edit-donation-name').value;
    const type = document.getElementById('edit-donation-type').value;
    const amount = document.getElementById('edit-donation-amount').value;
    const delivered = document.getElementById('edit-donation-delivered').value === 'true';

    const updatedDonation = {
      details: { name },
      type,
      delivered
    };

    if (type === 'donation') {
      updatedDonation.details.amount = amount;
    }

    try {
      await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: 'PUT',
        headers: {
        'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDonation)
      });

      closeEditModal();
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  }

  async function deleteDonation(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/donations/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Donation deleted successfully');
        fetchDonations(); // Refresh the donations list
      } else {
        const errorData = await response.json();
        alert(`Failed to delete donation: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    fetchDonations();
  });
