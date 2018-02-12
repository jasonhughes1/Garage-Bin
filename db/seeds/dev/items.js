exports.seed = function(knex, Promise) {

  return knex('items').del()
    .then(function () {
      return knex('items').insert([
        {name: 'Bike', reason: 'Old', cleanliness: 'Dusty'},
        {name: 'Gym Bag', reason: 'Sweaty', cleanliness: 'Rancid'},
        {name: 'Golf Clubs', reason: 'Play', cleanliness: 'Sparkling'},
      ]);
    });
};
