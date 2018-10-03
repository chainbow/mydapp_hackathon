<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          My DApp
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Index</q-list-header>
        <q-item to="/">
          <q-item-side icon="school" />
          <q-item-main label="Index" sublabel="Hello" />
        </q-item>
        <q-item to="/env">
          <q-item-side icon="code" />
          <q-item-main label="Env" sublabel="Env" />
        </q-item>
        <q-item to="/SendToken">
          <q-item-side icon="school" />
          <q-item-main label="SendToken" sublabel="SendToken" />
        </q-item>
        <q-item to="/SendTransaction">
          <q-item-side icon="school" />
          <q-item-main label="SendTransaction" sublabel="SendTransaction" />
        </q-item>
        <q-item to="/getCBB">
          <q-item-side icon="school" />
          <q-item-main label="getCBB" sublabel="getCBB" />
        </q-item>
        <q-item to="/sellToken">
          <q-item-side icon="school" />
          <q-item-main label="1.发布页面" sublabel="卖币，出品" />
        </q-item>
        <q-item to="/auctionList">
          <q-item-side icon="school" />
          <q-item-main label="2.挂单列表页面" sublabel="显示挂单一览" />
        </q-item>
        <q-item to="/auctionDetail">
          <q-item-side icon="school" />
          <q-item-main label="3.挂单详细页面" sublabel="显示挂单详细" />
        </q-item>
        <q-item to="/adminPage">
          <q-item-side icon="school" />
          <q-item-main label="4.管理员页面" sublabel="管理员的页面" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
