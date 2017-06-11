exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sponsors').del()
    .then(function () {
      // Inserts seed entries
      return knex('sponsors').insert([
        {
          sponsorId: 1, 
          sponsorUrl: 'www.hpe.com',
          sponsorName: "Hewlett Packard Enterprise",
          sponsorContent: "Some <strong>HPE</strong> content",
          sponsorTag: "HPE",
          sponsorLevel: "Diamond",
          sponsorLogo: "logoUrl"
        },
        {
          sponsorId: 2, 
          sponsorUrl: 'www.cisco.com',
          sponsorName: "Cisco",
          sponsorContent: "Some <strong>Cisco</strong> content",
          sponsorTag: "Cisco",
          sponsorLevel: "Platinum",
          sponsorLogo: "logoUrl"
        },
      ]);
    });
};
