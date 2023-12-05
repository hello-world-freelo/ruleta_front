import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    games: []
  }
}

export const getters = {
  games ({ games }) {
    return games || []
  },
  gamesById: (state) => (id) => {
    return state.games.find(product => product.id === id)
  }
}

export const mutations = {
  SET_GAMES(state, payload) {
    state.games = payload
  },
  UPDATE_GAME (state, award) {
    const index = state.games.findIndex(e => e.id === ad.id)
    state.games.splice(index, 1, award)
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
      const response = await protectedService.get('/eventos/lista-juego')
      if (response.data) commit('SET_GAMES', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the award')
      const response = await protectedService.get(`/eventos/lista-juego/${id}`)
      console.log("getOne", response.data);
      if (response?.data) commit('UPDATE_GAME', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
