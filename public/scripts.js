
let garageItems = [];


const fetchItems = () => {
  fetch('/api/v1/items')
    .then(res => res.json())
    .then(items =>  {
      console.log(items);
      garageItems = items;
      appendItems(items)
  });
};

const appendItems = (items) => {
  items.forEach(item => {

    $('.garage').append(`
      <div id=${item.id} class='item ${item.id} item ${item.cleanliness}'>
        <h4 class='item-name'>Item: ${item.name}</h4>
        <button class='details-btn'>Item Details</button>
        <div class='details hidden'>
          <h4 class='reason'>Reason: ${item.reason}</h4>
          <h4 class='condition'>Cleanliness: ${item.cleanliness}</h4>
          <select class="details-drop-down" name="">
            <option ${item.cleanliness === 'Sparkling' ? 'selected' : ''} value="Sparkling">Sparkling</option>
            <option ${item.cleanliness === 'Dusty' ? 'selected' : ''} value="Dusty">Dusty</option>
            <option ${item.cleanliness === 'Rancid' ? 'selected' : ''} value="Rancid">Rancid</option>
          </select>
        </div>
      </div>`)
    })
    counter();
  };

  const details = (event) => {
    console.log('fired');
    $(event.target).siblings('.details').toggleClass('hidden');
  }

  const updateCleanliness = (event) => {
  const updatedCleanliness = JSON.stringify({
    cleanliness: event.target.value
  });
  const id = $(event.target).closest('.item').attr('id');

  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    body: updatedCleanliness,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const orderItems = (items) => {
  console.log(items);
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
  return sort;
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
  return sort;
}

const sortGarageItems = (items) => {
  let alphabetical = orderItems(garageItems)
  console.log(alphabetical);
  const button =  $('.sort-btn').text();
  if (button === 'Sort A-Z') {
    $('.sort-btn').text('Sort Z-A');
    appendItems(alphabetical);
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

const counter = () => {
  const itemCount = $('.item').length;

  const dusty = $('.reason').length;
  const rancid = $('.condition').length;

  $('#count-all-items').text(itemCount);
  $('#dusty').text(dusty);
  $('#rancid').text(rancid);
};


$(document).ready(fetchItems)
$('.garage').on('change', '.details-drop-down', (event) => updateCleanliness(event))
$('.garage').on('click', '.details-btn', (event) => details(event));
$('.submit-btn').on('click', addItem);
$('.sort-btn').on('click', sortGarageItems)
$('.open-btn').on('click', doorControl);
