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
        {
          id: 3,
          email: "edupreez@datacentrix.co.za",
          event_profile: "Staff",
          first_name: "Elzette",
          last_name: "Du Preez",
          admin: 1,
          pro_profile: "Marketing Coordinator",
          company: "Datacentrix",
          mobilenr: "0846963000",
          verified: 1
          },
          {
          id: 4,
          email: "monique@smart-sm.co.za",
          event_profile: "Staff",
          first_name: "Monique ",
          last_name: "Oosthuizen",
          admin: 1,
          pro_profile: "Owner",
          company: "SMART Strategic Marketing",
          mobilenr: "0829260506",
          verified: 1
          }



      ]);
    });
};
