import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/views/layout/Layout'

/**
 * vue-router: params of vue-router
 * path: path of the route
 * name: name of the router
 * redirect : if `redirect:noredirect` will no redirect in the levelbar
 * meta : { role: ['admin'] }  will control the page role
 * icon : the icon show in the sidebar using font-awesome
 * image: the image show in the sidebar using a picture for the icon, image has higher priority than icon
 * isHidden : if `hidden:true` will not show in the sidebar
 * labels: [{classes: 'bg-red', text: '5'}] will show on the right side of the sidebar
 * isSingle : `isSingle:true` means the item has not submenu
 **/
export const constantRouterMap = [
  { path: '/login', component: require('@/views/login/index'), isHidden: true },
  { path: '/404', component: require('@/views/errorPage/404'), isHidden: true },
  { path: '/401', component: require('@/views/errorPage/401'), isHidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    isHidden: true,
    children: [{ path: 'dashboard', component: require('@/views/dashboard/index') }]
  },
  {
    path: '/basic',
    component: Layout,
    // redirect: '/areaCode',
    name: '基础平台',
    children: [
      { name: '地区代码', path: 'areaCode', component: require('@/views/basic/areaCode') },
      { name: '用户管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      {
        name: '商场管理',
        path: '/basic/merchants',
        redirect: '/basic/merchants/catalog',
        component: require('@/views/basic/merchants/index'),
        children: [
          { name: '商场类目管理', path: 'catalog', component: require('@/views/basic/merchants/catalog') },
          { name: '商场管理', path: 'market', component: require('@/views/basic/merchants/market') }
        ]
      },
      {
        name: '可配置化',
        path: 'dashboard',
        component: require('@/views/dashboard/index'),
        children: [
          { name: '产品管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '页面管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '模块管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '应用管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '图标管理', path: 'dashboard', component: require('@/views/dashboard/index') }
        ]
      },
      {
        name: '短息管理',
        path: 'dashboard',
        component: require('@/views/dashboard/index'),
        children: [
          { name: '短信下行通道', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '短信模板管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '短信发送记录', path: 'dashboard', component: require('@/views/dashboard/index') }
        ]
      },
      {
        name: '推送管理',
        path: 'dashboard',
        component: require('@/views/dashboard/index'),
        children: [
          { name: '推送模板', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '后台推送', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '推送配置', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '用户消息', path: 'dashboard', component: require('@/views/dashboard/index') }
        ]
      },
      { name: '支付系统', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '退款管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      {
        name: '提现管理',
        path: 'dashboard',
        component: require('@/views/dashboard/index'),
        children: [
          { name: '银行卡管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '体现申请', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '体现通用配置', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '体现商家配置', path: 'dashboard', component: require('@/views/dashboard/index') }
        ]
      },
      {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: '敏感词管理',
        children: [{ path: 'dashboard', component: require('@/views/dashboard/index') }]
      },
      {
        name: '版本管理',
        path: 'dashboard',
        component: require('@/views/dashboard/index'),
        children: [
          { name: '产品升级管理', path: 'dashboard', component: require('@/views/dashboard/index') },
          { name: '升级版本管理', path: 'dashboard', component: require('@/views/dashboard/index') }
        ]
      },
      { name: '优惠券管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '广告管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '黑名单管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '二维码管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '渠道管理', path: 'dashboard', component: require('@/views/dashboard/index') }
    ]
  },
  {
    path: '/vendors',
    component: Layout,
    name: '商家平台',
    children: [
      { name: '商家功能管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      {
        name: '商家管理',
        path: '/vendors/merchants',
        redirect: '/vendors/merchants/list',
        component: require('@/views/vendors/merchants/index'),
        children: [
          { name: '商家信息管理', path: 'list', component: require('@/views/vendors/merchants/list') },
          {
            name: '商家店铺管理',
            path: '/vendors/merchants/stores',
            redirect: '/vendors/merchants/stores/list',
            component: require('@/views/vendors/merchants/stores/index'),
            children: [
              {name: '店铺信息管理', path: 'list', component: require('@/views/vendors/merchants/stores/list')},
              {name: '商家账号管理', path: 'accounts', component: require('@/views/vendors/merchants/stores/accounts')},
              {name: '商家功能管理', path: 'funcs', component: require('@/views/vendors/merchants/stores/funcs')}
            ]
          }
        ]
      },
      { name: '团购管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '商家订单管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '消息发布管理', path: 'dashboard', component: require('@/views/dashboard/index') }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '智能平台',
    children: [
      { name: '停车管理', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '门禁管理', path: 'dashboard', component: require('@/views/dashboard/index') }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '运营平台',
    children: [{ path: 'dashboard', component: require('@/views/dashboard/index') }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '服务平台',
    children: [
      { name: '优托邦秀场', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '商场地图', path: 'dashboard', component: require('@/views/dashboard/index') },
      { name: '撤场拍卖', path: 'dashboard', component: require('@/views/dashboard/index') }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '结算平台',
    children: [{ path: 'dashboard', component: require('@/views/dashboard/index') }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '数据平台',
    children: [
      { name: '通用报表', path: 'dashboard', component: require('@/views/dashboard/index') }
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    name: '商圈平台',
    children: [
      {
        name: '麻辣教主',
        path: '/merchant/spicyleader',
        redirect: '/merchant/spicyleader/list',
        component: require('@/views/merchant/spicyleader/index'),
        children: [
          { name: '期数列表', path: 'list', component: require('@/views/merchant/spicyleader/list') },
          { name: '新增期数', path: 'create', component: require('@/views/merchant/spicyleader/add') }
        ]
      },
      {name: '主题管理', path: 'theme', component: require('@/views/merchant/theme/index')}
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/menu',
    name: '系统平台',
    children: [
      { name: '菜单管理', path: 'menu', component: require('@/views/system/menu/index') },
      { name: '用户管理', path: 'user', component: require('@/views/system/user/index'), icon: 'circle-o' },
      { name: '评论管理', path: 'comments', component: require('@/views/system/comments/index') }
    ]
  }
]

export const asyncRouterMap = [
  { path: '*', redirect: '/404', isHidden: true }
]

export default new VueRouter({
  // mode: 'hash|history|abstract',
  // base: '/',
  // linkActiveClass: 'router-link-active',
  // scrollBehavior: fn
  // base: '/omp',
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

