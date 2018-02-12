
let garageItems;

const appendItems = (items) => {
  items.forEach(item => {
    $('.garage').append(`<div class='appended-garage'>
      <div class='item${item.id}'>
        <h4 class='item-name'>Item: ${item.name}</h4>
        <h4 class='reason'>Reason: ${item.reason}</h4>
        <h4 class='condition'>Cleanliness: ${item.cleanliness}</h4>
     </div>`)
  })
}

const fetchItems = () => {
  fetch('/api/v1/items')
    .then(res => res.json())
    .then(items =>  {
      garageItems = items;
      appendItems(items)
  });
};

const orderItems = (items) => {
  const sort = items.sort((a, b) => {
    let firstName = a.name.toLowerCase();
    let secondName = b.name.toLowerCase();
    if(firstName > secondName) {
      return -1;
    }
    if(firstName < secondName) {
      return 1;
    }
    return 0;
  })
}

const reverseOrderItems = (items ) => {
  const sort = items.sort((a, b) => {
    let firstName = a.name.toLowerCase();
    let secondName = b.name.toLowerCase();
    if(firstName > secondName) {
      return -1;
    }
    if(firstName < secondName) {
      return 1;
    }
    return 0;
  })
}

const sortGarageItems = (items) => {
  const button =  $('.sort-btn').text();
  if (button === 'Sort A-Z') {
    $('.sort-btn').text('Sort Z-A');
    appendItems(orderItems(garageItems));
  } else {
    $('.sort-btn').text('Sort A-Z');
    appendItems(reverseOrderItems(garageItems));
  }
};

const doorControl = () => {
  console.log('hello');
  $('.garage').removeClass()
  $('.garage').addClass('.open-garage-door');
  // $('.garage').remove()

}

const addItem = () => {
  const item = {
    name: $('.name-item-input').val(),
    reason: $('.reason-input').val(),
    cleanliness: $('.drop-down').val()
  };

  fetch('/api/v1/items', {
    method: 'POST',
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(items => {
      appendItems(items);
      garageItems.push(items[0]);
      clearinput();
    })
    .catch(error => console.log(error));
};

const clearInput = () => {
  $('.name-item-input').val('');
  $('.reason-input').val('');
};


$(document).ready(fetchItems)
$('.submit-btn').on('click', addItem);
$('.sort-btn').on('click', sortGarageItems)
$('.open-btn').on('click', doorControl);
