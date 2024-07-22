import { protectedService } from "@/plugins/axios"
import { EmptyResponse } from "@/plugins/utils"

export const state = () => {
  return {
    premiosDetail: []
  }
}

export const getters = {
  premiosDetail ({ premiosDetail }) {
    return premiosDetail || []
  },
  premiosDetailById: (state) => (id) => {
    return state.premiosDetail.find(product => product.id === id)
  }
}

export const mutations = {
  SET_GAMES_DETAIL(state, payload) {
    state.premiosDetail = payload.data || []
  },
  UPDATE_GAME_DETAIL (state, award) {
    const index = state.premiosDetail.findIndex(e => e.id === ad.id)
    state.premiosDetail.splice(index, 1, award)
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
      const response = await protectedService.get('/eventos/lista-detalle-premio')
      if (response.data) commit('SET_GAMES_DETAIL', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  },

  async getOne ({ commit }, { id } = {}) {
    try {
      if (!id) throw new Error('You need an ID to update the award')
      const response = await protectedService.get(`/eventos/lista-detalle-premio/${id}`)
      console.log("getOne", response.data);
      if (response?.data) commit('UPDATE_GAME_DETAIL', response.data)
      return response ?? { error: new EmptyResponse() }
    } catch (error) {
      return { error }
    }
  }
}
