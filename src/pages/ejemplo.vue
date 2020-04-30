<template>
  <div class="q-pa-md">
    <q-scroll-area horizontal
        style="height: 94vh; width: 100%;"
        :thumb-style="thumbStyle"
        :visible="true"
        :force-on-mobile="true">
      <!-- :content-style="contentStyle" -->
      <!-- :content-active-style="contentActiveStyle" -->

      <div class="row no-wrap">
        <div v-for="n in 10" :key="n" style="width: 150px" class="q-pa-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto fuga quae veritatis blanditiis sequi id expedita amet esse aspernatur! Iure, doloribus!
        </div>
      </div>

    </q-scroll-area>
  </div>
</template>

<script>
export default {
  computed: {
    contentStyle () {
      return {
        backgroundColor: 'rgba(0,0,0,0.02)',
        color: '#555'
      }
    },

    contentActiveStyle () {
      return {
        backgroundColor: '#eee',
        color: 'black'
      }
    },

    thumbStyle () {
      return {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      }
    }
  }
}
</script>
