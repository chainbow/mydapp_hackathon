
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'env', component: () => import('pages/Env.vue') },
      { path: 'SendToken', component: () => import('pages/SendToken.vue') },
      { path: 'SendTransaction', component: () => import('pages/SendTransaction.vue') },
      { path: 'getcbb', component: () => import('pages/getCBB.vue') },
      { path: 'sellToken', component: () => import('pages/sellToken.vue') },
      { path: 'auctionList', component: () => import('pages/auctionList.vue') },
      { path: 'auctionDetail', component: () => import('pages/auctionDetail.vue') },
      { path: 'adminPage', component: () => import('pages/adminPage.vue') }
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
