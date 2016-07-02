# mixpanel middleware for Telegraf

[![Build Status](https://img.shields.io/travis/telegraf/telegraf-mixpanel.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/telegraf-mixpanel)
[![NPM Version](https://img.shields.io/npm/v/telegraf-mixpanel.svg?style=flat-square)](https://www.npmjs.com/package/telegraf-mixpanel)

[mixpanel](https://mixpanel.com) middleware for [Telegraf (Telegram bot framework)](https://github.com/telegraf/telegraf).

<a href="https://mixpanel.com/f/partner" rel="nofollow"><img src="https://cdn.mxpnl.com/site_media/images/partner/badge_blue.png" alt="Mobile Analytics" /></a>

## Installation

```js
$ npm install telegraf-mixpanel
```

## Example
  
```js
const Telegraf = require('telegraf')
const TelegrafMixpanel = require('telegraf-mixpanel')

const telegraf = new Telegraf(process.env.BOT_TOKEN)
const mixpanel = new TelegrafMixpanel(process.env.MIXPANEL_TOKEN)

telegraf.use(mixpanel.middleware())

// sales funnel for dummies

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
  return ctx.reply('⌛️')
})

telegraf.command('/pay', (ctx) => {
  ctx.mixpanel.track('action', { plan: 'PRO' })
  ctx.mixpanel.people.set('plan', 'PRO')
  ctx.mixpanel.people.trackCharge(9.99)
  return ctx.reply('💰')
})

// Promo staff

telegraf.command(/\/promo (.+)/, (ctx) => {
  ctx.mixpanel.track('promo', {
    promo: ctx.match[1],
    campaign: 'BLK FRIDAY'
  })
  ctx.mixpanel.people.increment('promo campaigns')
  return ctx.reply('✨')
})

telegraf.startPolling()
```

## License

The MIT License (MIT)

Copyright (c) 2016 Vitaly Domnikov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

