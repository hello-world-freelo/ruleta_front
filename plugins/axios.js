import * as axios from 'axios'
import * as Swal from 'sweetalert2'


function useLoading(method, url) {

  const methodsWithoutLoading = ['post', 'put', 'patch']

  if (methodsWithoutLoading.includes(method)) {
    // Lista de servicios que no muestran loading
    const blackList = []
    const shouldUseLoading = !blackList.some(obj => new RegExp(obj.url).test(url) && method === obj.method)
    return shouldUseLoading
  }

  return false;
}

export const protectedService = axios.create({
  withCredentials: false,
  baseURL: process.server ? (process.env.API_URL_SSR) : (process.env.API_URL_SPA)
})


export const publicService = axios.create({
  withCredentials: false,
  baseURL: process.server ? (process.env.API_URL_SSR) : (process.env.API_URL_SPA)
})

function useModalError(method, url) {
  if (method == 'post' || method == 'put' || method == 'patch' || method == 'delete') {
    // lista de servicios que no muestran loading
    const blackList = [
      // { url: '/orders/create_token', method: 'post' }
    ]
    if (blackList.some(obj => ((new RegExp(obj.url)).test(url) && method == obj.method)))
      return false // encontro una coincidencia y no se debe usar el modal
    else
      return true // no encontro una coincidencia y se debe usar el modal
  }
  return false
}

export default ({ store }) => {

  protectedService.interceptors.request.use(config => {
    const token = store.state.token
    if (token) config.headers.common['Authorization'] = `Bearer ${token}`
    if (useLoading(config.method, config.url))
      store.commit('SET_SHOW_LOADING')
    return config
  })

  protectedService.interceptors.response.use(function (response) {

    if (useLoading(response.config.method, response.config.url))
      store.commit('SET_HIDE_LOADING')
    return response

  }, function (error) {

    console.log("ee", error);

    if (useLoading(error.response.config.method, error.response.config.url)) {
      store.commit('SET_HIDE_LOADING')
    }

    const { status } = error.response

    if (status == 401) {

      console.log("codeee");
      // token expirado
      //store.dispatch('resetSessionStoreAll')
      //window.location.href = "/"

    } else {
      if (useModalError(error.response.config.method, error.response.config.url)) {
        Swal.fire({
          html:
            `<img class="small_icon" src="${require("@/static/icon_warning.svg")}"><p class="popup-content-text">${
              error.response.data.message
            }</p>`,
          customClass: {
            popup: "popup-printeddy",
            confirmButton: "popup-btn-confirm",
            cancelButton: "popup-btn-cancel",
          },
          showConfirmButton: true,
        })
      }
    }
    return Promise.reject(error);
  })

  publicService.interceptors.request.use(function (config) {
    if (useLoading(config.method, config.url))
      store.commit('SET_SHOW_LOADING')
    return config
  }, function (error) {
    return Promise.reject(error)
  })


  publicService.interceptors.response.use(function (response) {

    if (useLoading(response.config.method, response.config.url))
      store.commit('SET_HIDE_LOADING')
    return response

  }, function (error) {

    if (useLoading(error.response.config.method, error.response.config.url)) {
      store.commit('SET_HIDE_LOADING')
    }

    if (useModalError(error.response.config.method, error.response.config.url)) {
      if (error.response.data) {
        Swal.fire({
          html:
            `<img class="small_icon" src="${require("@/static/icon_warning.svg")}">
            <p class="popup-content-text">${error.response.data.msg}</p>`,
          customClass: {
            popup: "popup-giveaways",
            confirmButton: "popup-btn-confirm",
            cancelButton: "popup-btn-cancel",
          },
          showConfirmButton: true,
        })
      }
    }

    return Promise.reject(error)
  })
}
