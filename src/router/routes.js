
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'env', component: () => import('pages/Env.vue') },
      { path: 'SendToken', component: () => import('pages/SendToken.vue') },
      { path: 'SendTransaction', component: () => import('pages/SendTransaction.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
