import { computed, ref, watch } from 'vue';

import { getLastItem } from '../../../helpers/array';

import dayjs from 'dayjs';
import {
  DayMeal,
  DayPlan,
  Meal,
  MealPlan,
  meals,
  CalendarBoundaries,
  Day,
  Week,
  ClientRecipe,
} from '../../../../types';
import { WeekDay } from '../../../shared/Calendar/CalendarTypes';

export default function createMealPlanState() {
  const selectedDay = ref<Day>(new WeekDay(new Date()));

  const mealPlan = ref<MealPlan>();
  const dayPlan = ref<DayPlan>(newDayPlan());

  const isAddingMeal = ref(false);
  const isAddingRecipeToMeal = ref(false);
  const isAddingNewRecipeToMeal = ref(false);

  watch(selectedDay, () => (dayPlan.value = getDayPlan()), { immediate: true });

  const areAllMealsAdded = computed(() =>
    meals.every((meal) =>
      dayPlan.value.meals.some((dayMeal) => dayMeal.meal === meal)
    )
  );

  function getDayPlan(): DayPlan {
    if (!mealPlan.value) {
      return newDayPlan();
    }

    const index = mealPlan.value.days.findIndex(
      (day) => day.date === selectedDay.value.date
    );

    if (index < 0) {
      return newDayPlan();
    }

    return mealPlan.value.days[index];
  }

  function newDayPlan(): DayPlan {
    return {
      date: selectedDay.value.date,
      meals: [],
    };
  }

  function addRecipeToMeal(meal: Meal, recipe: ClientRecipe) {
    dayPlan.value.meals.push({
      meal,
      recipe,
    });

    isAddingMeal.value = false;
    isAddingRecipeToMeal.value = false;
  }

  function removeMeal(dayMeal: DayMeal) {
    const index = dayPlan.value.meals.findIndex(
      (meal) => meal.meal === dayMeal.meal
    );

    if (index === -1) {
      return;
    }

    dayPlan.value.meals.splice(index, 1);
  }

  function getCalendarBoundaries(weeks: Week[]): CalendarBoundaries {
    const firstDay = weeks[0].filter((day) => day !== null)[0] as Day;
    const lastDay = getLastItem(
      getLastItem(weeks).filter((day) => day !== null) as Day[]
    );

    return {
      startDate: dayjs(firstDay.date).toDate(),
      endDate: dayjs(lastDay.date).toDate(),
    };
  }

  return {
    selectedDay,
    mealPlan,
    dayPlan,
    isAddingMeal,
    isAddingRecipeToMeal,
    isAddingNewRecipeToMeal,
    areAllMealsAdded,

    getCalendarBoundaries,
    getDayPlan,
    addRecipeToMeal,
    removeMeal,
    selectDay: (day: Day) => (selectedDay.value = day),
    openMealSelector: () => (isAddingMeal.value = true),
    closeMealSelector: () => {
      isAddingMeal.value = false;
      isAddingRecipeToMeal.value = false;
      isAddingNewRecipeToMeal.value = false;
    },
    openRecipeSelector: () => (isAddingRecipeToMeal.value = true),
    closeRecipeSelector: () => (isAddingRecipeToMeal.value = false),
  };
}

export type MealPlanState = ReturnType<typeof createMealPlanState>;
