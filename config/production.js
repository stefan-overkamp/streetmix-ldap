module.exports = {
  app_host_port: 'streetmix.geodaten-velbert.de',
  header_host_port: 'streetmix.geodaten-velbert.de',
  restapi: {
    protocol: 'https://',
    baseuri: '/api'
  },
  facebook_app_id: '99',
  plausible: {
    domain: 'streetmix.geodaten-velbert.de'
  },
  pinterest: '99',
  db: {
    sequelize: {
      logging: true,
      database: 'streetmix',
      host: process.env.PGHOST || '127.0.0.1',
      port: process.env.PGPORT || 5432,
      // surely there is a way to inherit these defaults to other config files?
      // heroku hobby tier has max connections of 20, so this is a conservative setting
      // you'll see h22 errors if its too high: https://devcenter.heroku.com/articles/error-codes#h22-connection-limit-reached
      pool: {
        max: 12,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  },
  log_level: 'debug',
  l10n: {
    use_local: true
  },
  stripe: {
    tier1_plan_id: process.env.TIER1_PLAN_ID || 'plan_Fc2wCyqj2Azpbm'
  }
}
