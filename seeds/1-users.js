var bcrypt=require("bcrypt-nodejs");

var seedPass = bcrypt.hashSync("test");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1, 
          email: 'ryno@datacentrix.co.za',
          company: "Datacentrix",
          password: seedPass,
          first_name: "Ryno",
          last_name: "Coetzee",
          admin: 1
        },
        {
          id: 2, 
          email: 'rudie@datacentrix.co.za',
          company: "Datacentrix",
          password: seedPass,
          first_name: "Rudie",
          last_name: "Raath",
          admin: 1
        },
      ]);
    });
};
