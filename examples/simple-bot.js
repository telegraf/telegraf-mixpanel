const Telegraf = require('telegraf')
const TelegrafMixpanel = require('../lib/mixpanel')

const telegraf = new Telegraf(process.env.BOT_TOKEN)
const mixpanel = new TelegrafMixpanel(process.env.MIXPANEL_TOKEN)

telegraf.use(mixpanel.middleware())

telegraf.command('/start', (ctx) => {
  ctx.mixpanel.track('awareness')
  ctx.mixpanel.people.set({
    $created: new Date().toISOString()
  })
  return ctx.reply('Hi there!')
})

telegraf.command('/feature', (ctx) => {
  ctx.mixpanel.track('interest')
  return ctx.reply('42')
})

telegraf.command('/trial', (ctx) => {
  ctx.mixpanel.track('decision')
  ctx.mixpanel.people.set('plan', 'TRIAL')
  return ctx.reply('️️⌛️')
})

telegraf.command('/pay', (ctx) => {
  ctx.mixpanel.track('action', { plan: 'PRO' })
  ctx.mixpanel.people.set('plan', 'PRO')
  ctx.mixpanel.people.trackCharge(9.99)
  return ctx.reply('💰')
})

telegraf.command(/\/promo (.+)/, (ctx) => {
  ctx.mixpanel.track('promo', {
    promo: ctx.match[1],
    campaign: 'BLK FRIDAY'
  })
  ctx.mixpanel.people.increment('promo campaigns')
  return ctx.reply('✨')
})

telegraf.startPolling()
