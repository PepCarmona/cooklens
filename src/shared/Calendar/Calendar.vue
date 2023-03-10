<template>
  <div class="calendar">
    <div
      v-for="month in calendar"
      :key="month.monthNumber"
      class="calendar-month"
      :class="{ selected: month.isInView }"
    >
      <div class="calendar-month-title">
        <span class="month-name">{{ month.monthName }}</span>
        <span class="year">{{ month.year }}</span>
      </div>
      <div class="calendar-weekdays">
        <div v-for="day in weekdaysShort" :key="day">
          {{ day }}
        </div>
      </div>
      <div class="calendar-month-body">
        <div
          v-for="(week, index) in month.weeks"
          :key="index"
          class="calendar-week"
        >
          <div v-for="day in week" :key="day?.date" class="calendar-day">
            <Button
              v-if="day"
              :class="{
                selected: day.date === selectedDay?.date,
                past: day.isBeforeToday,
              }"
              :disabled="!allowPast && day.isBeforeToday"
              @click="$emit('selected-day', day)"
            >
              {{ day.dayNumber }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { weekdaysShort } from '../../helpers/date';
import { getCalendar } from '../../shared/Calendar/CalendarModel';
import { CalendarBoundaries, Day, Calendar } from '../../../types';

dayjs.extend(isoWeek);

const props = defineProps({
  boundaries: Object as PropType<CalendarBoundaries>,
  selectedDay: Object as PropType<Day>,
  allowPast: Boolean,
});
defineEmits(['selected-day']);

const calendar = ref<Calendar>(
  getCalendar(props.boundaries, props.selectedDay)
);
</script>

<style lang="scss" scoped>
.calendar {
  width: 100%;
}
.calendar-month {
  width: 100%;
  &:not(:first-child) {
    margin-top: 2rem;
  }
}
.calendar-month-title {
  background-color: var(--accent-color-complementary);
  padding: 0.25rem;
  border-radius: 0.5rem;
  & > * {
    color: white;
  }
}
.month-name {
  font-size: 18px;
  font-family: var(--title-font);
}
.year {
  display: block;
  font-size: 14px;
  font-family: var(--title-font);
}
.calendar-weekdays {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  color: var(--grey-600);
  & > * {
    width: calc(100% / 7);
  }
}
.calendar-week {
  display: flex;
  padding: 0.25rem 0;
}
.calendar-day {
  width: calc(100% / 7);
  & > * {
    display: block;
    height: 25px;
    width: 25px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    &.selected {
      background-color: var(--accent-color);
      border-radius: 25px;
      color: var(--inverted-text-color);
      &.past:not(.selected) {
        color: var(--grey-600);
      }
    }
  }
}
</style>
