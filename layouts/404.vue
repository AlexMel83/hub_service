<script lang="ts" setup></script>

<template>
  <div class="box-fail">
    <p class="text-whoops">Упс</p>
    <img class="fail-404" src="~/public/404.png" alt="404" />
    <p>Сторінка, яку ви шукали, не існує.</p>
    <slot />
  </div>
</template>

<style scoped>
.fail-404 {
  width: 90%;
}

p {
  text-align: center;
  color: var(--1, #09273B);
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.box-fail{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 32px 0 32px 0px;
}

@media (min-width: 768px){
    .fail-404 {
    width: 90%;
  }

  .box-fail {
    padding: 0px 325px 32px 325px;
  }

  p {
    font-size: 40px;
    line-height: 140%; /* 56px */
  }
  .text-whoops{
    position: absolute;
  }
}
</style>