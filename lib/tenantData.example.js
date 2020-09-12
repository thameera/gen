module.exports = [
  {
    label: 'tham@us',
    canonDomain: 'tham.auth0.com',
    manageUrl: 'https://manage.auth0.com/dashboard/us/tham',
    region: 'prod-us',
    m2mClient: {
      client_id: 'CLIENT_ID_HERE',
      client_secret: 'CLIENT_SECRET_HERE',
    },
    clients: [
      {
        name: 'bench11_spa',
        client_id: 'EbzWB8b1TXBiO4ZemYaHXIgk28AH5d7E',
      },
      {
        name: 'bench11_reg',
        client_id: 'oavP61isKqPioPM6fEFJMb9zSRqtZkMA',
      },
    ],
  },
  {
    label: 'tham@eu',
    canonDomain: 'tham.eu.auth0.com',
    manageUrl: 'https://manage.auth0.com/dashboard/eu/tham',
    region: 'eu',
    m2mClient: {
      client_id: 'CLIENT_ID_HERE',
      client_secret: 'CLIENT_SECRET_HERE',
    },
    clients: [
      {
        name: 'spa',
        client_id: 'LjjBj1M1dzf2NHiqEZK4r0MIus9zNyOk',
      },
    ],
  },
]
