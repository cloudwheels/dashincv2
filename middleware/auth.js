export default function ({ store, redirect }) {
  if (process.client && !store.getters.isAuthenticated)
    return redirect('/unauthorised')
}
