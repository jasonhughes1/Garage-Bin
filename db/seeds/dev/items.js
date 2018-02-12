exports.seed = function(knex, Promise) {

  return knex('items').del()
    .then(function () {
      return knex('items').insert([
        {id: 1, name: 'Bike', reason: 'Old', cleanliness: 'Dusty'},
        {id: 2, name: 'Gym Bag', reason: 'Sweaty', cleanliness: 'Rancid'},
        {id: 3, name: 'Golf Clubs', reason: 'Play', cleanliness: 'Sparkling'},
      ]);
    });
};
