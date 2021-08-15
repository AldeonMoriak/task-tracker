<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav
    class="bg-gray-800 relative z-50 font-vazir"
    ref="mobileMenu"
    :dir="store.dir"
  >
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          :class="[
            store.dir === 'ltr' ? 'left-0' : 'right-0',
            'absolute inset-y-0  flex items-center sm:hidden',
          ]"
        >
          <!-- Mobile menu button-->
          <button
            type="button"
            class="
              inline-flex
              items-center
              justify-center
              p-2
              rounded-md
              text-gray-400
              hover:text-white hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
            "
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="show = !show"
          >
            <span class="sr-only">{{
              store.dir === "ltr" ? "Open main menu" : "باز کردن منوی اصلی"
            }}</span>
            <!--
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
            -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
              v-if="!show"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!--
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
            -->
            <svg
              v-if="show"
              class="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <svg
              v-if="show"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="
            flex-1 flex
            items-center
            justify-center
            sm:items-stretch sm:justify-start
          "
        >
          <!-- <div class="flex-shrink-0 flex items-center">
            <h1 class="block lg:hidden h-8 w-auto text-white text-xl" alt="Task Tracker">TR</h1>
            <h1
              class="hidden lg:block h-8 w-auto text-white text-xl"
              alt="Task Tracker"
            >Task Tracker</h1>
          </div>-->
          <div class="hidden sm:block sm:ml-6">
            <div
              :class="[
                store.dir === 'ltr' ? '' : 'space-x-reverse',
                'flex space-x-4',
              ]"
            >
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <VLink
                href="/"
                ref="homeLink"
                :class="[
                  isHomeActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'px-3 py-2 rounded-md text-sm font-medium',
                ]"
                aria-current="page"
                >{{ store.dir === "ltr" ? "Home" : "صفحه اصلی" }}</VLink
              >

              <VLink
                href="history"
                :class="[
                  isHistoryActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'px-3 py-2 rounded-md text-sm font-medium',
                ]"
                >{{ store.dir === "ltr" ? "History" : "تاریخچه" }}</VLink
              >
            </div>
          </div>
        </div>
        <div
          :dir="store.dir"
          :class="[
            store.dir === 'ltr' ? 'right-0' : 'left-0',
            'absolute inset-y-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0',
          ]"
        >
          <TopIcons />

          <!-- Profile dropdown -->
          <div class="ml-3 relative" ref="profileMenu">
            <div>
              <button
                type="button"
                class="
                  bg-gray-800
                  flex
                  text-sm
                  rounded-full
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-offset-gray-800
                  focus:ring-white
                "
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                @click="showProfile = !showProfile"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt
                />
              </button>
            </div>

            <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
            -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                :class="[
                  store.dir === 'ltr' ? 'right-0' : 'left-0',
                  'origin-top-right absolute mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
                ]"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
                v-if="showProfile"
              >
                <!-- Active: "bg-gray-100", Not Active: "" -->
                <VLink
                  href="profile"
                  class="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-0"
                  >{{ store.dir === "ltr" ? "Your Profile" : "پروفایل" }}</VLink
                >
                <VLink
                  href="settings"
                  class="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabindex="-1"
                  id="user-menu-item-1"
                  >{{ store.dir === "ltr" ? "Settings" : "تنظیمات" }}</VLink
                >
                <button type="button" @click="signout">
                  <a
                    class="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-1"
                    >{{ store.dir === "ltr" ? "Sign out" : "خروج" }}</a
                  >
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="sm:hidden" id="mobile-menu" v-if="show">
      <div
        :class="[
          store.dir === 'ltr' ? 'text-left' : 'text-right',
          'px-2 pt-2 pb-3 space-y-1 absolute bg-black w-full rounded-b-md',
        ]"
      >
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <VLink
          href="/"
          :class="[
            isHomeActive
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          aria-current="page"
          >{{ store.dir === "ltr" ? "Home" : "صفحه اصلی" }}</VLink
        >

        <VLink
          href="history"
          :class="[
            isHistoryActive
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          >{{ store.dir === "ltr" ? "History" : "تاریخچه" }}</VLink
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useTask } from "../stores/tasks";
import TopIcons from "./TopIcons.vue";
import VLink from "./VLink.vue";

const store = useTask();
const show = ref(false);
const showProfile = ref(false);
const mobileMenu = ref(null);
const profileMenu = ref(null);
const homeLink = ref(null);
const signout = () => {
  localStorage.removeItem("access_token");
  location.href = "/task-tracker/login";
};
const isHomeActive = computed(() => location.pathname === "/task-tracker/");

const isHistoryActive = computed(
  () => location.pathname === "/task-tracker/history"
);

onClickOutside(mobileMenu, () => (show.value = false));
onClickOutside(profileMenu, () => (showProfile.value = false));
</script>
