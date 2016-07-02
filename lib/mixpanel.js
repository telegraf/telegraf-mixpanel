const debug = require('debug')('telegraf:mixpanel')
const Promise = require('bluebird')
const Mixpanel = require('mixpanel')

const unshift = [].unshift

class TelegrafMixpanel {

  constructor (mixpanelToken) {
    this.token = mixpanelToken
    this.client = Mixpanel.init(mixpanelToken)
    Promise.promisifyAll(this.client)
    Promise.promisifyAll(this.client.people)
  }

  middleware () {
    return (ctx, next) => {
      ctx.mixpanel = new MixpanelContext(this.client, ctx)
      return next()
    }
  }
}

class MixpanelContext {

  constructor (client, ctx) {
    this.client = client
    this.ctx = ctx
    this.people = new MixpanelPeopleContext(client, ctx)
  }

  track (eventName, props) {
    debug('track', eventName, props)
    const payload = {}
    if (this.ctx.from) {
      payload.distinct_id = this.ctx.from.id
    }
    return this.client.trackAsync(eventName, Object.assign(payload, props))
  }
}

class MixpanelPeopleContext {

  constructor (client, ctx) {
    this.client = client
    this.ctx = ctx
  }

  set (key, value) {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    var payload = {}
    if (value) {
      payload[key] = value
    } else {
      payload = Object.assign({
        $first_name: this.ctx.from.first_name,
        $last_name: this.ctx.from.last_name,
        username: this.ctx.from.username
      }, key)
    }
    debug('set', payload)
    return this.client.people.setAsync(this.ctx.from.id, payload)
  }

  setOnce (key, value) {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    var payload = {}
    if (value) {
      payload[key] = value
    } else {
      payload = key
    }
    debug('setOnce', payload)
    return this.client.people.set_onceAsync(this.ctx.from.id, payload)
  }

  increment (key) {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    debug('increment', key)
    unshift.call(arguments, this.ctx.from.id)
    return this.client.people.incrementAsync.apply(this.client.people, arguments)
  }

  append (key) {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    unshift.call(arguments, this.ctx.from.id)
    return this.client.people.appendAsync.apply(this.client.people, arguments)
  }

  union (key) {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    debug('union', key)
    unshift.call(arguments, this.ctx.from.id)
    return this.client.people.unionAsync.apply(this.client.people, arguments)
  }

  trackCharge (amount) {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    debug('trackCharge', amount)
    return this.client.people.track_chargeAsync(this.ctx.from.id, amount)
  }

  clearCharges () {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    debug('clearCharges')
    return this.client.people.clear_chargesAsync(this.ctx.from.id)
  }

  deleteUser () {
    if (!this.ctx.from) {
      throw new Error("Can't find sender info")
    }
    debug('deleteUser')
    return this.client.people.delete_userAsync.apply(this.ctx.from.id)
  }
}

module.exports = TelegrafMixpanel
