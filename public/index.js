(function iife() {
  const list = document.querySelector('.items');

  const status = document.querySelector('.status');

  const add = document.querySelector('.add');

  const toAdd = document.querySelector('.add-name');

  const toAddQuantity = document.querySelector('.add-quantity');

  disableAddButtonOnEmpty();

  let items = [];
  const errMsgs = {
    'duplicate': 'That name already exists',
    'network-error': 'There was a problem connecting to the network, try again',
  };

  function updateStatus(message) {
    status.innerText = message;
  }

  function renderItems(items) {
    const html = items.map(
      (item) => `
        <li>
          <button class="delete" data-name="${item.name}">X</button>
          <span class="name">${item.name}</span>
          <span id="q" class="quantity">${item.quantity}</span>
          <input id="new-q" class="new-quantity" type="text">
          <button class="update" data-name="${item.name}">Update</button>
        </li>`
    ).join('');
    list.innerHTML = html;
    add.disabled = !toAdd.value;
  }

  function disableAddButtonOnEmpty() {
    toAdd.addEventListener('input', () => {
      add.disabled = !toAdd.value;
    });
  }

  function convertError(response) {
    if (response.ok) {
      return response.json();
    }
    return response.json()
      .then(err => Promise.reject(err));
  }

  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
      const name = e.target.dataset.name;
      fetch(`/items/${name}`, {
          method: 'DELETE',
        })
        .catch(() => Promise.reject({
          error: 'network-error'
        }))
        .then(convertError)
        .then(items => {
          renderItems(items);
          updateStatus('');
        })
        .catch(err => {
          updateStatus(errMsgs[err.error] || err.error);
        });
    }

    else if (e.target.classList.contains('update')) {
      const itemClicked = e.target.parentNode;
      const oldQuantity = parseInt(itemClicked.querySelector('#q').innerHTML);
      const newQuantityInput = itemClicked.querySelector('#new-q').value;
      const newQuantity = newQuantityInput ? parseInt(newQuantityInput) : oldQuantity;

      const name = e.target.dataset.name;
      fetch(`/items/${name}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: name,
            quantity: newQuantity
          }),
          headers: {
            'Content-type': 'application/json'
          }
        })
        .catch(() => Promise.reject({
          error: 'network-error'
        }))
        .then(convertError)
        .then(items => {
          renderItems(items);
          updateStatus('');
        })
        .catch(err => {
          updateStatus(errMsgs[err.error] || err.error);
        });
    }
  });

  add.addEventListener('click', () => {
    const quantity = toAddQuantity.value ? parseInt(toAddQuantity.value) : 0;
    const name = toAdd.value;
    if (name) {
      fetch(`/items/`, {
          method: 'POST',
          body: JSON.stringify({
            name: name,
            quantity: quantity
          }),
          headers: {
            'Content-type': 'application/json'
          }
        })
        .catch(() => Promise.reject({
          error: 'network-error'
        }))
        .then(convertError)
        .then(items => {
          toAdd.value = '';
          toAddQuantity.value = '';
          renderItems(items);
          updateStatus('');
        })
        .catch(err => {
          updateStatus(errMsgs[err.error] || err.error);
        });
    }
  });

  fetch('/items/', {
      method: 'GET',
    })
    .catch(() => Promise.reject({
      error: 'network-error'
    }))
    .then(convertError)
    .then(items => {
      renderItems(items);
      updateStatus('');
    })
    .catch(err => {
      updateStatus(errMsgs[err.error] || err.error);
    });
})();