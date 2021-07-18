<template>
  <Alert :type="alertType" :message="alertMessage" v-if="showAlert" />
  <VLink ref="homeLink" href="/" />
  <div
    class="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      py-12
      px-4
      sm:px-6
      lg:px-8
      font-vazir
    "
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="pattern h-20 w-28 rounded-md"></div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{
            store.dir === "ltr"
              ? "Sign in to your account"
              : "به اکانت خود وارد شوید"
          }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">{{
              store.dir === "rtl" ? "یوزرنیم" : "Username"
            }}</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autocomplete="username"
              class="
                appearance-none
                rounded-none
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                rounded-t-md
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              :placeholder="store.dir === 'ltr' ? 'username' : 'نام کاربری'"
              v-model="username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{
              store.dir === "ltr" ? "Password" : "رمز عبور"
            }}</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="
                appearance-none
                rounded-none
                relative
                block
                w-full
                px-3
                py-2
                border border-gray-300
                placeholder-gray-500
                text-gray-900
                rounded-b-md
                focus:outline-none
                focus:ring-indigo-500
                focus:border-indigo-500
                focus:z-10
                sm:text-sm
              "
              :placeholder="store.dir === 'ltr' ? 'Password' : 'رمز عبور'"
              @keypress.enter="axiosCall('login')"
            />
          </div>
        </div>

        <div
          class="flex items-center"
          :class="store.dir === 'ltr' ? 'justify-end' : 'justify-start'"
        >
          <div class="text-sm">
            <VLink
              href="signup"
              class="
                font-medium
                text-indigo-600
                hover:text-indigo-500
                cursor-pointer
              "
              >{{
                store.dir === "ltr"
                  ? "Don't Have an account?"
                  : "حساب کاربری ندارید؟"
              }}</VLink
            >
          </div>
        </div>

        <div>
          <button
            type="button"
            @click="axiosCall('login')"
            :class="{ 'disabled:(opacity-50 cursor-not-allowed)': !enableButton }"
            :disabled="!enableButton"
            class="
              group
              relative
              w-full
              flex
              justify-center
              py-2
              px-4
              border border-transparent
              text-sm
              font-medium
              rounded-md
              text-white
              bg-indigo-600
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            "
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ store.dir === "ltr" ? "Sign in" : "ورود" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import VLink from "../components/VLink.vue";
import useAuth from "../composables/useAuth";
import Alert from "../components/Alert.vue";
import { useTask } from "../stores/tasks";

const {
  username,
  password,
  axiosCall,
  alertType,
  alertMessage,
  showAlert,
  homeLink,
  enableButton,
} = useAuth();
const store = useTask();
</script>

<style scoped>
.pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236912f4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>