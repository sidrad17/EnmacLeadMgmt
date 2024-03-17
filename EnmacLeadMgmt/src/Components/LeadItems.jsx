import axios from 'axios';
import React, { useEffect, useState } from 'react';

function LeadItems() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [leadId, setLeadId] = useState(null);

  // Fetch items on component mount
  useEffect(() => {
    axios.get('http://localhost:3000/auth/items')
      .then(result => {
        if (result.data.Status) {
          setItems(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    // Extract lead ID from URL
    const leadIdFromURL = window.location.pathname.split('/').pop();
    setLeadId(leadIdFromURL);

    // Fetch and update lead items
    axios.get(`http://localhost:3000/auth/leadItems/${leadIdFromURL}`)
      .then(res => {
        if (res.data.Status) {
          const existingItems = res.data.Result;
          // Update selectedItems state with fetched lead items
          setSelectedItems(existingItems);
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchResults(filteredItems);
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find(i => i.item_id === item.item_id);
    if (existingItem) {
      existingItem.quantity++;
      setSelectedItems([...selectedItems]);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  // Handle item removal
  const handleItemRemove = (item) => {
    const updatedItems = selectedItems.filter(filteredItem => filteredItem.item_id !== item.item_id);
    axios.delete(`http://localhost:3000/auth/deleteLeadItem/${leadId}/${item.item_id}`)
      .then(result => {
        if (result.data.Status) {
          alert('Selected item is removed.');
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
    setSelectedItems(updatedItems);
  };

  // Handle saving the selected items
  const handleSave = () => {
    // Combine existing lead items with selected items
    const allItems = [...selectedItems, ...items.filter(item => item.quantity > 0)];
    // Send a request to save all items
    axios.post(`http://localhost:3000/auth/upsertLeadItem/${leadId}`, allItems)
      .then(result => {
        if (result.data.Status) {
          alert('Items saved successfully.');
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Add Lead Items</h3>
      </div>
      <div className="mt-3">
        <input
          type="text"
          placeholder="Search items to add..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control mb-3"
        />
        {searchResults.length === 0 ? (
          <p>{searchTerm ? "No items found for the search term." : "No search performed."}</p>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map(item => (
                <tr key={item.item_id}>
                  <td>{item.item_name}</td>
                  <td>{item.price}</td>
                  <td>
                    <button className="btn btn-info btn-sm" onClick={() => handleItemSelect(item)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h5>Items Added</h5>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map(item => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>Rs. {item.price}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value);
                      if (!isNaN(quantity) && quantity > 0) {
                        item.quantity = quantity;
                        setSelectedItems([...selectedItems]);
                      }
                    }}
                  />
                </td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => handleItemRemove(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div align="center">
      <button className='btn btn-success w-20 rounded-0 mb-2' align="center" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default LeadItems;
