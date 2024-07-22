import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    premios: []
  }
}

export const getters = {
  premios ({ premios }) {
    return premios || []
  },
  premiosById: (state) => (id) => {
    return state.premios.find(product => product.id === id)
  }
}

export const mutations = {
  SET_AWARDS(state, payload) {
    state.premios = payload
  },
  UPDATE_AWARD (state, premios) {
    const index = state.premios.findIndex(e => e.id === ad.id)
    state.premios.splice(index, 1, premios)
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
      const response = await protectedService.get('/eventos/lista-premio')
      if (response.data) commit('SET_AWARDS', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the award')
      const response = await protectedService.get(`/eventos/lista-premio/${id}`)
      if (response?.data) commit('UPDATE_AWARD', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
