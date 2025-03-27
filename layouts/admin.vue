<template>
    <div class="flex flex-col min-h-screen">
      <AdminHeader />
      <main class="flex-grow">
        <slot />
      </main>
      <AdminFooter />
    </div>
  </template>
  