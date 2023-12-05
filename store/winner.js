import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    winners: []
  }
}

export const getters = {
  winners ({ winners }) {
    return winners || []
  },
  winnersById: (state) => (id) => {
    return state.winners.find(product => product.id === id)
  }
}

export const mutations = {
  SET_WINNERS(state, payload) {
    state.winners = payload
  },
  UPDATE_WINNER(state, award) {
    const index = state.winners.findIndex(e => e.id === ad.id)
    state.winners.splice(index, 1, award)
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
      const response = await protectedService.get('/eventos/lista-ganadores/10000')
      if (response.data) commit('SET_WINNERS', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the winner')
      const response = await protectedService.get(`/eventos/lista-ganadores/${id}`)
      if (response?.data) commit('UPDATE_WINNER', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
