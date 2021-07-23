
    <template>
  <div class="relative inline-block">
    <!-- Dropdown toggle button -->
    <slot></slot>

    <!-- Dropdown menu -->
    <div class="absolute z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl dark:bg-gray-800">
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:text-white"
      >your profile</a>
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:text-white"
      >Your projects</a>
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:text-white"
      >Help</a>
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:text-white"
      >Settings</a>
      <a
        href="#"
        class="block px-4 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-blue-500 hover:text-white dark:hover:text-white"
      >Sign Out</a>
    </div>
  </div>
</template> 