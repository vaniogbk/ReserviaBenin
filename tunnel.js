const localtunnel = require('localtunnel')

;(async () => {
  const tunnel = await localtunnel({ port: 8765, subdomain: 'reservia-benin-api' })
  console.log('Tunnel actif :', tunnel.url)
  console.log('API disponible sur :', tunnel.url + '/api/v1')
  // Garder le tunnel ouvert indéfiniment
  tunnel.on('close', () => {
    console.log('Tunnel ferme. Relancez demarrer-soutenance.bat')
    process.exit(0)
  })
})()
