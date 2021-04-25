<script>
  import parse from 'date-fns/parse'
  import format from 'date-fns/format'
  import { setDate } from 'date-fns'
  import set from 'date-fns/set'
  import getDaysInMonth from 'date-fns/getDaysInMonth'
  import FaCalendarAlt from 'svelte-icons/fa/FaCalendarAlt.svelte'
  import FaRegClock from 'svelte-icons/fa/FaRegClock.svelte'
  import { month_options } from '../commons/months'

  export let date = new Date()
  $: year = date.getFullYear()
  $: month = date.getMonth()
  $: day = date.getDate()
  $: hours = date.getHours()
  $: minutes = date.getMinutes()

  const year_options = Array.from({ length: 50 }).map((x, i) => i + 2000)

  $: days_in_month = getDaysInMonth(date)
  $: days_options = Array.from({ length: days_in_month }).map((x, i) => i + 1)
</script>

<style>
  .datetime input[type="number"]  {
  }

  .datetime > div {
    margin-right: 6px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  input[type=number] {
      -moz-appearance:textfield; /* Firefox */
  }
</style>

<div class="flex datetime font-mono text-sm">

  <div class="flex mr-4">
    <div class="bg-gray-200 text-sm font-medium text-gray-600 px-2 py-2 flex items-center">
      <div class="w-4 h-4 text-gray-600">
        <FaCalendarAlt />
      </div>
    </div>
    <div class="flex items-center border-r border-t border-b border-gray-300 px-2">
      <input
        type="number"
        max={days_in_month}
        value={day}
        style="max-width: 40px;"
        on:change={(event) => {
          console.log('time changed')
          console.log(event.target.value)
          const day = parseInt(event.target.value)
          date = set(date, {
            date: day
          })
        }}
      />

      <select
        value={month}
        on:change={(event) => {
          const month = parseInt(event.target.value)
          date = set(date, {
            month
          })
        }}
        class="appearance-none bg-white mx-2"
      >
        {#each month_options as m}
          <option value={m.value}>{m.label}</option>
        {/each}
      </select>

      <select
        value={year}
        on:change={(event) => {
          const year = parseInt(event.target.value)
          date = set(date, {
            year
          })
        }}
        class="appearance-none bg-white"
      >
        {#each year_options as y}
          <option>{y}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="flex">
    <div class="bg-gray-200 text-sm font-medium text-gray-600 px-2 py-2 flex items-center">
      <div class="w-4 h-4 text-gray-600">
        <FaRegClock />
      </div>
    </div>
    <div class="flex items-center border-r border-t border-b border-gray-300 px-2">
      <input 
        type="number"
        min="0"
        max="23"
        value={hours}
        style="max-width: 36px;"
        on:change={(event) => {
          const hours = parseInt(event.target.value)
          date = set(date, {
            hours
          })
        }}
      />
      <div class="mr-2">:</div>
      <input 
        type="number"
        min="0"
        max="59"
        value={minutes}
        style="max-width: 36px;"
        on:change={(event) => {
          const minutes = parseInt(event.target.value)
          date = set(date, {
            minutes
          })
        }}
      />
    </div>
  </div>

</div>
