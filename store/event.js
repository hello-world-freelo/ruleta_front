import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    events: []
  }
}

export const getters = {
  events ({ events }) {
    return events || []
  },
  eventsById: (state) => (id) => {
    return state.events.find(product => product.id === id)
  }
}

export const mutations = {
  SET_EVENTS(state, payload) {
    state.events = payload
  },
  UPDATE_EVENT (state, award) {
    const index = state.events.findIndex(e => e.id === ad.id)
    state.events.splice(index, 1, award)
  },
}

export let actions = {

  async initialize ({ dispatch }) {
    try {
      const response = await dispatch('get')
      return { success: !response.error, response }
    } catch (error) {
      return { success: false, error }
    }
  },

  async get ({ commit }) {
    try {
      const response = await protectedService.get('/eventos/lista-evento')
      if (response.data) commit('SET_EVENTS', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the award')
      const response = await protectedService.get(`/eventos/lista-evento/${id}`)
      console.log("getOne", response.data);
      if (response?.data) commit('UPDATE_EVENT', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
