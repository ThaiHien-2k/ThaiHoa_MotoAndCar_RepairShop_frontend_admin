<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Repair Appointments</h1>
    <div v-if="appointments.length" class="mt-6">
      <ul>
        <li v-for="appointment in appointments" :key="appointment.id">
          <NuxtLink :to="`/repair-appointments/${appointment.id}`">{{ appointment.title }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No repair appointments available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useRepairAppointment from '~/composables/useRepairAppointment';

const { appointments, fetchAppointments } = useRepairAppointment();

onMounted(() => {
  fetchAppointments();
});
</script>